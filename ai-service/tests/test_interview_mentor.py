"""
CareerForge AI Service - Interview Mentor Integration Tests
===========================================================
Tests:
1. HR Mode Session:
   - POST /api/ai/interview/start
   - POST /api/ai/interview/answer (Evaluates: communication, clarity, relevance, confidence, answer quality, improvement suggestions)
   - Follow-up turn & final evaluation
2. Technical Mode Session:
   - POST /api/ai/interview/start
   - POST /api/ai/interview/answer (Evaluates: correctness, technical depth, explanation, problem-solving approach, missing concepts, improvement suggestions)
   - POST /api/ai/interview/finish
3. Session Retrieval:
   - GET /api/ai/interview/history/{student_id}
   - Verifies persistence in MongoDB interview_sessions and student.interviewHistory
"""

import sys
import os
import asyncio
import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app
from app.services.student_memory import student_memory
from app.services.db import connect_to_mongo, close_mongo_connection


async def run_interview_mentor_tests():
    print("======================================================================")
    print("CAREERFORGE INTERVIEW MENTOR AGENT - INTEGRATION TEST SUITE")
    print("======================================================================")

    # Initialize DB connection
    await connect_to_mongo()

    student_id = "test_candidate_iv_001"
    await student_memory.get_or_create_student(
        student_id=student_id,
        name="Ananya Iyer",
        email="ananya.iyer@careerforge.edu",
        branch="Computer Science & Engineering",
        year="4th Year",
        careerGoal="Backend Software Engineer"
    )
    await student_memory.update_weaknesses(student_id, ["Concurrency Anomalies", "Distributed Caching"])
    await student_memory.update_skills(student_id, [{"name": "Java", "level": "advanced"}, {"name": "SQL", "level": "intermediate"}])
    print(f"[SETUP] Profile for '{student_id}' configured with weak areas and goals.")

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # ----------------------------------------------------------------------
        # TEST 1: HR Interview Mode
        # ----------------------------------------------------------------------
        print("\n--- [TEST 1] HR Interview Mode: Start, Answer, and Turn Evaluation ---")
        hr_start_res = await client.post("/api/ai/interview/start", json={
            "student_id": student_id,
            "mode": "hr",
            "target_company": "Microsoft",
            "role": "Backend Software Engineer",
            "max_questions": 2
        })
        assert hr_start_res.status_code == 200, hr_start_res.text
        hr_start = hr_start_res.json()
        hr_session_id = hr_start["sessionId"]
        assert hr_start["mode"] == "hr"
        assert hr_start["questionNumber"] == 1
        assert len(hr_start["question"]) > 10
        print(f"  [HR Start] Session ID: {hr_session_id}")
        print(f"  [HR Q1]: {hr_start['question']}")

        # Submit Turn 1 Answer with decisive ownership phrasing
        turn1_answer = (
            "In my final semester project, I led the backend development for our college placement portal. "
            "My role was to design the REST APIs and database schema. When we experienced slow response times during mock drives, "
            "I took full responsibility, optimized our SQL queries, and introduced Redis caching, which reduced latency by 45%. "
            "I regularly communicated updates with our faculty advisor and resolved any technical roadblocks."
        )
        hr_ans_res1 = await client.post("/api/ai/interview/answer", json={
            "sessionId": hr_session_id,
            "student_id": student_id,
            "answer": turn1_answer
        })
        assert hr_ans_res1.status_code == 200, hr_ans_res1.text
        hr_turn1 = hr_ans_res1.json()
        assert hr_turn1["sessionId"] == hr_session_id
        assert hr_turn1["mode"] == "hr"
        assert hr_turn1["questionNumber"] == 1
        assert not hr_turn1["isComplete"]
        assert hr_turn1["nextQuestion"] is not None

        # Verify HR Rubric Evaluation Fields
        eval_hr = hr_turn1["evaluation"]
        print(f"  [HR Turn 1 Eval] Score: {eval_hr.get('score')}%")
        print(f"    - Communication: {eval_hr.get('communication')}%")
        print(f"    - Clarity: {eval_hr.get('clarity')}%")
        print(f"    - Relevance: {eval_hr.get('relevance')}%")
        print(f"    - Confidence: {eval_hr.get('confidence')}%")
        print(f"    - Answer Quality: {eval_hr.get('answerQuality')}%")
        print(f"    - Improvement Suggestions: {eval_hr.get('improvementSuggestions')}")

        for field in ["communication", "clarity", "relevance", "confidence", "answerQuality", "improvementSuggestions"]:
            assert field in eval_hr, f"Missing HR evaluation field: {field}"
        assert isinstance(eval_hr["improvementSuggestions"], list)
        assert eval_hr["confidence"] >= 70, "Ownership indicators should yield strong confidence score"

        # Submit Turn 2 Answer (completes max_questions=2)
        print("\n  [Submitting HR Turn 2 to test interview completion]")
        turn2_answer = (
            "I want to join Microsoft because of your culture of continuous learning and customer obsession. "
            "Over the next three years, I aim to master distributed systems and mentor junior engineers."
        )
        hr_ans_res2 = await client.post("/api/ai/interview/answer", json={
            "sessionId": hr_session_id,
            "student_id": student_id,
            "answer": turn2_answer
        })
        assert hr_ans_res2.status_code == 200, hr_ans_res2.text
        hr_turn2 = hr_ans_res2.json()
        assert hr_turn2["isComplete"] is True
        assert hr_turn2["finalEvaluation"] is not None
        final_hr = hr_turn2["finalEvaluation"]
        print(f"  [HR Final Evaluation] Overall Score: {final_hr.get('overallScore')}%")
        print(f"    - Hiring Recommendation: {final_hr.get('hiringRecommendation')}")
        print(f"    - Strengths Observed: {final_hr.get('strengthsObserved')}")
        print(f"    - Weaknesses Observed: {final_hr.get('weaknessesObserved')}")

        # ----------------------------------------------------------------------
        # TEST 2: Technical Interview Mode
        # ----------------------------------------------------------------------
        print("\n--- [TEST 2] Technical Interview Mode: Start, Answer, and Rubrics ---")
        tech_start_res = await client.post("/api/ai/interview/start", json={
            "student_id": student_id,
            "mode": "technical",
            "target_company": "Amazon",
            "role": "Backend Software Engineer",
            "max_questions": 3
        })
        assert tech_start_res.status_code == 200, tech_start_res.text
        tech_start = tech_start_res.json()
        tech_session_id = tech_start["sessionId"]
        assert tech_start["mode"] == "technical"
        print(f"  [Tech Start] Session ID: {tech_session_id}")
        print(f"  [Tech Q1]: {tech_start['question']}")

        # Submit Turn 1 Technical Answer
        tech_answer = (
            "To handle high read/write throughput, I would decouple read and write paths using CQRS. "
            "For write-heavy transactional data requiring strict consistency, we use PostgreSQL with B-tree indices. "
            "We employ connection pooling via PgBouncer and optimize database transaction isolation levels. "
            "For reads, we cache active sessions and hot records in Redis with LRU eviction. "
            "The trade-off is eventual consistency on cached reads, which we mitigate with cache invalidation events over Kafka. "
            "Algorithmic complexity for cached queries is O(1) versus O(log N) indexed DB reads."
        )
        tech_ans_res = await client.post("/api/ai/interview/answer", json={
            "sessionId": tech_session_id,
            "student_id": student_id,
            "answer": tech_answer
        })
        assert tech_ans_res.status_code == 200, tech_ans_res.text
        tech_turn = tech_ans_res.json()
        assert tech_turn["sessionId"] == tech_session_id
        assert tech_turn["mode"] == "technical"

        # Verify Technical Rubric Evaluation Fields
        eval_tech = tech_turn["evaluation"]
        print(f"  [Tech Turn 1 Eval] Score: {eval_tech.get('score')}%")
        print(f"    - Correctness: {eval_tech.get('correctness')}%")
        print(f"    - Technical Depth: {eval_tech.get('technicalDepth')}%")
        print(f"    - Explanation: {eval_tech.get('explanation')}%")
        print(f"    - Problem-Solving: {eval_tech.get('problemSolving')}%")
        print(f"    - Missing Concepts: {eval_tech.get('missingConcepts')}")
        print(f"    - Improvement Suggestions: {eval_tech.get('improvementSuggestions')}")

        for field in ["correctness", "technicalDepth", "explanation", "problemSolving", "missingConcepts", "improvementSuggestions"]:
            assert field in eval_tech, f"Missing Technical evaluation field: {field}"
        assert isinstance(eval_tech["missingConcepts"], list)
        assert isinstance(eval_tech["improvementSuggestions"], list)

        # ----------------------------------------------------------------------
        # TEST 3: POST /api/ai/interview/finish
        # ----------------------------------------------------------------------
        print("\n--- [TEST 3] Conclude Technical Interview via POST /finish ---")
        finish_res = await client.post("/api/ai/interview/finish", json={
            "sessionId": tech_session_id,
            "student_id": student_id
        })
        assert finish_res.status_code == 200, finish_res.text
        finish_data = finish_res.json()
        assert finish_data["sessionId"] == tech_session_id
        assert finish_data["status"] == "completed"
        assert finish_data["overallScore"] >= 60
        assert "rubricScores" in finish_data
        assert "hiringRecommendation" in finish_data
        print(f"  [Finished] Overall: {finish_data['overallScore']}% | Recommendation: {finish_data['hiringRecommendation']}")

        # ----------------------------------------------------------------------
        # TEST 4: GET /api/ai/interview/history/{student_id}
        # ----------------------------------------------------------------------
        print("\n--- [TEST 4] Retrieve Past Interviews from MongoDB ---")
        hist_res = await client.get(f"/api/ai/interview/history/{student_id}")
        assert hist_res.status_code == 200, hist_res.text
        hist_data = hist_res.json()
        assert hist_data["student_id"] == student_id
        assert hist_data["total_sessions"] >= 2
        print(f"  Total sessions retrieved: {hist_data['total_sessions']}")

        # Verify both HR and Tech sessions exist in persistent history
        session_ids = [s["session_id"] for s in hist_data["sessions"]]
        assert hr_session_id in session_ids, f"HR session {hr_session_id} not in history"
        assert tech_session_id in session_ids, f"Tech session {tech_session_id} not in history"
        print(f"  Verified sessions {hr_session_id} and {tech_session_id} stored in MongoDB.")

        # Check student document interviewHistory in DB
        profile_after = await student_memory.read_student_profile(student_id)
        assert profile_after is not None
        iv_hist = profile_after.get("interviewHistory", [])
        assert len(iv_hist) >= 2, f"Expected >= 2 items in student.interviewHistory, got {len(iv_hist)}"
        print(f"  Verified student.interviewHistory updated in student profile.")

    await close_mongo_connection()
    print("\n======================================================================")
    print("ALL INTERVIEW MENTOR AGENT TESTS PASSED SUCCESSFULLY!")
    print("======================================================================")


if __name__ == "__main__":
    asyncio.run(run_interview_mentor_tests())
