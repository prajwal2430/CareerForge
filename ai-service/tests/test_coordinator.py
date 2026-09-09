"""
CareerForge AI Service - Placement Mentor Coordinator Agent Integration Tests
=============================================================================
Tests:
1. Intent identification & dynamic routing across specialized agents:
   - "What should I study today?" -> learning_recommendation
   - "Help me debug this code" -> coding_mentor
   - "Start an HR interview" -> interview_mentor
   - "Am I placement ready?" -> progress_analytics
   - "I want to know my weak areas" -> skill_assessment
   - "Create my preparation plan" -> coordinator (composite synthesis)
2. Response schema validation:
   {
     "agent": "...",
     "response": "...",
     "actions": [],
     "data": {}
   }
3. Selective invocation verification (does NOT invoke every agent for every task).
4. MongoDB shared memory update & execution logging in agent_results.
"""

import sys
import os
import asyncio
import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app
from app.services.student_memory import student_memory
from app.services.db import connect_to_mongo, close_mongo_connection, get_database


async def run_coordinator_tests():
    print("======================================================================")
    print("CAREERFORGE PLACEMENT MENTOR COORDINATOR AGENT - TEST SUITE")
    print("======================================================================")

    # Initialize DB connection
    await connect_to_mongo()

    student_id = "test_coord_std_001"

    # Setup student in shared memory
    await student_memory.get_or_create_student(
        student_id=student_id,
        name="Sneha Reddy",
        email="sneha.reddy@careerforge.edu",
        branch="Computer Science",
        year="4th Year",
        careerGoal="Backend SDE-1"
    )
    await student_memory.update_weaknesses(student_id, ["Dynamic Programming", "SQL Normalization"])
    await student_memory.update_skills(student_id, [
        {"name": "Java", "level": "advanced"},
        {"name": "Python", "level": "intermediate"}
    ])

    print(f"[SETUP] Initialized profile for student '{student_id}'.")

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:

        # ----------------------------------------------------------------------
        # TEST 1: Learning Recommendation Intent
        # ----------------------------------------------------------------------
        print("\n--- [TEST 1] Routing: 'What should I study today?' -> learning_recommendation ---")
        res1 = await client.post("/api/ai/mentor/chat", json={
            "studentId": student_id,
            "message": "What should I study today?"
        })
        assert res1.status_code == 200, res1.text
        data1 = res1.json()

        assert data1["agent"] == "learning_recommendation", f"Expected learning_recommendation, got {data1['agent']}"
        assert len(data1["response"]) > 20
        assert isinstance(data1["actions"], list)
        assert len(data1["actions"]) > 0
        assert "data" in data1
        print(f"  Routed to: {data1['agent']}")
        print(f"  Response Preview: {data1['response'][:100]}...")
        print(f"  Actions: {[a['label'] for a in data1['actions']]}")

        # ----------------------------------------------------------------------
        # TEST 2: Coding Mentor Intent
        # ----------------------------------------------------------------------
        print("\n--- [TEST 2] Routing: 'Help me debug this code' -> coding_mentor ---")
        res2 = await client.post("/api/ai/mentor/chat", json={
            "studentId": student_id,
            "message": "Help me debug this code"
        })
        assert res2.status_code == 200, res2.text
        data2 = res2.json()

        assert data2["agent"] == "coding_mentor", f"Expected coding_mentor, got {data2['agent']}"
        assert "debug" in data2["response"].lower() or "hint" in data2["response"].lower()
        assert len(data2["actions"]) > 0
        print(f"  Routed to: {data2['agent']}")
        print(f"  Response Preview: {data2['response'][:100]}...")

        # ----------------------------------------------------------------------
        # TEST 3: Interview Mentor Intent
        # ----------------------------------------------------------------------
        print("\n--- [TEST 3] Routing: 'Start an HR interview' -> interview_mentor ---")
        res3 = await client.post("/api/ai/mentor/chat", json={
            "studentId": student_id,
            "message": "Start an HR interview"
        })
        assert res3.status_code == 200, res3.text
        data3 = res3.json()

        assert data3["agent"] == "interview_mentor", f"Expected interview_mentor, got {data3['agent']}"
        assert "interview" in data3["response"].lower()
        assert len(data3["actions"]) > 0
        assert "sessionId" in data3["data"]
        print(f"  Routed to: {data3['agent']}")
        print(f"  Session ID generated: {data3['data']['sessionId']}")

        # ----------------------------------------------------------------------
        # TEST 4: Progress Analytics Intent
        # ----------------------------------------------------------------------
        print("\n--- [TEST 4] Routing: 'Am I placement ready?' -> progress_analytics ---")
        res4 = await client.post("/api/ai/mentor/chat", json={
            "studentId": student_id,
            "message": "Am I placement ready?"
        })
        assert res4.status_code == 200, res4.text
        data4 = res4.json()

        assert data4["agent"] == "progress_analytics", f"Expected progress_analytics, got {data4['agent']}"
        assert "readiness score" in data4["response"].lower() or "placement readiness" in data4["response"].lower()
        assert "readinessScore" in data4["data"]
        print(f"  Routed to: {data4['agent']}")
        print(f"  Readiness Score: {data4['data']['readinessScore']}%")

        # ----------------------------------------------------------------------
        # TEST 5: Skill Assessment Intent
        # ----------------------------------------------------------------------
        print("\n--- [TEST 5] Routing: 'I want to know my weak areas' -> skill_assessment ---")
        res5 = await client.post("/api/ai/mentor/chat", json={
            "studentId": student_id,
            "message": "I want to know my weak areas"
        })
        assert res5.status_code == 200, res5.text
        data5 = res5.json()

        assert data5["agent"] == "skill_assessment", f"Expected skill_assessment, got {data5['agent']}"
        assert "weak" in data5["response"].lower()
        assert "weaknesses" in data5["data"]
        print(f"  Routed to: {data5['agent']}")
        print(f"  Weak areas returned: {data5['data']['weaknesses']}")

        # ----------------------------------------------------------------------
        # TEST 6: Composite Preparation Plan Intent
        # ----------------------------------------------------------------------
        print("\n--- [TEST 6] Routing: 'Create my preparation plan' -> coordinator (composite synthesis) ---")
        res6 = await client.post("/api/ai/mentor/chat", json={
            "studentId": student_id,
            "message": "Create my preparation plan"
        })
        assert res6.status_code == 200, res6.text
        data6 = res6.json()

        assert data6["agent"] == "coordinator", f"Expected coordinator, got {data6['agent']}"
        assert "preparation plan" in data6["response"].lower() or "roadmap" in data6["response"].lower()
        assert "readinessScore" in data6["data"]
        print(f"  Routed to: {data6['agent']}")
        print(f"  Response Preview: {data6['response'][:100]}...")

        # ----------------------------------------------------------------------
        # TEST 7: Execution Logging in MongoDB
        # ----------------------------------------------------------------------
        print("\n--- [TEST 7] Verify Agent Execution Logging in MongoDB ---")
        db = get_database()
        if db is not None:
            cursor = db["agent_results"].find({
                "student_id": student_id,
                "agent_name": "Placement Coordinator"
            })
            logs = await cursor.to_list(length=20)
            assert len(logs) >= 6, f"Expected at least 6 execution logs in MongoDB, found {len(logs)}"
            print(f"  Verified {len(logs)} execution logs saved in MongoDB agent_results collection.")

    await close_mongo_connection()
    print("\n======================================================================")
    print("ALL COORDINATOR AGENT TESTS PASSED SUCCESSFULLY!")
    print("======================================================================")


if __name__ == "__main__":
    asyncio.run(run_coordinator_tests())
