"""
CareerForge AI Service - Skill Assessment Agent
==============================================
Role: Competency Evaluator and Diagnostic Gap Analyzer.

Key Capabilities:
1. Supported Categories:
   - Java (OOP, JVM, Concurrency, Collections, Streams)
   - SQL (Joins, Indexing, ACID, Normalization, Aggregates)
   - DSA (Arrays, Hashing, Trees, Graphs, Dynamic Programming, Stacks)
   - Aptitude (Quant, Logic, Probability, Time-Work, Data Interpretation)
   - Technical Fundamentals (OS, Networks, System Design, DB Internals)
2. Question Generation:
   - Curated high-yield benchmarks across Easy, Medium, and Hard.
   - Adaptive Gemini question generator targeting student-specific weaknesses.
3. Deterministic Evaluation Engine:
   - STRICT: Numerical scores are computed using 100% deterministic code.
   - Topic accuracy breakdown, strengths (>=70%), and weak areas (<70%).
4. Gemini Integration:
   - Dynamic question generation & personalized natural-language feedback.
5. Shared Student Memory:
   - Updates student skills, strengths, weaknesses, readiness score, and assessment history.
"""

import uuid
import time
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Union
from pydantic import BaseModel, Field

from app.services.student_memory import student_memory
from app.services.gemini_service import gemini_service
from app.utils.logger import logger
from app.services.db import get_database


# ==============================================================================
# Curated Benchmark Question Bank
# ==============================================================================

CURATED_QUESTION_BANK: Dict[str, List[Dict[str, Any]]] = {
    "java": [
        {
            "id": "java_01",
            "category": "Java",
            "topic": "OOP Principles",
            "difficulty": "Easy",
            "question": "Which of the following statements about method overriding in Java is correct?",
            "options": [
                "Overriding methods can have more restrictive access modifiers than the parent method.",
                "Private and static methods can be overridden by subclasses.",
                "The overriding method must have the exact same return type (or covariant subtype) and parameter list.",
                "Constructors in Java can be overridden."
            ],
            "correct_answer": 2,
            "explanation": "In Java, an overriding method must have the same signature (method name and parameter types) and a compatible (covariant) return type, and cannot reduce visibility."
        },
        {
            "id": "java_02",
            "category": "Java",
            "topic": "Collections Framework",
            "difficulty": "Medium",
            "question": "Which Java Collection class provides average O(1) time complexity for get() and put() operations?",
            "options": [
                "TreeMap",
                "HashMap",
                "TreeSet",
                "LinkedList"
            ],
            "correct_answer": 1,
            "explanation": "HashMap uses a hash table structure offering average O(1) time complexity for basic operations like get() and put()."
        },
        {
            "id": "java_03",
            "category": "Java",
            "topic": "Multithreading & Concurrency",
            "difficulty": "Medium",
            "question": "What is the primary effect of marking a variable as 'volatile' in Java?",
            "options": [
                "It makes method calls on the variable automatically thread-safe and atomic.",
                "It guarantees visibility of variable changes across threads by reading directly from main memory.",
                "It locks the variable so only one thread can access it at any given time.",
                "It serializes the variable to disk during execution."
            ],
            "correct_answer": 1,
            "explanation": "The 'volatile' keyword ensures visibility of changes across threads by bypassing CPU thread caches and reading/writing directly to main memory, though it does not provide mutual exclusion or compound atomicity."
        },
        {
            "id": "java_04",
            "category": "Java",
            "topic": "JVM & Memory Management",
            "difficulty": "Hard",
            "question": "In the standard Java Virtual Machine (JVM) memory model, where are object instances allocated?",
            "options": [
                "Directly on the thread's Call Stack",
                "Inside the Metaspace",
                "On the Heap Memory",
                "In the Native Method Stack"
            ],
            "correct_answer": 2,
            "explanation": "All Java class instances and arrays are allocated memory on the shared Heap, while primitive local variables and reference pointers reside on the thread stack."
        },
        {
            "id": "java_05",
            "category": "Java",
            "topic": "Streams & Lambdas",
            "difficulty": "Medium",
            "question": "Which intermediate operation in the Java Stream API flattens a stream of collections into a single stream?",
            "options": [
                "map()",
                "flatMap()",
                "distinct()",
                "filter()"
            ],
            "correct_answer": 1,
            "explanation": "flatMap() applies a 1-to-many transformer function to each element and flattens the resulting streams into a single composite stream."
        }
    ],
    "sql": [
        {
            "id": "sql_01",
            "category": "SQL",
            "topic": "Joins & Subqueries",
            "difficulty": "Easy",
            "question": "What is the fundamental difference between an INNER JOIN and a LEFT JOIN in SQL?",
            "options": [
                "INNER JOIN returns all rows from the left table; LEFT JOIN only matching rows.",
                "INNER JOIN returns only rows that match in both tables; LEFT JOIN returns all rows from the left table plus matched rows from the right.",
                "LEFT JOIN is faster because it does not examine foreign keys.",
                "INNER JOIN cannot be combined with WHERE clauses."
            ],
            "correct_answer": 1,
            "explanation": "INNER JOIN selects records with matching values in both tables, whereas LEFT JOIN returns all records from the left table and matched records from the right table (or NULL if no match exists)."
        },
        {
            "id": "sql_02",
            "category": "SQL",
            "topic": "Indexing & Optimization",
            "difficulty": "Medium",
            "question": "Which data structure is standard for primary and secondary indexes in relational databases like PostgreSQL and MySQL InnoDB?",
            "options": [
                "B+ Tree",
                "Binary Search Tree",
                "Red-Black Tree",
                "Linked List"
            ],
            "correct_answer": 0,
            "explanation": "B+ Trees maintain sorted order, have high fan-out for minimal disk I/O, and link leaf nodes sequentially, making both point lookups and range scans extremely efficient."
        },
        {
            "id": "sql_03",
            "category": "SQL",
            "topic": "Transactions & ACID",
            "difficulty": "Medium",
            "question": "Which ACID property guarantees that concurrent transactions do not interfere with each other's execution?",
            "options": [
                "Atomicity",
                "Consistency",
                "Isolation",
                "Durability"
            ],
            "correct_answer": 2,
            "explanation": "Isolation ensures that concurrent execution of transactions leaves the database in the same state as if the transactions were executed sequentially."
        },
        {
            "id": "sql_04",
            "category": "SQL",
            "topic": "Grouping & Aggregates",
            "difficulty": "Easy",
            "question": "Which SQL clause is specifically used to filter results AFTER an aggregation GROUP BY operation?",
            "options": [
                "WHERE",
                "HAVING",
                "ORDER BY",
                "LIMIT"
            ],
            "correct_answer": 1,
            "explanation": "The HAVING clause was added to SQL because the WHERE keyword cannot be used with aggregate functions like COUNT, SUM, or AVG."
        },
        {
            "id": "sql_05",
            "category": "SQL",
            "topic": "Database Normalization",
            "difficulty": "Hard",
            "question": "A relation is in Third Normal Form (3NF) if it is in Second Normal Form (2NF) and has no:",
            "options": [
                "Primary keys",
                "Repeating groups or multi-valued attributes",
                "Partial functional dependencies on a composite key",
                "Transitive functional dependencies on the primary key"
            ],
            "correct_answer": 3,
            "explanation": "3NF requires the elimination of transitive dependencies: non-key attributes must depend solely on the candidate keys, and not on other non-key attributes."
        }
    ],
    "dsa": [
        {
            "id": "dsa_01",
            "category": "DSA",
            "topic": "Arrays & Hashing",
            "difficulty": "Easy",
            "question": "What is the average-case time complexity of retrieving a value by key from a Hash Table with low collision rate?",
            "options": [
                "O(1)",
                "O(log N)",
                "O(N)",
                "O(N log N)"
            ],
            "correct_answer": 0,
            "explanation": "Under uniform hashing and appropriate load factor, key-value lookup in a hash table takes constant O(1) time."
        },
        {
            "id": "dsa_02",
            "category": "DSA",
            "topic": "Dynamic Programming",
            "difficulty": "Medium",
            "question": "Which two key properties must an algorithmic problem exhibit to be effectively solved using Dynamic Programming?",
            "options": [
                "Greedy choice property and Divide-and-Conquer subproblems",
                "Optimal substructure and Overlapping subproblems",
                "Linear time complexity and Binary searchability",
                "Balanced branching and Depth-first acyclic transitions"
            ],
            "correct_answer": 1,
            "explanation": "Dynamic Programming applies when a problem has optimal substructure (optimal solution composed of optimal solutions to subproblems) and overlapping subproblems (subproblems are recomputed repeatedly)."
        },
        {
            "id": "dsa_03",
            "category": "DSA",
            "topic": "Trees & Graphs",
            "difficulty": "Medium",
            "question": "Which graph traversal algorithm is guaranteed to find the shortest path between two vertices in an unweighted graph?",
            "options": [
                "Depth-First Search (DFS)",
                "Breadth-First Search (BFS)",
                "Bellman-Ford Algorithm",
                "Pre-Order Traversal"
            ],
            "correct_answer": 1,
            "explanation": "Breadth-First Search (BFS) explores all neighbors level-by-level, ensuring the first time a target vertex is reached, the shortest path in an unweighted graph is discovered."
        },
        {
            "id": "dsa_04",
            "category": "DSA",
            "topic": "Stacks & Queues",
            "difficulty": "Easy",
            "question": "Which data structure operates on a Last-In, First-Out (LIFO) order of elements?",
            "options": [
                "Queue",
                "Stack",
                "Binary Heap",
                "Deque"
            ],
            "correct_answer": 1,
            "explanation": "A Stack follows the LIFO principle: elements pushed last are the first to be popped."
        },
        {
            "id": "dsa_05",
            "category": "DSA",
            "topic": "Dynamic Programming",
            "difficulty": "Hard",
            "question": "In the standard 0/1 Knapsack problem with N items and maximum weight capacity W, what is the dynamic programming time complexity?",
            "options": [
                "O(2^N)",
                "O(N * W)",
                "O(N log W)",
                "O(N + W)"
            ],
            "correct_answer": 1,
            "explanation": "The classic pseudo-polynomial dynamic programming solution constructs an N x W table where each cell takes O(1) time, yielding total time complexity of O(N * W)."
        }
    ],
    "aptitude": [
        {
            "id": "apt_01",
            "category": "Aptitude",
            "topic": "Quantitative Aptitude",
            "difficulty": "Easy",
            "question": "A train traveling at 60 km/h crosses a 200-meter platform in 24 seconds. What is the length of the train?",
            "options": [
                "150 meters",
                "200 meters",
                "250 meters",
                "300 meters"
            ],
            "correct_answer": 1,
            "explanation": "Speed = 60 * (5/18) = 50/3 m/s. Distance = Speed * Time = (50/3) * 24 = 400 m. Length of train = Total Distance - Platform Length = 400 - 200 = 200 meters."
        },
        {
            "id": "apt_02",
            "category": "Aptitude",
            "topic": "Logical Reasoning",
            "difficulty": "Medium",
            "question": "In a certain code, 'LEAD' is coded as 'MFBE'. Following the same pattern, how will 'FORGE' be coded?",
            "options": [
                "GPSHF",
                "GPRHF",
                "HPSHF",
                "GPRIF"
            ],
            "correct_answer": 0,
            "explanation": "Each letter is shifted forward by 1 in the alphabet: L->M, E->F, A->B, D->E. Thus for FORGE: F->G, O->P, R->S, G->H, E->F => 'GPSHF'."
        },
        {
            "id": "apt_03",
            "category": "Aptitude",
            "topic": "Probability & Permutations",
            "difficulty": "Medium",
            "question": "Two standard 6-sided fair dice are rolled simultaneously. What is the probability that the sum of the two numbers rolled is exactly 8?",
            "options": [
                "5/36",
                "1/6",
                "7/36",
                "1/9"
            ],
            "correct_answer": 0,
            "explanation": "The favorable pairs with sum 8 are (2,6), (3,5), (4,4), (5,3), (6,2), which is 5 outcomes out of 36 total possible outcomes => 5/36."
        },
        {
            "id": "apt_04",
            "category": "Aptitude",
            "topic": "Time & Work",
            "difficulty": "Medium",
            "question": "Worker A can complete a task in 12 days, and Worker B can complete the same task in 6 days. Working together, how many days will they take?",
            "options": [
                "3 days",
                "4 days",
                "5 days",
                "9 days"
            ],
            "correct_answer": 1,
            "explanation": "Combined daily work rate = 1/12 + 1/6 = 3/12 = 1/4. Hence, together they take 4 days to finish the task."
        },
        {
            "id": "apt_05",
            "category": "Aptitude",
            "topic": "Data Interpretation",
            "difficulty": "Easy",
            "question": "If an engineer's coding test score increased from 50 to 75 points, what is the percentage increase?",
            "options": [
                "25%",
                "33.33%",
                "50%",
                "75%"
            ],
            "correct_answer": 2,
            "explanation": "Percentage Increase = ((75 - 50) / 50) * 100 = (25 / 50) * 100 = 50%."
        }
    ],
    "technical fundamentals": [
        {
            "id": "tf_01",
            "category": "Technical Fundamentals",
            "topic": "Operating Systems",
            "difficulty": "Medium",
            "question": "Which of the following is NOT one of Coffman's four necessary conditions for a deadlock to occur in an operating system?",
            "options": [
                "Mutual Exclusion",
                "Hold and Wait",
                "Preemption Allowed",
                "Circular Wait"
            ],
            "correct_answer": 2,
            "explanation": "The condition is 'No Preemption' (resources cannot be forcibly taken). If preemption is allowed, deadlocks can be broken."
        },
        {
            "id": "tf_02",
            "category": "Technical Fundamentals",
            "topic": "Computer Networks",
            "difficulty": "Easy",
            "question": "At which layer of the standard OSI 7-layer model does the Transmission Control Protocol (TCP) operate?",
            "options": [
                "Application Layer",
                "Transport Layer",
                "Network Layer",
                "Data Link Layer"
            ],
            "correct_answer": 1,
            "explanation": "TCP and UDP operate at the Transport Layer (Layer 4), responsible for end-to-end communication, reliability, and flow control."
        },
        {
            "id": "tf_03",
            "category": "Technical Fundamentals",
            "topic": "Operating Systems",
            "difficulty": "Medium",
            "question": "What is the primary difference between a process and a thread in modern operating systems?",
            "options": [
                "Processes share memory by default; threads have completely isolated address spaces.",
                "Threads within the same process share the same memory address space; processes have isolated address spaces.",
                "Threads can only execute on a single CPU core.",
                "Creating a process requires less overhead than creating a thread."
            ],
            "correct_answer": 1,
            "explanation": "A process has its own private virtual memory space, whereas threads within the same process share code, data, and heap, having their own separate stacks and registers."
        },
        {
            "id": "tf_04",
            "category": "Technical Fundamentals",
            "topic": "Computer Networks",
            "difficulty": "Easy",
            "question": "Which HTTP response status code indicates that the client request lacks valid authentication credentials for the target resource?",
            "options": [
                "400 Bad Request",
                "401 Unauthorized",
                "403 Forbidden",
                "404 Not Found"
            ],
            "correct_answer": 1,
            "explanation": "HTTP 401 Unauthorized means the request has not been applied because it lacks valid authentication credentials. (403 Forbidden means credentials are recognized but authorization is denied)."
        },
        {
            "id": "tf_05",
            "category": "Technical Fundamentals",
            "topic": "System Design Basics",
            "difficulty": "Hard",
            "question": "According to the CAP Theorem for distributed systems, in the presence of a network partition (P), a system must choose between:",
            "options": [
                "Performance and Scalability",
                "Consistency and Availability",
                "Atomicity and Durability",
                "Latency and Throughput"
            ],
            "correct_answer": 1,
            "explanation": "The CAP theorem states that distributed data stores cannot simultaneously guarantee all three; when a partition (P) occurs, the system must choose between Consistency (C) and Availability (A)."
        }
    ]
}

# Synonyms/aliases mapping for categories
CATEGORY_ALIASES = {
    "java": "java",
    "sql": "sql",
    "dsa": "dsa",
    "data structures": "dsa",
    "data structures and algorithms": "dsa",
    "aptitude": "aptitude",
    "quant": "aptitude",
    "technical fundamentals": "technical fundamentals",
    "fundamentals": "technical fundamentals",
    "core cs": "technical fundamentals",
    "cs fundamentals": "technical fundamentals",
}

TOPIC_REMEDIATION_MAP = {
    "OOP Principles": ["Inheritance vs Composition", "Polymorphism & Dynamic Dispatch", "SOLID Principles"],
    "Collections Framework": ["HashMap Internal Working", "Concurrent Collections", "TreeSet vs HashSet"],
    "Multithreading & Concurrency": ["Java Memory Model & Volatile", "Thread Synchronization", "Locks & Semaphores"],
    "JVM & Memory Management": ["JVM Garbage Collection Algorithms", "Heap vs Stack Memory", "Memory Leak Diagnosis"],
    "Streams & Lambdas": ["Functional Interfaces in Java", "Stream Pipelines & Collectors", "Parallel Streams"],
    "Joins & Subqueries": ["SQL Join Internals & Hash Joins", "Correlated Subqueries", "Window Functions"],
    "Indexing & Optimization": ["B+ Tree Index Anatomy", "Composite Indexes & SARGability", "EXPLAIN Query Plans"],
    "Transactions & ACID": ["Database Transaction Isolation Levels", "Dirty Reads & Phantom Reads", "Write-Ahead Logging"],
    "Grouping & Aggregates": ["HAVING vs WHERE", "GROUP BY Extensions (Rollup/Cube)", "Aggregate Performance"],
    "Database Normalization": ["1NF, 2NF, 3NF, BCNF Normalization", "Denormalization for Read Performance"],
    "Arrays & Hashing": ["Two-Pointer & Sliding Window", "Hash Map Collision Handling", "Prefix Sums"],
    "Dynamic Programming": ["Memoization vs Tabulation", "0/1 Knapsack Pattern", "Longest Common Subsequence"],
    "Trees & Graphs": ["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Dijkstra's Algorithm"],
    "Stacks & Queues": ["Monotonic Stack Pattern", "Queue using Two Stacks", "LRU Cache Implementation"],
    "Quantitative Aptitude": ["Time, Speed and Distance Formulas", "Work and Time Ratio Equations", "Percentages & Profit-Loss"],
    "Logical Reasoning": ["Coding-Decoding Patterns", "Syllogisms and Venn Diagrams", "Blood Relations & Direction Tests"],
    "Probability & Permutations": ["Conditional Probability & Bayes' Theorem", "Permutation vs Combination Formulations"],
    "Time & Work": ["Unitary Method & LCM Method for Work", "Pipes and Cisterns Problems"],
    "Data Interpretation": ["Bar Charts & Pie Charts Analysis", "Table Data Calculations & Ratio Trends"],
    "Operating Systems": ["Coffman Deadlock Conditions", "Process Scheduling Algorithms", "Paging & Virtual Memory"],
    "Computer Networks": ["TCP 3-Way Handshake & Teardown", "OSI vs TCP/IP Layer Models", "DNS Resolution Architecture"],
    "System Design Basics": ["CAP Theorem & PACELC", "Horizontal vs Vertical Scaling", "Load Balancer Strategies"]
}


# ==============================================================================
# In-Memory Active Assessment Sessions
# ==============================================================================
# Key: assessmentId -> Full Assessment Session Document (with correct answers)
ACTIVE_SESSIONS: Dict[str, Dict[str, Any]] = {}


# ==============================================================================
# Skill Assessment Agent
# ==============================================================================

class SkillAssessmentAgent:
    """
    Evaluates candidate competencies across Java, SQL, DSA, Aptitude, and CS Fundamentals.
    Combines AI question generation and adaptive feedback with 100% deterministic scoring.
    """

    def __init__(self, name: str = "Skill Assessor"):
        self.name = name
        self.role = "Competency Evaluator and Gap Analyzer"

    @staticmethod
    def normalize_category(category: str) -> str:
        """
        Normalize category input string to canonical representation.
        """
        cleaned = (category or "").strip().lower()
        return CATEGORY_ALIASES.get(cleaned, cleaned)

    # --------------------------------------------------------------------------
    # 1. START ASSESSMENT SESSION
    # --------------------------------------------------------------------------
    async def start_assessment(
        self,
        student_id: str,
        category: str,
        difficulty: str = "Medium",
        question_count: int = 5,
        use_ai: bool = True
    ) -> Dict[str, Any]:
        """
        Starts a new assessment session:
        - Retrieves student weaknesses from shared memory to guide question selection.
        - Generates or selects questions for the category and difficulty.
        - Persists the active assessment session securely.
        - Returns student-facing questions (OMITTING correct answers to prevent cheating).
        """
        norm_cat = self.normalize_category(category)
        display_category = {
            "java": "Java",
            "sql": "SQL",
            "dsa": "DSA",
            "aptitude": "Aptitude",
            "technical fundamentals": "Technical Fundamentals"
        }.get(norm_cat, category.upper())

        # 1. Read student profile and diagnosed weaknesses from shared memory
        weaknesses = await student_memory.read_weaknesses(student_id)

        # 2. Generate questions (Adaptive with Gemini or Curated Bank)
        questions = await self._select_or_generate_questions(
            category=norm_cat,
            display_category=display_category,
            difficulty=difficulty,
            count=question_count,
            known_weaknesses=weaknesses,
            use_ai=use_ai
        )

        # 3. Create unique assessment session
        assessment_id = f"asmt_{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc)
        duration_minutes = max(10, len(questions) * 3)

        session_record = {
            "assessment_id": assessment_id,
            "student_id": student_id,
            "category": display_category,
            "difficulty": difficulty,
            "duration_minutes": duration_minutes,
            "total_questions": len(questions),
            "questions": questions,  # Full questions with answers
            "created_at": now,
            "status": "in_progress"
        }

        # Save to database and memory cache
        db = get_database()
        if db is not None:
            await db["assessments"].insert_one(session_record)
        ACTIVE_SESSIONS[assessment_id] = session_record

        # 4. Prepare student-facing questions (OMIT correct_answer & explanation)
        student_questions = []
        for q in questions:
            student_questions.append({
                "id": q["id"],
                "category": q["category"],
                "topic": q["topic"],
                "difficulty": q["difficulty"],
                "question": q["question"],
                "options": q["options"]
            })

        logger.info(f"Started assessment '{assessment_id}' ({display_category}) for student '{student_id}' with {len(student_questions)} questions.")

        return {
            "assessmentId": assessment_id,
            "category": display_category,
            "difficulty": difficulty,
            "totalQuestions": len(student_questions),
            "durationMinutes": duration_minutes,
            "questions": student_questions
        }

    # --------------------------------------------------------------------------
    # 2. SUBMIT & DETERMINISTICALLY EVALUATE ANSWERS
    # --------------------------------------------------------------------------
    async def submit_assessment(
        self,
        assessment_id: str,
        student_id: str,
        submitted_answers: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Evaluates student answers:
        - Evaluates correct MCQ answers using STRICT deterministic application logic.
        - Computes numerical score, topic-level accuracy, strengths, and weak areas.
        - Generates natural language coaching feedback using Gemini.
        - Updates student skills, strengths, weaknesses, and readiness in shared memory.
        - Returns structured assessment summary.
        """
        # 1. Fetch assessment session
        session = await self._get_assessment_session(assessment_id)
        if not session:
            logger.error(f"Assessment session not found: {assessment_id}")
            raise ValueError(f"Assessment session '{assessment_id}' not found.")

        questions = session.get("questions", [])
        category = session.get("category", "General")
        total_questions = len(questions)

        if total_questions == 0:
            raise ValueError("Assessment has no questions.")

        # 2. Deterministic Scoring Logic
        correct_count = 0
        topic_stats: Dict[str, Dict[str, int]] = {}
        detailed_results: List[Dict[str, Any]] = []

        for q in questions:
            qid = q["id"]
            topic = q.get("topic", "General")
            correct_val = q.get("correct_answer")
            options = q.get("options", [])

            if topic not in topic_stats:
                topic_stats[topic] = {"total": 0, "correct": 0}
            topic_stats[topic]["total"] += 1

            student_raw_ans = submitted_answers.get(qid)
            is_correct = self._check_answer(student_raw_ans, correct_val, options)

            if is_correct:
                correct_count += 1
                topic_stats[topic]["correct"] += 1

            detailed_results.append({
                "questionId": qid,
                "topic": topic,
                "difficulty": q.get("difficulty", "Medium"),
                "isCorrect": is_correct,
                "studentAnswer": student_raw_ans,
                "correctAnswer": correct_val,
                "explanation": q.get("explanation", "")
            })

        # Deterministic score calculation (0 to 100 integer)
        score = round((correct_count / total_questions) * 100)
        passed = score >= 60

        # Topic Breakdown, Strengths, and Weak Areas
        topic_breakdown: Dict[str, float] = {}
        strengths: List[str] = []
        weak_areas: List[str] = []
        recommended_topics: List[str] = []

        for topic, stat in topic_stats.items():
            tot = stat["total"]
            corr = stat["correct"]
            accuracy = round((corr / tot) * 100.0, 1)
            topic_breakdown[topic] = accuracy

            if accuracy >= 70.0:
                strengths.append(topic)
            else:
                weak_areas.append(topic)
                # Recommend remediation topics
                recs = TOPIC_REMEDIATION_MAP.get(topic, [f"Advanced {topic} Review", f"Practice {topic} Problems"])
                recommended_topics.extend(recs)

        # Remove duplicates from recommendations while preserving order
        recommended_topics = list(dict.fromkeys(recommended_topics))

        # 3. Generate Natural Language Feedback (Gemini or Deterministic Template)
        feedback = await self._generate_feedback(
            category=category,
            score=score,
            total_questions=total_questions,
            correct_count=correct_count,
            strengths=strengths,
            weak_areas=weak_areas
        )

        # 4. Update Shared Student Memory
        # A) Save Assessment Result
        result_record = {
            "assessment_id": assessment_id,
            "student_id": student_id,
            "category": category,
            "score": float(score),
            "total_score": 100.0,
            "passed": passed,
            "correct_count": correct_count,
            "total_questions": total_questions,
            "topic_breakdown": topic_breakdown,
            "strengths": strengths,
            "weak_areas": weak_areas,
            "feedback": feedback,
            "timestamp": datetime.now(timezone.utc)
        }
        await student_memory.save_assessment_result(result_record)

        # B) Update Student Skills
        skill_level = "Advanced" if score >= 85 else ("Intermediate" if score >= 60 else "Beginner")
        await student_memory.update_skills(
            identifier=student_id,
            skills=[{
                "name": category,
                "level": skill_level,
                "verified": passed
            }]
        )

        # C) Update Strengths & Weaknesses
        if strengths:
            await student_memory.update_strengths(student_id, strengths)
        if weak_areas:
            await student_memory.update_weaknesses(student_id, weak_areas, mode="merge")

        # D) Adaptive Weakness Remediation: If student scored 100% on a previously weak topic, remove it!
        resolved_weaknesses = [t for t, acc in topic_breakdown.items() if acc == 100.0]
        if resolved_weaknesses:
            await student_memory.remove_weaknesses(student_id, resolved_weaknesses)

        # E) Save Agent Result
        await student_memory.save_agent_result(
            identifier=student_id,
            agent_name=self.name,
            task_name="evaluate_assessment",
            result_data={
                "assessmentId": assessment_id,
                "category": category,
                "score": score,
                "passed": passed,
                "strengths": strengths,
                "weakAreas": weak_areas
            }
        )

        # Mark active session as completed
        if assessment_id in ACTIVE_SESSIONS:
            ACTIVE_SESSIONS[assessment_id]["status"] = "completed"

        # Adaptively update learning roadmap with new assessment diagnostics via Adaptive Learning Loop
        try:
            from app.services.adaptive_loop import adaptive_learning_loop
            await adaptive_learning_loop.evaluate_and_adapt(
                student_id=student_id,
                trigger_source="assessment_submission",
                trigger_payload={"assessment_id": assessment_id, "category": category, "score": score}
            )
        except Exception as e:
            logger.warning(f"Could not run adaptive loop after assessment: {e}")

        db = get_database()
        if db is not None:
            await db["assessments"].update_one(
                {"assessment_id": assessment_id},
                {"$set": {"status": "completed", "score": score, "completed_at": datetime.now(timezone.utc)}}
            )

        logger.info(
            f"Evaluated assessment '{assessment_id}' for '{student_id}': score={score}%, strengths={len(strengths)}, weakAreas={len(weak_areas)}"
        )

        # 5. Return Exact Structured Response
        return {
            "assessmentId": assessment_id,
            "category": category,
            "score": score,
            "strengths": strengths,
            "weakAreas": weak_areas,
            "recommendedTopics": recommended_topics,
            "passed": passed,
            "totalQuestions": total_questions,
            "correctCount": correct_count,
            "feedback": feedback,
            "topicBreakdown": topic_breakdown,
            "detailedResults": detailed_results
        }

    # --------------------------------------------------------------------------
    # Helper: Deterministic Answer Checker
    # --------------------------------------------------------------------------
    @staticmethod
    def _check_answer(student_ans: Any, correct_val: Any, options: List[str]) -> bool:
        """
        Deterministically evaluates if a student's answer matches the correct answer.
        Handles zero-based index (0..3), letter ('A'..'D'), or option string value.
        """
        if student_ans is None:
            return False

        # If both are integers or can be cast to int
        try:
            if int(student_ans) == int(correct_val):
                return True
        except (ValueError, TypeError):
            pass

        # If student passed letter 'A', 'B', 'C', 'D'
        letter_to_index = {"a": 0, "b": 1, "c": 2, "d": 3}
        if isinstance(student_ans, str) and student_ans.strip().lower() in letter_to_index:
            s_idx = letter_to_index[student_ans.strip().lower()]
            try:
                if s_idx == int(correct_val):
                    return True
            except (ValueError, TypeError):
                pass

        # If comparison is by text content of the option
        if isinstance(correct_val, int) and 0 <= correct_val < len(options):
            correct_text = options[correct_val].strip().lower()
            if str(student_ans).strip().lower() == correct_text:
                return True

        if str(student_ans).strip().lower() == str(correct_val).strip().lower():
            return True

        return False

    # --------------------------------------------------------------------------
    # Helper: Question Selection or Dynamic Generation
    # --------------------------------------------------------------------------
    async def _select_or_generate_questions(
        self,
        category: str,
        display_category: str,
        difficulty: str,
        count: int,
        known_weaknesses: List[str],
        use_ai: bool
    ) -> List[Dict[str, Any]]:
        """
        Selects questions from curated bank or generates fresh questions using Gemini.
        """
        norm_cat = category.lower()

        # Check if we should attempt Gemini dynamic question generation
        if use_ai and gemini_service.is_configured():
            try:
                ai_questions = await self._generate_gemini_questions(
                    category=display_category,
                    difficulty=difficulty,
                    count=count,
                    known_weaknesses=known_weaknesses
                )
                if ai_questions and len(ai_questions) >= count:
                    return ai_questions[:count]
            except Exception as e:
                logger.warning(f"Dynamic Gemini question generation failed, falling back to curated bank: {e}")

        # Curated Bank Fallback
        bank = CURATED_QUESTION_BANK.get(norm_cat)
        if not bank:
            # Fallback to DSA if unrecognized
            bank = CURATED_QUESTION_BANK.get("dsa", [])

        # Filter by difficulty if specified, otherwise take best available
        diff_matched = [q for q in bank if q.get("difficulty", "").lower() == difficulty.lower()]
        if len(diff_matched) >= count:
            selected = diff_matched[:count]
        else:
            # Prioritize weakness topics if any match
            weakness_matched = [q for q in bank if any(w.lower() in q.get("topic", "").lower() for w in known_weaknesses)]
            remaining = [q for q in bank if q not in weakness_matched]
            selected = (weakness_matched + remaining)[:count]

        # In case fewer questions than count, return all available
        if not selected:
            selected = bank[:count]

        return selected

    # --------------------------------------------------------------------------
    # Helper: Gemini Dynamic Question Generation
    # --------------------------------------------------------------------------
    async def _generate_gemini_questions(
        self,
        category: str,
        difficulty: str,
        count: int,
        known_weaknesses: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Calls Gemini with structured JSON schema to generate targeted MCQ questions.
        """
        class GeminiQuestion(BaseModel):
            id: str
            topic: str
            difficulty: str
            question: str
            options: List[str] = Field(description="Exactly 4 distinct multiple choice options")
            correct_answer_index: int = Field(description="0, 1, 2, or 3 index of the correct option")
            explanation: str

        class QuestionBankResponse(BaseModel):
            questions: List[GeminiQuestion]

        weakness_str = ", ".join(known_weaknesses) if known_weaknesses else "None specified"
        prompt = (
            f"Generate exactly {count} high-quality technical multiple-choice assessment questions for: {category}.\n"
            f"Target Difficulty: {difficulty}.\n"
            f"Student's known weakness areas to target adaptively: {weakness_str}.\n"
            "Requirements:\n"
            "1. Each question must have exactly 4 plausible options.\n"
            "2. 'correct_answer_index' must be the exact zero-based index (0, 1, 2, or 3) of the single correct answer.\n"
            "3. Include a clear explanation justifying the correct answer.\n"
            "4. Cover core hiring standards expected in top technology companies."
        )

        response = await gemini_service.generate_structured_json(
            prompt=prompt,
            response_schema=QuestionBankResponse,
            system_instruction="You are an expert technical interviewer creating diagnostic coding assessments.",
            temperature=0.3,
            timeout=20.0
        )

        formatted = []
        if isinstance(response, QuestionBankResponse):
            for i, q in enumerate(response.questions):
                formatted.append({
                    "id": f"ai_{category.lower()}_{i+1}_{uuid.uuid4().hex[:6]}",
                    "category": category,
                    "topic": q.topic,
                    "difficulty": q.difficulty,
                    "question": q.question,
                    "options": q.options[:4],
                    "correct_answer": q.correct_answer_index,
                    "explanation": q.explanation
                })
        return formatted

    # --------------------------------------------------------------------------
    # Helper: Natural Language Coaching Feedback
    # --------------------------------------------------------------------------
    async def _generate_feedback(
        self,
        category: str,
        score: int,
        total_questions: int,
        correct_count: int,
        strengths: List[str],
        weak_areas: List[str]
    ) -> str:
        """
        Generates personalized natural-language feedback.
        Uses Gemini if available; falls back to deterministic rule-based feedback.
        """
        if gemini_service.is_configured():
            try:
                prompt = (
                    f"A software engineering candidate completed a {category} diagnostic assessment.\n"
                    f"Deterministic Score: {score}% ({correct_count}/{total_questions} correct).\n"
                    f"Demonstrated Strengths: {', '.join(strengths) if strengths else 'None clearly established'}.\n"
                    f"Identified Weak Areas: {', '.join(weak_areas) if weak_areas else 'None - excellent mastery'}.\n"
                    "Provide a concise, encouraging 2-3 sentence coaching summary. "
                    "Highlight what went well, pinpoint the exact concept they need to study next, "
                    "and give an actionable placement tip."
                )
                ai_feedback = await gemini_service.generate_text(
                    prompt=prompt,
                    temperature=0.6,
                    timeout=10.0
                )
                if ai_feedback and len(ai_feedback.strip()) > 20:
                    return ai_feedback.strip()
            except Exception as e:
                logger.warning(f"Could not generate Gemini feedback, using deterministic fallback: {e}")

        # Deterministic Rule-Based Feedback Fallback
        if score >= 80:
            str_text = f"Strong execution across {', '.join(strengths)}." if strengths else "Exceptional foundational knowledge."
            weak_text = f" To reach top-tier benchmark, fine-tune {', '.join(weak_areas)}." if weak_areas else " Ready for high-bar company rounds!"
            return f"Excellent performance ({score}%). {str_text}{weak_text}"
        elif score >= 60:
            weak_text = f" Focus your upcoming study sprint on {', '.join(weak_areas)}." if weak_areas else ""
            return f"Solid passing performance ({score}%). You demonstrated good fundamentals in {', '.join(strengths)}.{weak_text}"
        else:
            weak_text = f"Targeted practice is strongly recommended in: {', '.join(weak_areas)}." if weak_areas else "Review core principles."
            return f"Diagnostic score of {score}% indicates foundational gaps. {weak_text} Work through guided exercises before re-attempting."

    # --------------------------------------------------------------------------
    # Helper: Retrieve Session
    # --------------------------------------------------------------------------
    async def _get_assessment_session(self, assessment_id: str) -> Optional[Dict[str, Any]]:
        """
        Finds the assessment session from in-memory cache or MongoDB.
        """
        if assessment_id in ACTIVE_SESSIONS:
            return ACTIVE_SESSIONS[assessment_id]

        db = get_database()
        if db is not None:
            doc = await db["assessments"].find_one({"assessment_id": assessment_id})
            if doc:
                return doc
        return None


# Global singleton instance
skill_assessment_agent = SkillAssessmentAgent()
