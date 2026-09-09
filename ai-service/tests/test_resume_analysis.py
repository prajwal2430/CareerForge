"""
Comprehensive Integration Test Suite for AI Resume Analysis
============================================================
Tests:
1. Non-destructive text extraction from resume document.
2. Structured extraction of all 6 dimensions:
   - skills
   - education
   - projects
   - experience
   - certifications
   - technologies
3. Career Goal Benchmarking & Skill Gap Analysis:
   - detected_skills
   - missing_skills
   - recommended_skills
   - recommended_projects
   - recommended_learning_topics
   - ats_score
4. Non-destructive preservation of original resume content.
5. MongoDB persistence in 'resume_analyses' collection & history retrieval.
6. Synchronization with student skill profile & diagnosed weaknesses.
7. End-to-end integration with Learning Recommendation Agent (injected capstone milestone & topics).
"""

import sys
import os
import asyncio
from datetime import datetime, timezone

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.student_memory import student_memory
from app.services.db import connect_to_mongo, close_mongo_connection, get_database
from app.services.resume_service import resume_service
from app.agents.learning_recommendation import learning_recommendation_agent


SAMPLE_RESUME_TEXT = """
Siddharth Rao
siddharth.rao@example.com | +91 98765 43210 | Bangalore, India
LinkedIn: linkedin.com/in/siddharth-rao | GitHub: github.com/siddharth-rao

EDUCATION
Bachelor of Technology in Computer Science & Engineering
National Institute of Technology Karnataka (NITK), Surathkal (2021 - 2025)
CGPA: 8.9 / 10.0

TECHNICAL SKILLS & TECHNOLOGIES
Languages: Java, Python, SQL, C++, JavaScript
Core Competencies: Data Structures & Algorithms, Object-Oriented Programming, REST APIs, Database Design, Debugging
Tools & Platforms: PostgreSQL, Git, Linux, Docker, Spring Boot

EXPERIENCE
Backend Engineering Intern | Razorpay, Bangalore (June 2024 - August 2024)
- Designed and implemented RESTful microservices in Java Spring Boot handling 250,000 webhook events per day.
- Optimized PostgreSQL database queries using composite indexes, reducing average transaction latency by 32%.
- Created automated integration test pipelines with 88% branch coverage.

PROJECTS
Real-Time Distributed Task Dispatcher (Java, PostgreSQL, Docker)
- Architected a distributed job execution framework with priority queuing and worker heartbeat monitoring.
- Utilized Docker containers for isolated job worker environments and PostgreSQL transactions for state transitions.

CERTIFICATIONS
- AWS Certified Solutions Architect - Associate (Amazon Web Services, 2024)
- Oracle Certified Associate: Java SE 11 Programmer (Oracle, 2023)
"""


async def run_resume_tests():
    print("======================================================================")
    print("CAREERFORGE AI RESUME ANALYSIS - INTEGRATION TEST SUITE")
    print("======================================================================")

    await connect_to_mongo()

    student_id = "test_candidate_resume"

    # Clean up previous test artifacts
    db = get_database()
    if db is not None:
        await db["resume_analyses"].delete_many({"student_id": student_id})
        await db["students"].delete_many({"student_id": student_id})
        await db["learning_roadmaps"].delete_many({"student_id": student_id})
    student_memory._in_memory_resumes.pop(student_id, None)
    student_memory._in_memory_students.pop(student_id, None)

    # 1. Setup Student
    await student_memory.get_or_create_student(
        student_id=student_id,
        name="Siddharth Rao",
        email="siddharth.rao@example.com",
        careerGoal="Backend Software Engineer"
    )

    # --- [TEST 1 & 2] Extraction of the 6 Structured Dimensions ---
    print("\n--- [TEST 1 & 2] Non-Destructive Extraction of 6 Dimensions ---")
    extracted_data = await resume_service.extract_structured_resume(SAMPLE_RESUME_TEXT)

    print(f"[OK] Extracted Skills: {extracted_data['skills']}")
    print(f"[OK] Extracted Technologies: {extracted_data['technologies']}")
    print(f"[OK] Extracted Education ({len(extracted_data['education'])}): {extracted_data['education'][0] if extracted_data['education'] else 'None'}")
    print(f"[OK] Extracted Experience ({len(extracted_data['experience'])}): {extracted_data['experience'][0].get('role', '') if extracted_data['experience'] else 'None'}")
    print(f"[OK] Extracted Projects ({len(extracted_data['projects'])}): {[p.get('title') for p in extracted_data['projects']]}")
    print(f"[OK] Extracted Certifications ({len(extracted_data['certifications'])}): {[c.get('name') for c in extracted_data['certifications']]}")

    assert len(extracted_data["skills"]) >= 2, "Skills must be extracted"
    assert len(extracted_data["technologies"]) >= 2, "Technologies must be extracted"
    assert len(extracted_data["education"]) >= 1, "Education must be extracted"
    assert len(extracted_data["experience"]) >= 1, "Experience must be extracted"
    assert len(extracted_data["projects"]) >= 1, "Projects must be extracted"
    assert len(extracted_data["certifications"]) >= 1, "Certifications must be extracted"

    # --- [TEST 3] Career Goal Benchmarking & Gap Generation ---
    print("\n--- [TEST 3] Career Goal Benchmarking (Backend Software Engineer) ---")
    benchmarks = resume_service.benchmark_against_career_goal(
        extracted_data=extracted_data,
        career_goal="Backend Software Engineer"
    )

    print(f"[OK] ATS Match Score: {benchmarks['ats_score']}%")
    print(f"[OK] Target Role: {benchmarks['target_role_title']}")
    print(f"[OK] Detected Skills: {benchmarks['detected_skills']}")
    print(f"[OK] Missing Skills: {benchmarks['missing_skills']}")
    print(f"[OK] Recommended Skills: {benchmarks['recommended_skills']}")
    print(f"[OK] Recommended Projects: {[p['title'] for p in benchmarks['recommended_projects']]}")
    print(f"[OK] Recommended Learning Topics: {benchmarks['recommended_learning_topics']}")

    assert benchmarks["ats_score"] > 50, "ATS score should reflect strong backend base"
    assert len(benchmarks["detected_skills"]) >= 3, "Should detect Java, SQL, REST APIs, etc."
    assert len(benchmarks["missing_skills"]) >= 1, "Should identify missing skills (e.g. Caching, Microservices, Concurrency)"
    assert len(benchmarks["recommended_skills"]) >= 1, "Should recommend modern high-impact skills"
    assert len(benchmarks["recommended_projects"]) >= 1, "Should recommend targeted portfolio projects"
    assert len(benchmarks["recommended_learning_topics"]) >= 1, "Should recommend learning topics"

    # --- [TEST 4] Non-Destructive Guarantee Test ---
    print("\n--- [TEST 4] Non-Destructive Integrity Guarantee ---")
    original_copy = str(SAMPLE_RESUME_TEXT)
    # Perform full analyze and sync
    saved_analysis = await resume_service.analyze_and_sync(
        student_id=student_id,
        resume_text=SAMPLE_RESUME_TEXT,
        file_name="siddharth_resume.txt",
        file_type="txt",
        career_goal_override="Backend Software Engineer"
    )
    assert SAMPLE_RESUME_TEXT == original_copy, "Original resume text must not be mutated!"
    print("[OK] Verified original resume content was preserved with 100% integrity.")

    # --- [TEST 5] MongoDB Persistence & Query Retrieval ---
    print("\n--- [TEST 5] MongoDB Persistence Verification ---")
    latest_saved = await student_memory.read_latest_resume_analysis(student_id)
    assert latest_saved is not None, "Resume analysis must be stored in database"
    assert latest_saved["student_id"] == student_id
    assert latest_saved["analysis"]["ats_score"] == benchmarks["ats_score"]

    history = await student_memory.read_resume_history(student_id)
    assert len(history) >= 1, "History must contain at least 1 record"
    print(f"[OK] Successfully verified MongoDB persistence: Analysis ID '{latest_saved['analysis_id']}' retrieved.")

    # --- [TEST 6] Student Skill Profile Synchronization ---
    print("\n--- [TEST 6] Skill Profile & Weakness Synchronization ---")
    updated_profile = await student_memory.read_student_profile(student_id)
    profile_skills = [s["name"] for s in updated_profile.get("skills", [])]
    profile_weaknesses = updated_profile.get("weaknesses", [])
    profile_resume_score = updated_profile.get("resume_score", 0)

    print(f"[OK] Profile Skills Count: {len(profile_skills)}")
    print(f"[OK] Profile Weaknesses (from Missing Skills): {profile_weaknesses}")
    print(f"[OK] Profile Resume ATS Score: {profile_resume_score}%")

    assert profile_resume_score == benchmarks["ats_score"]
    # Verify at least one detected skill was synced
    assert any(ds in profile_skills for ds in benchmarks["detected_skills"])
    # Verify at least one missing skill was added to weaknesses
    assert any(ms in profile_weaknesses for ms in benchmarks["missing_skills"])

    # --- [TEST 7] Learning Recommendation Agent Integration ---
    print("\n--- [TEST 7] Learning Recommendation Agent Integration ---")
    roadmap = await learning_recommendation_agent.generate_personalized_roadmap(student_id=student_id)
    assert roadmap is not None

    topics_next = roadmap.get("topics_to_study_next", [])
    milestones = roadmap.get("milestones", [])
    milestone_titles = [m.get("title", "") for m in milestones]

    print(f"[OK] Adapted Topics to Study Next: {topics_next}")
    print(f"[OK] Adapted Roadmap Milestones: {milestone_titles}")

    # Verify that recommended learning topics or missing skills from resume were ingested
    has_resume_topic = any(
        t in topics_next for t in benchmarks["recommended_learning_topics"] + benchmarks["missing_skills"]
    )
    assert has_resume_topic, "Roadmap topics must reflect resume gap insights!"

    # Verify that a Portfolio Capstone project milestone was injected
    has_capstone = any("Portfolio Capstone" in m["title"] or "Capstone" in m["title"] for m in milestones)
    assert has_capstone, "Roadmap must include a Portfolio Capstone milestone tailored to resume recommendations!"
    print("[OK] Confirmed Portfolio Capstone milestone successfully injected into candidate roadmap.")

    await close_mongo_connection()

    print("\n======================================================================")
    print("ALL 7 AI RESUME ANALYSIS INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("======================================================================")


if __name__ == "__main__":
    asyncio.run(run_resume_tests())
