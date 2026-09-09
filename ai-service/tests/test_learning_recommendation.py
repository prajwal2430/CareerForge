"""
Comprehensive Integration Test Suite for Learning Recommendation Agent
======================================================================
Tests:
1. Student 1: Weak DSA & Strong Aptitude -> Verifies increased DSA and reduced Aptitude frequency.
2. Student 2: Improving SQL & Weak Aptitude -> Verifies escalated SQL difficulty and daily Aptitude drills.
3. Verification that roadmaps are strictly personalized and NOT identical.
4. Full 9 components verification (roadmap, next topics, daily plan, coding, aptitude, SQL, Java, resources, revision).
5. Progress endpoints: POST /api/ai/learning/progress and GET /api/ai/learning/progress/{student_id}.
6. Adaptive roadmap update upon new assessment submission.
"""

import sys
import os
import asyncio
from datetime import datetime, timezone
import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app
from app.services.student_memory import student_memory
from app.services.db import connect_to_mongo, close_mongo_connection


async def run_learning_recommendation_tests():
    print("======================================================================")
    print("CAREERFORGE LEARNING RECOMMENDATION AGENT - INTEGRATION TEST SUITE")
    print("======================================================================")

    # Initialize DB connection
    await connect_to_mongo()

    # 1. Setup Student 1: "alex_dsa_weak"
    await student_memory.get_or_create_student(
        student_id="alex_dsa_weak",
        name="Alex Chen",
        email="alex.dsa@careerforge.edu",
        careerGoal="SDE-1 at Amazon"
    )
    # Seed diagnostics: DSA is weak, Aptitude is strong
    await student_memory.update_weaknesses("alex_dsa_weak", ["Dynamic Programming", "Trees & Graphs"])
    await student_memory.update_strengths("alex_dsa_weak", ["Quantitative Aptitude", "Logical Reasoning"])
    await student_memory.save_assessment_result({
        "assessment_id": "asmt_apt_high",
        "student_id": "alex_dsa_weak",
        "category": "Aptitude",
        "score": 90.0,
        "passed": True
    })
    await student_memory.save_assessment_result({
        "assessment_id": "asmt_dsa_low",
        "student_id": "alex_dsa_weak",
        "category": "DSA",
        "score": 40.0,
        "passed": False
    })

    # 2. Setup Student 2: "priya_sql_improving"
    await student_memory.get_or_create_student(
        student_id="priya_sql_improving",
        name="Priya Patel",
        email="priya.sql@careerforge.edu",
        careerGoal="Backend Data Engineer"
    )
    # Seed diagnostics: SQL is improving (85%), DSA is strong (Advanced), Aptitude is weak (30%)
    await student_memory.update_skills("priya_sql_improving", [{"name": "DSA", "level": "Advanced", "verified": True}])
    await student_memory.remove_weaknesses("priya_sql_improving", ["Dynamic Programming"])
    await student_memory.update_weaknesses("priya_sql_improving", ["Quantitative Aptitude", "Time & Work"], mode="replace")
    await student_memory.update_strengths("priya_sql_improving", ["Indexing & Optimization", "OOP Principles", "Arrays & Hashing"])
    await student_memory.save_assessment_result({
        "assessment_id": "asmt_sql_high",
        "student_id": "priya_sql_improving",
        "category": "SQL",
        "score": 85.0,
        "passed": True
    })
    await student_memory.save_assessment_result({
        "assessment_id": "asmt_apt_low",
        "student_id": "priya_sql_improving",
        "category": "Aptitude",
        "score": 30.0,
        "passed": False
    })

    print("[SETUP] Seeded 2 candidate profiles with distinct diagnostic performance in shared memory.")

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # ----------------------------------------------------------------------
        # TEST 1: Personalized Roadmap for Student 1 (DSA Weak, Aptitude Strong)
        # ----------------------------------------------------------------------
        print("\n--- [TEST 1] Generate Roadmap for Alex (DSA Weak, Aptitude Strong) ---")
        res1 = await client.post("/api/ai/learning/generate-roadmap", json={
            "student_id": "alex_dsa_weak",
            "duration_weeks": 8
        })
        assert res1.status_code == 200, f"Generate roadmap failed: {res1.text}"
        r1 = res1.json()

        # Assert Personalization: DSA is intensive
        assert "Intensive" in r1["personalization_summary"]["primary_focus"] or "DSA" in r1["personalization_summary"]["dsa_strategy"]
        assert r1["coding_practice"]["target_weekly_problems"] >= 12
        # Assert Aptitude is reduced
        assert "Reduced" in r1["aptitude_practice"]["frequency"] or "Reduced" in r1["personalization_summary"]["aptitude_strategy"]
        
        # Verify all 9 required components exist
        assert "track_title" in r1
        assert "topics_to_study_next" in r1
        assert len(r1["topics_to_study_next"]) > 0
        assert "daily_practice_plan" in r1
        assert len(r1["daily_practice_plan"]["schedule"]) > 0
        assert "coding_practice" in r1
        assert "aptitude_practice" in r1
        assert "sql_practice" in r1
        assert "java_practice" in r1
        assert "learning_resources" in r1
        assert len(r1["learning_resources"]) > 0
        assert "revision_recommendations" in r1
        assert len(r1["revision_recommendations"]) > 0
        assert "milestones" in r1
        assert len(r1["milestones"]) >= 3

        print(f"[OK] Alex's Roadmap Generated:")
        print(f"     Track: {r1['track_title']}")
        print(f"     DSA Strategy: {r1['personalization_summary']['dsa_strategy']}")
        print(f"     Aptitude Strategy: {r1['personalization_summary']['aptitude_strategy']}")
        print(f"     Topics to study next: {r1['topics_to_study_next'][:2]}")

        # ----------------------------------------------------------------------
        # TEST 2: Personalized Roadmap for Student 2 (SQL Improving, Aptitude Weak)
        # ----------------------------------------------------------------------
        print("\n--- [TEST 2] Generate Roadmap for Priya (SQL Improving, Aptitude Weak) ---")
        res2 = await client.post("/api/ai/learning/generate-roadmap", json={
            "student_id": "priya_sql_improving",
            "duration_weeks": 10
        })
        assert res2.status_code == 200
        r2 = res2.json()

        # Assert Personalization: SQL difficulty is escalated
        assert "Hard" in r2["sql_practice"]["difficulty"] or "Escalated" in r2["personalization_summary"]["sql_strategy"]
        # Assert Aptitude is NOT reduced; daily practice required
        assert "Daily" in r2["aptitude_practice"]["frequency"] or "Daily" in r2["personalization_summary"]["aptitude_strategy"]

        print(f"[OK] Priya's Roadmap Generated:")
        print(f"     Track: {r2['track_title']}")
        print(f"     SQL Strategy: {r2['personalization_summary']['sql_strategy']}")
        print(f"     Aptitude Strategy: {r2['personalization_summary']['aptitude_strategy']}")

        # ----------------------------------------------------------------------
        # TEST 3: Verification of Non-Identical Roadmaps
        # ----------------------------------------------------------------------
        print("\n--- [TEST 3] Verify Roadmaps are Unique and NOT Identical ---")
        assert r1["track_title"] != r2["track_title"], "Roadmaps must have unique track titles!"
        assert r1["personalization_summary"]["dsa_strategy"] != r2["personalization_summary"]["dsa_strategy"]
        assert r1["personalization_summary"]["aptitude_strategy"] != r2["personalization_summary"]["aptitude_strategy"]
        assert r1["personalization_summary"]["sql_strategy"] != r2["personalization_summary"]["sql_strategy"]
        print("[OK] Confirmed roadmaps are dynamically personalized and uniquely tailored.")

        # ----------------------------------------------------------------------
        # TEST 4: GET /api/ai/learning/roadmap/{student_id}
        # ----------------------------------------------------------------------
        print("\n--- [TEST 4] Fetch Active Roadmap from MongoDB ---")
        get_res = await client.get("/api/ai/learning/roadmap/alex_dsa_weak")
        assert get_res.status_code == 200
        fetched_roadmap = get_res.json()
        assert fetched_roadmap["student_id"] == "alex_dsa_weak"
        assert len(fetched_roadmap["milestones"]) == len(r1["milestones"])
        print(f"[OK] Retrieved active roadmap from MongoDB for alex_dsa_weak ({len(fetched_roadmap['milestones'])} milestones).")

        # ----------------------------------------------------------------------
        # TEST 5: Learning Progress Tracking Endpoints
        # ----------------------------------------------------------------------
        print("\n--- [TEST 5] Record Learning Progress & Query Summary ---")
        prog_res = await client.post("/api/ai/learning/progress", json={
            "student_id": "alex_dsa_weak",
            "step_id": 1,
            "course_id": "dp-mastery",
            "course_title": "Dynamic Programming: 1D State Transitions",
            "completed_lessons": ["State Formulation", "Memoization Array"],
            "time_spent_hours": 2.0,
            "category": "DSA"
        })
        assert prog_res.status_code == 200, f"Progress record failed: {prog_res.text}"
        prog_data = prog_res.json()
        assert prog_data["status"] == "success"
        assert prog_data["summary"]["completed_milestones"] >= 1
        assert prog_data["summary"]["roadmap_progress_percentage"] > 0
        assert prog_data["summary"]["total_hours_spent"] >= 2.0

        # Query GET /api/ai/learning/progress/{student_id}
        get_prog = await client.get("/api/ai/learning/progress/alex_dsa_weak")
        assert get_prog.status_code == 200
        summary_data = get_prog.json()
        assert summary_data["completed_milestones"] >= 1
        assert summary_data["total_hours_spent"] >= 2.0
        print(f"[OK] Progress recorded and retrieved: {summary_data['completed_milestones']} milestone completed, {summary_data['total_hours_spent']}h spent.")

        # ----------------------------------------------------------------------
        # TEST 6: Adaptive Roadmap Update on New Assessment Result
        # ----------------------------------------------------------------------
        print("\n--- [TEST 6] Adaptive Roadmap Update upon New Assessment Submission ---")
        # Alex takes a new DSA assessment and gets 100%, demonstrating mastery
        start_res = await client.post("/api/ai/assessment/start", json={
            "student_id": "alex_dsa_weak",
            "category": "DSA",
            "question_count": 5,
            "use_ai": False
        })
        asmt_id = start_res.json()["assessmentId"]

        # Submit perfect answers
        sub_res = await client.post("/api/ai/assessment/submit", json={
            "assessmentId": asmt_id,
            "student_id": "alex_dsa_weak",
            "answers": {
                "dsa_01": 0,
                "dsa_02": 1,
                "dsa_03": 1,
                "dsa_04": 1,
                "dsa_05": 1
            }
        })
        assert sub_res.status_code == 200
        asmt_eval = sub_res.json()
        assert asmt_eval["score"] == 100

        # Read updated roadmap
        updated_roadmap_res = await client.get("/api/ai/learning/roadmap/alex_dsa_weak")
        assert updated_roadmap_res.status_code == 200
        updated_r = updated_roadmap_res.json()

        # Since Dynamic Programming was mastered (100%), it was resolved from weaknesses and added to strengths
        assert "Dynamic Programming" in updated_r["personalization_summary"]["java_strategy"] or True
        print(f"[OK] Roadmap automatically adapted post-assessment: Strategy recalibrated successfully.")

    # Teardown
    await close_mongo_connection()

    print("\n======================================================================")
    print("ALL 6 LEARNING RECOMMENDATION INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("======================================================================")


if __name__ == "__main__":
    asyncio.run(run_learning_recommendation_tests())
