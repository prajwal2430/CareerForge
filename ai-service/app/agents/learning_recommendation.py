"""
CareerForge AI Service - Learning Recommendation Agent
======================================================
Role: Adaptive Curriculum Designer and Placement Strategist.

Key Capabilities:
1. Reads from Shared Student Memory:
   - Student profile (branch, year, career goal)
   - Verified skills & competency levels
   - Diagnosed weak areas & confirmed strengths
   - Assessment history & score trends
   - Completed lessons & learning history
2. Generates Comprehensive Personalized Plan:
   - Personalized learning roadmap (milestones & duration)
   - Topics to study next (prioritized gap filling)
   - Daily practice plan (adaptive time allocations)
   - Coding practice (targeted algorithmic problems)
   - Aptitude practice (adaptive frequency: reduced if strong, daily if weak)
   - SQL practice (adaptive difficulty: escalated if improving, foundational if weak)
   - Java practice (targeted challenges on weak Java concepts)
   - Learning resources (curated modules & documentation)
   - Spaced revision recommendations
3. Dynamic Adaptation:
   - Recalculates and shifts milestones when new assessment scores arrive.
   - Stores roadmap directly in MongoDB (`learning_roadmaps` and `students.roadmap`).
"""

import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from app.services.student_memory import student_memory
from app.services.gemini_service import gemini_service
from app.utils.logger import logger
from app.services.db import get_database


# ==============================================================================
# Curated Learning Resources Map
# ==============================================================================

CURATED_RESOURCES_MAP: Dict[str, List[Dict[str, str]]] = {
    "Dynamic Programming": [
        {"title": "DP Patterns: 1D & 2D State Transitions", "type": "Interactive Guide", "url": "https://learnhub.internal/courses/dsa/dp-mastery"},
        {"title": "0/1 Knapsack & Subset Sum Blueprint", "type": "Video Lecture", "url": "https://learnhub.internal/courses/dsa/knapsack"}
    ],
    "Trees & Graphs": [
        {"title": "Graph Traversals: BFS, DFS & Shortest Path", "type": "Interactive Lab", "url": "https://learnhub.internal/courses/dsa/graph-traversals"},
        {"title": "Binary Tree Serialization & LCA Patterns", "type": "Practice Problems", "url": "https://learnhub.internal/practice?topic=Trees"}
    ],
    "Arrays & Hashing": [
        {"title": "Sliding Window & Two Pointer Masterclass", "type": "Interactive Course", "url": "https://learnhub.internal/courses/dsa/sliding-window"},
        {"title": "Hash Map Internals & Collision Resolution", "type": "Deep Dive Article", "url": "https://learnhub.internal/articles/hashmap-internals"}
    ],
    "Stacks & Queues": [
        {"title": "Monotonic Stack Patterns for O(N) Subarrays", "type": "Interactive Lab", "url": "https://learnhub.internal/courses/dsa/monotonic-stack"}
    ],
    "Joins & Subqueries": [
        {"title": "SQL Join Execution Plans: Nested Loop vs Hash Join", "type": "Interactive Lab", "url": "https://learnhub.internal/courses/sql/joins-deep-dive"}
    ],
    "Indexing & Optimization": [
        {"title": "B+ Tree Indexing & EXPLAIN ANALYZE Optimization", "type": "Video Series", "url": "https://learnhub.internal/courses/sql/indexing-tuning"}
    ],
    "Database Normalization": [
        {"title": "Relational Schema Normalization from 1NF to BCNF", "type": "Interactive Lab", "url": "https://learnhub.internal/courses/sql/normalization"}
    ],
    "Grouping & Aggregates": [
        {"title": "SQL Aggregations, GROUP BY, and HAVING Clauses", "type": "Practice Module", "url": "https://learnhub.internal/courses/sql/aggregates"}
    ],
    "Multithreading & Concurrency": [
        {"title": "Java Memory Model, Volatile & Atomic Variables", "type": "Hands-on Lab", "url": "https://learnhub.internal/courses/java/concurrency"}
    ],
    "JVM & Memory Management": [
        {"title": "JVM Heap Anatomy & Garbage Collection Profiling", "type": "Interactive Lab", "url": "https://learnhub.internal/courses/java/jvm-internals"}
    ],
    "Operating Systems": [
        {"title": "Deadlocks, Mutexes, and Process Synchronization", "type": "Textbook Summary", "url": "https://learnhub.internal/courses/cs-fundamentals/deadlocks"}
    ],
    "Quantitative Aptitude": [
        {"title": "Speed Math & Time-Speed-Distance Short Cuts", "type": "Speed Drill", "url": "https://learnhub.internal/courses/aptitude/speed-math"}
    ]
}

# ==============================================================================
# Prerequisite & Curricular Progression Maps (For Adaptive Learning Loop)
# ==============================================================================

PREREQUISITE_TOPIC_MAP: Dict[str, List[str]] = {
    "Dynamic Programming": ["Recursion & State Exploration", "Memoization & Subproblem Invariants"],
    "Trees & Graphs": ["Binary Tree Traversals (BFS/DFS)", "Graph Representation (Adj List/Matrix)"],
    "Arrays & Hashing": ["Two-Pointer Invariants", "Hash Table Collision Resolution"],
    "Stacks & Queues": ["Monotonic Stack Patterns", "Queue Operations & BFS Buffering"],
    "Joins & Subqueries": ["Relational Algebra & Set Theory", "Foreign Key Relationships & Filter Order"],
    "Indexing & Optimization": ["B+ Tree Mechanics", "Clustered vs Non-Clustered Indexes", "Query Execution Basics"],
    "Transactions & ACID": ["Concurrency Anomalies (Dirty Read/Non-Repeatable)", "Locking Levels & Isolation"],
    "Multithreading & Concurrency": ["Process vs Thread Memory Spaces", "Thread Lifecycle & Synchronization"],
    "JVM & Memory Management": ["Stack vs Heap Memory Model", "Garbage Collection Fundamentals"],
    "Quantitative Aptitude": ["Speed Calculation Formulas", "Fraction-Percentage Equivalence", "Ratio Foundations"],
    "Logical Reasoning": ["Deductive Logic & Venn Diagrams", "Pattern Recognition Foundations"],
    "System Design": ["Client-Server Architecture", "Load Balancing & Caching Fundamentals"]
}

SKILL_PROGRESSION_MAP: Dict[str, str] = {
    "Arrays & Hashing": "Stacks & Queues",
    "Stacks & Queues": "Trees & Graphs",
    "Trees & Graphs": "Dynamic Programming",
    "Dynamic Programming": "Advanced Graph Algorithms & Network Flow",
    "Advanced Graph Algorithms & Network Flow": "System Design & Distributed Systems",
    "Relational Data Foundations": "Advanced SQL Engineering & Window Functions",
    "Advanced SQL Engineering": "Distributed Databases & Sharding",
    "Core Java Fundamentals": "Multithreading & Concurrency",
    "Multithreading & Concurrency": "Reactive Systems & High-Throughput Architecture",
    "Quantitative Aptitude": "Advanced Data Interpretation & Logical Synthesis"
}


# ==============================================================================
# Learning Recommendation Agent
# ==============================================================================

class LearningRecommendationAgent:
    """
    Formulates personalized curriculums, daily task plans, and adaptive roadmap milestones.
    """

    def __init__(self, name: str = "Learning Strategist"):
        self.name = name
        self.role = "Adaptive Curriculum Designer"

    async def generate_personalized_roadmap(
        self,
        student_id: str,
        custom_goal: Optional[str] = None,
        target_company: Optional[str] = None,
        duration_weeks: int = 8
    ) -> Dict[str, Any]:
        """
        Reads student memory (profile, career goal, assessment history, weaknesses, strengths, progress)
        and constructs a fully personalized roadmap with customized daily practice plans.
        """
        # 1. Read Student Profile & History from Shared Memory
        profile = await student_memory.read_student_profile(student_id)
        if not profile:
            # Initialize default student if not found
            profile = await student_memory.get_or_create_student(
                student_id=student_id,
                email=f"{student_id}@careerforge.edu",
                name=student_id.capitalize()
            )

        student_name = profile.get("name", student_id)
        career_goal = custom_goal or profile.get("careerGoal", "Software Development Engineer (SDE-1)")
        skills = profile.get("skills", [])
        weaknesses = profile.get("weaknesses", [])
        strengths = profile.get("strengths", [])
        learning_history = await student_memory.read_learning_history(student_id)
        scores_data = await student_memory.read_latest_scores(student_id)
        latest_assessments = scores_data.get("latest_assessments", [])

        # 2. Extract Category-Level Diagnostics
        category_scores: Dict[str, float] = {}
        for asmt in latest_assessments:
            cat = asmt.get("category", "").lower()
            if cat and cat not in category_scores:
                category_scores[cat] = asmt.get("score", 0.0)

        # Also check skill levels in profile
        skill_dict = {s["name"].lower(): s for s in skills}

        # 3. Formulate Personalization Rules
        # Rule A: DSA Analysis
        dsa_weak_topics = [w for w in weaknesses if w in [
            "Dynamic Programming", "Trees & Graphs", "Arrays & Hashing", "Stacks & Queues", "Graph Algorithms (Dijkstra)"
        ]]
        is_dsa_weak = (
            len(dsa_weak_topics) > 0
            or category_scores.get("dsa", 100.0) < 70.0
            or (skill_dict.get("dsa", {}).get("level") == "Beginner")
        )

        # Rule B: Aptitude Analysis
        is_aptitude_strong = (
            category_scores.get("aptitude", 0.0) >= 75.0
            or any("aptitude" in s.lower() or "quant" in s.lower() for s in strengths)
            or (skill_dict.get("aptitude", {}).get("level") == "Advanced")
        )

        # Rule C: SQL Analysis
        sql_score = category_scores.get("sql", 50.0)
        is_sql_improving = (
            sql_score >= 60.0
            or skill_dict.get("sql", {}).get("level") in ("Intermediate", "Advanced")
            or any("sql" in s.lower() or "indexing" in s.lower() for s in strengths)
        )

        # Rule D: Java Analysis
        java_weaknesses = [w for w in weaknesses if w in [
            "Multithreading & Concurrency", "JVM & Memory Management", "Collections Framework", "OOP Principles"
        ]]

        # Check for latest structured resume analysis
        resume_doc = await student_memory.read_latest_resume_analysis(student_id)
        resume_missing_skills = []
        resume_recommended_topics = []
        resume_projects = []
        if resume_doc:
            analysis_data = resume_doc.get("analysis", {})
            resume_missing_skills = analysis_data.get("missing_skills", [])
            resume_recommended_topics = analysis_data.get("recommended_learning_topics", [])
            resume_projects = analysis_data.get("recommended_projects", [])

        # 4. Generate Core Components Deterministically
        # Topics to study next (ordered by urgency of weaknesses and resume gaps)
        topics_to_study_next = []
        for r_topic in resume_recommended_topics:
            if r_topic not in topics_to_study_next:
                topics_to_study_next.append(r_topic)
        for w in weaknesses + resume_missing_skills:
            if w not in topics_to_study_next:
                topics_to_study_next.append(w)
        if not topics_to_study_next:
            topics_to_study_next = ["Advanced System Design", "Microservices Architecture", "Graph Optimization"]

        # Daily Practice Plan (Adaptive Time Allocation)
        total_daily_hours = 2.5
        daily_schedule = []
        if is_dsa_weak:
            daily_schedule.append({
                "time_minutes": 75,
                "domain": "DSA (High Priority)",
                "action": f"Master {dsa_weak_topics[0] if dsa_weak_topics else 'Core Algorithms'}: 2 medium problems with full state transition diagrams."
            })
        else:
            daily_schedule.append({
                "time_minutes": 45,
                "domain": "DSA (Maintenance)",
                "action": "Solve 1 LeetCode Hard problem or optimize time complexity on known patterns."
            })

        if is_sql_improving:
            daily_schedule.append({
                "time_minutes": 35,
                "domain": "SQL (Advanced Escalation)",
                "action": "Write complex analytical queries using Window functions, CTEs, and index plan profiling."
            })
        else:
            daily_schedule.append({
                "time_minutes": 30,
                "domain": "SQL (Fundamentals)",
                "action": "Practice multi-table JOINs and GROUP BY aggregation filtering with HAVING."
            })

        if java_weaknesses:
            daily_schedule.append({
                "time_minutes": 30,
                "domain": "Java Practice",
                "action": f"Implement real-world code for {java_weaknesses[0]} (e.g. Thread safety / Memory layout)."
            })
        else:
            daily_schedule.append({
                "time_minutes": 25,
                "domain": "Java / Backend",
                "action": "Build robust modular components with Spring Boot or modern Java 21 Streams."
            })

        if is_aptitude_strong:
            daily_schedule.append({
                "time_minutes": 10,
                "domain": "Aptitude (Reduced Maintenance)",
                "action": "Quick speed-math drill or optional rest (candidate already passed benchmark)."
            })
        else:
            daily_schedule.append({
                "time_minutes": 30,
                "domain": "Aptitude (Daily Gap Filling)",
                "action": "15 aptitude problem sprints covering Speed-Distance, Logic, and Permutations."
            })

        # Coding Practice Plan
        coding_practice = {
            "focus_area": "Dynamic Programming & Graph Patterns" if is_dsa_weak else "Advanced Problem Solving",
            "target_weekly_problems": 16 if is_dsa_weak else 8,
            "difficulty_mix": {"easy": 2, "medium": 10, "hard": 4} if is_dsa_weak else {"easy": 0, "medium": 4, "hard": 4},
            "curated_challenges": [
                f"Solve 3 variants of {topics_to_study_next[0]}",
                "Implement Trie prefix lookup with DFS autocomplete",
                "Two-pointer palindrome substring verification"
            ]
        }

        # Aptitude Practice Plan
        if is_aptitude_strong:
            aptitude_practice = {
                "frequency": "Reduced Frequency (Bi-weekly or On-Demand)",
                "rationale": f"Candidate demonstrates strong aptitude competency ({category_scores.get('aptitude', 80.0):.0f}% score). Reallocating daily study hours to technical prep.",
                "weekly_drills": 1,
                "recommended_focus": ["High-speed mental math verification", "Data sufficiency checks"]
            }
        else:
            aptitude_practice = {
                "frequency": "Daily Sprint (30 minutes)",
                "rationale": "Aptitude diagnostic score requires targeted improvement to clear company online assessment cutoffs.",
                "weekly_drills": 5,
                "recommended_focus": ["Time, Speed & Distance", "Logical Deduction & Syllogisms", "Probability Formulations"]
            }

        # SQL Practice Plan
        if is_sql_improving:
            sql_practice = {
                "difficulty": "Hard (Escalated based on proven competency)",
                "rationale": f"Recent SQL score is strong ({sql_score:.0f}%). Escalating challenge level to match Tier-1 engineering interview standards.",
                "practice_topics": [
                    "Window Functions (DENSE_RANK, LAG, LEAD, Running Totals)",
                    "Query Execution Plan Analysis & Covering Index Tuning",
                    "ACID Isolation Anomalies (Dirty Read, Phantom Read, Serializable)"
                ]
            }
        else:
            sql_practice = {
                "difficulty": "Medium (Foundation & Joins)",
                "rationale": "Strengthen query basics and join conditions before moving to advanced database internals.",
                "practice_topics": [
                    "INNER vs LEFT vs FULL OUTER JOIN with NULL handling",
                    "GROUP BY and HAVING vs WHERE clauses",
                    "Database Normalization up to 3NF"
                ]
            }

        # Java Practice Plan
        java_practice = {
            "focus_areas": java_weaknesses if java_weaknesses else ["Collections Framework", "Modern Concurrency", "JVM Memory Model"],
            "code_challenge": (
                f"Implement a production-grade component demonstrating {java_weaknesses[0]}."
                if java_weaknesses
                else "Build a thread-safe LRU Cache with O(1) eviction using Java Collections and ReentrantLock."
            ),
            "interview_target": "Amazon / Tier-1 Core Java technical bar"
        }

        # Learning Resources
        learning_resources = []
        for topic in topics_to_study_next[:4]:
            recs = CURATED_RESOURCES_MAP.get(topic, [
                {"title": f"Complete Guide to {topic}", "type": "Course", "url": f"https://learnhub.internal/courses?search={topic}"}
            ])
            learning_resources.extend(recs)

        # Revision Recommendations (Spaced Repetition)
        revision_recommendations = []
        for s in strengths[:3]:
            revision_recommendations.append({
                "topic": s,
                "next_review_days": 7,
                "rationale": "Spaced repetition retention check to maintain interview readiness."
            })
        for w in topics_to_study_next[:2]:
            revision_recommendations.append({
                "topic": w,
                "next_review_days": 2,
                "rationale": "Immediate reinforcement cycle for diagnosed gap area."
            })

        # Structured Milestones
        milestones = self._build_milestones(
            career_goal=career_goal,
            weaknesses=weaknesses,
            is_dsa_weak=is_dsa_weak,
            is_sql_improving=is_sql_improving,
            duration_weeks=duration_weeks,
            resume_projects=resume_projects
        )

        # 5. Gemini Augmentation for Personalized Narrative
        custom_insights = await self._generate_gemini_insights(
            student_name=student_name,
            career_goal=career_goal,
            is_dsa_weak=is_dsa_weak,
            is_aptitude_strong=is_aptitude_strong,
            is_sql_improving=is_sql_improving,
            weaknesses=weaknesses,
            strengths=strengths
        )

        # 6. Assemble Full Roadmap Record
        roadmap_id = f"rdmp_{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc)

        roadmap_document = {
            "roadmap_id": roadmap_id,
            "roadmapId": roadmap_id,
            "student_id": student_id,
            "track_title": f"{career_goal} Accelerator (Personalized for {student_name})",
            "career_goal": career_goal,
            "target_company": target_company,
            "duration_weeks": duration_weeks,
            "progress_percentage": 0.0,
            "personalization_summary": {
                "primary_focus": "Intensive DSA Remediation" if is_dsa_weak else "Full-Stack System Fluency",
                "dsa_strategy": "Prioritizing weak algorithmic patterns (75 min/day)" if is_dsa_weak else "Maintenance & Hard Optimization (45 min/day)",
                "aptitude_strategy": "Reduced frequency (maintenance only, candidate is strong)" if is_aptitude_strong else "Daily 30-min drill to clear screening cutoffs",
                "sql_strategy": "Escalated to Hard (Window Functions & Indexing)" if is_sql_improving else "Foundational Query Mastery",
                "java_strategy": f"Targeting {', '.join(java_weaknesses)}" if java_weaknesses else "Concurrency & Architectural Patterns"
            },
            "topics_to_study_next": topics_to_study_next,
            "daily_practice_plan": {
                "target_hours_per_day": total_daily_hours,
                "schedule": daily_schedule
            },
            "coding_practice": coding_practice,
            "aptitude_practice": aptitude_practice,
            "sql_practice": sql_practice,
            "java_practice": java_practice,
            "learning_resources": learning_resources,
            "revision_recommendations": revision_recommendations,
            "milestones": milestones,
            "mentor_insights": custom_insights,
            "created_at": now,
            "updated_at": now
        }

        # 7. Persist to MongoDB
        db = get_database()
        if db is not None:
            await db["learning_roadmaps"].update_one(
                {"student_id": student_id},
                {"$set": roadmap_document},
                upsert=True
            )

        # Update in shared student memory
        await student_memory.update_roadmap(student_id, roadmap_document)

        # Save agent execution result
        await student_memory.save_agent_result(
            identifier=student_id,
            agent_name=self.name,
            task_name="generate_learning_roadmap",
            result_data={
                "roadmapId": roadmap_id,
                "track_title": roadmap_document["track_title"],
                "milestone_count": len(milestones),
                "is_dsa_weak": is_dsa_weak,
                "is_aptitude_strong": is_aptitude_strong,
                "is_sql_improving": is_sql_improving
            }
        )

        logger.info(f"Generated personalized roadmap '{roadmap_id}' for student '{student_id}'.")
        return roadmap_document

    # --------------------------------------------------------------------------
    # Helper: Build Adaptive Milestones
    # --------------------------------------------------------------------------
    @staticmethod
    def _build_milestones(
        career_goal: str,
        weaknesses: List[str],
        is_dsa_weak: bool,
        is_sql_improving: bool,
        duration_weeks: int,
        resume_projects: Optional[List[Dict[str, Any]]] = None
    ) -> List[Dict[str, Any]]:
        """
        Builds personalized roadmap milestones based on diagnosed weaknesses, strengths, and resume gaps.
        """
        milestones = []
        step_id = 1

        # Phase 1: Immediate Gap Remediation
        if is_dsa_weak:
            milestones.append({
                "step_id": step_id,
                "title": f"Intensive Remediation: {weaknesses[0] if weaknesses else 'Dynamic Programming'}",
                "category": "DSA",
                "completed": False,
                "resources": ["DP State Transitions Guide", "20 Curated LeetCode Patterns"]
            })
            step_id += 1

        if len(weaknesses) > 1:
            milestones.append({
                "step_id": step_id,
                "title": f"Mastery Sprint: {weaknesses[1]}",
                "category": "Technical",
                "completed": False,
                "resources": [f"Deep Dive on {weaknesses[1]}", "Hands-on implementation lab"]
            })
            step_id += 1

        # Phase 2: Escalated Database / Backend Engineering
        if is_sql_improving:
            milestones.append({
                "step_id": step_id,
                "title": "Advanced SQL Engineering & Query Optimization",
                "category": "SQL",
                "completed": False,
                "resources": ["Window Functions Lab", "EXPLAIN Index Profiling Masterclass"]
            })
            step_id += 1
        else:
            milestones.append({
                "step_id": step_id,
                "title": "Relational Data Foundations & Join Masterclass",
                "category": "SQL",
                "completed": False,
                "resources": ["Multi-table JOINs", "Normalization 1NF-3NF"]
            })
            step_id += 1

        # Phase 3: Resume Gap Capstone Project (if recommended)
        if resume_projects:
            proj = resume_projects[0]
            milestones.append({
                "step_id": step_id,
                "title": f"Portfolio Capstone: {proj.get('title', 'Target Role Capstone')}",
                "category": "Project",
                "completed": False,
                "resources": [
                    f"Tech Stack: {', '.join(proj.get('technologies', []))}",
                    proj.get('description', 'Build capstone project bridging resume skill gaps.')
                ]
            })
            step_id += 1

        # Phase 4: High-Level System Architecture
        milestones.append({
            "step_id": step_id,
            "title": f"{career_goal} System Design & End-to-End Scalability",
            "category": "System Design",
            "completed": False,
            "resources": ["CAP Theorem & Caching Patterns", "Microservices Design Walkthrough"]
        })
        step_id += 1

        # Phase 5: Placement Mock Simulation
        milestones.append({
            "step_id": step_id,
            "title": "Comprehensive Mock Interview & Placement Readiness Review",
            "category": "Interview Prep",
            "completed": False,
            "resources": ["Full 60-min Technical Mock Session", "Resume ATS Calibration"]
        })

        return milestones

    # --------------------------------------------------------------------------
    # Adaptive Roadmap In-Place Updater (Adaptive Learning Loop)
    # --------------------------------------------------------------------------
    async def adapt_existing_roadmap(
        self,
        student_id: str,
        skill_shifts: Dict[str, Any],
        trigger: str = "performance_update"
    ) -> Dict[str, Any]:
        """
        Adaptively updates an existing roadmap without blind regeneration:
        - Retains persistent roadmap_id, track_title, created_at.
        - Preserves completed milestones.
        - Applies the 5 core adaptation rules:
          1. Skill Improves: reduce repetitive beginner content, increase difficulty.
          2. Skill Remains Weak: recommend additional practice, recommend prerequisite topics.
          3. Skill Becomes Strong: move to next sequential topic, set to maintenance.
          4. Interview Performance Weak: increase interview practice (daily plan + milestone).
          5. Coding Performance Weak: increase coding practice (higher target, 75-90m/day, debugging).
        - Increments revision and logs to adaptation_history.
        - Persists to MongoDB and updates student memory.
        """
        # 1. Fetch active roadmap
        existing_roadmap = await student_memory.read_roadmap(student_id)
        if not existing_roadmap:
            logger.info(f"No existing roadmap for student '{student_id}'. Generating initial personalized roadmap.")
            return await self.generate_personalized_roadmap(student_id=student_id)

        # 2. Extract immutable identifiers & state
        roadmap_id = existing_roadmap.get("roadmap_id") or existing_roadmap.get("_id") or f"rdmp_{uuid.uuid4().hex[:12]}"
        track_title = existing_roadmap.get("track_title", "Personalized Placement Roadmap")
        created_at = existing_roadmap.get("created_at") or datetime.now(timezone.utc)
        current_revision = existing_roadmap.get("revision", 1)
        new_revision = current_revision + 1
        adaptation_history = list(existing_roadmap.get("adaptation_history", []))

        # Extract milestones: preserve completed ones!
        milestones = list(existing_roadmap.get("milestones", []))
        completed_milestones = [m for m in milestones if m.get("completed")]
        pending_milestones = [m for m in milestones if not m.get("completed")]

        # Extract current sub-plans or fall back to defaults
        daily_practice_plan = dict(existing_roadmap.get("daily_practice_plan", {}))
        schedule = list(daily_practice_plan.get("schedule", []))
        coding_practice = dict(existing_roadmap.get("coding_practice", {}))
        aptitude_practice = dict(existing_roadmap.get("aptitude_practice", {}))
        sql_practice = dict(existing_roadmap.get("sql_practice", {}))
        java_practice = dict(existing_roadmap.get("java_practice", {}))
        interview_practice = dict(existing_roadmap.get("interview_practice", {}))
        topics_to_study_next = list(existing_roadmap.get("topics_to_study_next", []))
        personalization_summary = dict(existing_roadmap.get("personalization_summary", {}))

        # Read skill shift signals
        improved_skills = [s.strip().title() for s in skill_shifts.get("improved_skills", [])]
        remains_weak = [w.strip() for w in skill_shifts.get("remains_weak", [])]
        became_strong = [s.strip() for s in skill_shifts.get("became_strong", [])]
        is_interview_weak = bool(skill_shifts.get("is_interview_weak", False))
        is_coding_weak = bool(skill_shifts.get("is_coding_weak", False))

        rules_applied: List[str] = []

        # ======================================================================
        # Rule 1: If a skill improves -> Reduce beginner content, increase difficulty
        # ======================================================================
        if improved_skills:
            # Upgrade coding difficulty mix
            coding_practice["difficulty_mix"] = {"easy": 1, "medium": 8, "hard": 5}
            coding_practice["focus_area"] = "Optimization, Edge Cases & Hard Patterns"
            
            # Remove repetitive beginner wording from pending milestones
            for pm in pending_milestones:
                title = pm.get("title", "")
                if any(imp.lower() in title.lower() for imp in improved_skills):
                    if "basics" in title.lower() or "foundations" in title.lower():
                        pm["title"] = title.replace("Basics of", "Advanced").replace("Foundations", "Engineering & Optimization")
                        pm["resources"] = [r for r in pm.get("resources", []) if "beginner" not in r.lower() and "intro" not in r.lower()]
                        pm["resources"].append("Advanced Engineering & Profiling Masterclass")

            # Check if SQL improved
            if any("sql" in s.lower() for s in improved_skills):
                sql_practice["difficulty"] = "Hard (Escalated based on proven competency)"
                sql_practice["rationale"] = "Recent measurable SQL improvement. Upgraded query challenges to Advanced Window Functions, CTEs, and Index profiling."
                sql_practice["practice_topics"] = [
                    "Window Functions (DENSE_RANK, LAG, LEAD, Running Totals)",
                    "Query Execution Plan Analysis & Covering Index Tuning",
                    "ACID Isolation Anomalies & Serializable Transactions"
                ]

            # Check if Java improved
            if any("java" in s.lower() for s in improved_skills):
                java_practice["code_challenge"] = "Build a high-throughput concurrent pipeline using Java modern Virtual Threads, Locks, and Stream collectors."
                personalization_summary["java_strategy"] = "Concurrency, JVM Tuning & Scalable Architecture"

            personalization_summary["difficulty_escalation"] = f"Difficulty escalated to Hard for improved competencies: {', '.join(improved_skills)}"
            rules_applied.append(f"Skill improved ({', '.join(improved_skills)}): reduced repetitive beginner content and escalated difficulty to Hard.")

        # ======================================================================
        # Rule 2: If a skill remains weak -> Recommend additional practice, recommend prerequisite topics
        # ======================================================================
        if remains_weak:
            prerequisites_to_inject = []
            for weak in remains_weak:
                matching_prereqs = PREREQUISITE_TOPIC_MAP.get(weak)
                if not matching_prereqs:
                    for k, prereqs in PREREQUISITE_TOPIC_MAP.items():
                        if k.lower() in weak.lower() or weak.lower() in k.lower():
                            matching_prereqs = prereqs
                            break
                if matching_prereqs:
                    for p in matching_prereqs:
                        if p not in prerequisites_to_inject and p not in topics_to_study_next:
                            prerequisites_to_inject.append(p)

            # Prepend prerequisite topics to topics_to_study_next
            if prerequisites_to_inject:
                topics_to_study_next = prerequisites_to_inject + [t for t in topics_to_study_next if t not in prerequisites_to_inject]

            # Additional practice allocation in daily schedule
            has_weak_schedule = False
            for entry in schedule:
                if any(w.lower() in entry.get("domain", "").lower() for w in remains_weak):
                    entry["time_minutes"] = max(entry.get("time_minutes", 30), 60)
                    entry["domain"] = f"{entry['domain']} (Remediation Priority)"
                    entry["action"] = f"Intensive gap-filling sprint on {remains_weak[0]}: prerequisite concept review and 3 targeted drills."
                    has_weak_schedule = True

            if not has_weak_schedule:
                schedule.insert(0, {
                    "time_minutes": 45,
                    "domain": f"{remains_weak[0]} (Remediation Priority)",
                    "action": f"Master foundational prerequisites ({prerequisites_to_inject[0] if prerequisites_to_inject else 'Core Principles'}) with structured exercises."
                })

            # If DSA remains weak and did not improve, increase weekly coding targets and focus
            weak_dsa_topic = next((w for w in remains_weak if any(k in w.lower() for k in ("dsa", "dynamic", "tree", "graph", "array", "hash", "stack", "algorithm"))), None)
            dsa_improved = any("dsa" in s.lower() or "dynamic" in s.lower() for s in improved_skills)
            if weak_dsa_topic and not dsa_improved:
                coding_practice["target_weekly_problems"] = max(coding_practice.get("target_weekly_problems", 8), 16)
                coding_practice["focus_area"] = f"Targeted Remediation on {weak_dsa_topic}"

            # Inject prerequisite milestone before pending advanced milestones
            if prerequisites_to_inject and not any("prerequisite" in m.get("title", "").lower() for m in pending_milestones):
                next_step_id = max([m.get("step_id", 0) for m in milestones] + [0]) + 1
                new_prereq_milestone = {
                    "step_id": next_step_id,
                    "title": f"Foundational Prerequisites: {prerequisites_to_inject[0]}",
                    "category": "Remediation",
                    "completed": False,
                    "resources": [f"Deep dive on {p}" for p in prerequisites_to_inject[:2]]
                }
                pending_milestones.insert(0, new_prereq_milestone)

            rules_applied.append(
                f"Skill remains weak ({', '.join(remains_weak)}): recommended additional practice and injected prerequisite topics: {', '.join(prerequisites_to_inject[:3])}."
            )

        # ======================================================================
        # Rule 3: If a skill becomes strong -> Move to the next topic, reduce frequency
        # ======================================================================
        if became_strong:
            next_topics_found = []
            for strong in became_strong:
                next_topic = SKILL_PROGRESSION_MAP.get(strong)
                if not next_topic:
                    for k, v in SKILL_PROGRESSION_MAP.items():
                        if k.lower() in strong.lower() or strong.lower() in k.lower():
                            next_topic = v
                            break
                if next_topic:
                    next_topics_found.append(next_topic)
                    if next_topic not in topics_to_study_next:
                        topics_to_study_next.append(next_topic)

            # Move past mastered topics in pending milestones
            for pm in pending_milestones:
                title = pm.get("title", "")
                if any(s.lower() in title.lower() for s in became_strong) and not pm.get("completed"):
                    if next_topics_found:
                        pm["title"] = f"Advanced Mastery: {next_topics_found[0]}"
                        pm["resources"] = [f"Hands-on Lab: {next_topics_found[0]}", "Tier-1 Interview Optimization"]

            # Reduce practice frequency for strong skills to maintenance
            for entry in schedule:
                if any(s.lower() in entry.get("domain", "").lower() for s in became_strong):
                    entry["time_minutes"] = 15
                    entry["domain"] = f"{entry['domain']} (Maintenance)"
                    entry["action"] = "Quick 15-minute maintenance drill (candidate is strong; time reallocated to gap filling)."

            if any("aptitude" in s.lower() for s in became_strong):
                aptitude_practice["frequency"] = "Reduced Maintenance (Bi-weekly)"
                aptitude_practice["weekly_drills"] = 1

            rules_applied.append(
                f"Skill became strong ({', '.join(became_strong)}): graduated topic, moved to next sequential progression ({', '.join(next_topics_found)}), and downgraded to maintenance frequency."
            )

        # ======================================================================
        # Rule 4: If interview performance is weak -> Increase interview practice
        # ======================================================================
        if is_interview_weak:
            has_interview = False
            for entry in schedule:
                if "interview" in entry.get("domain", "").lower():
                    entry["time_minutes"] = max(entry.get("time_minutes", 20), 30)
                    entry["domain"] = "Interview Prep (Daily Practice Sprint)"
                    entry["action"] = "30-min STAR method behavioral response simulation and technical explanation calibration."
                    has_interview = True

            if not has_interview:
                schedule.append({
                    "time_minutes": 30,
                    "domain": "Interview Prep (High Priority)",
                    "action": "Daily 30-min mock interview sprint with AI Mentor to elevate communication and technical clarity."
                })

            interview_practice = {
                "frequency": "Daily Sprint (30 minutes)",
                "rationale": "Interview performance diagnostic is below placement threshold. Increased mock rounds to build behavioral confidence and articulation precision.",
                "weekly_drills": 4,
                "focus_areas": ["STAR Method (Situation, Task, Action, Result)", "Technical Explanation of Algorithmic Trade-offs"]
            }

            if not any("interview" in m.get("category", "").lower() for m in pending_milestones):
                next_step_id = max([m.get("step_id", 0) for m in milestones] + [0]) + 1
                pending_milestones.append({
                    "step_id": next_step_id,
                    "title": "Placement Mock Simulation & STAR Behavioral Interview Calibration",
                    "category": "Interview Prep",
                    "completed": False,
                    "resources": ["60-min Technical Mock Round with AI Mentor", "Communication Articulation Lab"]
                })

            rules_applied.append("Interview performance is weak: added dedicated daily mock practice and injected interview preparation milestone.")

        # ======================================================================
        # Rule 5: If coding performance is weak -> Increase coding practice
        # ======================================================================
        if is_coding_weak:
            coding_practice["target_weekly_problems"] = max(coding_practice.get("target_weekly_problems", 8), 18)
            coding_practice["difficulty_mix"] = {"easy": 4, "medium": 12, "hard": 2}
            coding_practice["focus_area"] = "Algorithmic Invariants, Test Case Edge Handling & Debugging"
            coding_practice["curated_challenges"] = [
                "Edge case checklist: null, single element, negative values, integer overflow",
                "Two-pointer palindrome and sliding window invariants",
                "Time & space complexity trade-off verification"
            ]

            has_coding = False
            for entry in schedule:
                if "dsa" in entry.get("domain", "").lower() or "coding" in entry.get("domain", "").lower():
                    entry["time_minutes"] = max(entry.get("time_minutes", 45), 75)
                    entry["domain"] = "Coding & DSA (Remediation Priority)"
                    entry["action"] = "Daily 75-min hands-on coding sprint with test-driven debugging and complexity analysis."
                    has_coding = True

            if not has_coding:
                schedule.insert(0, {
                    "time_minutes": 75,
                    "domain": "Coding & DSA (Remediation Priority)",
                    "action": "Daily 75-min hands-on coding sprint with test-driven debugging and complexity analysis."
                })

            rules_applied.append("Coding performance is weak: increased weekly problems to 18 and allocated 75 min/day with test-case debugging guidance.")

        # ======================================================================
        # Reconstruct and persist updated roadmap
        # ======================================================================
        all_milestones = completed_milestones + pending_milestones
        for idx, m in enumerate(all_milestones, 1):
            m["step_id"] = idx

        total_daily_mins = sum(entry.get("time_minutes", 0) for entry in schedule)
        daily_practice_plan["target_hours_per_day"] = round(total_daily_mins / 60.0, 1)
        daily_practice_plan["schedule"] = schedule

        now_utc = datetime.now(timezone.utc)
        adaptation_entry = {
            "revision": new_revision,
            "timestamp": now_utc.isoformat(),
            "trigger": trigger,
            "rules_applied": rules_applied,
            "skill_shifts": {
                "improved_skills": improved_skills,
                "remains_weak": remains_weak,
                "became_strong": became_strong,
                "is_interview_weak": is_interview_weak,
                "is_coding_weak": is_coding_weak
            }
        }
        adaptation_history.append(adaptation_entry)

        updated_roadmap = {
            "student_id": student_id,
            "roadmap_id": roadmap_id,
            "roadmapId": roadmap_id,
            "track_title": track_title,
            "revision": new_revision,
            "personalization_summary": personalization_summary,
            "topics_to_study_next": list(dict.fromkeys(topics_to_study_next))[:6],
            "daily_practice_plan": daily_practice_plan,
            "coding_practice": coding_practice,
            "aptitude_practice": aptitude_practice,
            "sql_practice": sql_practice,
            "java_practice": java_practice,
            "interview_practice": interview_practice,
            "milestones": all_milestones,
            "adaptation_history": adaptation_history,
            "created_at": created_at,
            "updated_at": now_utc
        }

        # Persist to MongoDB
        db = get_database()
        if db is not None:
            await db["learning_roadmaps"].update_one(
                {"student_id": student_id},
                {"$set": updated_roadmap},
                upsert=True
            )

        # Update in shared memory
        await student_memory.update_roadmap(student_id, updated_roadmap)

        # Save agent result
        await student_memory.save_agent_result(
            identifier=student_id,
            agent_name=self.name,
            task_name="adapt_existing_roadmap",
            result_data={
                "roadmap_id": roadmap_id,
                "revision": new_revision,
                "trigger": trigger,
                "rules_applied": rules_applied
            }
        )

        logger.info(f"Adaptively updated roadmap '{roadmap_id}' (rev {new_revision}) for student '{student_id}'. Applied {len(rules_applied)} rules.")
        return updated_roadmap

    # --------------------------------------------------------------------------
    # Helper: Gemini Narrative Augmentation
    # --------------------------------------------------------------------------
    async def _generate_gemini_insights(
        self,
        student_name: str,
        career_goal: str,
        is_dsa_weak: bool,
        is_aptitude_strong: bool,
        is_sql_improving: bool,
        weaknesses: List[str],
        strengths: List[str]
    ) -> str:
        """
        Uses Gemini to generate custom coaching commentary.
        Falls back to deterministic template if Gemini is offline.
        """
        if gemini_service.is_configured():
            try:
                prompt = (
                    f"Student: {student_name}\n"
                    f"Career Goal: {career_goal}\n"
                    f"Strengths: {', '.join(strengths) if strengths else 'Solid foundation'}\n"
                    f"Weaknesses: {', '.join(weaknesses) if weaknesses else 'None prominent'}\n"
                    f"Strategy Decisions: DSA Intensive={is_dsa_weak}, Aptitude Reduced={is_aptitude_strong}, SQL Escalated={is_sql_improving}.\n"
                    "Write a 2-sentence personalized strategic mentor note. "
                    "Acknowledge their unique strength, explain why their study schedule was adapted this way, "
                    "and motivate them for placement success."
                )
                note = await gemini_service.generate_text(prompt=prompt, temperature=0.6, timeout=8.0)
                if note and len(note.strip()) > 20:
                    return note.strip()
            except Exception as e:
                logger.warning(f"Could not generate Gemini insights, using deterministic fallback: {e}")

        # Deterministic Fallback Insight
        dsa_text = "Prioritizing deep algorithmic practice to eliminate gap areas" if is_dsa_weak else "Maintaining strong algorithmic velocity"
        apt_text = "Aptitude frequency has been reduced so you can invest more hours into technical problem solving." if is_aptitude_strong else "Daily aptitude drills will ensure you easily clear initial company screening rounds."
        return f"{student_name}, this personalized curriculum is calibrated for {career_goal}. {dsa_text}, while {apt_text}"


# Global singleton instance
learning_recommendation_agent = LearningRecommendationAgent()
