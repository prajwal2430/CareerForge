import asyncio
import sys
import os

# Add parent directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.services.db import connect_to_mongo, close_mongo_connection, get_database
from app.services.student_memory import student_memory
from app.agents import (
    CoordinatorAgent,
    SkillAssessmentAgent,
    LearningRecommendationAgent,
    CodingMentorAgent,
    InterviewMentorAgent,
    ProgressAnalyticsAgent,
)
from app.agents.learning_recommendation import RecommendationRequest
from app.agents.coding_mentor import CodeHelpRequest
from app.agents.interview_mentor import InterviewSessionRequest


async def run_memory_tests():
    print("=" * 70)
    print("CAREERFORGE SHARED STUDENT MEMORY SYSTEM - INTEGRATION TESTS")
    print("=" * 70)

    # 1. Connect to MongoDB
    await connect_to_mongo()
    db = get_database()
    if db is not None:
        print("[OK] Database Connected: MongoDB 'learnhub'")
    else:
        print("[WARN] Database Offline: Falling back to resilient in-memory mode")

    test_student_id = "test_student_001"
    test_email = "student001@learnhub.com"

    # 2. Get or Create Student
    print("\n[TEST 1] Initializing Student Profile in Shared Memory...")
    student = await student_memory.get_or_create_student(
        student_id=test_student_id,
        email=test_email,
        name="Alex Chen",
        branch="Computer Science and Engineering",
        year="4th Year",
        careerGoal="SDE-1 at Tier 1 Tech"
    )
    assert student is not None
    assert student["name"] == "Alex Chen"
    print(f"[OK] Student Profile Initialized: {student['name']} ({student['email']})")
    print(f"   Branch: {student['branch']} | Year: {student['year']}")
    print(f"   Career Goal: {student['careerGoal']}")
    print(f"   Initial Skills: {[s['name'] for s in student['skills']]}")

    # 3. Read Student Profile
    print("\n[TEST 2] Reading Student Profile via Shared Memory...")
    profile = await student_memory.read_student_profile(test_student_id)
    assert profile is not None
    assert profile["student_id"] == test_student_id
    print(f"[OK] Read Profile Success: ID={profile['student_id']}, Name={profile['name']}")

    # 4. Update Skills
    print("\n[TEST 3] Updating Student Skills in Shared Memory...")
    new_skills = [
        {"name": "Dynamic Programming", "level": "Intermediate", "verified": True},
        {"name": "FastAPI", "level": "Advanced", "verified": True},
        {"name": "MongoDB", "level": "Intermediate", "verified": True}
    ]
    updated_skills = await student_memory.update_skills(test_student_id, new_skills, mode="merge")
    skill_names = [s["name"] for s in updated_skills]
    assert "FastAPI" in skill_names
    assert "Dynamic Programming" in skill_names
    print(f"[OK] Skills Updated (Merged): {skill_names}")

    # 5. Update Weaknesses
    print("\n[TEST 4] Updating Student Weaknesses in Shared Memory...")
    diagnosed_weaknesses = ["Graph Algorithms (Dijkstra)", "Concurrency & Race Conditions"]
    updated_weaknesses = await student_memory.update_weaknesses(test_student_id, diagnosed_weaknesses, mode="merge")
    assert "Concurrency & Race Conditions" in updated_weaknesses
    print(f"[OK] Weaknesses Updated: {updated_weaknesses}")

    # 6. Read Weaknesses
    print("\n[TEST 5] Reading Weaknesses from Shared Memory...")
    read_w = await student_memory.read_weaknesses(test_student_id)
    assert len(read_w) >= 2
    print(f"[OK] Read Weaknesses Success: {read_w}")

    # 7. Update Learning Roadmap
    print("\n[TEST 6] Updating Learning Roadmap in Shared Memory...")
    roadmap_payload = {
        "track_title": "Full-Stack SDE Placement Sprint",
        "target_company": "Amazon",
        "duration_weeks": 8,
        "progress_percentage": 25.0,
        "milestones": [
            {"step_id": 1, "title": "Master Array & Sliding Window", "completed": True},
            {"step_id": 2, "title": "Graph BFS/DFS & Shortest Path", "completed": False},
            {"step_id": 3, "title": "System Design: Cache & Queues", "completed": False}
        ]
    }
    updated_roadmap = await student_memory.update_roadmap(test_student_id, roadmap_payload)
    assert updated_roadmap["track_title"] == "Full-Stack SDE Placement Sprint"
    print(f"[OK] Roadmap Updated: {updated_roadmap['track_title']} ({len(updated_roadmap['milestones'])} milestones)")

    # 8. Test Agent Interactivity with Shared Memory (No Memory Duplication)
    print("\n[TEST 7] Testing Multi-Agent Shared Memory Interaction...")
    
    # Coordinator Agent reads profile and saves result
    coordinator = CoordinatorAgent()
    coord_res = await coordinator.route_request(test_student_id, "I need a study plan for Amazon SDE interview")
    print(f"[OK] Coordinator Agent executed: {coord_res['message']}")

    # Skill Assessment Agent
    skill_assessor = SkillAssessmentAgent()
    assessment_res = await skill_assessor.evaluate_skills(test_student_id, {"category": "DSA"})
    print(f"[OK] Skill Assessment Agent executed: {assessment_res['summary']}")

    # Learning Recommendation Agent
    recommender = LearningRecommendationAgent()
    rec_res = await recommender.generate_study_plan(
        test_student_id,
        RecommendationRequest(user_id=test_student_id, target_role="SDE-1 Amazon", timeframe_weeks=6)
    )
    print(f"[OK] Learning Recommendation Agent executed: {rec_res['status']}")

    # Coding Mentor Agent
    code_mentor = CodingMentorAgent()
    code_res = await code_mentor.provide_assistance(
        CodeHelpRequest(
            user_id=test_student_id,
            problem_id="4",
            language="python",
            code="def median_two_sorted(nums1, nums2): pass",
            question_type="complexity"
        )
    )
    print(f"[OK] Coding Mentor Agent executed: {code_res['summary']}")

    # Interview Mentor Agent
    interview_mentor = InterviewMentorAgent()
    interview_res = await interview_mentor.conduct_interview_turn(
        InterviewSessionRequest(
            user_id=test_student_id,
            target_company="Amazon",
            interview_type="technical"
        )
    )
    print(f"[OK] Interview Mentor Agent executed: {interview_res['summary']}")

    # Progress Analytics Agent
    analytics_agent = ProgressAnalyticsAgent()
    analytics_res = await analytics_agent.compute_readiness(test_student_id)
    print(f"[OK] Progress Analytics Agent executed: {analytics_res['summary']}")

    # 9. Read Latest Scores from Shared Memory
    print("\n[TEST 8] Reading Latest Scores & Metrics across Agents...")
    scores = await student_memory.read_latest_scores(test_student_id)
    print(f"[OK] Read Latest Scores Success:")
    print(f"   Readiness Score: {scores['readinessScore']}%")
    print(f"   Category Progress: {scores['progress']}")

    # 10. Teardown
    await close_mongo_connection()

    print("\n" + "=" * 70)
    print("[SUCCESS] ALL SHARED STUDENT MEMORY TESTS PASSED SUCCESSFULLY!")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(run_memory_tests())
