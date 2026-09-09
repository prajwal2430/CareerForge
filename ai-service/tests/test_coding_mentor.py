"""
Comprehensive Integration Test Suite for Coding Mentor Agent
============================================================
Tests:
1. Safe Non-Gemini Sandbox Execution:
   - Correct submission -> Accepted (100% tests passed)
   - Buggy submission -> Runtime Error / Wrong Answer
   - Infinite loop submission -> Time Limit Exceeded (strict timeout)
   - Blocked imports -> Security Restriction
2. POST /api/ai/coding/analyze:
   - Execution -> Test results -> Complexity analysis & Debugging guidance
   - Verifies persistence in MongoDB coding_submissions
3. POST /api/ai/coding/hint:
   - Socratic progression (Level 1 -> 2 -> 3 -> 4)
   - Safety check: Solution is NOT revealed unless reveal_solution=True
   - Level 5 unlocks solution when requested
4. GET /api/ai/coding/history/{student_id}:
   - Verifies retrieval of submission records from MongoDB
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


async def run_coding_mentor_tests():
    print("======================================================================")
    print("CAREERFORGE CODING MENTOR AGENT - INTEGRATION TEST SUITE")
    print("======================================================================")

    # Initialize DB connection
    await connect_to_mongo()

    student_id = "test_coder_001"
    await student_memory.get_or_create_student(
        student_id=student_id,
        name="Dev Sharma",
        email="dev.coder@careerforge.edu",
        careerGoal="SDE-1 at Amazon"
    )
    print(f"[SETUP] Initialized coder profile for '{student_id}' in shared memory.")

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # ----------------------------------------------------------------------
        # TEST 1: Optimal Correct Code (Accepted)
        # ----------------------------------------------------------------------
        print("\n--- [TEST 1] Correct Optimal Two Sum (Python) -> Accepted ---")
        correct_code = """
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
"""
        test_cases = [
            {"input": "([2, 7, 11, 15], 9)", "expected_output": "[0, 1]"},
            {"input": "([3, 2, 4], 6)", "expected_output": "[1, 2]"},
            {"input": "([3, 3], 6)", "expected_output": "[0, 1]"}
        ]

        res1 = await client.post("/api/ai/coding/analyze", json={
            "student_id": student_id,
            "problem_id": "two-sum",
            "problem_title": "Two Sum",
            "language": "python",
            "code": correct_code,
            "test_cases": test_cases,
            "problem_description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
        })
        assert res1.status_code == 200, f"Analyze failed: {res1.text}"
        data1 = res1.json()

        assert data1["status"] == "Accepted", f"Expected Accepted, got {data1['status']}"
        assert data1["passed"] is True
        assert data1["passed_test_cases"] == 3
        assert data1["total_test_cases"] == 3
        assert data1["runtime_ms"] > 0
        assert "complexity_analysis" in data1
        assert "learning_feedback" in data1
        print(f"[OK] Submission Accepted! Runtime: {data1['runtime_ms']:.1f}ms, Complexity: {data1['complexity_analysis']['time']}")

        # ----------------------------------------------------------------------
        # TEST 2: Buggy Code with Runtime Exception
        # ----------------------------------------------------------------------
        print("\n--- [TEST 2] Buggy Code with ZeroDivisionError -> Runtime Error ---")
        buggy_code = """
def twoSum(nums, target):
    val = 10 / 0
    return []
"""
        res2 = await client.post("/api/ai/coding/analyze", json={
            "student_id": student_id,
            "problem_id": "two-sum",
            "problem_title": "Two Sum",
            "language": "python",
            "code": buggy_code,
            "test_cases": test_cases
        })
        assert res2.status_code == 200
        data2 = res2.json()

        assert data2["status"] == "Runtime Error"
        assert data2["passed"] is False
        assert data2["error_detected"] is True
        assert "ZeroDivisionError" in data2["error_details"]
        assert data2["debugging_guidance"] is not None
        print(f"[OK] Bug accurately trapped: {data2['error_details']}")
        print(f"     Mentor Guidance: {data2['debugging_guidance'][:80]}...")

        # ----------------------------------------------------------------------
        # TEST 3: Infinite Loop -> Strict Time Limit Exceeded
        # ----------------------------------------------------------------------
        print("\n--- [TEST 3] Infinite Loop -> Time Limit Exceeded Sandbox Enforcement ---")
        infinite_loop_code = """
def twoSum(nums, target):
    while True:
        pass
    return []
"""
        res3 = await client.post("/api/ai/coding/analyze", json={
            "student_id": student_id,
            "problem_id": "two-sum",
            "problem_title": "Two Sum",
            "language": "python",
            "code": infinite_loop_code,
            "test_cases": test_cases
        })
        assert res3.status_code == 200
        data3 = res3.json()

        assert data3["status"] == "Time Limit Exceeded"
        assert data3["passed"] is False
        print(f"[OK] Infinite loop safely killed by sandbox: {data3['status']}")

        # ----------------------------------------------------------------------
        # TEST 4: Security Restrictions Trapped
        # ----------------------------------------------------------------------
        print("\n--- [TEST 4] Dangerous Subprocess / OS Execution Blocked ---")
        malicious_code = """
import os
os.system('echo hacked')
def twoSum(nums, target):
    return []
"""
        res4 = await client.post("/api/ai/coding/analyze", json={
            "student_id": student_id,
            "problem_id": "two-sum",
            "problem_title": "Two Sum",
            "language": "python",
            "code": malicious_code,
            "test_cases": test_cases
        })
        assert res4.status_code == 200
        data4 = res4.json()
        assert "Security Restriction" in data4["error_details"]
        print(f"[OK] Security violation trapped: {data4['error_details']}")

        # ----------------------------------------------------------------------
        # TEST 5: Socratic Progressive Hint System
        # ----------------------------------------------------------------------
        print("\n--- [TEST 5] Progressive Socratic Hints (Levels 1 -> 2 -> 3 -> 4) ---")
        student_draft = "def twoSum(nums, target):\n    # stuck here\n    pass"

        # Hint Level 1: Gentle Conceptual
        h1 = await client.post("/api/ai/coding/hint", json={
            "student_id": student_id,
            "problem_id": "two-sum",
            "problem_title": "Two Sum",
            "code": student_draft
        })
        assert h1.status_code == 200
        d_h1 = h1.json()
        assert d_h1["hint_level"] == 1
        assert not d_h1["solution_revealed"]
        assert "def twoSum" not in d_h1["hint"], "Solution leaked in Level 1!"
        print(f"[OK] Hint Level 1 received: '{d_h1['hint_level_name']}'")

        # Hint Level 2: Specific Data Structure
        h2 = await client.post("/api/ai/coding/hint", json={
            "student_id": student_id,
            "problem_id": "two-sum",
            "problem_title": "Two Sum",
            "code": student_draft
        })
        assert h2.status_code == 200
        d_h2 = h2.json()
        assert d_h2["hint_level"] == 2
        assert not d_h2["solution_revealed"]
        print(f"[OK] Hint Level 2 received: '{d_h2['hint_level_name']}'")

        # Hint Level 3: Algorithmic Approach
        h3 = await client.post("/api/ai/coding/hint", json={
            "student_id": student_id,
            "problem_id": "two-sum",
            "problem_title": "Two Sum",
            "code": student_draft
        })
        assert h3.status_code == 200
        d_h3 = h3.json()
        assert d_h3["hint_level"] == 3
        assert not d_h3["solution_revealed"]
        print(f"[OK] Hint Level 3 received: '{d_h3['hint_level_name']}'")

        # Hint Level 5 without reveal_solution flag -> Must NOT reveal solution
        h5_safe = await client.post("/api/ai/coding/hint", json={
            "student_id": student_id,
            "problem_id": "two-sum",
            "problem_title": "Two Sum",
            "code": student_draft,
            "requested_level": 5,
            "reveal_solution": False
        })
        assert h5_safe.status_code == 200
        d_h5_safe = h5_safe.json()
        assert d_h5_safe["hint_level"] == 4, "Safety error: level 5 granted without reveal_solution=true!"
        assert not d_h5_safe["solution_revealed"]
        print("[OK] Solution disclosure protection enforced: Level 5 clamped to Level 4 when reveal_solution=False.")

        # Hint Level 5 WITH reveal_solution=True -> Unlocks complete code
        h5_unlocked = await client.post("/api/ai/coding/hint", json={
            "student_id": student_id,
            "problem_id": "two-sum",
            "problem_title": "Two Sum",
            "code": student_draft,
            "requested_level": 5,
            "reveal_solution": True
        })
        assert h5_unlocked.status_code == 200
        d_h5_unlocked = h5_unlocked.json()
        assert d_h5_unlocked["hint_level"] == 5
        assert d_h5_unlocked["solution_revealed"] is True
        assert "twoSum" in d_h5_unlocked["hint"]
        print("[OK] Solution explicitly unlocked upon verified user request.")

        # ----------------------------------------------------------------------
        # TEST 6: Submission History Retrieval
        # ----------------------------------------------------------------------
        print("\n--- [TEST 6] Coding History Retrieval from MongoDB ---")
        hist_res = await client.get(f"/api/ai/coding/history/{student_id}")
        assert hist_res.status_code == 200
        hist_data = hist_res.json()
        assert hist_data["total_submissions"] >= 3
        # First submission was Accepted
        accepted_sub = next((s for s in hist_data["submissions"] if s["status"] == "Accepted"), None)
        assert accepted_sub is not None
        assert accepted_sub["passed_test_cases"] == 3
        print(f"[OK] History verified in MongoDB: {hist_data['total_submissions']} submissions recorded for '{student_id}'.")

    # Teardown
    await close_mongo_connection()

    print("\n======================================================================")
    print("ALL 6 CODING MENTOR INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("======================================================================")


if __name__ == "__main__":
    asyncio.run(run_coding_mentor_tests())
