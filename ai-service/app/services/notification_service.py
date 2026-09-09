"""
CareerForge AI Service - Motivation & Reminder Service
======================================================
Role: Personalized Student Motivation, Study Reminders & Milestone Celebrations.

Features:
- Daily learning reminder (calibrated to today's active roadmap tasks)
- Incomplete task reminder (proactive nudge for pending tasks)
- Learning streak protection & milestone celebration
- Milestone completion notification
- Diagnostic assessment reminder for untested weak areas
- Mock interview practice reminder
- Anti-spam throttling & cooldown controls
- Persistent notification history in MongoDB
"""

import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional

from app.services.student_memory import student_memory
from app.services.gemini_service import gemini_service
from app.services.db import get_database
from app.utils.logger import logger

# Anti-spam cooldown thresholds (in hours)
COOLDOWNS = {
    "daily_learning": 20,
    "incomplete_task": 12,
    "learning_streak": 20,
    "assessment_reminder": 72,
    "interview_practice": 72,
    "milestone_notification": 1
}

# Streak celebration milestones
STREAK_MILESTONES = [3, 7, 14, 21, 30, 60, 90, 100]


class NotificationService:
    """
    Manages personalized notifications, anti-spam throttling, and student notification history.
    """

    def __init__(self, name: str = "Motivation & Reminder Engine"):
        self.name = name
        self._in_memory_notifications: Dict[str, List[Dict[str, Any]]] = {}

    # --------------------------------------------------------------------------
    # 1. Anti-Spam Check
    # --------------------------------------------------------------------------
    async def is_throttled(
        self,
        student_id: str,
        notification_type: str,
        cooldown_hours: Optional[int] = None
    ) -> bool:
        """
        Checks if a notification of this type was sent to the student within the cooldown window.
        """
        hours = cooldown_hours or COOLDOWNS.get(notification_type, 24)
        cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)

        db = get_database()
        if db is not None:
            recent = await db["notifications"].find_one({
                "student_id": student_id,
                "type": notification_type,
                "created_at": {"$gte": cutoff}
            })
            if recent:
                logger.info(f"[NOTIF] Suppressed duplicate '{notification_type}' for '{student_id}' (cooldown {hours}h active).")
                return True

            # Max active unread cap (max 6 unread notifications)
            unread_count = await db["notifications"].count_documents({
                "student_id": student_id,
                "status": "unread"
            })
            if unread_count >= 6:
                logger.info(f"[NOTIF] Suppressed notification for '{student_id}': student already has {unread_count} unread notifications.")
                return True
        else:
            user_notifs = self._in_memory_notifications.get(student_id, [])
            recent = [n for n in user_notifs if n.get("type") == notification_type and n.get("created_at") >= cutoff]
            if recent:
                logger.info(f"[NOTIF] Suppressed duplicate '{notification_type}' for '{student_id}' (in-memory cooldown {hours}h active).")
                return True
            unread_count = len([n for n in user_notifs if n.get("status") == "unread"])
            if unread_count >= 6:
                logger.info(f"[NOTIF] Suppressed notification for '{student_id}': student already has {unread_count} unread notifications (in-memory).")
                return True

        return False

    # --------------------------------------------------------------------------
    # 2. Daily Learning Reminder
    # --------------------------------------------------------------------------
    async def generate_daily_learning_reminder(self, student_id: str, force: bool = False) -> Optional[Dict[str, Any]]:
        """
        Daily learning reminder: Highlights today's primary focus, scheduled minutes, and roadmap track.
        """
        if not force and await self.is_throttled(student_id, "daily_learning"):
            return None

        profile = await student_memory.read_student_profile(student_id)
        name = profile.get("name", student_id.capitalize()) if profile else student_id.capitalize()
        career_goal = profile.get("careerGoal", "Software Engineer") if profile else "Software Engineer"
        roadmap = await student_memory.read_roadmap(student_id)

        focus_topic = "Data Structures & Algorithms"
        daily_mins = 60
        track_title = "Placement Preparation"

        if roadmap:
            track_title = roadmap.get("track_title", track_title)
            topics = roadmap.get("topics_to_study_next", [])
            if topics:
                focus_topic = topics[0]
            schedule = roadmap.get("daily_practice_plan", {}).get("schedule", [])
            if schedule:
                daily_mins = sum(s.get("time_minutes", 0) for s in schedule)

        message = (
            f"Good morning, {name}! Today's priority focus for your {career_goal} roadmap is "
            f"**{focus_topic}** (~{daily_mins} mins scheduled). Ready to make measurable progress today?"
        )

        # AI Augmentation if online
        if gemini_service.is_configured():
            try:
                ai_prompt = (
                    f"Student: {name}, Goal: {career_goal}, Roadmap: {track_title}, Today's Focus: {focus_topic}.\n"
                    "Write a crisp, motivating 1-sentence daily study reminder to start today's plan. Keep it actionable and energetic."
                )
                ai_text = await gemini_service.generate_text(prompt=ai_prompt, temperature=0.7, timeout=4.0)
                if ai_text and len(ai_text.strip()) > 15:
                    message = ai_text.strip()
            except Exception as e:
                logger.warning(f"Could not use Gemini for daily reminder, using template: {e}")

        return await self._create_notification(
            student_id=student_id,
            notification_type="daily_learning",
            title=f"Today's Plan: {focus_topic}",
            message=message,
            priority="medium",
            action_url="/practice",
            metadata={"focus_topic": focus_topic, "scheduled_minutes": daily_mins, "track": track_title}
        )

    # --------------------------------------------------------------------------
    # 3. Incomplete Task Reminder
    # --------------------------------------------------------------------------
    async def generate_incomplete_task_reminder(self, student_id: str, force: bool = False) -> Optional[Dict[str, Any]]:
        """
        Incomplete task reminder: Alerts student of pending daily practice items or uncompleted milestones.
        """
        if not force and await self.is_throttled(student_id, "incomplete_task"):
            return None

        roadmap = await student_memory.read_roadmap(student_id)
        if not roadmap:
            return None

        schedule = roadmap.get("daily_practice_plan", {}).get("schedule", [])
        pending_items = [s.get("domain", "Task") for s in schedule if not s.get("completed")]
        
        if not pending_items:
            # Check pending milestones
            pending_m = [m.get("title") for m in roadmap.get("milestones", []) if not m.get("completed")]
            if pending_m:
                pending_items = [pending_m[0]]

        if not pending_items:
            return None

        task_name = pending_items[0]
        count = len(pending_items)

        message = (
            f"You have {count} pending learning task{'s' if count > 1 else ''} today, including "
            f"**{task_name}**. Spend 20 minutes tonight to stay on track with your placement milestone!"
        )

        return await self._create_notification(
            student_id=student_id,
            notification_type="incomplete_task",
            title=f"Pending Task: {task_name}",
            message=message,
            priority="high",
            action_url="/practice",
            metadata={"pending_count": count, "primary_task": task_name}
        )

    # --------------------------------------------------------------------------
    # 4. Learning Streak (Protection & Celebration)
    # --------------------------------------------------------------------------
    async def generate_streak_reminder(self, student_id: str, force: bool = False) -> Optional[Dict[str, Any]]:
        """
        Streak reminder:
        - If today's activity is missing -> Streak protection warning ("Protect your X-day streak!").
        - If streak hits a milestone (3, 7, 14, 30 days) -> Celebration alert.
        """
        profile = await student_memory.read_student_profile(student_id)
        streak_days = profile.get("streak", 1) if profile else 1

        is_milestone = streak_days in STREAK_MILESTONES

        if not force and not is_milestone and await self.is_throttled(student_id, "learning_streak"):
            return None

        if is_milestone:
            title = f"[Streak Milestone] {streak_days}-Day Streak Achieved!"
            message = (
                f"Outstanding consistency! You have maintained a {streak_days}-day learning streak. "
                f"You are in the top percentile of campus candidates preparing this month!"
            )
            priority = "high"
        else:
            title = f"[Streak Alert] Protect Your {streak_days}-Day Streak!"
            message = (
                f"Do not lose your {streak_days}-day active streak! Complete 1 practice drill or review "
                f"today's topic before midnight to keep your momentum alive."
            )
            priority = "medium"

        return await self._create_notification(
            student_id=student_id,
            notification_type="learning_streak",
            title=title,
            message=message,
            priority=priority,
            action_url="/dashboard",
            metadata={"streak_days": streak_days, "is_milestone": is_milestone}
        )

    # --------------------------------------------------------------------------
    # 5. Milestone Notification
    # --------------------------------------------------------------------------
    async def generate_milestone_notification(
        self,
        student_id: str,
        milestone_data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """
        Milestone notification: Celebrates completed milestone and announces next curriculum phase.
        """
        step_id = milestone_data.get("step_id", 1)
        title_text = milestone_data.get("title", f"Milestone #{step_id}")
        category = milestone_data.get("category", "Learning")

        # Deduplicate milestone notifications by step_id
        db = get_database()
        if db is not None:
            existing = await db["notifications"].find_one({
                "student_id": student_id,
                "type": "milestone_notification",
                "metadata.step_id": step_id
            })
            if existing:
                return None
        else:
            user_notifs = self._in_memory_notifications.get(student_id, [])
            for n in user_notifs:
                if n.get("type") == "milestone_notification" and n.get("metadata", {}).get("step_id") == step_id:
                    return None

        message = (
            f"Milestone Complete: **{title_text}**! You have successfully cleared this phase. "
            f"Your placement roadmap has advanced to the next engineering milestone."
        )


        return await self._create_notification(
            student_id=student_id,
            notification_type="milestone_notification",
            title=f"Milestone Cleared: {title_text}",
            message=message,
            priority="high",
            action_url="/dashboard",
            metadata={"step_id": step_id, "title": title_text, "category": category}
        )

    # --------------------------------------------------------------------------
    # 6. Assessment Reminder
    # --------------------------------------------------------------------------
    async def generate_assessment_reminder(self, student_id: str, force: bool = False) -> Optional[Dict[str, Any]]:
        """
        Assessment reminder: Proactively nudges student to benchmark their weak areas with a quick diagnostic test.
        """
        if not force and await self.is_throttled(student_id, "assessment_reminder"):
            return None

        profile = await student_memory.read_student_profile(student_id)
        weaknesses = profile.get("weaknesses", []) if profile else []
        target_topic = weaknesses[0] if weaknesses else "DSA"

        message = (
            f"Time for a quick check-in! Take a 5-question diagnostic assessment on **{target_topic}** "
            f"to verify your recent progress and calibrate your readiness score."
        )

        return await self._create_notification(
            student_id=student_id,
            notification_type="assessment_reminder",
            title=f"Benchmark Diagnostic: {target_topic}",
            message=message,
            priority="medium",
            action_url="/assessment",
            metadata={"target_topic": target_topic}
        )

    # --------------------------------------------------------------------------
    # 7. Interview Practice Reminder
    # --------------------------------------------------------------------------
    async def generate_interview_reminder(self, student_id: str, force: bool = False) -> Optional[Dict[str, Any]]:
        """
        Interview reminder: Nudges student to practice technical or HR mock rounds.
        """
        if not force and await self.is_throttled(student_id, "interview_practice"):
            return None

        profile = await student_memory.read_student_profile(student_id)
        role = profile.get("careerGoal", "Software Engineer") if profile else "Software Engineer"

        message = (
            f"Sharpen your interview articulation! Start a 15-minute Technical Mock Interview for **{role}** "
            f"with AI Mentor to practice structuring your STAR-method answers."
        )

        return await self._create_notification(
            student_id=student_id,
            notification_type="interview_practice",
            title="Practice Mock Interview Round",
            message=message,
            priority="medium",
            action_url="/interview",
            metadata={"role": role}
        )

    # --------------------------------------------------------------------------
    # 8. Evaluate and Dispatch All Eligible Reminders
    # --------------------------------------------------------------------------
    async def evaluate_and_dispatch_reminders(self, student_id: str) -> List[Dict[str, Any]]:
        """
        Scans student's current memory, roadmap, streak, and readiness,
        and generates all non-throttled notifications.
        """
        dispatched = []

        # 1. Daily learning reminder
        daily = await self.generate_daily_learning_reminder(student_id)
        if daily:
            dispatched.append(daily)

        # 2. Incomplete task reminder
        incomplete = await self.generate_incomplete_task_reminder(student_id)
        if incomplete:
            dispatched.append(incomplete)

        # 3. Streak protection or celebration
        streak = await self.generate_streak_reminder(student_id)
        if streak:
            dispatched.append(streak)

        # 4. Assessment reminder if weak areas diagnosed
        profile = await student_memory.read_student_profile(student_id)
        if profile and profile.get("weaknesses"):
            asmt = await self.generate_assessment_reminder(student_id)
            if asmt:
                dispatched.append(asmt)

        # 5. Interview reminder if readiness < 70% or interviews empty
        signals = await student_memory.read_all_student_signals(student_id)
        if len(signals.get("interview_sessions", [])) < 2:
            iv = await self.generate_interview_reminder(student_id)
            if iv:
                dispatched.append(iv)

        logger.info(f"[NOTIF] Dispatched {len(dispatched)} eligible reminders for '{student_id}'.")
        return dispatched

    # --------------------------------------------------------------------------
    # 9. Query & Notification Management
    # --------------------------------------------------------------------------
    async def get_student_notifications(
        self,
        student_id: str,
        status_filter: Optional[str] = None,
        limit: int = 20
    ) -> Dict[str, Any]:
        """
        Retrieves notification history for student.
        """
        query: Dict[str, Any] = {"student_id": student_id}
        if status_filter:
            query["status"] = status_filter

        db = get_database()
        notifications = []
        unread_count = 0

        if db is not None:
            cursor = db["notifications"].find(query, {"_id": 0}).sort("created_at", -1).limit(limit)
            notifications = await cursor.to_list(length=limit)
            unread_count = await db["notifications"].count_documents({
                "student_id": student_id,
                "status": "unread"
            })
        else:
            user_notifs = self._in_memory_notifications.get(student_id, [])
            if status_filter:
                notifications = [n for n in user_notifs if n.get("status") == status_filter][:limit]
            else:
                notifications = user_notifs[:limit]
            unread_count = len([n for n in user_notifs if n.get("status") == "unread"])

        return {
            "student_id": student_id,
            "unread_count": unread_count,
            "total_notifications": len(notifications),
            "notifications": notifications
        }

    async def mark_as_read(self, notification_id: str) -> bool:
        """
        Marks a notification as read.
        """
        db = get_database()
        if db is not None:
            res = await db["notifications"].update_one(
                {"notification_id": notification_id},
                {"$set": {"status": "read", "read_at": datetime.now(timezone.utc)}}
            )
            return res.modified_count > 0
        else:
            for s_id, notifs in self._in_memory_notifications.items():
                for n in notifs:
                    if n.get("notification_id") == notification_id:
                        n["status"] = "read"
                        n["read_at"] = datetime.now(timezone.utc)
                        return True
        return False

    async def dismiss_notification(self, notification_id: str) -> bool:
        """
        Dismisses a notification.
        """
        db = get_database()
        if db is not None:
            res = await db["notifications"].update_one(
                {"notification_id": notification_id},
                {"$set": {"status": "dismissed", "dismissed_at": datetime.now(timezone.utc)}}
            )
            return res.modified_count > 0
        else:
            for s_id, notifs in self._in_memory_notifications.items():
                for n in notifs:
                    if n.get("notification_id") == notification_id:
                        n["status"] = "dismissed"
                        n["dismissed_at"] = datetime.now(timezone.utc)
                        return True
        return False

    # --------------------------------------------------------------------------
    # Internal Helper: Persist Notification Record
    # --------------------------------------------------------------------------
    async def _create_notification(
        self,
        student_id: str,
        notification_type: str,
        title: str,
        message: str,
        priority: str = "medium",
        action_url: str = "/dashboard",
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Creates and stores notification document in MongoDB.
        """
        notif_id = f"notif_{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc)

        record = {
            "notification_id": notif_id,
            "student_id": student_id,
            "type": notification_type,
            "title": title,
            "message": message,
            "priority": priority,
            "status": "unread",
            "action_url": action_url,
            "metadata": metadata or {},
            "created_at": now,
            "read_at": None
        }

        db = get_database()
        if db is not None:
            await db["notifications"].insert_one(dict(record))
        else:
            if student_id not in self._in_memory_notifications:
                self._in_memory_notifications[student_id] = []
            self._in_memory_notifications[student_id].insert(0, dict(record))

        logger.info(f"[NOTIF] Stored '{notification_type}' notification '{notif_id}' for '{student_id}': \"{title}\"")
        return record


# Global Singleton Instance
notification_service = NotificationService()
