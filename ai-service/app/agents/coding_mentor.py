"""
CareerForge AI Service - Coding Mentor Agent
===========================================
Role: DSA & Placement Coding Mentor and Code Reviewer.

Key Principles:
1. Safe Non-Gemini Execution: Student code is executed in code_sandbox with strict timeouts,
   NOT via LLM hallucination.
2. Socratic Pedagogy: The agent provides progressive hints:
   Hint -> More specific hint -> Approach -> Optimization -> Solution explanation.
   Full solutions are NEVER revealed unless explicitly requested by the student.
3. Automated Placement Diagnostics:
   - Automated error detection and debugging guidance
   - Time and space complexity analysis
   - Optimization suggestions
   - Placement interview feedback
4. Shared Student Memory:
   - Stores submission history in MongoDB coding_submissions and student.codingHistory.
"""

import time
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from app.services.code_sandbox import code_sandbox, ExecutionResult
from app.services.student_memory import student_memory
from app.services.gemini_service import gemini_service
from app.utils.logger import logger


# In-memory session tracking for progressive hints per (student_id, problem_id)
# Value: integer current hint level (1..5)
STUDENT_HINT_LEVELS: Dict[str, int] = {}

HINT_LEVEL_NAMES = {
    1: "Gentle Conceptual Hint",
    2: "Specific Data Structure Hint",
    3: "Algorithmic Approach & Invariant",
    4: "Complexity & Optimization Strategy",
    5: "Complete Solution & Code Walkthrough"
}


# ==============================================================================
# Coding Mentor Agent
# ==============================================================================

class CodingMentorAgent:
    """
    Placement Coding Mentor Agent.
    Evaluates submissions using safe sandbox execution, analyzes code complexity,
    diagnoses errors, and provides Socratic progressive hints.
    """

    def __init__(self, name: str = "Code Mentor"):
        self.name = name
        self.role = "DSA & Competitive Programming Tutor"

    # --------------------------------------------------------------------------
    # 1. ANALYZE CODE SUBMISSION
    # --------------------------------------------------------------------------
    async def analyze_submission(
        self,
        student_id: str,
        problem_id: str,
        problem_title: str,
        language: str,
        code: str,
        test_cases: List[Dict[str, Any]],
        problem_description: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Full Execution and Analysis Flow:
        1. Executes code in safe sandbox against test cases (NOT Gemini).
        2. Calculates test case accuracy, runtime, and memory.
        3. Invokes Mentor intelligence (Gemini / deterministic rule engine) for:
           - Error detection
           - Debugging guidance
           - Complexity analysis
           - Optimization suggestions
           - Learning feedback
        4. Persists submission in MongoDB and updates student memory.
        """
        logger.info(f"Executing code submission for student '{student_id}' on problem '{problem_title}' ({language}).")

        # Step 1: Execute code in safe sandbox
        execution: ExecutionResult = await code_sandbox.execute_code(
            code=code,
            language=language,
            test_cases=test_cases
        )

        passed_all = (execution.status == "Accepted")

        # Step 2: Generate AI Analysis & Coaching Feedback
        analysis = await self._generate_code_analysis(
            problem_title=problem_title,
            problem_description=problem_description or problem_title,
            language=language,
            code=code,
            execution=execution
        )

        # Step 3: Assemble Submission Record
        sub_id = f"sub_{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc)
        submission_record = {
            "submission_id": sub_id,
            "student_id": student_id,
            "problem_id": problem_id,
            "problem_title": problem_title,
            "language": language,
            "code": code,
            "status": execution.status,
            "runtime_ms": execution.runtime_ms,
            "memory_mb": execution.memory_mb,
            "passed_test_cases": execution.passed_count,
            "total_test_cases": execution.total_count,
            "test_case_results": [r.model_dump() for r in execution.test_results],
            "error_message": execution.error_message,
            "ai_feedback": analysis.get("learning_feedback", ""),
            "complexity_analysis": analysis.get("complexity_analysis", {}),
            "debugging_guidance": analysis.get("debugging_guidance"),
            "optimization_suggestions": analysis.get("optimization_suggestions", []),
            "timestamp": now
        }

        # Step 4: Persist in Shared Student Memory
        await student_memory.save_coding_submission(submission_record)

        # Save agent execution result
        await student_memory.save_agent_result(
            identifier=student_id,
            agent_name=self.name,
            task_name="analyze_coding_submission",
            result_data={
                "problem_id": problem_id,
                "problem_title": problem_title,
                "status": execution.status,
                "passed_count": execution.passed_count,
                "total_count": execution.total_count,
                "runtime_ms": execution.runtime_ms
            }
        )

        # Trigger Adaptive Learning Loop
        try:
            from app.services.adaptive_loop import adaptive_learning_loop
            await adaptive_learning_loop.evaluate_and_adapt(
                student_id=student_id,
                trigger_source="coding_submission",
                trigger_payload={"problem_id": problem_id, "status": execution.status}
            )
        except Exception as ae:
            logger.warning(f"Could not run adaptive loop after coding submission: {ae}")

        logger.info(f"Completed analysis for '{student_id}' on '{problem_title}': status={execution.status}")

        return {
            "submission_id": sub_id,
            "problem_id": problem_id,
            "problem_title": problem_title,
            "status": execution.status,
            "passed": passed_all,
            "passed_test_cases": execution.passed_count,
            "total_test_cases": execution.total_count,
            "runtime_ms": execution.runtime_ms,
            "memory_mb": execution.memory_mb,
            "test_results": [r.model_dump() for r in execution.test_results],
            "error_detected": bool(execution.error_message or not passed_all),
            "error_details": execution.error_message,
            "debugging_guidance": analysis.get("debugging_guidance"),
            "complexity_analysis": analysis.get("complexity_analysis"),
            "optimization_suggestions": analysis.get("optimization_suggestions"),
            "learning_feedback": analysis.get("learning_feedback")
        }

    # --------------------------------------------------------------------------
    # 2. PROVIDE PROGRESSIVE HINT
    # --------------------------------------------------------------------------
    async def provide_progressive_hint(
        self,
        student_id: str,
        problem_id: str,
        problem_title: str,
        code: str,
        language: str = "python",
        requested_level: Optional[int] = None,
        reveal_solution: bool = False
    ) -> Dict[str, Any]:
        """
        Socratic Progressive Hint Progression:
        Level 1: Gentle Conceptual Hint (clue without giving away algorithm)
        Level 2: Specific Data Structure Hint (e.g. suggests Hash Table or Two Pointers)
        Level 3: Algorithmic Approach & Invariant (step-by-step logic pseudocode)
        Level 4: Complexity & Optimization Strategy (how to achieve optimal time/space)
        Level 5: Complete Solution Explanation (ONLY provided if reveal_solution is True or level 5 requested)
        """
        session_key = f"{student_id}_{problem_id}"
        current_level = STUDENT_HINT_LEVELS.get(session_key, 0)

        # Determine target hint level
        if requested_level is not None:
            target_level = max(1, min(5, requested_level))
        else:
            target_level = min(4 if not reveal_solution else 5, current_level + 1)

        # Enforce safety: do not reveal solution unless explicitly requested
        if target_level == 5 and not reveal_solution:
            target_level = 4

        # Update tracked level for this session
        STUDENT_HINT_LEVELS[session_key] = target_level

        level_name = HINT_LEVEL_NAMES.get(target_level, "Hint")

        # Generate hint text via Gemini or deterministic fallback
        hint_content = await self._generate_hint_content(
            problem_title=problem_title,
            student_code=code,
            language=language,
            level=target_level,
            reveal_solution=reveal_solution
        )

        return {
            "problem_id": problem_id,
            "problem_title": problem_title,
            "hint_level": target_level,
            "hint_level_name": level_name,
            "has_next_hint": (target_level < 4 or (target_level == 4 and not reveal_solution)),
            "solution_revealed": (target_level == 5 and reveal_solution),
            "hint": hint_content,
            "next_step_available": (
                "Call /hint with reveal_solution=true to view the full solution walkthrough."
                if target_level == 4
                else f"Call /hint again to progress to Level {target_level + 1}: {HINT_LEVEL_NAMES.get(target_level + 1, '')}."
            )
        }

    # --------------------------------------------------------------------------
    # Helper: AI Code Analysis & Feedback
    # --------------------------------------------------------------------------
    async def _generate_code_analysis(
        self,
        problem_title: str,
        problem_description: str,
        language: str,
        code: str,
        execution: ExecutionResult
    ) -> Dict[str, Any]:
        """
        Uses Gemini to analyze complexity, diagnose errors, and provide feedback.
        Falls back to comprehensive rule-based analysis if Gemini is unavailable.
        """
        if gemini_service.is_configured():
            try:
                class AnalysisSchema(BaseModel):
                    time_complexity: str = Field(description="Big-O time complexity e.g. O(N) or O(N^2)")
                    space_complexity: str = Field(description="Big-O space complexity e.g. O(1) or O(N)")
                    complexity_explanation: str
                    debugging_guidance: Optional[str] = Field(description="Direct, helpful diagnosis of what went wrong or why it failed")
                    optimization_suggestions: List[str] = Field(description="Actionable algorithmic or data structure improvements")
                    learning_feedback: str = Field(description="Encouraging, placement-focused feedback")

                status_summary = f"Execution Status: {execution.status} ({execution.passed_count}/{execution.total_count} test cases passed)."
                if execution.error_message:
                    status_summary += f" Error Message: {execution.error_message}"

                prompt = (
                    f"You are the CareerForge AI Coding Mentor reviewing a student's solution for '{problem_title}'.\n"
                    f"Problem Context: {problem_description}\n"
                    f"Language: {language}\n"
                    f"Student Code:\n```\n{code}\n```\n"
                    f"{status_summary}\n\n"
                    "Analyze the code and output structured JSON:\n"
                    "1. Compute precise Time and Space complexity.\n"
                    "2. If execution failed or had wrong answer, provide clear debugging guidance without spoonfeeding full code.\n"
                    "3. Suggest concrete optimization steps if suboptimal.\n"
                    "4. Give encouraging, interview-relevant learning feedback."
                )

                response = await gemini_service.generate_structured_json(
                    prompt=prompt,
                    response_schema=AnalysisSchema,
                    system_instruction="You are an ACM-ICPC medalist and senior technical interviewer providing Socratic coding feedback.",
                    temperature=0.2,
                    timeout=12.0
                )

                if isinstance(response, AnalysisSchema):
                    return {
                        "complexity_analysis": {
                            "time": response.time_complexity,
                            "space": response.space_complexity,
                            "explanation": response.complexity_explanation
                        },
                        "debugging_guidance": response.debugging_guidance,
                        "optimization_suggestions": response.optimization_suggestions,
                        "learning_feedback": response.learning_feedback
                    }
            except Exception as e:
                logger.warning(f"Could not generate Gemini code analysis, using rule engine: {e}")

        # Deterministic Rule-Based Fallback
        return self._deterministic_code_analysis(problem_title, code, execution)

    # --------------------------------------------------------------------------
    # Helper: Deterministic Rule-Based Code Analysis
    # --------------------------------------------------------------------------
    @staticmethod
    def _deterministic_code_analysis(
        problem_title: str,
        code: str,
        execution: ExecutionResult
    ) -> Dict[str, Any]:
        """
        Deterministic static analysis for complexity, errors, and optimizations.
        """
        # Complexity heuristic based on nested loops
        loop_count = code.count("for ") + code.count("while ")
        if loop_count >= 2:
            time_comp = "O(N^2)"
            space_comp = "O(1)"
            comp_exp = "Nested loops iterate across inputs, resulting in quadratic time complexity."
            opts = [
                "Replace the nested loop lookup with a Hash Map (dict) to reduce time complexity from O(N^2) to O(N).",
                "Consider two-pointer technique if the input array can be sorted or is already sorted."
            ]
        elif loop_count == 1:
            time_comp = "O(N)"
            space_comp = "O(N)" if ("seen" in code or "dict" in code or "set" in code or "map" in code.lower()) else "O(1)"
            comp_exp = "Single pass through the input with linear time complexity."
            opts = [
                "Your current time complexity is optimal for unsorted inputs.",
                "Ensure edge cases like empty arrays, duplicates, or negative values are handled gracefully."
            ]
        else:
            time_comp = "O(1)"
            space_comp = "O(1)"
            comp_exp = "Constant time operations."
            opts = ["Verify boundaries and null inputs."]

        # Debugging guidance based on execution status
        if execution.status == "Accepted":
            dbg = "All test cases passed! Your solution correctly satisfies the problem constraints."
            feedback = f"Great work! You solved '{problem_title}' with {execution.runtime_ms:.1f}ms runtime. Your approach demonstrates good algorithmic understanding."
        elif execution.status == "Wrong Answer":
            dbg = "One or more test cases produced incorrect output. Double-check your condition bounds, return types, and whether 0-indexed or 1-indexed output is expected."
            feedback = "You are close! Review the failing test case output above to trace where the output deviates from expected values."
        elif execution.status == "Time Limit Exceeded":
            dbg = f"Execution exceeded the {execution.runtime_ms/1000:.1f}s threshold. Your current {time_comp} approach is likely timing out on large inputs."
            feedback = "In placement interviews, O(N^2) solutions frequently fail performance benchmarks. Optimize to O(N) or O(N log N) using hashing or binary search."
        else:
            dbg = f"Runtime error detected: {execution.error_message or 'Check syntax and variable scopes.'}"
            feedback = "A runtime exception interrupted execution. Inspect the line referenced in the error message and verify variable types and bounds."

        return {
            "complexity_analysis": {
                "time": time_comp,
                "space": space_comp,
                "explanation": comp_exp
            },
            "debugging_guidance": dbg,
            "optimization_suggestions": opts,
            "learning_feedback": feedback
        }

    # --------------------------------------------------------------------------
    # Helper: Socratic Hint Generator
    # --------------------------------------------------------------------------
    async def _generate_hint_content(
        self,
        problem_title: str,
        student_code: str,
        language: str,
        level: int,
        reveal_solution: bool
    ) -> str:
        """
        Produces hints calibrated strictly to the requested progression level.
        """
        if gemini_service.is_configured():
            try:
                level_instructions = {
                    1: "Give a gentle Socratic conceptual clue. DO NOT mention data structures or code.",
                    2: "Suggest the appropriate data structure or pattern (e.g. Hash Map, Stack, Two-Pointer). DO NOT give pseudocode or solution.",
                    3: "Provide the algorithmic approach and loop invariant in step-by-step bullet points. DO NOT provide full code.",
                    4: "Explain the optimal time and space complexity and how to avoid redundant work.",
                    5: "Provide the complete optimal solution with line-by-line explanation, since student explicitly requested it."
                }

                prompt = (
                    f"Problem: {problem_title}\n"
                    f"Student's Current Code Draft ({language}):\n```\n{student_code}\n```\n"
                    f"Target Hint Level: Level {level} ({HINT_LEVEL_NAMES.get(level)})\n"
                    f"Constraint for this level: {level_instructions.get(level)}\n"
                    "Respond concisely and clearly."
                )

                res = await gemini_service.generate_text(
                    prompt=prompt,
                    system_instruction="You are an expert coding mentor guiding a candidate through placement DSA preparation.",
                    temperature=0.3,
                    timeout=8.0
                )
                if res and len(res.strip()) > 10:
                    return res.strip()
            except Exception as e:
                logger.warning(f"Could not generate Gemini hint, using deterministic fallback: {e}")

        # Deterministic Fallback Hints for Common DSA Problems
        fallback_hints = {
            1: f"Think about how you can avoid checking every pair of elements. Can you remember elements you have already inspected as you traverse?",
            2: f"Consider using a Hash Table (dictionary/Map). As you iterate, store each element's value as a key and its index as the value.",
            3: f"Algorithmic Approach:\n1. Initialize an empty hash map `seen`.\n2. Iterate through array with index `i` and element `num`.\n3. Compute `complement = target - num`.\n4. If `complement` exists in `seen`, return `[seen[complement], i]`.\n5. Otherwise, record `seen[num] = i`.",
            4: f"Complexity Optimization:\n- Brute force requires O(N^2) time by scanning pairs.\n- With a Hash Map, lookup is O(1) average time, reducing overall complexity to O(N) time and O(N) space.",
            5: (
                f"Complete Solution ({language}):\n\n"
                "```python\n"
                "def twoSum(nums, target):\n"
                "    seen = {}\n"
                "    for i, num in enumerate(nums):\n"
                "        complement = target - num\n"
                "        if complement in seen:\n"
                "            return [seen[complement], i]\n"
                "        seen[num] = i\n"
                "    return []\n"
                "```\n"
                "Explanation: We perform a single pass through `nums`. By looking up the needed complement in O(1) time before adding the current element, we guarantee finding the pair in linear time."
            )
        }

        return fallback_hints.get(level, fallback_hints[1])


# Global Singleton Instance
coding_mentor_agent = CodingMentorAgent()
