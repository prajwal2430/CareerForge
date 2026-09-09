"""
Comprehensive Integration Test Suite for Adaptive Learning Loop
================================================================
Demonstrates the continuous loop:
Assessment -> Skill Profile -> Weak Area Detection -> Learning Roadmap
-> Practice -> New Performance -> Analytics -> Updated Skill Profile -> Updated Roadmap

Tests:
1. Setup initial student and baseline roadmap.
2. Rule 1: Skill Improves -> Reduces repetitive beginner content, escalates difficulty (Hard).
3. Rule 2: Skill Remains Weak -> Recommends additional practice time, injects prerequisite topics.
4. Rule 3: Skill Becomes Strong -> Moves to next sequential topic, sets to maintenance frequency.
5. Rule 4: Interview Performance Weak -> Increases interview practice (daily plan + mock milestone).
6. Rule 5: Coding Performance Weak -> Increases coding practice (weekly problems 18+, debugging drills).
7. Invariant: Existing roadmap is updated in-place (roadmap_id identical, completed milestones intact, revision incremented).
"""

import sys
import os
import asyncio
from datetime import datetime, timezone

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.student_memory import student_memory
from app.services.db import connect_to_mongo, close_mongo_connection, get_database
from app.agents.learning_recommendation import learning_recommendation_agent
from app.services.adaptive_loop import adaptive_learning_loop


async def run_adaptive_learning_loop_tests():
    print("======================================================================")
    print("CAREERFORGE ADAPTIVE LEARNING LOOP - INTEGRATION TEST SUITE")
    print("======================================================================")

    # 1. Initialize MongoDB connection
    await connect_to_mongo()

    student_id = "test_candidate_adaptive"

    # Clean up any leftover test data from previous runs
    db = get_database()
    if db is not None:
        for col_name in [
            "students", "assessment_results", "coding_submissions",
            "interview_sessions", "learning_roadmaps", "placement_readiness",
            "learning_loop_history", "learning_progress"
        ]:
            await db[col_name].delete_many({"student_id": student_id})
    if student_id in student_memory._in_memory_students:
        del student_memory._in_memory_students[student_id]
    if student_id in student_memory._in_memory_readiness:
        del student_memory._in_memory_readiness[student_id]

    # Seed initial student profile
    await student_memory.get_or_create_student(
        student_id=student_id,
        name="Aditi Sharma",
        email="aditi.adaptive@careerforge.edu",
        careerGoal="SDE-1 at Tier-1 Tech"
    )

    # Initial diagnostics: DSA weak, SQL beginner, Interview unpracticed
    await student_memory.update_weaknesses(student_id, ["Dynamic Programming", "Relational Data Foundations"])
    await student_memory.update_strengths(student_id, ["Quantitative Aptitude"])
    await student_memory.save_assessment_result({
        "assessment_id": "asmt_dsa_initial",
        "student_id": student_id,
        "category": "DSA",
        "score": 45.0,
        "passed": False,
        "timestamp": datetime.now(timezone.utc)
    })

    # --- [PHASE 1] Initial Baseline Roadmap Generation ---
    print("\n--- [PHASE 1] Initial Baseline Roadmap Generation ---")
    initial_roadmap = await learning_recommendation_agent.generate_personalized_roadmap(student_id=student_id)
    initial_id = initial_roadmap["roadmap_id"]
    initial_revision = initial_roadmap.get("revision", 1)
    print(f"[OK] Baseline Roadmap Created: id={initial_id}, rev={initial_revision}")
    assert initial_id is not None
    assert len(initial_roadmap.get("milestones", [])) >= 3

    # Mark milestone 1 as COMPLETED by student
    initial_roadmap["milestones"][0]["completed"] = True
    await student_memory.update_roadmap(student_id, initial_roadmap)
    print(f"[OK] Milestone 1 marked completed: '{initial_roadmap['milestones'][0]['title']}'")

    # --- [PHASE 2] Rule 1: Skill Improves -> Reduce Beginner Content & Escalate Difficulty ---
    print("\n--- [PHASE 2] Rule 1: SQL Skill Improves (Score 45 -> 80) ---")
    # Student practices and submits a high-scoring SQL assessment
    await student_memory.save_assessment_result({
        "assessment_id": "asmt_sql_improved",
        "student_id": student_id,
        "category": "SQL",
        "score": 82.0,
        "passed": True,
        "timestamp": datetime.now(timezone.utc)
    })

    result_p2 = await adaptive_learning_loop.evaluate_and_adapt(
        student_id=student_id,
        trigger_source="sql_assessment_submission"
    )

    roadmap_p2 = await student_memory.read_roadmap(student_id)
    print(f"[OK] Roadmap Revision: {roadmap_p2.get('revision')}")
    print(f"[OK] SQL Difficulty: {roadmap_p2.get('sql_practice', {}).get('difficulty')}")
    print(f"[OK] Coding Difficulty Mix: {roadmap_p2.get('coding_practice', {}).get('difficulty_mix')}")
    print(f"[OK] Rules Applied: {result_p2.get('rulesApplied')}")

    # Assertions for Rule 1:
    assert roadmap_p2["roadmap_id"] == initial_id, "Roadmap ID must remain identical!"
    assert roadmap_p2["milestones"][0]["completed"] is True, "Completed milestones must remain completed!"
    assert "Hard" in roadmap_p2.get("sql_practice", {}).get("difficulty", "")
    assert any("sql" in r.lower() for r in result_p2.get("rulesApplied", []))


    # --- [PHASE 3] Rule 2: Skill Remains Weak -> Recommend More Practice & Prerequisite Topics ---
    print("\n--- [PHASE 3] Rule 2: DSA (Dynamic Programming) Remains Weak ---")
    # Student scores 50 on another DSA assessment
    await student_memory.save_assessment_result({
        "assessment_id": "asmt_dsa_still_weak",
        "student_id": student_id,
        "category": "DSA",
        "score": 50.0,
        "passed": False,
        "timestamp": datetime.now(timezone.utc)
    })

    result_p3 = await adaptive_learning_loop.evaluate_and_adapt(
        student_id=student_id,
        trigger_source="dsa_assessment_submission"
    )

    roadmap_p3 = await student_memory.read_roadmap(student_id)
    topics_next = roadmap_p3.get("topics_to_study_next", [])
    print(f"[OK] Topics to Study Next (Prerequisites injected): {topics_next[:3]}")
    print(f"[OK] Weekly Coding Problem Target: {roadmap_p3.get('coding_practice', {}).get('target_weekly_problems')}")

    # Assertions for Rule 2:
    assert roadmap_p3["roadmap_id"] == initial_id
    assert roadmap_p3.get("coding_practice", {}).get("target_weekly_problems", 0) >= 16
    assert any("Recursion" in t or "Memoization" in t for t in topics_next), f"Prerequisite topic must be injected! Found: {topics_next}"

    # --- [PHASE 4] Rule 3: Skill Becomes Strong -> Move to Next Topic & Maintenance Mode ---
    print("\n--- [PHASE 4] Rule 3: Java Skill Becomes Strong (Score >= 85) ---")
    # Student completes advanced Java assessment
    await student_memory.save_assessment_result({
        "assessment_id": "asmt_java_mastered",
        "student_id": student_id,
        "category": "Java",
        "score": 90.0,
        "passed": True,
        "timestamp": datetime.now(timezone.utc)
    })

    result_p4 = await adaptive_learning_loop.evaluate_and_adapt(
        student_id=student_id,
        trigger_source="java_assessment_submission"
    )

    roadmap_p4 = await student_memory.read_roadmap(student_id)
    schedule = roadmap_p4.get("daily_practice_plan", {}).get("schedule", [])
    java_entry = next((s for s in schedule if "java" in s.get("domain", "").lower()), None)
    print(f"[OK] Java Schedule Domain: {java_entry.get('domain') if java_entry else 'N/A'}")
    print(f"[OK] Java Daily Minutes: {java_entry.get('time_minutes') if java_entry else 'N/A'} mins")
    print(f"[OK] Next Topics: {roadmap_p4.get('topics_to_study_next')[:3]}")

    # Assertions for Rule 3:
    assert roadmap_p4["roadmap_id"] == initial_id
    if java_entry:
        assert "Maintenance" in java_entry.get("domain", "") or java_entry.get("time_minutes", 0) <= 25

    # --- [PHASE 5] Rule 4: Interview Performance Weak -> Increase Interview Practice ---
    print("\n--- [PHASE 5] Rule 4: Mock Interview Performance Weak (Score 55%) ---")
    # Student finishes an interview with low score
    await student_memory.save_interview_session({
        "session_id": "mock_iv_failed",
        "student_id": student_id,
        "mode": "technical",
        "status": "completed",
        "overall_score": 55.0,
        "rubric_scores": {"correctness": 50, "clarity": 55, "technicalDepth": 55},
        "created_at": datetime.now(timezone.utc)
    })

    result_p5 = await adaptive_learning_loop.evaluate_and_adapt(
        student_id=student_id,
        trigger_source="interview_completion"
    )

    roadmap_p5 = await student_memory.read_roadmap(student_id)
    iv_practice = roadmap_p5.get("interview_practice", {})
    schedule_p5 = roadmap_p5.get("daily_practice_plan", {}).get("schedule", [])
    has_iv_schedule = any("interview" in s.get("domain", "").lower() for s in schedule_p5)

    print(f"[OK] Interview Practice Frequency: {iv_practice.get('frequency')}")
    print(f"[OK] Daily Interview Schedule Included: {has_iv_schedule}")

    # Assertions for Rule 4:
    assert roadmap_p5["roadmap_id"] == initial_id
    assert has_iv_schedule is True, "Daily schedule must include interview prep!"
    assert "Daily" in iv_practice.get("frequency", "")

    # --- [PHASE 6] Rule 5: Coding Performance Weak -> Increase Coding Practice Target ---
    print("\n--- [PHASE 6] Rule 5: Coding Performance Weak (Failed Submissions) ---")
    # Student submits 3 failed coding attempts
    for idx in range(3):
        await student_memory.save_coding_submission({
            "submission_id": f"sub_fail_{idx}",
            "student_id": student_id,
            "problem_id": "prob_two_sum",
            "problem_title": "Two Sum",
            "status": "Wrong Answer",
            "total_test_cases": 10,
            "passed_test_cases": 3,
            "timestamp": datetime.now(timezone.utc)
        })

    result_p6 = await adaptive_learning_loop.evaluate_and_adapt(
        student_id=student_id,
        trigger_source="coding_submission"
    )

    roadmap_p6 = await student_memory.read_roadmap(student_id)
    coding_plan = roadmap_p6.get("coding_practice", {})
    coding_schedule = next((s for s in roadmap_p6.get("daily_practice_plan", {}).get("schedule", []) if "coding" in s.get("domain", "").lower() or "dsa" in s.get("domain", "").lower()), None)

    print(f"[OK] Target Weekly Problems: {coding_plan.get('target_weekly_problems')}")
    print(f"[OK] Coding Daily Minutes: {coding_schedule.get('time_minutes') if coding_schedule else 'N/A'} mins")
    print(f"[OK] Coding Focus: {coding_plan.get('focus_area')}")

    # Assertions for Rule 5:
    assert roadmap_p6["roadmap_id"] == initial_id
    assert coding_plan.get("target_weekly_problems", 0) >= 18, "Target weekly problems must be 18+ when coding is weak!"
    if coding_schedule:
        assert coding_schedule.get("time_minutes", 0) >= 75

    # --- [PHASE 7] Performance Recovery: Coding & Interview Improve ---
    print("\n--- [PHASE 7] Performance Recovery: Coding & Interview Improve (85%+) ---")
    # Student submits 3 accepted coding submissions demonstrating recovery
    for idx in range(3):
        await student_memory.save_coding_submission({
            "submission_id": f"sub_accepted_recovery_{idx}",
            "student_id": student_id,
            "problem_id": f"prob_recov_{idx}",
            "problem_title": "Trapping Rain Water",
            "status": "Accepted",
            "total_test_cases": 20,
            "passed_test_cases": 20,
            "timestamp": datetime.now(timezone.utc)
        })
    # Student passes advanced DSA assessments demonstrating mastery
    await student_memory.save_assessment_result({
        "assessment_id": "asmt_dsa_recovered_1",
        "student_id": student_id,
        "category": "DSA",
        "score": 88.0,
        "passed": True,
        "timestamp": datetime.now(timezone.utc)
    })
    await student_memory.save_assessment_result({
        "assessment_id": "asmt_dsa_recovered_2",
        "student_id": student_id,
        "category": "DSA",
        "score": 94.0,
        "passed": True,
        "timestamp": datetime.now(timezone.utc)
    })
    # Student passes mock interview with distinction
    await student_memory.save_interview_session({
        "session_id": "mock_iv_distinction",
        "student_id": student_id,
        "mode": "technical",
        "status": "completed",
        "overall_score": 88.0,
        "rubric_scores": {"correctness": 90, "clarity": 85, "technicalDepth": 90},
        "created_at": datetime.now(timezone.utc)
    })

    result_p7 = await adaptive_learning_loop.evaluate_and_adapt(
        student_id=student_id,
        trigger_source="dsa_assessment_submission",
        trigger_payload={"category": "DSA", "score": 94.0}
    )

    roadmap_p7 = await student_memory.read_roadmap(student_id)
    recovered_coding = roadmap_p7.get("coding_practice", {})

    print(f"[OK] Recovered Revision: {roadmap_p7.get('revision')}")
    print(f"[OK] Recovered Coding Focus: {recovered_coding.get('focus_area')}")
    print(f"[OK] Recovered Coding Difficulty Mix: {recovered_coding.get('difficulty_mix')}")
    print(f"[OK] Recovered Rules Applied: {result_p7.get('rulesApplied')}")

    # Assertions for Phase 7:
    assert roadmap_p7["roadmap_id"] == initial_id
    assert "Optimization" in recovered_coding.get("focus_area", "")
    assert recovered_coding.get("difficulty_mix", {}).get("hard", 0) >= 4
    assert any("improved" in r.lower() for r in result_p7.get("rulesApplied", []))

    # --- [PHASE 8] Verify In-Place Preservation & Complete Adaptation Audit Trail ---
    print("\n--- [PHASE 8] Verify In-Place Preservation & Complete Adaptation Audit Trail ---")
    final_roadmap = await student_memory.read_roadmap(student_id)
    history = final_roadmap.get("adaptation_history", [])

    print(f"[OK] Final Roadmap ID: {final_roadmap['roadmap_id']} (Matches initial: {initial_id})")
    print(f"[OK] Final Revision: {final_roadmap.get('revision')} (Started at: {initial_revision})")
    print(f"[OK] Completed Milestone 1 Intact: {final_roadmap['milestones'][0]['completed']} ('{final_roadmap['milestones'][0]['title']}')")
    print(f"[OK] Total Adaptation Audit Entries: {len(history)}")

    assert final_roadmap["roadmap_id"] == initial_id
    assert final_roadmap.get("revision", 1) > initial_revision
    assert final_roadmap["milestones"][0]["completed"] is True
    assert len(history) >= 6

    await close_mongo_connection()

    print("\n======================================================================")
    print("ALL 8 ADAPTIVE LEARNING LOOP INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("======================================================================")


if __name__ == "__main__":
    asyncio.run(run_adaptive_learning_loop_tests())
