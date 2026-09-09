"""
Comprehensive Integration Test Suite for Skill Assessment Agent
===============================================================
Tests:
1. Java assessment (Student 1: High Score -> Advanced, Strengths)
2. SQL assessment (Student 2: Medium Score -> Intermediate, Weak Areas & Recommended Topics)
3. DSA assessment (Student 3: Target Weakness & Remediation)
4. Aptitude assessment (Student 4: Low Score -> Beginner, Gap Analysis)
5. Technical Fundamentals assessment (Student 5: Alternative answer formats: indices & letters)
6. History and Skills endpoints verification across all students.
7. Verification that scores are strictly deterministic (NO arbitrary LLM scores).
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


async def run_assessment_tests():
    print("======================================================================")
    print("CAREERFORGE SKILL ASSESSMENT AGENT - COMPREHENSIVE TEST SUITE")
    print("======================================================================")

    # Initialize DB connection
    await connect_to_mongo()

    # Setup test students
    students = [
        {
            "id": "student_alpha",
            "name": "Alpha Kumar",
            "email": "alpha@careerforge.edu",
            "branch": "Computer Science",
            "year": "4th Year"
        },
        {
            "id": "student_beta",
            "name": "Beta Sharma",
            "email": "beta@careerforge.edu",
            "branch": "Information Technology",
            "year": "3rd Year"
        },
        {
            "id": "student_gamma",
            "name": "Gamma Patel",
            "email": "gamma@careerforge.edu",
            "branch": "Electronics and Communication",
            "year": "4th Year"
        },
        {
            "id": "student_delta",
            "name": "Delta Verma",
            "email": "delta@careerforge.edu",
            "branch": "Mechanical Engineering",
            "year": "2nd Year"
        },
        {
            "id": "student_epsilon",
            "name": "Epsilon Rao",
            "email": "epsilon@careerforge.edu",
            "branch": "Computer Science",
            "year": "4th Year"
        }
    ]

    for s in students:
        await student_memory.get_or_create_student(
            student_id=s["id"],
            name=s["name"],
            email=s["email"],
            branch=s["branch"],
            year=s["year"]
        )
    print(f"[SETUP] Successfully initialized {len(students)} test student profiles in shared memory.")

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # ----------------------------------------------------------------------
        # TEST 1: Java Assessment - High Score (Student Alpha)
        # ----------------------------------------------------------------------
        print("\n--- [TEST 1] Java Assessment (Student Alpha: Target 100% Score) ---")
        start_res = await client.post("/api/ai/assessment/start", json={
            "student_id": "student_alpha",
            "category": "Java",
            "difficulty": "Medium",
            "question_count": 5,
            "use_ai": False
        })
        assert start_res.status_code == 200, f"Start failed: {start_res.text}"
        java_data = start_res.json()
        asmt_id_1 = java_data["assessmentId"]
        assert java_data["category"] == "Java"
        assert len(java_data["questions"]) == 5

        # Verify no answer keys were leaked to student
        for q in java_data["questions"]:
            assert "correct_answer" not in q, "Security error: correct_answer exposed to student!"
            assert "explanation" not in q, "Security error: explanation exposed to student!"

        # Perfect answers based on curated bank
        perfect_java_answers = {
            "java_01": 2,  # Overriding return type
            "java_02": 1,  # HashMap
            "java_03": 1,  # volatile memory visibility
            "java_04": 2,  # Heap
            "java_05": 1   # flatMap
        }

        submit_res = await client.post("/api/ai/assessment/submit", json={
            "assessmentId": asmt_id_1,
            "student_id": "student_alpha",
            "answers": perfect_java_answers
        })
        assert submit_res.status_code == 200, f"Submit failed: {submit_res.text}"
        eval_1 = submit_res.json()

        # Deterministic verification: 5/5 = 100%
        assert eval_1["score"] == 100, f"Expected deterministic score 100, got {eval_1['score']}"
        assert eval_1["correctCount"] == 5
        assert eval_1["totalQuestions"] == 5
        assert eval_1["passed"] is True
        assert len(eval_1["strengths"]) > 0
        assert len(eval_1["weakAreas"]) == 0
        print(f"[OK] Java Assessment evaluated deterministically: Score = {eval_1['score']}%, Strengths = {eval_1['strengths']}")

        # ----------------------------------------------------------------------
        # TEST 2: SQL Assessment - Moderate Score (Student Beta)
        # ----------------------------------------------------------------------
        print("\n--- [TEST 2] SQL Assessment (Student Beta: Target 60% Score) ---")
        start_res = await client.post("/api/ai/assessment/start", json={
            "student_id": "student_beta",
            "category": "SQL",
            "difficulty": "Medium",
            "question_count": 5,
            "use_ai": False
        })
        assert start_res.status_code == 200
        sql_data = start_res.json()
        asmt_id_2 = sql_data["assessmentId"]

        # 3 correct (60%), 2 wrong
        sql_answers = {
            "sql_01": 1,  # Correct (INNER vs LEFT)
            "sql_02": 0,  # Correct (B+ Tree)
            "sql_03": 2,  # Correct (Isolation)
            "sql_04": 0,  # Wrong (chose WHERE instead of HAVING)
            "sql_05": 0   # Wrong (chose Primary keys instead of Transitive)
        }

        submit_res = await client.post("/api/ai/assessment/submit", json={
            "assessmentId": asmt_id_2,
            "student_id": "student_beta",
            "answers": sql_answers
        })
        assert submit_res.status_code == 200
        eval_2 = submit_res.json()

        assert eval_2["score"] == 60, f"Expected deterministic score 60, got {eval_2['score']}"
        assert eval_2["correctCount"] == 3
        assert eval_2["passed"] is True
        assert "Grouping & Aggregates" in eval_2["weakAreas"]
        assert "Database Normalization" in eval_2["weakAreas"]
        assert len(eval_2["recommendedTopics"]) > 0
        print(f"[OK] SQL Assessment evaluated deterministically: Score = {eval_2['score']}%, Weak Areas = {eval_2['weakAreas']}")
        print(f"     Recommended Topics: {eval_2['recommendedTopics'][:2]}")

        # ----------------------------------------------------------------------
        # TEST 3: DSA Assessment - Weakness Diagnosis & Remediation (Student Gamma)
        # ----------------------------------------------------------------------
        print("\n--- [TEST 3] DSA Assessment (Student Gamma: Target 80% Score) ---")
        # Seed gamma with weakness in Dynamic Programming
        await student_memory.update_weaknesses("student_gamma", ["Dynamic Programming"])

        start_res = await client.post("/api/ai/assessment/start", json={
            "student_id": "student_gamma",
            "category": "DSA",
            "difficulty": "Medium",
            "question_count": 5,
            "use_ai": False
        })
        assert start_res.status_code == 200
        dsa_data = start_res.json()
        asmt_id_3 = dsa_data["assessmentId"]

        # 4 correct (80%), 1 wrong
        dsa_answers = {
            "dsa_01": 0,  # Correct: O(1)
            "dsa_02": 1,  # Correct: Optimal substructure & Overlapping subproblems
            "dsa_03": 1,  # Correct: BFS
            "dsa_04": 0,  # Wrong (selected Queue instead of Stack)
            "dsa_05": 1   # Correct: O(N * W) Knapsack DP
        }

        submit_res = await client.post("/api/ai/assessment/submit", json={
            "assessmentId": asmt_id_3,
            "student_id": "student_gamma",
            "answers": dsa_answers
        })
        assert submit_res.status_code == 200
        eval_3 = submit_res.json()

        assert eval_3["score"] == 80, f"Expected deterministic score 80, got {eval_3['score']}"
        assert eval_3["correctCount"] == 4
        # Because gamma scored 100% on both DP questions (dsa_02 and dsa_05), Dynamic Programming is now mastered and cleared from weaknesses!
        assert "Dynamic Programming" in eval_3["strengths"]
        assert "Stacks & Queues" in eval_3["weakAreas"]
        print(f"[OK] DSA Assessment evaluated: Score = {eval_3['score']}%, Dynamic Programming moved to Strengths!")

        # ----------------------------------------------------------------------
        # TEST 4: Aptitude Assessment - Low Score (Student Delta)
        # ----------------------------------------------------------------------
        print("\n--- [TEST 4] Aptitude Assessment (Student Delta: Target 20% Score) ---")
        start_res = await client.post("/api/ai/assessment/start", json={
            "student_id": "student_delta",
            "category": "Aptitude",
            "difficulty": "Easy",
            "question_count": 5,
            "use_ai": False
        })
        assert start_res.status_code == 200
        apt_data = start_res.json()
        asmt_id_4 = apt_data["assessmentId"]

        # 1 correct (20%), 4 wrong
        apt_answers = {
            "apt_01": 1,  # Correct (200 meters)
            "apt_02": 3,  # Wrong
            "apt_03": 2,  # Wrong
            "apt_04": 0,  # Wrong
            "apt_05": 0   # Wrong
        }

        submit_res = await client.post("/api/ai/assessment/submit", json={
            "assessmentId": asmt_id_4,
            "student_id": "student_delta",
            "answers": apt_answers
        })
        assert submit_res.status_code == 200
        eval_4 = submit_res.json()

        assert eval_4["score"] == 20, f"Expected deterministic score 20, got {eval_4['score']}"
        assert eval_4["passed"] is False
        assert len(eval_4["weakAreas"]) >= 3
        print(f"[OK] Aptitude Assessment evaluated: Score = {eval_4['score']}%, Passed = {eval_4['passed']}, Weak Areas = {len(eval_4['weakAreas'])}")

        # ----------------------------------------------------------------------
        # TEST 5: Technical Fundamentals - Flexible Answer Types (Student Epsilon)
        # ----------------------------------------------------------------------
        print("\n--- [TEST 5] Technical Fundamentals (Student Epsilon: Letter 'A'..'D' and Index Formats) ---")
        start_res = await client.post("/api/ai/assessment/start", json={
            "student_id": "student_epsilon",
            "category": "Technical Fundamentals",
            "difficulty": "Medium",
            "question_count": 5,
            "use_ai": False
        })
        assert start_res.status_code == 200
        tf_data = start_res.json()
        asmt_id_5 = tf_data["assessmentId"]

        # Answers provided using mixed string letters 'B', 'C' and int indices
        tf_answers = {
            "tf_01": "C",  # Index 2: Preemption Allowed (Correct)
            "tf_02": "B",  # Index 1: Transport Layer (Correct)
            "tf_03": 1,    # Index 1: Address space difference (Correct)
            "tf_04": "B",  # Index 1: 401 Unauthorized (Correct)
            "tf_05": 1     # Index 1: Consistency and Availability (Correct)
        }

        submit_res = await client.post("/api/ai/assessment/submit", json={
            "assessmentId": asmt_id_5,
            "student_id": "student_epsilon",
            "answers": tf_answers
        })
        assert submit_res.status_code == 200
        eval_5 = submit_res.json()

        assert eval_5["score"] == 100, f"Expected deterministic score 100, got {eval_5['score']}"
        assert eval_5["correctCount"] == 5
        print(f"[OK] Technical Fundamentals evaluated with mixed answer representations: Score = {eval_5['score']}%")

        # ----------------------------------------------------------------------
        # TEST 6: History & Skills Endpoints Verification
        # ----------------------------------------------------------------------
        print("\n--- [TEST 6] Verification of Assessment History & Student Skill Endpoints ---")

        # Verify Student Alpha History
        hist_alpha = await client.get("/api/ai/assessment/history/student_alpha")
        assert hist_alpha.status_code == 200
        h_data = hist_alpha.json()
        assert h_data["total_assessments"] >= 1
        assert h_data["history"][0]["score"] == 100
        print(f"[OK] History verified for student_alpha: {h_data['total_assessments']} assessment(s) recorded.")

        # Verify Student Alpha Skills Profile
        skills_alpha = await client.get("/api/ai/assessment/skills/student_alpha")
        assert skills_alpha.status_code == 200
        s_data = skills_alpha.json()
        java_skill = next((s for s in s_data["skills"] if s["name"] == "Java"), None)
        assert java_skill is not None
        assert java_skill["level"] == "Advanced"
        assert java_skill["verified"] is True
        print(f"[OK] Skill profile verified for student_alpha: Java skill upgraded to '{java_skill['level']}' (Verified: {java_skill['verified']}).")

        # Verify Student Beta Skills (Intermediate)
        skills_beta = await client.get("/api/ai/assessment/skills/student_beta")
        assert skills_beta.status_code == 200
        s_beta = skills_beta.json()
        sql_skill = next((s for s in s_beta["skills"] if s["name"] == "SQL"), None)
        assert sql_skill is not None
        assert sql_skill["level"] == "Intermediate"
        assert "Database Normalization" in s_beta["weaknesses"]
        print(f"[OK] Skill profile verified for student_beta: SQL skill is '{sql_skill['level']}', weaknesses tracked.")

        # Verify Student Delta Skills (Beginner)
        skills_delta = await client.get("/api/ai/assessment/skills/student_delta")
        assert skills_delta.status_code == 200
        s_delta = skills_delta.json()
        apt_skill = next((s for s in s_delta["skills"] if s["name"] == "Aptitude"), None)
        assert apt_skill is not None
        assert apt_skill["level"] == "Beginner"
        print(f"[OK] Skill profile verified for student_delta: Aptitude skill is '{apt_skill['level']}'.")

    # Teardown
    await close_mongo_connection()

    print("\n======================================================================")
    print("ALL 6 SKILL ASSESSMENT INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("======================================================================")


if __name__ == "__main__":
    asyncio.run(run_assessment_tests())
