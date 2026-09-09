"""
CareerForge AI Service - Interview Mentor Agent
==============================================
Role: Senior Technical & HR Placement Interview Simulator.

Modes:
1. HR Interview Mode:
   - Evaluates: communication, clarity, relevance, confidence indicators,
     answer quality, and actionable improvement suggestions.
2. Technical Interview Mode:
   - Evaluates: correctness, technical depth, explanation, problem-solving approach,
     missing concepts, and technical improvement suggestions.

Adaptive Features:
- Questions dynamically calibrate based on:
  * Career goal (e.g. SDE-1, Backend Engineer)
  * Academic branch (e.g. Computer Science, ECE, IT)
  * College year (e.g. 4th Year placement sprint)
  * Verified skills (e.g. Java, Python, SQL)
  * Diagnosed weak areas (e.g. Dynamic Programming, Concurrency, Normalization)
  * Previous interview answers (contextual follow-up questioning)

Execution Flow:
Start Interview -> Generate Question -> Student Answers -> Evaluate Answer ->
Give Feedback -> Generate Next Question -> Repeat -> Final Comprehensive Evaluation
"""

import uuid
import re
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from app.services.student_memory import student_memory
from app.services.gemini_service import gemini_service
from app.utils.logger import logger
from app.services.db import get_database


# Active in-memory session cache for fast turn-by-turn retrieval
ACTIVE_INTERVIEWS: Dict[str, Dict[str, Any]] = {}


# ==============================================================================
# Curated Adaptive Question Banks
# ==============================================================================

CURATED_HR_QUESTIONS = [
    {
        "id": "hr_intro",
        "theme": "Introduction & Ownership",
        "question": (
            "Walk me through your journey. What inspired you to pursue a career as a {career_goal}, "
            "and what was a defining project where you took ownership from conception to delivery?"
        )
    },
    {
        "id": "hr_challenge",
        "theme": "Problem Solving & Resilience",
        "question": (
            "Tell me about a time when you faced a significant obstacle or critical bug close to a project deadline. "
            "How did you prioritize, communicate with teammates, and resolve it?"
        )
    },
    {
        "id": "hr_conflict",
        "theme": "Collaboration & Conflict Resolution",
        "question": (
            "Describe a scenario where you strongly disagreed with a peer or team lead regarding a technical decision. "
            "How did you articulate your viewpoint, and what was the ultimate resolution?"
        )
    },
    {
        "id": "hr_weakness_growth",
        "theme": "Self-Awareness & Continuous Learning",
        "question": (
            "We notice in placement diagnostics that you have been strengthening your skills in {weak_topic}. "
            "How do you typically approach learning a difficult concept where you initially struggle?"
        )
    },
    {
        "id": "hr_company_fit",
        "theme": "Company Alignment & Long-Term Vision",
        "question": (
            "Why are you targeting {target_company} specifically, and how does joining our engineering organization "
            "align with your 3-year professional trajectory?"
        )
    }
]

CURATED_TECH_QUESTIONS = [
    {
        "id": "tech_arch",
        "theme": "Core Architectural Trade-offs",
        "question": (
            "As an aspiring {career_goal}, how would you architect a scalable system to handle high read/write throughput? "
            "Specifically, explain how you choose between relational vs non-relational databases and when to introduce caching."
        )
    },
    {
        "id": "tech_weak_deepdive",
        "theme": "Diagnostic Gap Deep-Dive",
        "question": (
            "Let's dive into an essential topic: {weak_topic}. "
            "Can you explain the underlying mechanics, common failure modes or bottlenecks, and how you would optimize it in production?"
        )
    },
    {
        "id": "tech_concurrency_db",
        "theme": "Data Integrity & Concurrency",
        "question": (
            "Explain how database transaction isolation levels (e.g. Read Committed vs Serializable) "
            "prevent concurrency anomalies like Dirty Reads and Phantom Reads. How does this tie into thread-safety?"
        )
    },
    {
        "id": "tech_algo_complexity",
        "theme": "Algorithmic Reasoning & Scaling",
        "question": (
            "Suppose your service processes millions of incoming data points daily. "
            "How do you evaluate and optimize algorithmic time and space complexity to prevent memory leaks and latency spikes?"
        )
    }
]


# ==============================================================================
# Interview Mentor Agent
# ==============================================================================

class InterviewMentorAgent:
    """
    Simulates high-bar HR and Technical placement interview sessions.
    Evaluates turn-by-turn responses and issues final comprehensive diagnostic scorecards.
    """

    def __init__(self, name: str = "Interview Mentor"):
        self.name = name
        self.role = "Senior Technical & HR Placement Interviewer"

    # --------------------------------------------------------------------------
    # 1. START INTERVIEW SESSION
    # --------------------------------------------------------------------------
    async def start_interview(
        self,
        student_id: str,
        mode: str = "technical",
        target_company: str = "General",
        role: Optional[str] = None,
        max_questions: int = 4
    ) -> Dict[str, Any]:
        """
        Initializes an interview session:
        - Reads student profile, branch, year, career goal, and weak areas.
        - Generates personalized Question 1.
        - Records first dialogue turn and persists in MongoDB.
        """
        normalized_mode = "hr" if mode.lower() in ("hr", "behavioral", "culture") else "technical"
        
        # 1. Fetch student context from shared memory
        profile = await student_memory.read_student_profile(student_id)
        if not profile:
            profile = await student_memory.get_or_create_student(
                student_id=student_id,
                email=f"{student_id}@careerforge.edu",
                name=student_id.capitalize()
            )

        student_name = profile.get("name", "Candidate")
        branch = profile.get("branch", "Computer Science")
        year = profile.get("year", "4th Year")
        career_goal = role or profile.get("careerGoal", "Software Development Engineer (SDE-1)")
        skills = [s["name"] for s in profile.get("skills", [])]
        weaknesses = profile.get("weaknesses", [])

        # 2. Generate First Question
        session_id = f"iv_{uuid.uuid4().hex[:12]}"
        first_question = await self._generate_adaptive_question(
            mode=normalized_mode,
            turn_number=1,
            student_name=student_name,
            career_goal=career_goal,
            branch=branch,
            year=year,
            skills=skills,
            weaknesses=weaknesses,
            target_company=target_company,
            previous_dialogue=[]
        )

        # 3. Create Session Record
        now = datetime.now(timezone.utc)
        session_record = {
            "session_id": session_id,
            "student_id": student_id,
            "student_name": student_name,
            "target_company": target_company,
            "interview_type": normalized_mode,
            "role": career_goal,
            "branch": branch,
            "year": year,
            "current_question_index": 1,
            "max_questions": max_questions,
            "dialogue": [
                {
                    "speaker": "agent",
                    "message": first_question,
                    "timestamp": now
                }
            ],
            "turn_evaluations": [],
            "overall_score": None,
            "rubric_scores": {},
            "strengths_observed": [],
            "weaknesses_observed": [],
            "recommendations": "",
            "status": "in_progress",
            "created_at": now,
            "updated_at": now
        }

        # 4. Persist in DB and cache
        db = get_database()
        if db is not None:
            await db["interview_sessions"].insert_one(dict(session_record))
        session_record.pop("_id", None)
        ACTIVE_INTERVIEWS[session_id] = session_record

        logger.info(f"Started {normalized_mode.upper()} interview '{session_id}' for student '{student_id}'.")

        return {
            "sessionId": session_id,
            "mode": normalized_mode,
            "targetCompany": target_company,
            "role": career_goal,
            "questionNumber": 1,
            "totalQuestions": max_questions,
            "question": first_question,
            "status": "in_progress"
        }

    # --------------------------------------------------------------------------
    # 2. ANSWER QUESTION & EVALUATE TURN
    # --------------------------------------------------------------------------
    async def answer_question(
        self,
        session_id: str,
        student_id: str,
        answer: str
    ) -> Dict[str, Any]:
        """
        Evaluates the student's answer using Mode-Specific Rubrics:
        - HR Mode: evaluates communication, clarity, relevance, confidence, answer quality.
        - Technical Mode: evaluates correctness, technical depth, explanation, problem-solving, missing concepts.
        If more questions remain, generates the next adaptive question; otherwise finalizes interview.
        """
        session = await self._get_session(session_id)
        if not session:
            raise ValueError(f"Interview session '{session_id}' not found.")

        mode = session.get("interview_type", "technical")
        dialogue = session.get("dialogue", [])
        turn_number = session.get("current_question_index", 1)
        max_questions = session.get("max_questions", 4)
        now = datetime.now(timezone.utc)

        # 1. Record User Answer in dialogue
        dialogue.append({
            "speaker": "user",
            "message": answer,
            "timestamp": now
        })

        # Identify current question text
        last_question = next((t["message"] for t in reversed(dialogue[:-1]) if t["speaker"] == "agent"), "")

        # 2. Evaluate Answer based on Mode
        if mode == "hr":
            evaluation = await self._evaluate_hr_answer(last_question, answer, session)
        else:
            evaluation = await self._evaluate_technical_answer(last_question, answer, session)

        # Store turn evaluation
        session.setdefault("turn_evaluations", []).append({
            "question_number": turn_number,
            "question": last_question,
            "answer": answer,
            "evaluation": evaluation
        })

        # Check if interview has concluded
        if turn_number >= max_questions:
            final_summary = await self.finish_interview(session_id, student_id)
            return {
                "sessionId": session_id,
                "mode": mode,
                "questionNumber": turn_number,
                "evaluation": evaluation,
                "nextQuestion": None,
                "isComplete": True,
                "finalEvaluation": final_summary
            }

        # 3. Generate Next Adaptive Question
        next_turn_num = turn_number + 1
        session["current_question_index"] = next_turn_num

        next_question = await self._generate_adaptive_question(
            mode=mode,
            turn_number=next_turn_num,
            student_name=session.get("student_name", "Candidate"),
            career_goal=session.get("role", "Software Engineer"),
            branch=session.get("branch", "Computer Science"),
            year=session.get("year", "4th Year"),
            skills=session.get("skills", []),
            weaknesses=session.get("weaknesses", []),
            target_company=session.get("target_company", "General"),
            previous_dialogue=dialogue
        )

        # Add Next Agent Question to dialogue
        dialogue.append({
            "speaker": "agent",
            "message": next_question,
            "timestamp": datetime.now(timezone.utc)
        })
        session["updated_at"] = datetime.now(timezone.utc)

        # Update in DB
        db = get_database()
        if db is not None:
            await db["interview_sessions"].update_one(
                {"session_id": session_id},
                {"$set": session}
            )

        logger.info(f"Turn {turn_number} evaluated for session '{session_id}'. Next question generated.")

        return {
            "sessionId": session_id,
            "mode": mode,
            "questionNumber": turn_number,
            "evaluation": evaluation,
            "nextQuestion": next_question,
            "isComplete": False
        }

    # --------------------------------------------------------------------------
    # 3. FINISH INTERVIEW & FINAL EVALUATION
    # --------------------------------------------------------------------------
    async def finish_interview(self, session_id: str, student_id: str) -> Dict[str, Any]:
        """
        Wraps up interview session:
        - Calculates aggregate overall score and rubric dimensions.
        - Identifies observed strengths, persistent weaknesses, and hiring recommendation.
        - Updates student memory with mock interview score.
        """
        session = await self._get_session(session_id)
        if not session:
            raise ValueError(f"Interview session '{session_id}' not found.")

        turn_evals = session.get("turn_evaluations", [])
        mode = session.get("interview_type", "technical")
        now = datetime.now(timezone.utc)

        if not turn_evals:
            # Fallback if finished without turns
            overall_score = 70.0
            rubric_scores = {"overall": 70.0}
            strengths_obs = ["Participated in interview session"]
            weaknesses_obs = ["No answers submitted for evaluation"]
            final_feedback = "Interview session ended before substantive answers were recorded."
        else:
            # Calculate aggregate scores
            scores = [t["evaluation"].get("score", 70.0) for t in turn_evals]
            overall_score = round(sum(scores) / len(scores), 1)

            if mode == "hr":
                rubric_scores = {
                    "communication": round(sum(t["evaluation"].get("communication", 70) for t in turn_evals) / len(turn_evals), 1),
                    "clarity": round(sum(t["evaluation"].get("clarity", 70) for t in turn_evals) / len(turn_evals), 1),
                    "relevance": round(sum(t["evaluation"].get("relevance", 70) for t in turn_evals) / len(turn_evals), 1),
                    "confidence": round(sum(t["evaluation"].get("confidence", 70) for t in turn_evals) / len(turn_evals), 1),
                    "answerQuality": round(sum(t["evaluation"].get("answerQuality", 70) for t in turn_evals) / len(turn_evals), 1)
                }
            else:
                rubric_scores = {
                    "correctness": round(sum(t["evaluation"].get("correctness", 70) for t in turn_evals) / len(turn_evals), 1),
                    "technicalDepth": round(sum(t["evaluation"].get("technicalDepth", 70) for t in turn_evals) / len(turn_evals), 1),
                    "explanation": round(sum(t["evaluation"].get("explanation", 70) for t in turn_evals) / len(turn_evals), 1),
                    "problemSolving": round(sum(t["evaluation"].get("problemSolving", 70) for t in turn_evals) / len(turn_evals), 1)
                }

            # Collect observed strengths & weaknesses
            all_sugs = []
            for t in turn_evals:
                all_sugs.extend(t["evaluation"].get("improvementSuggestions", []))

            strengths_obs = [
                "Clear structured articulation" if rubric_scores.get("clarity", 70) >= 75 else "Good foundational awareness",
                "Strong technical depth" if rubric_scores.get("technicalDepth", 70) >= 75 else "Relevant illustrative examples"
            ]
            weaknesses_obs = list(dict.fromkeys(all_sugs))[:3] if all_sugs else ["Refine technical precision"]
            final_feedback = f"Completed {mode.upper()} interview with an overall score of {overall_score}%. " + (
                "Candidate demonstrated strong hiring potential." if overall_score >= 75 else "Solid baseline with targeted areas for refinement."
            )

        hiring_rec = "Strong Hire (Tier 1 Ready)" if overall_score >= 85 else (
            "Hire (Tier 2 Ready)" if overall_score >= 70 else "Needs Additional Preparation"
        )

        session["status"] = "completed"
        session["overall_score"] = overall_score
        session["rubric_scores"] = rubric_scores
        session["strengths_observed"] = strengths_obs
        session["weaknesses_observed"] = weaknesses_obs
        session["recommendations"] = final_feedback
        session["completed_at"] = now
        session["updated_at"] = now

        # Update in Shared Student Memory
        await student_memory.save_interview_session(session)

        # Save execution result
        await student_memory.save_agent_result(
            identifier=student_id,
            agent_name=self.name,
            task_name="complete_interview",
            result_data={
                "sessionId": session_id,
                "mode": mode,
                "overallScore": overall_score,
                "hiringRecommendation": hiring_rec
            }
        )

        # Trigger Adaptive Learning Loop
        try:
            from app.services.adaptive_loop import adaptive_learning_loop
            await adaptive_learning_loop.evaluate_and_adapt(
                student_id=student_id,
                trigger_source="interview_completion",
                trigger_payload={"sessionId": session_id, "mode": mode, "overallScore": overall_score}
            )
        except Exception as ae:
            logger.warning(f"Could not run adaptive loop after interview completion: {ae}")

        logger.info(f"Finalized interview session '{session_id}': score={overall_score}%, rec={hiring_rec}")

        return {
            "sessionId": session_id,
            "mode": mode,
            "status": "completed",
            "overallScore": overall_score,
            "rubricScores": rubric_scores,
            "strengthsObserved": strengths_obs,
            "weaknessesObserved": weaknesses_obs,
            "finalFeedback": final_feedback,
            "hiringRecommendation": hiring_rec,
            "completedAt": now.isoformat()
        }

    # --------------------------------------------------------------------------
    # Helper: HR Evaluation Engine
    # --------------------------------------------------------------------------
    async def _evaluate_hr_answer(
        self,
        question: str,
        answer: str,
        session: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Evaluates HR answer on:
        - communication, clarity, relevance, confidence indicators, answer quality, improvement suggestions.
        """
        ans_len = len(answer.strip())
        words = answer.split()
        word_count = len(words)

        # Confidence analysis: check active voice vs hedging words
        hedging_words = ["maybe", "i guess", "probably", "kinda", "sort of", "i think maybe"]
        hedge_count = sum(1 for h in hedging_words if h in answer.lower())
        ownership_indicators = ["i led", "i designed", "i implemented", "i resolved", "i took responsibility", "my role was", "i organized"]
        ownership_count = sum(1 for o in ownership_indicators if o in answer.lower())

        if gemini_service.is_configured():
            try:
                class HREvalSchema(BaseModel):
                    communication: int = Field(description="Score 0-100 on professional grammar and articulation")
                    clarity: int = Field(description="Score 0-100 on conciseness and STAR method structure")
                    relevance: int = Field(description="Score 0-100 on how directly question was addressed")
                    confidence: int = Field(description="Score 0-100 based on decisive language vs excessive hedging")
                    answer_quality: int = Field(description="Score 0-100 overall impact and maturity")
                    feedback: str = Field(description="2-sentence encouraging summary")
                    improvement_suggestions: List[str] = Field(description="2 actionable behavioral tips")

                prompt = (
                    f"You are a Senior Bar-Raiser HR Interviewer for {session.get('target_company', 'Tech')}.\n"
                    f"Role: {session.get('role', 'Software Engineer')}\n"
                    f"Interview Question: {question}\n"
                    f"Candidate Answer: {answer}\n\n"
                    "Evaluate this response on HR criteria:\n"
                    "- Communication (grammar, tone)\n"
                    "- Clarity (STAR method: Situation, Task, Action, Result)\n"
                    "- Relevance (addressed the prompt directly)\n"
                    "- Confidence indicators (decisive ownership verbs vs passive hedging)\n"
                    "- Answer quality and maturity\n"
                    "- Actionable improvement suggestions."
                )

                res = await gemini_service.generate_structured_json(
                    prompt=prompt,
                    response_schema=HREvalSchema,
                    temperature=0.2,
                    timeout=10.0
                )

                if isinstance(res, HREvalSchema):
                    overall = round((res.communication + res.clarity + res.relevance + res.confidence + res.answer_quality) / 5)
                    return {
                        "score": overall,
                        "communication": res.communication,
                        "clarity": res.clarity,
                        "relevance": res.relevance,
                        "confidence": res.confidence,
                        "answerQuality": res.answer_quality,
                        "feedback": res.feedback,
                        "improvementSuggestions": res.improvement_suggestions
                    }
            except Exception as e:
                logger.warning(f"Gemini HR evaluation failed, using deterministic fallback: {e}")

        # Deterministic Fallback HR Evaluation
        comm_score = min(95, max(50, 60 + min(30, word_count // 5)))
        clarity_score = 80 if ("situation" in answer.lower() or "result" in answer.lower() or word_count >= 30) else 65
        relevance_score = 85 if word_count >= 20 else 55
        confidence_score = max(50, min(95, 75 + (ownership_count * 8) - (hedge_count * 10)))
        quality_score = round((comm_score + clarity_score + relevance_score + confidence_score) / 4)
        total_turn_score = round((comm_score + clarity_score + relevance_score + confidence_score + quality_score) / 5)

        suggs = []
        if hedge_count > 0:
            suggs.append("Replace hesitant language ('maybe', 'I guess') with decisive, accountable phrasing.")
        if ownership_count == 0:
            suggs.append("Highlight your personal contribution explicitly ('I designed...', 'My role was...').")
        if word_count < 40:
            suggs.append("Structure your answer using the STAR method (Situation, Task, Action, Result) for deeper impact.")
        if not suggs:
            suggs.append("Quantify the results of your actions (e.g., 'reduced latency by 20%') to maximize impression.")

        return {
            "score": total_turn_score,
            "communication": comm_score,
            "clarity": clarity_score,
            "relevance": relevance_score,
            "confidence": confidence_score,
            "answerQuality": quality_score,
            "feedback": f"Structured response with good ownership. Communication is articulate ({comm_score}%).",
            "improvementSuggestions": suggs
        }

    # --------------------------------------------------------------------------
    # Helper: Technical Evaluation Engine
    # --------------------------------------------------------------------------
    async def _evaluate_technical_answer(
        self,
        question: str,
        answer: str,
        session: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Evaluates Technical answer on:
        - correctness, technical depth, explanation, problem-solving approach, missing concepts, improvement suggestions.
        """
        words = answer.split()
        word_count = len(words)

        if gemini_service.is_configured():
            try:
                class TechEvalSchema(BaseModel):
                    correctness: int = Field(description="Score 0-100 on technical correctness")
                    technical_depth: int = Field(description="Score 0-100 on depth and edge-case awareness")
                    explanation: int = Field(description="Score 0-100 on clarity of technical articulation")
                    problem_solving_approach: int = Field(description="Score 0-100 on structured reasoning")
                    missing_concepts: List[str] = Field(description="Key concepts or trade-offs omitted")
                    improvement_suggestions: List[str] = Field(description="Concrete technical study tips")
                    feedback: str = Field(description="2-sentence constructive summary")

                prompt = (
                    f"You are a Principal Software Engineer conducting a Technical Round for {session.get('target_company', 'Tech')}.\n"
                    f"Role: {session.get('role', 'Software Engineer')}\n"
                    f"Question: {question}\n"
                    f"Candidate Response: {answer}\n\n"
                    "Evaluate on:\n"
                    "- Correctness (factual accuracy of concepts/algorithms)\n"
                    "- Technical depth (trade-offs, concurrency, complexity, internals)\n"
                    "- Explanation (clarity of communication)\n"
                    "- Problem-solving approach (structured reasoning)\n"
                    "- Missing concepts\n"
                    "- Concrete improvement suggestions."
                )

                res = await gemini_service.generate_structured_json(
                    prompt=prompt,
                    response_schema=TechEvalSchema,
                    temperature=0.2,
                    timeout=10.0
                )

                if isinstance(res, TechEvalSchema):
                    overall = round((res.correctness + res.technical_depth + res.explanation + res.problem_solving_approach) / 4)
                    return {
                        "score": overall,
                        "correctness": res.correctness,
                        "technicalDepth": res.technical_depth,
                        "explanation": res.explanation,
                        "problemSolving": res.problem_solving_approach,
                        "missingConcepts": res.missing_concepts,
                        "improvementSuggestions": res.improvement_suggestions,
                        "feedback": res.feedback
                    }
            except Exception as e:
                logger.warning(f"Gemini Technical evaluation failed, using deterministic fallback: {e}")

        # Deterministic Fallback Technical Evaluation
        correctness = min(95, max(55, 65 + min(25, word_count // 6)))
        depth = 80 if ("tradeoff" in answer.lower() or "complexity" in answer.lower() or "index" in answer.lower()) else 65
        explanation = 80 if word_count >= 35 else 60
        problem_solving = 75
        overall = round((correctness + depth + explanation + problem_solving) / 4)

        missing = []
        if "complexity" not in answer.lower() and "o(" not in answer.lower():
            missing.append("Time & Space Complexity analysis")
        if "tradeoff" not in answer.lower() and "versus" not in answer.lower():
            missing.append("Trade-offs between memory and computational overhead")

        suggs = [
            "Explicitly discuss Big-O Time and Space trade-offs when presenting technical choices.",
            "Describe edge cases (e.g. concurrent updates, network partitions, or null checks)."
        ]

        return {
            "score": overall,
            "correctness": correctness,
            "technicalDepth": depth,
            "explanation": explanation,
            "problemSolving": problem_solving,
            "missingConcepts": missing if missing else ["Alternative architectural patterns"],
            "improvementSuggestions": suggs,
            "feedback": f"Good technical coverage ({correctness}%). Deepen your explanation of internal trade-offs."
        }

    # --------------------------------------------------------------------------
    # Helper: Adaptive Question Generator
    # --------------------------------------------------------------------------
    async def _generate_adaptive_question(
        self,
        mode: str,
        turn_number: int,
        student_name: str,
        career_goal: str,
        branch: str,
        year: str,
        skills: List[str],
        weaknesses: List[str],
        target_company: str,
        previous_dialogue: List[Dict[str, Any]]
    ) -> str:
        """
        Generates questions tailored to candidate's background and previous answers.
        """
        weak_topic = weaknesses[0] if weaknesses else "System Design and Algorithms"
        skill_str = ", ".join(skills[:4]) if skills else "Core Engineering"

        # If previous answers exist, use Gemini to ask an adaptive follow-up
        if previous_dialogue and gemini_service.is_configured():
            try:
                last_user_turn = next((t["message"] for t in reversed(previous_dialogue) if t["speaker"] == "user"), "")
                prompt = (
                    f"Mode: {mode.upper()} Placement Interview for {target_company}.\n"
                    f"Candidate: {student_name} ({branch}, {year}), Career Goal: {career_goal}.\n"
                    f"Candidate's previous answer:\n\"{last_user_turn}\"\n"
                    f"Diagnosed Weak Areas to challenge adaptively: {weak_topic}.\n"
                    f"Turn: Question {turn_number}.\n"
                    "Generate a natural, challenging follow-up question. "
                    "In Technical mode, probe a specific concept or trade-off related to their answer or weak area. "
                    "In HR mode, ask a behavioral situation testing leadership, team communication, or overcoming failure."
                )
                q_text = await gemini_service.generate_text(
                    prompt=prompt,
                    temperature=0.4,
                    timeout=8.0
                )
                if q_text and len(q_text.strip()) > 20:
                    return q_text.strip()
            except Exception as e:
                logger.warning(f"Could not generate Gemini interview question: {e}")

        # Curated Adaptive Fallback
        if mode == "hr":
            idx = (turn_number - 1) % len(CURATED_HR_QUESTIONS)
            template = CURATED_HR_QUESTIONS[idx]["question"]
        else:
            idx = (turn_number - 1) % len(CURATED_TECH_QUESTIONS)
            template = CURATED_TECH_QUESTIONS[idx]["question"]

        return template.format(
            student_name=student_name,
            career_goal=career_goal,
            target_company=target_company,
            weak_topic=weak_topic,
            skill=skill_str
        )

    # --------------------------------------------------------------------------
    # Helper: Retrieve Session
    # --------------------------------------------------------------------------
    async def _get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetches session from memory cache or MongoDB.
        """
        if session_id in ACTIVE_INTERVIEWS:
            return ACTIVE_INTERVIEWS[session_id]

        db = get_database()
        if db is not None:
            doc = await db["interview_sessions"].find_one({"session_id": session_id})
            if doc:
                doc.pop("_id", None)
                ACTIVE_INTERVIEWS[session_id] = doc
                return doc
        return None


# Global Singleton Instance
interview_mentor_agent = InterviewMentorAgent()
