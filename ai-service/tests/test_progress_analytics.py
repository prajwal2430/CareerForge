"""
CareerForge AI Service - Progress Analytics Agent Integration Test Suite
========================================================================
Tests:
1. Multi-modal signal aggregation (Assessments, Coding, Aptitude, SQL, Java, Interviews, Roadmap).
2. Deterministic readiness scoring (reproducible mathematical calculations, transparent weights).
3. Exact response payload structure verification:
   {
     "readinessScore": 72,
     "status": "Needs Improvement",
     "skills": {},
     "strongAreas": [],
     "weakAreas": [],
     "improvements": []
   }
4. GET /api/ai/readiness/{student_id}
5. GET /api/ai/analytics/{student_id} (Trend detection, activity summary, weekly hours)
6. GET /api/ai/analytics/history/{student_id}
7. Verification of MongoDB persistence in placement_readiness and students collections.
"""

import sys
import os
import asyncio
from datetime import datetime, timezone, timedelta
import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app
from app.services.student_memory import student_memory
from app.services.db import connect_to_mongo, close_mongo_connection
from app.services.readiness_service import DEFAULT_WEIGHTS


async def run_progress_analytics_tests():
    print("======================================================================")
    print("CAREERFORGE PROGRESS ANALYTICS AGENT - INTEGRATION TEST SUITE")
    print("======================================================================")

    # Initialize DB connection
    await connect_to_mongo()

    student_id = "test_analytics_std_001"
    now = datetime.now(timezone.utc)

    # 1. Setup Student in Shared Memory
    await student_memory.get_or_create_student(
        student_id=student_id,
        name="Karan Patel",
        email="karan.patel@careerforge.edu",
        branch="Information Technology",
        year="4th Year",
        careerGoal="Full Stack SDE-1"
    )

    # Seed multi-modal signals:
    # A. Assessment Results (DSA, SQL, Aptitude)
    await student_memory.save_assessment_result({
        "student_id": student_id,
        "assessment_id": "assess_dsa_01",
        "category": "DSA",
        "score": 70.0,
        "total_questions": 5,
        "correct_answers": 3,
        "time_spent_seconds": 300,
        "timestamp": now - timedelta(days=5)
    })
    await student_memory.save_assessment_result({
        "student_id": student_id,
        "assessment_id": "assess_sql_01",
        "category": "SQL",
        "score": 65.0,
        "total_questions": 5,
        "correct_answers": 3,
        "time_spent_seconds": 250,
        "timestamp": now - timedelta(days=4)
    })
    await student_memory.save_assessment_result({
        "student_id": student_id,
        "assessment_id": "assess_apt_01",
        "category": "Aptitude",
        "score": 85.0,
        "total_questions": 5,
        "correct_answers": 4,
        "time_spent_seconds": 200,
        "timestamp": now - timedelta(days=3)
    })

    # B. Coding Submissions (Accepted problem)
    await student_memory.save_coding_submission({
        "student_id": student_id,
        "problem_id": "prob_two_sum",
        "problem_title": "Two Sum",
        "language": "python",
        "code": "def twoSum(nums, target): return []",
        "status": "Accepted",
        "passed_test_cases": 3,
        "total_test_cases": 3,
        "runtime_ms": 42.0,
        "timestamp": now - timedelta(days=2)
    })

    # C. Mock Interview Session
    await student_memory.save_interview_session({
        "session_id": "iv_test_session_01",
        "student_id": student_id,
        "interview_type": "technical",
        "target_company": "Amazon",
        "status": "completed",
        "overall_score": 75.0,
        "rubric_scores": {
            "correctness": 75.0,
            "technicalDepth": 75.0,
            "explanation": 80.0,
            "problemSolving": 70.0
        },
        "created_at": now - timedelta(days=1),
        "completed_at": now - timedelta(days=1)
    })

    # D. Learning Progress & Milestones
    await student_memory.update_roadmap(
        student_id,
        {
            "role": "Full Stack SDE-1",
            "milestones": [
                {"step_id": 1, "topic": "DSA Fundamentals", "completed": True},
                {"step_id": 2, "topic": "Relational DB & SQL", "completed": True},
                {"step_id": 3, "topic": "System Design Basics", "completed": False},
                {"step_id": 4, "topic": "Mock Interview Sprint", "completed": False}
            ],
            "progress_percentage": 50.0
        }
    )

    print(f"[SETUP] Multi-modal signals initialized for '{student_id}'.")

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # ----------------------------------------------------------------------
        # TEST 1: GET /api/ai/readiness/{student_id}
        # ----------------------------------------------------------------------
        print("\n--- [TEST 1] GET /api/ai/readiness/{student_id} ---")
        res_readiness = await client.get(f"/api/ai/readiness/{student_id}")
        assert res_readiness.status_code == 200, res_readiness.text
        data = res_readiness.json()

        print(f"  Readiness Score: {data.get('readinessScore')}%")
        print(f"  Status: {data.get('status')}")
        print(f"  Skills: {data.get('skills')}")
        print(f"  Strong Areas: {data.get('strongAreas')}")
        print(f"  Weak Areas: {data.get('weakAreas')}")
        print(f"  Improvements: {data.get('improvements')}")

        # Assert exact structure requested by user
        assert "readinessScore" in data, "Missing readinessScore"
        assert "status" in data, "Missing status"
        assert "skills" in data, "Missing skills"
        assert "strongAreas" in data, "Missing strongAreas"
        assert "weakAreas" in data, "Missing weakAreas"
        assert "improvements" in data, "Missing improvements"

        # Check types
        assert isinstance(data["readinessScore"], (int, float))
        assert isinstance(data["status"], str)
        assert isinstance(data["skills"], dict)
        assert isinstance(data["strongAreas"], list)
        assert isinstance(data["weakAreas"], list)
        assert isinstance(data["improvements"], list)

        # Check skill components
        skills = data["skills"]
        for skill_key in ["dsa", "java", "sql", "aptitude", "interview", "learning", "consistency"]:
            assert skill_key in skills, f"Missing skill key: {skill_key}"

        # Deterministic verification: check weighted calculation
        w = DEFAULT_WEIGHTS
        expected_score = round(
            (skills["dsa"] * w.dsa_coding) +
            (skills["java"] * w.java) +
            (skills["sql"] * w.sql) +
            (skills["aptitude"] * w.aptitude) +
            (skills["interview"] * w.interview) +
            (skills["learning"] * w.learning_completion) +
            (skills["consistency"] * w.consistency),
            1
        )
        assert abs(data["readinessScore"] - expected_score) < 0.2, (
            f"Deterministic score mismatch! Got {data['readinessScore']}, expected {expected_score}"
        )
        print(f"  [PASSED] Mathematical calculation is 100% deterministic ({data['readinessScore']} == {expected_score}).")

        # Verify status mapping
        score = data["readinessScore"]
        if score >= 80:
            assert data["status"] == "Placement Ready"
        elif score >= 70:
            assert data["status"] == "Needs Improvement"
        else:
            assert data["status"] == "Needs Significant Preparation"
        print(f"  [PASSED] Status '{data['status']}' correctly matches score {score}.")

        # ----------------------------------------------------------------------
        # TEST 2: GET /api/ai/analytics/{student_id}
        # ----------------------------------------------------------------------
        print("\n--- [TEST 2] GET /api/ai/analytics/{student_id} ---")
        res_analytics = await client.get(f"/api/ai/analytics/{student_id}")
        assert res_analytics.status_code == 200, res_analytics.text
        analytics_data = res_analytics.json()

        print(f"  Trend: {analytics_data.get('trend')} (Delta: {analytics_data.get('scoreDelta')})")
        print(f"  Weekly Hours: {analytics_data.get('weeklyHours')}")
        print(f"  Activity Summary: {analytics_data.get('activitySummary')}")
        print(f"  Narrative: {analytics_data.get('narrative')}")

        assert analytics_data["student_id"] == student_id
        assert "trend" in analytics_data
        assert "scoreDelta" in analytics_data
        assert "weeklyHours" in analytics_data
        assert "activitySummary" in analytics_data
        assert "narrative" in analytics_data
        assert analytics_data["activitySummary"]["assessmentsCompleted"] >= 3
        assert analytics_data["activitySummary"]["codingSubmissions"] >= 1
        assert analytics_data["activitySummary"]["mockInterviews"] >= 1
        print("  [PASSED] Full progress analytics generated with multi-modal counts and narrative.")

        # ----------------------------------------------------------------------
        # TEST 3: GET /api/ai/analytics/history/{student_id} & DB Persistence
        # ----------------------------------------------------------------------
        print("\n--- [TEST 3] GET /api/ai/analytics/history/{student_id} & MongoDB Storage ---")
        res_history = await client.get(f"/api/ai/analytics/history/{student_id}")
        assert res_history.status_code == 200, res_history.text
        hist_data = res_history.json()

        assert hist_data["student_id"] == student_id
        assert hist_data["total_records"] >= 1
        print(f"  Historical records found: {hist_data['total_records']}")

        # Verify student profile readinessScore was updated in MongoDB
        profile = await student_memory.read_student_profile(student_id)
        assert profile is not None
        assert "readinessScore" in profile
        assert abs(profile["readinessScore"] - score) < 0.2
        print(f"  [PASSED] Synchronized student.readinessScore={profile['readinessScore']} in MongoDB.")

    await close_mongo_connection()
    print("\n======================================================================")
    print("ALL PROGRESS ANALYTICS AGENT TESTS PASSED SUCCESSFULLY!")
    print("======================================================================")


if __name__ == "__main__":
    asyncio.run(run_progress_analytics_tests())
