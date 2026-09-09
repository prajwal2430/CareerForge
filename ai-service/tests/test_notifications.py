"""
Comprehensive Integration Test Suite for Motivation & Reminder Functionality
=============================================================================
Tests:
1. Daily learning reminder (calibrated to active roadmap & today's tasks).
2. Incomplete task reminder (detects uncompleted daily tasks).
3. Learning streak protection & milestone celebration (3, 7, 14, 30 days).
4. Milestone completion notification.
5. Assessment reminder for diagnosed weak areas.
6. Mock interview practice reminder.
7. Anti-spam throttling & cooldown enforcement (prevents duplicate spam).
8. Notification history persistence, unread counter, and mark-as-read flow.
"""

import sys
import os
import asyncio
from datetime import datetime, timezone

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.student_memory import student_memory
from app.services.db import connect_to_mongo, close_mongo_connection, get_database
from app.agents.learning_recommendation import learning_recommendation_agent
from app.services.notification_service import notification_service


async def run_notification_tests():
    print("======================================================================")
    print("CAREERFORGE MOTIVATION & REMINDERS - INTEGRATION TEST SUITE")
    print("======================================================================")

    await connect_to_mongo()

    student_id = "test_candidate_reminders"

    # Purge any previous test records to ensure clean state
    db = get_database()
    if db is not None:
        await db["notifications"].delete_many({"student_id": student_id})
        await db["students"].delete_many({"student_id": student_id})
        await db["roadmaps"].delete_many({"student_id": student_id})
    notification_service._in_memory_notifications.pop(student_id, None)

    # 1. Setup Student with active profile & roadmap
    await student_memory.get_or_create_student(
        student_id=student_id,
        name="Rohan Verma",
        email="rohan.reminders@careerforge.edu",
        careerGoal="Backend Engineer at Google"
    )
    await student_memory.update_weaknesses(student_id, ["Dynamic Programming", "SQL Indexing"])
    await student_memory.update_strengths(student_id, ["Quantitative Aptitude"])

    # Generate active roadmap
    roadmap = await learning_recommendation_agent.generate_personalized_roadmap(student_id=student_id)
    assert roadmap is not None

    # --- [TEST 1] Daily Learning Reminder ---
    print("\n--- [TEST 1] Generate Daily Learning Reminder ---")
    daily_notif = await notification_service.generate_daily_learning_reminder(student_id, force=True)
    print(f"[OK] Title: {daily_notif['title']}")
    print(f"[OK] Message: {daily_notif['message']}")
    print(f"[OK] Action URL: {daily_notif['action_url']}")
    assert daily_notif is not None
    assert daily_notif["type"] == "daily_learning"
    assert "Rohan" in daily_notif["message"] or "Backend" in daily_notif["message"] or "today" in daily_notif["message"].lower()

    # --- [TEST 2] Incomplete Task Reminder ---
    print("\n--- [TEST 2] Generate Incomplete Task Reminder ---")
    incomplete_notif = await notification_service.generate_incomplete_task_reminder(student_id, force=True)
    print(f"[OK] Title: {incomplete_notif['title']}")
    print(f"[OK] Message: {incomplete_notif['message']}")
    assert incomplete_notif is not None
    assert incomplete_notif["type"] == "incomplete_task"
    assert "pending" in incomplete_notif["message"].lower()

    # --- [TEST 3] Learning Streak (Protection & Celebration) ---
    print("\n--- [TEST 3A] Streak Protection Reminder (Active Streak At Risk) ---")
    # Set student streak to 5 days (non-milestone)
    db = student_memory._get_col("students")
    if db is not None:
        await db.update_one({"student_id": student_id}, {"$set": {"streak": 5}})

    streak_protect = await notification_service.generate_streak_reminder(student_id, force=True)
    print(f"[OK] Title: {streak_protect['title']}")
    print(f"[OK] Message: {streak_protect['message']}")
    assert "Protect" in streak_protect["title"]
    assert "5-day" in streak_protect["message"]

    print("\n--- [TEST 3B] Streak Milestone Celebration (7-Day Streak) ---")
    if db is not None:
        await db.update_one({"student_id": student_id}, {"$set": {"streak": 7}})

    streak_milestone = await notification_service.generate_streak_reminder(student_id, force=True)
    print(f"[OK] Title: {streak_milestone['title']}")
    print(f"[OK] Message: {streak_milestone['message']}")
    assert "Milestone" in streak_milestone["title"]
    assert "7-Day" in streak_milestone["title"]

    # --- [TEST 4] Milestone Notification ---
    print("\n--- [TEST 4] Milestone Completion Notification ---")
    milestone_notif = await notification_service.generate_milestone_notification(
        student_id=student_id,
        milestone_data={
            "step_id": 1,
            "title": "Phase 1: Dynamic Programming Masterclass",
            "category": "DSA"
        }
    )
    print(f"[OK] Title: {milestone_notif['title']}")
    print(f"[OK] Message: {milestone_notif['message']}")
    assert milestone_notif is not None
    assert milestone_notif["type"] == "milestone_notification"
    assert "Dynamic Programming" in milestone_notif["title"]

    # Deduplication test: Sending same step_id again should be deduplicated
    dupe_milestone = await notification_service.generate_milestone_notification(
        student_id=student_id,
        milestone_data={
            "step_id": 1,
            "title": "Phase 1: Dynamic Programming Masterclass",
            "category": "DSA"
        }
    )
    assert dupe_milestone is None, "Duplicate milestone notification must be suppressed!"
    print("[OK] Verified duplicate milestone notification suppression.")

    # --- [TEST 5] Assessment Reminder for Weak Areas ---
    print("\n--- [TEST 5] Assessment Reminder for Weak Topics ---")
    asmt_notif = await notification_service.generate_assessment_reminder(student_id, force=True)
    print(f"[OK] Title: {asmt_notif['title']}")
    print(f"[OK] Message: {asmt_notif['message']}")
    assert asmt_notif is not None
    assert asmt_notif["type"] == "assessment_reminder"
    assert "Dynamic Programming" in asmt_notif["title"] or "Diagnostic" in asmt_notif["title"]

    # --- [TEST 6] Interview Practice Reminder ---
    print("\n--- [TEST 6] Interview Practice Reminder ---")
    iv_notif = await notification_service.generate_interview_reminder(student_id, force=True)
    print(f"[OK] Title: {iv_notif['title']}")
    print(f"[OK] Message: {iv_notif['message']}")
    assert iv_notif is not None
    assert iv_notif["type"] == "interview_practice"
    assert "STAR" in iv_notif["message"] or "Interview" in iv_notif["message"]

    # --- [TEST 7] Anti-Spam Throttling & Cooldown Enforcement ---
    print("\n--- [TEST 7] Anti-Spam Throttling Verification ---")
    # Without force=True, daily learning reminder should be throttled because one was just created!
    throttled_notif = await notification_service.generate_daily_learning_reminder(student_id, force=False)
    assert throttled_notif is None, "Immediate repeat notification must be throttled by anti-spam!"
    print("[OK] Confirmed anti-spam throttle prevented duplicate daily notification.")

    # --- [TEST 8] Notification History & Mark-As-Read ---
    print("\n--- [TEST 8] Notification History & Mark-As-Read Flow ---")
    history_res = await notification_service.get_student_notifications(student_id)
    print(f"[OK] Total Stored Notifications: {history_res['total_notifications']}")
    print(f"[OK] Unread Count: {history_res['unread_count']}")
    assert history_res["total_notifications"] >= 5
    assert history_res["unread_count"] >= 5

    # Mark the first notification as read
    first_notif_id = history_res["notifications"][0]["notification_id"]
    read_success = await notification_service.mark_as_read(first_notif_id)
    assert read_success is True

    # Re-query and verify unread count decreased
    updated_history = await notification_service.get_student_notifications(student_id)
    print(f"[OK] Unread Count after marking 1 read: {updated_history['unread_count']}")
    assert updated_history["unread_count"] == history_res["unread_count"] - 1

    await close_mongo_connection()

    print("\n======================================================================")
    print("ALL 8 MOTIVATION & REMINDERS INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("======================================================================")


if __name__ == "__main__":
    asyncio.run(run_notification_tests())
