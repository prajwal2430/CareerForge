"""
CareerForge AI Service - Adaptive Learning Loop
===============================================
Role: Continuous Feedback Orchestrator.
Continuously uses new student performance (Assessments, Coding, Interviews, Learning Progress)
to update skill profiles, detect weak/strong shifts, and adaptively update roadmaps without
blind regeneration.

Pipeline:
Assessment / Practice / Submission
↓
Collect Multi-Modal Signals
↓
Analytics (Deterministic Scoring & Historical Comparison)
↓
Detect Skill Shifts (Improved, Remains Weak, Became Strong, Interview Weak, Coding Weak)
↓
Update Student Profile & Verified Skills
↓
Adapt Existing Roadmap (Preserve ID & Completed Milestones, Apply 5 Core Rules)
↓
Persist to MongoDB & Memory
"""

from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

from app.services.student_memory import student_memory
from app.services.readiness_service import readiness_scoring_service
from app.agents.learning_recommendation import learning_recommendation_agent
from app.services.db import get_database
from app.utils.logger import logger


CATEGORY_TOPIC_MAP = {
    "sql": ["relational", "sql", "join", "index", "normalization", "transaction", "database"],
    "dsa": ["dsa", "dynamic programming", "tree", "graph", "array", "hash", "stack", "queue", "algorithm", "recursion"],
    "java": ["java", "multithreading", "jvm", "concurrency", "oop", "collections"],
    "aptitude": ["aptitude", "quant", "logical", "reasoning", "math", "probability"],
    "interview": ["interview", "star", "mock", "behavioral"]
}


def is_topic_in_category(topic: str, category: str) -> bool:
    topic_l = topic.lower()
    cat_l = category.lower()
    if cat_l in topic_l or topic_l in cat_l:
        return True
    keywords = CATEGORY_TOPIC_MAP.get(cat_l, [])
    return any(k in topic_l for k in keywords)


class AdaptiveLearningLoopService:
    """
    Continuous adaptive loop orchestrator.
    """

    def __init__(self, name: str = "Adaptive Learning Loop"):
        self.name = name

    async def evaluate_and_adapt(
        self,
        student_id: str,
        trigger_source: str = "performance_update",
        trigger_payload: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Executes a complete iteration of the adaptive learning loop:
        1. Multi-modal signal gathering
        2. Deterministic analytics & trend calculation
        3. Skill shift detection (5 rules)
        4. Profile & skill level synchronization
        5. In-place roadmap adaptation
        6. History logging
        """
        logger.info(f"[ADAPTIVE LOOP] Running evaluation for student '{student_id}' triggered by '{trigger_source}'.")

        # 1. Gather all student signals
        signals = await student_memory.read_all_student_signals(student_id)
        profile = signals.get("profile", {})
        if not profile:
            profile = await student_memory.get_or_create_student(
                student_id=student_id,
                email=f"{student_id}@careerforge.edu",
                name=student_id.capitalize()
            )
            signals["profile"] = profile

        # 2. Deterministic Skill Scoring
        current_skills = readiness_scoring_service.calculate_skill_scores(signals)
        readiness_score = readiness_scoring_service.compute_readiness_score(current_skills)
        readiness_status = readiness_scoring_service.determine_status(readiness_score)

        # 3. Read previous analytics history to detect shifts
        analytics_history = await student_memory.read_analytics_history(student_id, limit=5)
        previous_snapshot = analytics_history[0] if analytics_history else {}
        prev_skills = previous_snapshot.get("skills", {})

        # Profile strengths and weaknesses
        existing_strengths = list(profile.get("strengths", []))
        existing_weaknesses = list(profile.get("weaknesses", []))

        # 4. Detect Skill Shifts based on measurable progress
        improved_skills: List[str] = []
        remains_weak: List[str] = []
        became_strong: List[str] = []

        # Check Category scores
        for category, curr_score in current_skills.items():
            if category in ("learning", "consistency"):
                continue

            prev_score = prev_skills.get(category)
            cat_name = category.upper() if category in ("dsa", "sql") else category.capitalize()

            # Check if this category was the direct trigger of the evaluation
            is_trigger_category = False
            if trigger_payload and isinstance(trigger_payload, dict):
                t_cat = trigger_payload.get("category", "")
                if t_cat and (t_cat.lower() == category.lower() or is_topic_in_category(t_cat, category)):
                    is_trigger_category = True
            if category.lower() in trigger_source.lower():
                is_trigger_category = True

            # Did the score measurably improve?
            score_improved = False
            if prev_score is not None and curr_score >= prev_score + 3.0:
                score_improved = True
            elif prev_score is not None and prev_score < 65.0 and curr_score >= 65.0:
                score_improved = True
            elif prev_score is None and is_trigger_category and curr_score >= 65.0:
                score_improved = True
            elif is_trigger_category and curr_score >= 70.0 and (prev_score is None or curr_score >= prev_score):
                score_improved = True

            # Rule 1: Skill improves -> reduce repetitive beginner content and increase difficulty
            if score_improved:
                improved_skills.append(cat_name)

            # Rule 3: Skill becomes strong -> move to the next topic
            if curr_score >= 75.0:
                if (prev_score is None or prev_score < 75.0) or is_trigger_category or cat_name not in existing_strengths:
                    became_strong.append(cat_name)
                    if cat_name not in improved_skills:
                        improved_skills.append(cat_name)
                if cat_name not in existing_strengths:
                    existing_strengths.append(cat_name)
                # Remove resolved weaknesses in this category
                existing_weaknesses = [w for w in existing_weaknesses if not is_topic_in_category(w, category)]

            # Rule 2: Skill remains weak -> recommend additional practice & prerequisite topics
            if curr_score < 65.0:
                if is_trigger_category or (prev_score is not None and prev_score < 65.0) or any(is_topic_in_category(w, category) for w in existing_weaknesses):
                    remains_weak.append(cat_name)
                    if cat_name not in existing_weaknesses and curr_score < 60.0:
                        existing_weaknesses.append(cat_name)

        # Incorporate granular topics from weaknesses
        for w in existing_weaknesses:
            if w not in remains_weak and not any(s.lower() in w.lower() for s in became_strong):
                remains_weak.append(w)

        # Coding and Interview specifics
        is_coding_weak = current_skills.get("dsa", 70.0) < 65.0
        codings = signals.get("coding_submissions", [])
        if codings:
            recent_codings = codings[:3]
            recent_accepted = sum(1 for c in recent_codings if c.get("status") == "Accepted")
            if recent_accepted >= 1 and codings[0].get("status") == "Accepted" and current_skills.get("dsa", 0) >= 60.0:
                is_coding_weak = False
            elif codings[0].get("status") in ("Wrong Answer", "Runtime Error", "Time Limit Exceeded"):
                is_coding_weak = True

        is_interview_weak = current_skills.get("interview", 70.0) < 70.0
        interviews = signals.get("interview_sessions", [])
        if interviews:
            last_iv_score = interviews[0].get("overall_score")
            if last_iv_score is not None:
                if last_iv_score >= 75:
                    is_interview_weak = False
                elif last_iv_score < 68:
                    is_interview_weak = True

        skill_shifts = {
            "improved_skills": list(dict.fromkeys(improved_skills)),
            "remains_weak": list(dict.fromkeys(remains_weak)),
            "became_strong": list(dict.fromkeys(became_strong)),
            "is_interview_weak": is_interview_weak,
            "is_coding_weak": is_coding_weak,
            "current_scores": current_skills,
            "previous_scores": prev_skills
        }

        # 5. Synchronize Student Profile in Shared Memory
        updated_skills = []
        for cat, score in current_skills.items():
            lvl = "Advanced" if score >= 80 else ("Intermediate" if score >= 60 else "Beginner")
            updated_skills.append({
                "name": cat.upper() if cat in ("dsa", "sql") else cat.capitalize(),
                "level": lvl,
                "verified": score >= 65
            })
        await student_memory.update_skills(student_id, updated_skills)

        if existing_strengths:
            await student_memory.update_strengths(student_id, list(dict.fromkeys(existing_strengths)))
        if existing_weaknesses:
            await student_memory.update_weaknesses(student_id, list(dict.fromkeys(existing_weaknesses)), mode="replace")

        # Save Placement Readiness record to history
        readiness_record = {
            "student_id": student_id,
            "readinessScore": readiness_score,
            "status": readiness_status,
            "skills": current_skills,
            "strongAreas": existing_strengths[:4],
            "weakAreas": existing_weaknesses[:4],
            "calculated_at": datetime.now(timezone.utc)
        }
        await student_memory.save_placement_readiness(student_id, readiness_record)

        # 6. Adapt the Existing Roadmap In-Place (Never blindly regenerate!)
        updated_roadmap = await learning_recommendation_agent.adapt_existing_roadmap(
            student_id=student_id,
            skill_shifts=skill_shifts,
            trigger=trigger_source
        )

        # 7. Record Adaptive Loop Event in MongoDB
        loop_log_entry = {
            "student_id": student_id,
            "trigger_source": trigger_source,
            "trigger_payload": trigger_payload or {},
            "readiness_score": readiness_score,
            "readiness_status": readiness_status,
            "skill_shifts": skill_shifts,
            "roadmap_id": updated_roadmap.get("roadmap_id"),
            "revision": updated_roadmap.get("revision"),
            "rules_applied": updated_roadmap.get("adaptation_history", [])[-1].get("rules_applied", []) if updated_roadmap.get("adaptation_history") else [],
            "timestamp": datetime.now(timezone.utc)
        }

        db = get_database()
        if db is not None:
            await db["learning_loop_history"].insert_one(dict(loop_log_entry))

        await student_memory.save_agent_result(
            identifier=student_id,
            agent_name=self.name,
            task_name="execute_adaptive_loop",
            result_data={
                "trigger": trigger_source,
                "readinessScore": readiness_score,
                "roadmap_id": updated_roadmap.get("roadmap_id"),
                "revision": updated_roadmap.get("revision"),
                "rules_count": len(loop_log_entry["rules_applied"])
            }
        )

        logger.info(
            f"[ADAPTIVE LOOP] Completed iteration for '{student_id}'. Roadmap '{updated_roadmap.get('roadmap_id')}' "
            f"updated to revision {updated_roadmap.get('revision')} with {len(loop_log_entry['rules_applied'])} rules applied."
        )

        return {
            "status": "success",
            "student_id": student_id,
            "trigger": trigger_source,
            "readinessScore": readiness_score,
            "readinessStatus": readiness_status,
            "skillShifts": skill_shifts,
            "rulesApplied": loop_log_entry["rules_applied"],
            "roadmap": {
                "roadmapId": updated_roadmap.get("roadmap_id"),
                "revision": updated_roadmap.get("revision"),
                "trackTitle": updated_roadmap.get("track_title"),
                "topicsToStudyNext": updated_roadmap.get("topics_to_study_next"),
                "dailyPracticePlan": updated_roadmap.get("daily_practice_plan"),
                "codingPractice": updated_roadmap.get("coding_practice"),
                "milestonesCount": len(updated_roadmap.get("milestones", []))
            }
        }


# Global Singleton Instance
adaptive_learning_loop = AdaptiveLearningLoopService()
