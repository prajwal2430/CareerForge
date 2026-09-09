from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Union
from app.services.db import get_database
from app.utils.logger import logger
from app.models.student_memory import (
    Student,
    SkillItem,
    AssessmentResult,
    CodingSubmission,
    LearningRoadmap,
    LearningProgress,
    InterviewSession,
    ProgressAnalytics,
    PlacementReadiness,
    AgentResult
)

# Collection Names in the shared MongoDB database ('learnhub')
COLLECTIONS = {
    "students": "students",
    "assessments": "assessments",
    "assessment_results": "assessment_results",
    "coding_submissions": "coding_submissions",
    "learning_roadmaps": "learning_roadmaps",
    "learning_progress": "learning_progress",
    "interview_sessions": "interview_sessions",
    "progress_analytics": "progress_analytics",
    "placement_readiness": "placement_readiness",
    "agent_results": "agent_results",
    "resume_analyses": "resume_analyses"
}


class StudentMemoryService:
    """
    Unified Shared Memory Service for CareerForge AI Agents.
    All agents read and write student memory through this centralized service.
    Directly interfaces with the shared MongoDB 'learnhub' database.
    """

    def __init__(self):
        # In-memory fallback cache for resilience if DB connection is intermittent
        self._in_memory_students: Dict[str, Dict[str, Any]] = {}
        self._in_memory_results: List[Dict[str, Any]] = []
        self._in_memory_readiness: Dict[str, List[Dict[str, Any]]] = {}
        self._in_memory_resumes: Dict[str, List[Dict[str, Any]]] = {}

    def _get_col(self, col_name: str):
        db = get_database()
        if db is not None:
            return db[COLLECTIONS.get(col_name, col_name)]
        return None

    # --------------------------------------------------------------------------
    # 1. READ STUDENT PROFILE
    # --------------------------------------------------------------------------
    async def read_student_profile(self, identifier: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves the complete profile of a student by student_id or email.
        """
        col = self._get_col("students")
        if col is not None:
            query = {"$or": [{"student_id": identifier}, {"email": identifier}]}
            doc = await col.find_one(query, {"_id": 0})
            if doc:
                return doc

        # Fallback to local memory cache
        return self._in_memory_students.get(identifier)

    # --------------------------------------------------------------------------
    # 2. READ LATEST SCORES
    # --------------------------------------------------------------------------
    async def read_latest_scores(self, identifier: str) -> Dict[str, Any]:
        """
        Retrieves the latest scores across assessments, coding, mock interviews, and readiness.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        scores = {
            "readinessScore": profile.get("readinessScore", 0.0) if profile else 0.0,
            "progress": profile.get("progress", {}) if profile else {},
            "latest_assessments": [],
            "latest_coding": None,
            "latest_interview": None
        }

        # Latest assessment results
        ar_col = self._get_col("assessment_results")
        if ar_col is not None:
            cursor = ar_col.find({"student_id": student_id}, {"_id": 0}).sort("timestamp", -1).limit(3)
            scores["latest_assessments"] = await cursor.to_list(length=3)

        # Latest coding submission
        cs_col = self._get_col("coding_submissions")
        if cs_col is not None:
            doc = await cs_col.find_one({"student_id": student_id}, {"_id": 0}, sort=[("timestamp", -1)])
            scores["latest_coding"] = doc

        # Latest interview score
        iv_col = self._get_col("interview_sessions")
        if iv_col is not None:
            doc = await iv_col.find_one({"student_id": student_id}, {"_id": 0}, sort=[("created_at", -1)])
            scores["latest_interview"] = doc

        return scores

    # --------------------------------------------------------------------------
    # 3. READ WEAKNESSES
    # --------------------------------------------------------------------------
    async def read_weaknesses(self, identifier: str) -> List[str]:
        """
        Retrieves diagnosed weaknesses and skill deficit areas for targeted learning.
        """
        profile = await self.read_student_profile(identifier)
        if profile:
            return profile.get("weaknesses", [])
        return []

    # --------------------------------------------------------------------------
    # 4. READ LEARNING HISTORY
    # --------------------------------------------------------------------------
    async def read_learning_history(self, identifier: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Retrieves course completion history and learning progress entries.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        lp_col = self._get_col("learning_progress")
        if lp_col is not None:
            cursor = lp_col.find({"student_id": student_id}, {"_id": 0}).sort("last_accessed", -1).limit(limit)
            return await cursor.to_list(length=limit)

        if profile and "learningHistory" in profile:
            return profile["learningHistory"][:limit]

        return []

    # --------------------------------------------------------------------------
    # 5. READ INTERVIEW HISTORY
    # --------------------------------------------------------------------------
    async def read_interview_history(self, identifier: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieves mock interview sessions, dialogue logs, and rubric scores.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        iv_col = self._get_col("interview_sessions")
        if iv_col is not None:
            cursor = iv_col.find({"student_id": student_id}, {"_id": 0}).sort("created_at", -1).limit(limit)
            return await cursor.to_list(length=limit)

        if profile and "interviewHistory" in profile:
            return profile["interviewHistory"][:limit]

        return []

    # --------------------------------------------------------------------------
    # 6. UPDATE SKILLS
    # --------------------------------------------------------------------------
    async def update_skills(
        self,
        identifier: str,
        skills: List[Union[Dict[str, Any], SkillItem, str]],
        mode: str = "merge"
    ) -> List[Dict[str, Any]]:
        """
        Updates student verified skills.
        mode="merge" adds new skills or updates levels; mode="replace" overwrites the array.
        """
        col = self._get_col("students")
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        # Normalize incoming skills to dicts
        normalized_skills: List[Dict[str, Any]] = []
        for s in skills:
            if isinstance(s, str):
                normalized_skills.append({"name": s, "level": "Intermediate", "verified": True})
            elif isinstance(s, SkillItem):
                normalized_skills.append(s.model_dump())
            elif isinstance(s, dict):
                normalized_skills.append({
                    "name": s.get("name", "Unknown"),
                    "level": s.get("level", "Intermediate"),
                    "verified": s.get("verified", True)
                })

        if mode == "merge" and profile and "skills" in profile:
            existing_map = {item["name"].lower(): item for item in profile["skills"]}
            for n_skill in normalized_skills:
                existing_map[n_skill["name"].lower()] = n_skill
            final_skills = list(existing_map.values())
        else:
            final_skills = normalized_skills

        # Persist to database
        now = datetime.now(timezone.utc)
        if col is not None:
            await col.update_one(
                {"$or": [{"student_id": student_id}, {"email": identifier}]},
                {"$set": {"skills": final_skills, "updated_at": now}},
                upsert=True
            )

        # Update in-memory fallback
        if identifier in self._in_memory_students:
            self._in_memory_students[identifier]["skills"] = final_skills
            self._in_memory_students[identifier]["updated_at"] = now

        logger.info(f"Updated skills for student '{student_id}': {len(final_skills)} total skills.")
        return final_skills

    # --------------------------------------------------------------------------
    # 7. UPDATE WEAKNESSES
    # --------------------------------------------------------------------------
    async def update_weaknesses(
        self,
        identifier: str,
        weaknesses: List[str],
        mode: str = "merge"
    ) -> List[str]:
        """
        Updates or appends diagnosed weaknesses for adaptive recommendation.
        """
        col = self._get_col("students")
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        if mode == "merge" and profile and "weaknesses" in profile:
            current = set(profile["weaknesses"])
            current.update(weaknesses)
            final_weaknesses = list(current)
        else:
            final_weaknesses = list(set(weaknesses))

        now = datetime.now(timezone.utc)
        if col is not None:
            await col.update_one(
                {"$or": [{"student_id": student_id}, {"email": identifier}]},
                {"$set": {"weaknesses": final_weaknesses, "updated_at": now}},
                upsert=True
            )

        if identifier in self._in_memory_students:
            self._in_memory_students[identifier]["weaknesses"] = final_weaknesses
            self._in_memory_students[identifier]["updated_at"] = now

        logger.info(f"Updated weaknesses for student '{student_id}': {final_weaknesses}")
        return final_weaknesses

    # --------------------------------------------------------------------------
    # 8. UPDATE ROADMAP
    # --------------------------------------------------------------------------
    async def update_roadmap(
        self,
        identifier: str,
        roadmap_data: Union[Dict[str, Any], LearningRoadmap]
    ) -> Dict[str, Any]:
        """
        Updates the student's active roadmap and records in learning_roadmaps.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        data = roadmap_data.model_dump() if isinstance(roadmap_data, LearningRoadmap) else roadmap_data
        data["student_id"] = student_id
        data["updated_at"] = datetime.now(timezone.utc)

        # 1. Update learning_roadmaps collection
        lr_col = self._get_col("learning_roadmaps")
        if lr_col is not None:
            await lr_col.update_one(
                {"student_id": student_id},
                {"$set": data},
                upsert=True
            )

        # 2. Update embedded roadmap summary in students collection
        st_col = self._get_col("students")
        if st_col is not None:
            await st_col.update_one(
                {"$or": [{"student_id": student_id}, {"email": identifier}]},
                {"$set": {"roadmap": data, "updated_at": data["updated_at"], "student_id": student_id}},
                upsert=True
            )

        if identifier in self._in_memory_students:
            self._in_memory_students[identifier]["roadmap"] = data

        logger.info(f"Updated learning roadmap for student '{student_id}': {data.get('track_title', 'Roadmap')}")
        return data

    # --------------------------------------------------------------------------
    # 9. SAVE AGENT RESULT
    # --------------------------------------------------------------------------
    async def save_agent_result(
        self,
        identifier: str,
        agent_name: str,
        task_name: str,
        result_data: Dict[str, Any],
        artifacts: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Persists structured execution results from any agent to agent_results collection.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        record = {
            "student_id": student_id,
            "agent_name": agent_name,
            "task_name": task_name,
            "output_summary": result_data.get("summary", f"{agent_name} executed {task_name}"),
            "details": result_data,
            "artifacts": artifacts or [],
            "timestamp": datetime.now(timezone.utc)
        }

        ar_col = self._get_col("agent_results")
        if ar_col is not None:
            await ar_col.insert_one(record)
        else:
            self._in_memory_results.append(record)

        logger.info(f"Saved execution result for Agent '{agent_name}' on task '{task_name}' for student '{student_id}'.")
        return record

    # --------------------------------------------------------------------------
    # 10. GET OR CREATE STUDENT (INITIALIZATION HELPER)
    # --------------------------------------------------------------------------
    async def get_or_create_student(
        self,
        student_id: str,
        email: str,
        name: str,
        branch: str = "Computer Science",
        year: str = "4th Year",
        careerGoal: str = "Software Development Engineer (SDE-1)"
    ) -> Dict[str, Any]:
        """
        Retrieves existing student profile or creates an initialized profile.
        """
        existing = await self.read_student_profile(student_id)
        if existing:
            return existing

        existing_by_email = await self.read_student_profile(email)
        if existing_by_email:
            return existing_by_email

        new_student = Student(
            student_id=student_id,
            email=email,
            name=name,
            branch=branch,
            year=year,
            careerGoal=careerGoal,
            skills=[
                SkillItem(name="Python", level="Intermediate", verified=True),
                SkillItem(name="Data Structures", level="Intermediate", verified=True)
            ],
            strengths=["Arrays", "Hash Tables", "Object-Oriented Programming"],
            weaknesses=["Dynamic Programming", "System Design"],
            progress={"dsa": 45.0, "courses": 60.0, "mock": 80.0, "resume": 85.0, "overall": 67.5},
            readinessScore=72.0
        ).model_dump()

        col = self._get_col("students")
        if col is not None:
            await col.insert_one(new_student)

        self._in_memory_students[student_id] = new_student
        self._in_memory_students[email] = new_student

        logger.info(f"Initialized new student profile in shared memory: {student_id} ({email})")
        return new_student

    # --------------------------------------------------------------------------
    # 11. UPDATE STRENGTHS
    # --------------------------------------------------------------------------
    async def update_strengths(
        self,
        identifier: str,
        strengths: List[str]
    ) -> List[str]:
        """
        Appends or updates identified strengths in the student profile.
        """
        col = self._get_col("students")
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        current = set(profile.get("strengths", [])) if profile else set()
        current.update(strengths)
        final_strengths = list(current)

        now = datetime.now(timezone.utc)
        if col is not None:
            await col.update_one(
                {"$or": [{"student_id": student_id}, {"email": identifier}]},
                {"$set": {"strengths": final_strengths, "updated_at": now}},
                upsert=True
            )

        if identifier in self._in_memory_students:
            self._in_memory_students[identifier]["strengths"] = final_strengths
            self._in_memory_students[identifier]["updated_at"] = now

        logger.info(f"Updated strengths for student '{student_id}': {final_strengths}")
        return final_strengths

    # --------------------------------------------------------------------------
    # 12. REMOVE WEAKNESSES
    # --------------------------------------------------------------------------
    async def remove_weaknesses(
        self,
        identifier: str,
        resolved_weaknesses: List[str]
    ) -> List[str]:
        """
        Removes resolved weaknesses when student demonstrates mastery.
        """
        col = self._get_col("students")
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        current = set(profile.get("weaknesses", [])) if profile else set()
        for w in resolved_weaknesses:
            current.discard(w)
        final_weaknesses = list(current)

        now = datetime.now(timezone.utc)
        if col is not None:
            await col.update_one(
                {"$or": [{"student_id": student_id}, {"email": identifier}]},
                {"$set": {"weaknesses": final_weaknesses, "updated_at": now}},
                upsert=True
            )

        if identifier in self._in_memory_students:
            self._in_memory_students[identifier]["weaknesses"] = final_weaknesses
            self._in_memory_students[identifier]["updated_at"] = now

        logger.info(f"Removed resolved weaknesses for '{student_id}'. Remaining: {final_weaknesses}")
        return final_weaknesses

    # --------------------------------------------------------------------------
    # 13. SAVE ASSESSMENT RESULT
    # --------------------------------------------------------------------------
    async def save_assessment_result(
        self,
        result_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Saves a finalized assessment result into assessment_results collection and appends to student history.
        """
        student_id = result_data.get("student_id")
        if not result_data.get("timestamp"):
            result_data["timestamp"] = datetime.now(timezone.utc)

        col = self._get_col("assessment_results")
        if col is not None:
            await col.insert_one(result_data)
        result_data.pop("_id", None)

        # Also push to student.assessmentHistory in students collection
        st_col = self._get_col("students")
        if st_col is not None and student_id:
            summary_entry = {
                "assessmentId": result_data.get("assessment_id"),
                "category": result_data.get("category"),
                "score": result_data.get("score"),
                "passed": result_data.get("passed", True),
                "timestamp": result_data["timestamp"]
            }
            await st_col.update_one(
                {"$or": [{"student_id": student_id}, {"email": student_id}]},
                {
                    "$push": {"assessmentHistory": summary_entry},
                    "$set": {"updated_at": datetime.now(timezone.utc)}
                }
            )

        logger.info(f"Saved assessment result for '{student_id}' in category '{result_data.get('category')}': {result_data.get('score')}%")
        return result_data

    # --------------------------------------------------------------------------
    # 14. READ ASSESSMENT HISTORY
    # --------------------------------------------------------------------------
    async def read_assessment_history(
        self,
        identifier: str,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Retrieves past assessment results for a student from assessment_results collection.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        col = self._get_col("assessment_results")
        if col is not None:
            cursor = col.find({"student_id": student_id}, {"_id": 0}).sort("timestamp", -1).limit(limit)
            results = await cursor.to_list(length=limit)
            return results

        if profile and "assessmentHistory" in profile:
            return profile["assessmentHistory"][:limit]

        return []

    # --------------------------------------------------------------------------
    # 15. READ ROADMAP
    # --------------------------------------------------------------------------
    async def read_roadmap(self, identifier: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves active personalized roadmap for a student.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        lr_col = self._get_col("learning_roadmaps")
        if lr_col is not None:
            doc = await lr_col.find_one({"student_id": student_id}, {"_id": 0})
            if doc:
                return doc

        if profile and "roadmap" in profile and profile["roadmap"]:
            return profile["roadmap"]

        return None

    # --------------------------------------------------------------------------
    # 16. RECORD LEARNING PROGRESS
    # --------------------------------------------------------------------------
    async def record_learning_progress(
        self,
        identifier: str,
        progress_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Records learning task, course lesson, or roadmap milestone completion.
        Updates learning_progress, milestones in learning_roadmaps, and student progress metrics.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        now = datetime.now(timezone.utc)
        record = {
            "student_id": student_id,
            "course_id": progress_data.get("course_id") or progress_data.get("module_id", "custom_task"),
            "course_title": progress_data.get("course_title") or progress_data.get("title", "Learning Milestone"),
            "category": progress_data.get("category", "General"),
            "completed_lessons": progress_data.get("completed_lessons", []),
            "step_id": progress_data.get("step_id"),
            "time_spent_hours": float(progress_data.get("time_spent_hours", 1.0)),
            "last_accessed": now
        }

        # 1. Upsert into learning_progress collection
        lp_col = self._get_col("learning_progress")
        if lp_col is not None:
            await lp_col.insert_one(dict(record))
        record.pop("_id", None)

        # 2. If a roadmap step_id was completed, update the milestone status in learning_roadmaps
        step_id = progress_data.get("step_id")
        lr_col = self._get_col("learning_roadmaps")
        if lr_col is not None and step_id is not None:
            roadmap = await lr_col.find_one({"student_id": student_id})
            if roadmap and "milestones" in roadmap:
                milestones = roadmap["milestones"]
                for m in milestones:
                    if m.get("step_id") == step_id:
                        m["completed"] = True
                completed_count = sum(1 for m in milestones if m.get("completed"))
                progress_pct = round((completed_count / len(milestones)) * 100, 1) if milestones else 0.0

                await lr_col.update_one(
                    {"student_id": student_id},
                    {
                        "$set": {
                            "milestones": milestones,
                            "progress_percentage": progress_pct,
                            "updated_at": now
                        }
                    }
                )

                # Also update student profile embedded progress
                st_col = self._get_col("students")
                if st_col is not None:
                    await st_col.update_one(
                        {"$or": [{"student_id": student_id}, {"email": identifier}]},
                        {"$set": {"progress.courses": progress_pct, "updated_at": now}}
                    )

        logger.info(f"Recorded learning progress for '{student_id}': {record['course_title']}")
        return record

    # --------------------------------------------------------------------------
    # 17. READ LEARNING PROGRESS SUMMARY
    # --------------------------------------------------------------------------
    async def read_learning_progress_summary(self, identifier: str) -> Dict[str, Any]:
        """
        Summarizes completed learning modules, milestones, and time spent.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        lp_col = self._get_col("learning_progress")
        history = []
        total_time_hours = 0.0
        if lp_col is not None:
            cursor = lp_col.find({"student_id": student_id}, {"_id": 0}).sort("last_accessed", -1)
            history = await cursor.to_list(length=100)
            total_time_hours = sum(h.get("time_spent_hours", 0.0) for h in history)

        roadmap = await self.read_roadmap(student_id)
        milestones = roadmap.get("milestones", []) if roadmap else []
        completed_milestones = sum(1 for m in milestones if m.get("completed"))
        total_milestones = len(milestones)
        roadmap_pct = round((completed_milestones / total_milestones) * 100, 1) if total_milestones else 0.0

        return {
            "student_id": student_id,
            "roadmap_progress_percentage": roadmap_pct,
            "completed_milestones": completed_milestones,
            "total_milestones": total_milestones,
            "total_hours_spent": round(total_time_hours, 1),
            "recent_activities": history[:10]
        }

    # --------------------------------------------------------------------------
    # 18. SAVE CODING SUBMISSION
    # --------------------------------------------------------------------------
    async def save_coding_submission(
        self,
        submission_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Saves a student code submission, test results, and AI feedback to coding_submissions collection
        and appends a summary to student.codingHistory in students collection.
        """
        student_id = submission_data.get("student_id")
        now = datetime.now(timezone.utc)
        if not submission_data.get("timestamp"):
            submission_data["timestamp"] = now

        cs_col = self._get_col("coding_submissions")
        if cs_col is not None:
            await cs_col.insert_one(dict(submission_data))
        submission_data.pop("_id", None)

        # Update student profile embedded coding history & progress metrics
        st_col = self._get_col("students")
        if st_col is not None and student_id:
            summary_entry = {
                "problem_id": submission_data.get("problem_id"),
                "problem_title": submission_data.get("problem_title"),
                "language": submission_data.get("language"),
                "status": submission_data.get("status"),
                "passed_test_cases": submission_data.get("passed_test_cases", 0),
                "total_test_cases": submission_data.get("total_test_cases", 0),
                "runtime_ms": submission_data.get("runtime_ms", 0),
                "timestamp": submission_data["timestamp"]
            }
            # If status == 'Accepted', increment DSA progress
            inc_dsa = 1.0 if submission_data.get("status") == "Accepted" else 0.2
            await st_col.update_one(
                {"$or": [{"student_id": student_id}, {"email": student_id}]},
                {
                    "$push": {"codingHistory": summary_entry},
                    "$inc": {"progress.dsa": inc_dsa},
                    "$set": {"updated_at": now}
                }
            )

        logger.info(f"Saved coding submission for '{student_id}' on '{submission_data.get('problem_title')}': {submission_data.get('status')}")
        return submission_data

    # --------------------------------------------------------------------------
    # 19. READ CODING HISTORY
    # --------------------------------------------------------------------------
    async def read_coding_history(
        self,
        identifier: str,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Retrieves past coding submissions for a student.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        cs_col = self._get_col("coding_submissions")
        if cs_col is not None:
            cursor = cs_col.find({"student_id": student_id}, {"_id": 0}).sort("timestamp", -1).limit(limit)
            return await cursor.to_list(length=limit)

        if profile and "codingHistory" in profile:
            return profile["codingHistory"][:limit]

        return []

    # --------------------------------------------------------------------------
    # 20. SAVE OR UPDATE INTERVIEW SESSION
    # --------------------------------------------------------------------------
    async def save_interview_session(
        self,
        session_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Saves or updates an interview session in interview_sessions collection.
        If completed, pushes summary to student.interviewHistory and updates progress.mock.
        """
        session_id = session_data.get("session_id")
        student_id = session_data.get("student_id")
        now = datetime.now(timezone.utc)

        col = self._get_col("interview_sessions")
        if col is not None and session_id:
            await col.update_one(
                {"session_id": session_id},
                {"$set": session_data},
                upsert=True
            )
        session_data.pop("_id", None)

        # If completed, update student profile
        if session_data.get("status") == "completed" and student_id:
            st_col = self._get_col("students")
            if st_col is not None:
                summary_entry = {
                    "session_id": session_id,
                    "mode": session_data.get("interview_type"),
                    "target_company": session_data.get("target_company"),
                    "overall_score": session_data.get("overall_score"),
                    "completed_at": session_data.get("completed_at") or now
                }
                score = session_data.get("overall_score") or 75.0
                await st_col.update_one(
                    {"$or": [{"student_id": student_id}, {"email": student_id}]},
                    {
                        "$push": {"interviewHistory": summary_entry},
                        "$set": {
                            "progress.mock": float(score),
                            "updated_at": now
                        }
                    }
                )

        logger.info(f"Saved interview session '{session_id}' for student '{student_id}': status={session_data.get('status')}")
        return session_data

    # --------------------------------------------------------------------------
    # 21. READ INTERVIEW SESSION
    # --------------------------------------------------------------------------
    async def read_interview_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves a specific interview session by session_id.
        """
        col = self._get_col("interview_sessions")
        if col is not None:
            doc = await col.find_one({"session_id": session_id}, {"_id": 0})
            if doc:
                return doc
        return None

    # --------------------------------------------------------------------------
    # 22. SAVE PROGRESS ANALYTICS
    # --------------------------------------------------------------------------
    async def save_progress_analytics(
        self,
        student_id: str,
        analytics_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Saves computed progress analytics (weekly hours, velocity, consistency) in progress_analytics collection.
        """
        now = datetime.now(timezone.utc)
        record = dict(analytics_data)
        record["student_id"] = student_id
        if "calculated_at" not in record:
            record["calculated_at"] = now

        col = self._get_col("progress_analytics")
        if col is not None:
            await col.insert_one(dict(record))
        record.pop("_id", None)

        logger.info(f"Saved progress analytics record for student '{student_id}'.")
        return record

    # --------------------------------------------------------------------------
    # 23. READ LATEST PROGRESS ANALYTICS
    # --------------------------------------------------------------------------
    async def read_latest_progress_analytics(self, identifier: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves the most recent progress analytics snapshot for a student.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        col = self._get_col("progress_analytics")
        if col is not None:
            doc = await col.find_one({"student_id": student_id}, {"_id": 0}, sort=[("calculated_at", -1)])
            if doc:
                return doc
        return None

    # --------------------------------------------------------------------------
    # 24. SAVE PLACEMENT READINESS
    # --------------------------------------------------------------------------
    async def save_placement_readiness(
        self,
        student_id: str,
        readiness_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Saves placement readiness assessment in placement_readiness collection
        and synchronizes student.readinessScore in students collection.
        """
        now = datetime.now(timezone.utc)
        record = dict(readiness_data)
        record["student_id"] = student_id
        if "calculated_at" not in record:
            record["calculated_at"] = now

        col = self._get_col("placement_readiness")
        if col is not None:
            await col.insert_one(dict(record))
        record.pop("_id", None)

        # In-memory history caching
        if student_id not in self._in_memory_readiness:
            self._in_memory_readiness[student_id] = []
        self._in_memory_readiness[student_id].insert(0, dict(record))

        # Update student profile readinessScore
        score = record.get("readinessScore") or record.get("overall_score")
        if score is not None:
            st_col = self._get_col("students")
            if st_col is not None:
                await st_col.update_one(
                    {"$or": [{"student_id": student_id}, {"email": student_id}]},
                    {
                        "$set": {
                            "readinessScore": float(score),
                            "updated_at": now
                        }
                    }
                )
            if student_id in self._in_memory_students:
                self._in_memory_students[student_id]["readinessScore"] = float(score)
                self._in_memory_students[student_id]["updated_at"] = now

        logger.info(f"Saved placement readiness for student '{student_id}': score={score}")
        return record

    # --------------------------------------------------------------------------
    # 25. READ LATEST PLACEMENT READINESS
    # --------------------------------------------------------------------------
    async def read_latest_placement_readiness(self, identifier: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves the latest placement readiness report for a student.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        col = self._get_col("placement_readiness")
        if col is not None:
            doc = await col.find_one({"student_id": student_id}, {"_id": 0}, sort=[("calculated_at", -1)])
            if doc:
                return doc

        # In-memory fallback
        if student_id in self._in_memory_readiness and self._in_memory_readiness[student_id]:
            return self._in_memory_readiness[student_id][0]
        return None

    # --------------------------------------------------------------------------
    # 26. READ ANALYTICS HISTORY
    # --------------------------------------------------------------------------
    async def read_analytics_history(self, identifier: str, limit: int = 15) -> List[Dict[str, Any]]:
        """
        Retrieves historical snapshots of progress analytics and readiness scores for trend analysis.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        col = self._get_col("placement_readiness")
        if col is not None:
            cursor = col.find({"student_id": student_id}, {"_id": 0}).sort("calculated_at", -1).limit(limit)
            results = await cursor.to_list(length=limit)
            if results:
                return results

        # In-memory fallback
        if student_id in self._in_memory_readiness:
            return self._in_memory_readiness[student_id][:limit]
        return []

    # --------------------------------------------------------------------------
    # 27. READ ALL STUDENT SIGNALS (MULTI-MODAL DATA COLLECTION)
    # --------------------------------------------------------------------------
    async def read_all_student_signals(self, identifier: str) -> Dict[str, Any]:
        """
        Gathers multi-modal data points across assessments, coding, interviews, learning, and profile.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        # 1. Assessment History
        ar_col = self._get_col("assessment_results")
        assessments = []
        if ar_col is not None:
            cursor = ar_col.find({"student_id": student_id}, {"_id": 0}).sort("timestamp", -1)
            assessments = await cursor.to_list(length=100)
        elif profile:
            assessments = profile.get("assessmentHistory", [])

        # 2. Coding Submissions
        cs_col = self._get_col("coding_submissions")
        codings = []
        if cs_col is not None:
            cursor = cs_col.find({"student_id": student_id}, {"_id": 0}).sort("timestamp", -1)
            codings = await cursor.to_list(length=100)
        elif profile:
            codings = profile.get("codingHistory", [])

        # 3. Interview Sessions
        iv_col = self._get_col("interview_sessions")
        interviews = []
        if iv_col is not None:
            cursor = iv_col.find({"student_id": student_id}, {"_id": 0}).sort("created_at", -1)
            interviews = await cursor.to_list(length=50)
        elif profile:
            interviews = profile.get("interviewHistory", [])

        # 4. Learning Progress
        lp_col = self._get_col("learning_progress")
        learnings = []
        if lp_col is not None:
            cursor = lp_col.find({"student_id": student_id}, {"_id": 0}).sort("last_accessed", -1)
            learnings = await cursor.to_list(length=100)

        # 5. Roadmap
        roadmap = await self.read_roadmap(student_id)

        return {
            "profile": profile or {},
            "student_id": student_id,
            "assessments": assessments,
            "coding_submissions": codings,
            "interview_sessions": interviews,
            "learning_progress": learnings,
            "roadmap": roadmap or {}
        }

    # --------------------------------------------------------------------------
    # 26. RESUME ANALYSIS STORAGE & RETRIEVAL
    # --------------------------------------------------------------------------
    async def save_resume_analysis(
        self,
        student_id: str,
        analysis_record: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Stores structured resume analysis in MongoDB 'resume_analyses' collection
        and updates the student's embedded resume snapshot and ATS score.
        """
        record = dict(analysis_record)
        record["student_id"] = student_id
        if "created_at" not in record:
            record["created_at"] = datetime.now(timezone.utc)
        record["updated_at"] = datetime.now(timezone.utc)

        col = self._get_col("resume_analyses")
        if col is not None:
            await col.insert_one(dict(record))

        # In-memory fallback
        if student_id not in self._in_memory_resumes:
            self._in_memory_resumes[student_id] = []
        self._in_memory_resumes[student_id].insert(0, dict(record))

        # Update student profile embedded resume & score
        ats_score = record.get("analysis", {}).get("ats_score", 0)
        detected_skills = record.get("analysis", {}).get("detected_skills", [])
        extracted_skills = record.get("parsed_data", {}).get("skills", [])
        missing_skills = record.get("analysis", {}).get("missing_skills", [])

        resume_summary = {
            "ats_score": ats_score,
            "extracted_skills": extracted_skills or detected_skills,
            "suggestions": missing_skills,
            "last_analyzed": record["created_at"]
        }

        s_col = self._get_col("students")
        if s_col is not None:
            await s_col.update_one(
                {"student_id": student_id},
                {
                    "$set": {
                        "resume": resume_summary,
                        "resume_score": float(ats_score),
                        "resume_analysis": record.get("analysis", {}),
                        "progress.resume": float(ats_score),
                        "updated_at": datetime.now(timezone.utc)
                    }
                },
                upsert=True
            )

        if student_id in self._in_memory_students:
            self._in_memory_students[student_id]["resume"] = resume_summary
            self._in_memory_students[student_id]["resume_score"] = float(ats_score)
            self._in_memory_students[student_id]["resume_analysis"] = record.get("analysis", {})

        logger.info(f"Saved resume analysis for student '{student_id}': ATS Score={ats_score}%.")
        return record

    async def read_latest_resume_analysis(self, identifier: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves the most recent structured resume analysis for a student.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        col = self._get_col("resume_analyses")
        if col is not None:
            doc = await col.find_one({"student_id": student_id}, {"_id": 0}, sort=[("created_at", -1)])
            if doc:
                return doc

        user_resumes = self._in_memory_resumes.get(student_id, [])
        if user_resumes:
            return user_resumes[0]

        return None

    async def read_resume_history(self, identifier: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Retrieves chronological resume analysis history for a student.
        """
        profile = await self.read_student_profile(identifier)
        student_id = profile.get("student_id") if profile else identifier

        col = self._get_col("resume_analyses")
        if col is not None:
            cursor = col.find({"student_id": student_id}, {"_id": 0}).sort("created_at", -1).limit(limit)
            return await cursor.to_list(length=limit)

        return self._in_memory_resumes.get(student_id, [])[:limit]


# Global Singleton Instance for all AI Agents
student_memory = StudentMemoryService()
