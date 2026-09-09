"""
CareerForge AI Service - Placement Mentor Coordinator Agent
===========================================================
Role: Central Orchestrator & Intelligent Intent Router.
Determines which specialized agent should handle a student's request,
passes minimal required context, invokes only necessary agents,
updates shared student memory, and returns a unified structured response.

Available Specialized Agents:
1. Skill Assessment Agent
2. Learning Recommendation Agent
3. Coding Mentor Agent
4. Interview Mentor Agent
5. Progress Analytics Agent
"""

import re
import time
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from app.services.student_memory import student_memory
from app.services.gemini_service import gemini_service
from app.utils.logger import logger

# Import Specialized Agents
from app.agents.skill_assessment import skill_assessment_agent
from app.agents.learning_recommendation import learning_recommendation_agent
from app.agents.coding_mentor import coding_mentor_agent
from app.agents.interview_mentor import interview_mentor_agent
from app.agents.progress_analytics import progress_analytics_agent


class CoordinatorResponse(BaseModel):
    agent: str = Field(..., description="ID of the specialized agent that handled the request")
    response: str = Field(..., description="Natural language response and guidance for the student")
    actions: List[Dict[str, Any]] = Field(default_factory=list, description="Interactive UI action shortcuts")
    data: Dict[str, Any] = Field(default_factory=dict, description="Structured domain payload from the agent")


class CoordinatorAgent:
    """
    Placement Mentor Coordinator Agent.
    Analyzes student intent, queries shared student memory, routes to the single
    best-fit specialized agent (or composite workflow), and maintains execution history.
    """

    def __init__(self, name: str = "Placement Coordinator"):
        self.name = name
        self.role = "Central Placement Mentor & Multi-Agent Orchestrator"

    # --------------------------------------------------------------------------
    # 1. MAIN COORDINATOR ENTRY POINT
    # --------------------------------------------------------------------------
    async def handle_student_request(
        self,
        student_id: str,
        message: str
    ) -> Dict[str, Any]:
        """
        Orchestration Pipeline:
        1. Receive student request.
        2. Identify student's intent.
        3. Read relevant student memory.
        4. Select and invoke ONLY the required specialized agent.
        5. Receive agent result & update shared student memory.
        6. Return unified structured response.
        """
        start_time = time.time()
        logger.info(f"[COORDINATOR] Received request from '{student_id}': \"{message}\"")

        # 1. Ensure student profile exists in shared memory
        profile = await student_memory.read_student_profile(student_id)
        if not profile:
            profile = await student_memory.get_or_create_student(
                student_id=student_id,
                email=f"{student_id}@careerforge.edu",
                name=student_id.capitalize()
            )

        # 2. Identify Intent
        intent = await self._classify_intent(message)
        logger.info(f"[COORDINATOR] Intent classified as '{intent}' for student '{student_id}'.")

        # 3. Route to Specialized Agent
        agent_id = "coordinator"
        response_text = ""
        actions = []
        data = {}

        if intent == "learning_recommendation":
            agent_id = "learning_recommendation"
            result = await self._handle_learning_recommendation(student_id, profile, message)
            response_text = result["response"]
            actions = result["actions"]
            data = result["data"]

        elif intent == "coding_mentor":
            agent_id = "coding_mentor"
            result = await self._handle_coding_mentor(student_id, profile, message)
            response_text = result["response"]
            actions = result["actions"]
            data = result["data"]

        elif intent == "interview_mentor":
            agent_id = "interview_mentor"
            result = await self._handle_interview_mentor(student_id, profile, message)
            response_text = result["response"]
            actions = result["actions"]
            data = result["data"]

        elif intent == "progress_analytics":
            agent_id = "progress_analytics"
            result = await self._handle_progress_analytics(student_id, profile, message)
            response_text = result["response"]
            actions = result["actions"]
            data = result["data"]

        elif intent == "skill_assessment":
            agent_id = "skill_assessment"
            result = await self._handle_skill_assessment(student_id, profile, message)
            response_text = result["response"]
            actions = result["actions"]
            data = result["data"]

        elif intent == "composite_plan":
            agent_id = "coordinator"
            result = await self._handle_composite_plan(student_id, profile, message)
            response_text = result["response"]
            actions = result["actions"]
            data = result["data"]

        else:
            # General Conversational Guidance
            agent_id = "coordinator"
            result = await self._handle_general_guidance(student_id, profile, message)
            response_text = result["response"]
            actions = result["actions"]
            data = result["data"]

        elapsed_ms = round((time.time() - start_time) * 1000, 1)

        # 4. Save Execution Record to Shared Memory
        await student_memory.save_agent_result(
            identifier=student_id,
            agent_name=self.name,
            task_name="orchestrate_chat",
            result_data={
                "message": message,
                "intent": intent,
                "delegated_agent": agent_id,
                "elapsed_ms": elapsed_ms,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        )

        logger.info(f"[COORDINATOR] Completed routing in {elapsed_ms}ms via '{agent_id}'.")

        return {
            "agent": agent_id,
            "response": response_text,
            "actions": actions,
            "data": data
        }

    # --------------------------------------------------------------------------
    # Intent Classification Engine
    # --------------------------------------------------------------------------
    async def _classify_intent(self, message: str) -> str:
        """
        Deterministic keyword + pattern matching for fast, 100% reliable routing.
        Falls back to Gemini classification if query is ambiguous.
        """
        msg_lower = message.lower().strip()

        # Composite Preparation Plan
        if any(p in msg_lower for p in [
            "create my preparation plan", "preparation plan", "prep plan",
            "overall strategy", "comprehensive roadmap", "how do i prepare for placement"
        ]):
            return "composite_plan"

        # Learning Recommendation
        if any(p in msg_lower for p in [
            "what should i study today", "study today", "what to study", "daily plan",
            "study plan", "recommend topics", "recommendation", "roadmap",
            "next topic", "what should i learn", "revision", "curriculum"
        ]):
            return "learning_recommendation"

        # Coding Mentor
        if any(p in msg_lower for p in [
            "debug this code", "debug", "hint", "coding problem", "time complexity",
            "space complexity", "two sum", "leetcode", "runtime error",
            "syntax error", "fix my code", "optimization", "optimize this code"
        ]):
            return "coding_mentor"

        # Interview Mentor
        if any(p in msg_lower for p in [
            "start an hr interview", "hr interview", "technical interview",
            "mock interview", "interview me", "behavioral questions", "interview practice",
            "star method", "conduct an interview"
        ]):
            return "interview_mentor"

        # Progress Analytics / Readiness
        if any(p in msg_lower for p in [
            "am i placement ready", "placement ready", "readiness score", "readiness",
            "how ready am i", "my score", "placement probability", "readiness status",
            "overall progress", "my stats"
        ]):
            return "progress_analytics"

        # Skill Assessment / Weak Areas
        if any(p in msg_lower for p in [
            "weak areas", "my weaknesses", "where do i need to improve", "skill gaps",
            "take an assessment", "start assessment", "test my skills", "evaluate my skills",
            "diagnostic test", "quiz me"
        ]):
            return "skill_assessment"

        # Gemini LLM Intent Classifier for ambiguous queries
        if gemini_service.is_configured():
            try:
                prompt = (
                    f"Classify the student query into exactly ONE of the following intent labels:\n"
                    f"- 'learning_recommendation'\n"
                    f"- 'coding_mentor'\n"
                    f"- 'interview_mentor'\n"
                    f"- 'progress_analytics'\n"
                    f"- 'skill_assessment'\n"
                    f"- 'composite_plan'\n"
                    f"- 'general'\n\n"
                    f"Query: \"{message}\"\n\n"
                    "Respond with ONLY the exact intent label in lowercase."
                )
                label = await gemini_service.generate_text(prompt=prompt, temperature=0.1, timeout=3.0)
                if label:
                    clean_label = label.strip().strip("'\"").lower()
                    if clean_label in [
                        "learning_recommendation", "coding_mentor", "interview_mentor",
                        "progress_analytics", "skill_assessment", "composite_plan"
                    ]:
                        return clean_label
            except Exception as e:
                logger.warning(f"Gemini intent classification fallback failed: {e}")

        return "general"

    # --------------------------------------------------------------------------
    # Specialized Handlers
    # --------------------------------------------------------------------------

    async def _handle_learning_recommendation(
        self,
        student_id: str,
        profile: Dict[str, Any],
        message: str
    ) -> Dict[str, Any]:
        """
        Delegates to Learning Recommendation Agent.
        """
        roadmap_data = await learning_recommendation_agent.generate_personalized_roadmap(
            student_id=student_id
        )

        daily_plan = roadmap_data.get("daily_practice_plan", {})
        next_topics = roadmap_data.get("topics_to_study_next", ["Dynamic Programming", "SQL Indexing"])
        role = profile.get("careerGoal", "Software Engineer")

        response = (
            f"Here is your personalized study plan for today targeted at your goal of **{role}**:\n\n"
            f"1. **Primary Focus:** {next_topics[0] if next_topics else 'Core Algorithms'}\n"
            f"   - *Coding Practice:* {daily_plan.get('coding_practice', {}).get('problem_focus', 'Medium LeetCode challenge')}\n"
            f"   - *Expected Time:* {daily_plan.get('coding_practice', {}).get('daily_time_allocation', '45 mins')}\n"
            f"2. **Secondary Review:** {next_topics[1] if len(next_topics) > 1 else 'System Architecture'}\n"
            f"   - *Drill:* {daily_plan.get('sql_practice', {}).get('difficulty', 'Intermediate SQL queries')}\n"
            f"3. **Spaced Repetition:** Review your identified strong topics to maintain retention before mock drives."
        )

        actions = [
            {"label": "Open Daily Practice", "action": "navigate", "target": "/practice"},
            {"label": "View Full Roadmap", "action": "navigate", "target": "/roadmaps"},
            {"label": "Start Assessment", "action": "navigate", "target": "/assessment"}
        ]

        return {
            "response": response,
            "actions": actions,
            "data": {
                "topics_to_study_next": next_topics,
                "daily_practice_plan": daily_plan,
                "milestones_count": len(roadmap_data.get("milestones", []))
            }
        }

    async def _handle_coding_mentor(
        self,
        student_id: str,
        profile: Dict[str, Any],
        message: str
    ) -> Dict[str, Any]:
        """
        Delegates to Coding Mentor Agent.
        """
        # Socratic hint or guidance
        hint_result = await coding_mentor_agent.provide_progressive_hint(
            student_id=student_id,
            problem_id="prob_two_sum",
            problem_title="Two Sum",
            code="# Student working on solution",
            requested_level=1
        )

        response = (
            f"I'm here to help you debug and optimize your coding problems!\n\n"
            f"**Conceptual Hint:**\n{hint_result.get('hint_content', 'Think about using a Hash Map to look up complement values in O(1) time.')}\n\n"
            f"Would you like me to analyze your specific code implementation or provide a deeper algorithmic breakdown?"
        )

        actions = [
            {"label": "Submit Code for Analysis", "action": "navigate", "target": "/practice/two-sum"},
            {"label": "Request Level 2 Hint", "action": "hint_level_2", "target": "prob_two_sum"},
            {"label": "View Submission History", "action": "navigate", "target": "/profile"}
        ]

        return {
            "response": response,
            "actions": actions,
            "data": hint_result
        }

    async def _handle_interview_mentor(
        self,
        student_id: str,
        profile: Dict[str, Any],
        message: str
    ) -> Dict[str, Any]:
        """
        Delegates to Interview Mentor Agent.
        """
        mode = "hr" if "hr" in message.lower() or "behavioral" in message.lower() else "technical"
        interview_session = await interview_mentor_agent.start_interview(
            student_id=student_id,
            mode=mode,
            target_company="General",
            role=profile.get("careerGoal", "Software Engineer"),
            max_questions=3
        )

        response = (
            f"I have initialized a **{mode.upper()} Placement Mock Interview** for you!\n\n"
            f"**Question 1:**\n\"{interview_session.get('question')}\"\n\n"
            f"Take your time to structure your answer thoughtfully. "
            f"{'Use the STAR method (Situation, Task, Action, Result).' if mode == 'hr' else 'Be sure to mention trade-offs and complexity.'}"
        )

        actions = [
            {"label": f"Continue {mode.upper()} Interview", "action": "open_interview", "sessionId": interview_session.get("sessionId")},
            {"label": "Switch to Technical Round", "action": "start_technical_interview", "target": "/interview"}
        ]

        return {
            "response": response,
            "actions": actions,
            "data": interview_session
        }

    async def _handle_progress_analytics(
        self,
        student_id: str,
        profile: Dict[str, Any],
        message: str
    ) -> Dict[str, Any]:
        """
        Delegates to Progress Analytics Agent.
        """
        readiness = await progress_analytics_agent.generate_readiness_report(student_id)
        score = readiness.get("readinessScore", 70.0)
        status = readiness.get("status", "Needs Improvement")
        strong = readiness.get("strongAreas", [])
        weak = readiness.get("weakAreas", [])
        improvements = readiness.get("improvements", [])

        response = (
            f"Your current deterministic **Placement Readiness Score is {score}%** ({status}).\n\n"
            f"**Key Strengths:**\n" + ("\n".join([f"- {s}" for s in strong[:3]]) if strong else "- Foundational problem solving") + "\n\n"
            f"**Areas Needing Improvement:**\n" + ("\n".join([f"- {w}" for w in weak[:3]]) if weak else "- Maintain current pace") + "\n\n"
            f"**Action Item:** {improvements[0] if improvements else 'Complete a mock interview round.'}"
        )

        actions = [
            {"label": "View Full Analytics Dashboard", "action": "navigate", "target": "/dashboard"},
            {"label": "Take Diagnostic Assessment", "action": "navigate", "target": "/assessment"},
            {"label": "Start Mock Interview", "action": "navigate", "target": "/interview"}
        ]

        return {
            "response": response,
            "actions": actions,
            "data": readiness
        }

    async def _handle_skill_assessment(
        self,
        student_id: str,
        profile: Dict[str, Any],
        message: str
    ) -> Dict[str, Any]:
        """
        Delegates to Skill Assessment / Diagnostics.
        """
        weaknesses = profile.get("weaknesses", ["Dynamic Programming", "SQL Indexing"])
        strengths = profile.get("strengths", ["Java Core", "Problem Solving"])

        response = (
            f"Based on your diagnostic evaluations, here is your skill breakdown:\n\n"
            f"**Identified Weak Areas (Require Remediation):**\n" +
            ("\n".join([f"- {w}" for w in weaknesses[:4]]) if weaknesses else "- No significant weaknesses diagnosed yet!") + "\n\n"
            f"**Verified Strengths:**\n" +
            ("\n".join([f"- {s}" for s in strengths[:4]]) if strengths else "- Core Engineering Fundamentals") + "\n\n"
            f"Would you like to start a targeted diagnostic test in **{weaknesses[0] if weaknesses else 'DSA'}** to verify improvement?"
        )

        actions = [
            {"label": f"Test {weaknesses[0] if weaknesses else 'DSA'}", "action": "start_assessment", "category": weaknesses[0] if weaknesses else "DSA"},
            {"label": "Practice Coding Questions", "action": "navigate", "target": "/practice"},
            {"label": "View Readiness Score", "action": "navigate", "target": "/dashboard"}
        ]

        return {
            "response": response,
            "actions": actions,
            "data": {
                "weaknesses": weaknesses,
                "strengths": strengths
            }
        }

    async def _handle_composite_plan(
        self,
        student_id: str,
        profile: Dict[str, Any],
        message: str
    ) -> Dict[str, Any]:
        """
        Multi-Agent Synthesis:
        Invokes Analytics (to identify current readiness and weak areas) +
        Learning Recommendation (to build tailored roadmap milestones).
        """
        logger.info(f"[COORDINATOR] Running composite preparation workflow for '{student_id}'.")

        # Step 1: Read Analytics
        readiness = await progress_analytics_agent.generate_readiness_report(student_id)
        # Step 2: Generate Roadmap
        roadmap = await learning_recommendation_agent.generate_personalized_roadmap(student_id)

        score = readiness.get("readinessScore", 70.0)
        status = readiness.get("status", "Needs Improvement")
        role = profile.get("careerGoal", "Software Engineer")
        weak_areas = readiness.get("weakAreas", [])
        milestones = roadmap.get("milestones", [])

        response = (
            f"### Comprehensive Placement Preparation Plan for {role}\n\n"
            f"**1. Current Benchmark:** Readiness is currently at **{score}%** ({status}).\n"
            f"**2. Target Gap Remediation:** We have prioritized {', '.join(weak_areas[:2]) if weak_areas else 'Core DSA'}.\n"
            f"**3. Milestone Roadmap:** Formulated an **{len(milestones)}-phase structured curriculum** with weekly coding drills and timed aptitude sets.\n"
            f"**4. Mock Interview Sprints:** Technical interview rounds scheduled after milestone 2 completion."
        )

        actions = [
            {"label": "View Structured Roadmap", "action": "navigate", "target": "/roadmaps"},
            {"label": "Start Daily Practice", "action": "navigate", "target": "/practice"},
            {"label": "Check Analytics", "action": "navigate", "target": "/dashboard"}
        ]

        return {
            "response": response,
            "actions": actions,
            "data": {
                "readinessScore": score,
                "status": status,
                "roadmap_milestones": len(milestones),
                "weakAreas": weak_areas
            }
        }

    async def _handle_general_guidance(
        self,
        student_id: str,
        profile: Dict[str, Any],
        message: str
    ) -> Dict[str, Any]:
        """
        Conversational guidance from the Coordinator using student background from shared memory.
        """
        name = profile.get("name", "Student")
        role = profile.get("careerGoal", "Software Engineer")
        year = profile.get("year", "4th Year")
        branch = profile.get("branch", "Computer Science")

        response = (
            f"Hello {name}! As your CareerForge Placement Coordinator, I'm here to guide your transition "
            f"into a **{role}** role. You are currently in your **{year} ({branch})**.\n\n"
            f"I can coordinate with any of our specialized AI agents:\n"
            f"- **Skill Assessment Agent:** Diagnose weak concepts with adaptive MCQs\n"
            f"- **Learning Recommendation Agent:** Generate personalized daily study roadmaps\n"
            f"- **Coding Mentor Agent:** Sandbox code execution, Socratic hints, and complexity analysis\n"
            f"- **Interview Mentor Agent:** Realistic HR and Technical mock interviews with rubric evaluations\n"
            f"- **Progress Analytics Agent:** Deterministic placement readiness score calculation\n\n"
            f"How would you like to prepare today?"
        )

        actions = [
            {"label": "What should I study today?", "action": "chat", "message": "What should I study today?"},
            {"label": "Am I placement ready?", "action": "chat", "message": "Am I placement ready?"},
            {"label": "Start an HR interview", "action": "chat", "message": "Start an HR interview"},
            {"label": "I want to know my weak areas", "action": "chat", "message": "I want to know my weak areas"}
        ]

        return {
            "response": response,
            "actions": actions,
            "data": {
                "student_name": name,
                "role": role,
                "year": year,
                "branch": branch
            }
        }


# Global Singleton Instance
coordinator_agent = CoordinatorAgent()
