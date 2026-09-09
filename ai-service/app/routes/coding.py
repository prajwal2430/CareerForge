"""
CareerForge AI Service - Coding Mentor Routes
=============================================
Endpoints:
- POST /api/ai/coding/analyze         : Execute code in sandbox, evaluate test cases & analyze complexity
- POST /api/ai/coding/hint            : Socratic progressive hints (Hint -> Approach -> Optimization -> Solution)
- GET  /api/ai/coding/history/{student_id} : View past coding submissions and feedback
"""

from fastapi import APIRouter, HTTPException, status, Path
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from app.agents.coding_mentor import coding_mentor_agent
from app.services.student_memory import student_memory
from app.utils.logger import logger

router = APIRouter(prefix="/api/ai/coding", tags=["Coding Mentor"])


# ==============================================================================
# Request & Response Schemas
# ==============================================================================

class AnalyzeCodeRequest(BaseModel):
    student_id: str = Field(..., description="Unique student or user identifier")
    problem_id: str = Field(..., description="Unique problem identifier or slug")
    problem_title: str = Field(..., description="Title of the coding problem")
    language: str = Field(default="python", description="Programming language: python, javascript, etc.")
    code: str = Field(..., description="Student code submission")
    test_cases: Optional[List[Dict[str, Any]]] = Field(
        default_factory=list,
        description="List of test cases with 'input' and 'expected_output'"
    )
    problem_description: Optional[str] = Field(default=None, description="Optional problem statement")


class HintRequest(BaseModel):
    student_id: str = Field(..., description="Unique student identifier")
    problem_id: str = Field(..., description="Problem identifier")
    problem_title: str = Field(..., description="Problem title")
    code: str = Field(default="", description="Current student draft code in editor")
    language: Optional[str] = Field(default="python", description="Programming language")
    requested_level: Optional[int] = Field(default=None, ge=1, le=5, description="1: Gentle, 2: Structure, 3: Approach, 4: Optimization, 5: Solution")
    reveal_solution: Optional[bool] = Field(default=False, description="Must be true to unlock Level 5 complete solution code")


# Default test cases for common practice problems if none passed
DEFAULT_PROBLEM_TEST_CASES = {
    "two-sum": [
        {"input": "([2, 7, 11, 15], 9)", "expected_output": "[0, 1]"},
        {"input": "([3, 2, 4], 6)", "expected_output": "[1, 2]"},
        {"input": "([3, 3], 6)", "expected_output": "[0, 1]"}
    ],
    "reverse-string": [
        {"input": "['h', 'e', 'l', 'l', 'o']", "expected_output": "['o', 'l', 'l', 'e', 'h']"}
    ],
    "palindrome-number": [
        {"input": "121", "expected_output": "true"},
        {"input": "-121", "expected_output": "false"}
    ]
}


# ==============================================================================
# Route Implementations
# ==============================================================================

@router.post("/analyze")
async def analyze_code_submission(payload: AnalyzeCodeRequest):
    """
    Executes student code in a safe, non-Gemini sandbox, evaluates test cases,
    and invokes the Coding Mentor for complexity analysis, debugging guidance,
    and optimization feedback. Stores submission in MongoDB.
    """
    try:
        test_cases = payload.test_cases
        if not test_cases:
            test_cases = DEFAULT_PROBLEM_TEST_CASES.get(payload.problem_id.lower(), [
                {"input": "([2, 7, 11, 15], 9)", "expected_output": "[0, 1]"}
            ])

        result = await coding_mentor_agent.analyze_submission(
            student_id=payload.student_id,
            problem_id=payload.problem_id,
            problem_title=payload.problem_title,
            language=payload.language,
            code=payload.code,
            test_cases=test_cases,
            problem_description=payload.problem_description
        )
        return result
    except Exception as e:
        logger.error(f"Error analyzing code submission for '{payload.student_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze coding submission: {str(e)}"
        )



@router.post("/hint")
async def get_progressive_hint(payload: HintRequest):
    """
    Provides Socratic progressive hints:
    Level 1: Gentle Conceptual Hint
    Level 2: Specific Data Structure Hint
    Level 3: Algorithmic Approach & Invariant
    Level 4: Complexity & Optimization Strategy
    Level 5: Complete Solution (Requires reveal_solution=true)
    """
    try:
        hint_result = await coding_mentor_agent.provide_progressive_hint(
            student_id=payload.student_id,
            problem_id=payload.problem_id,
            problem_title=payload.problem_title,
            code=payload.code,
            language=payload.language or "python",
            requested_level=payload.requested_level,
            reveal_solution=payload.reveal_solution or False
        )
        return hint_result
    except Exception as e:
        logger.error(f"Error generating progressive hint for '{payload.student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate coding hint: {str(e)}"
        )


@router.get("/history/{student_id}")
async def get_coding_history(student_id: str = Path(..., description="Student identifier")):
    """
    Retrieves all past coding submissions for a student from MongoDB.
    """
    try:
        submissions = await student_memory.read_coding_history(student_id)
        return {
            "student_id": student_id,
            "total_submissions": len(submissions),
            "submissions": submissions
        }
    except Exception as e:
        logger.error(f"Error retrieving coding history for '{student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve coding history: {str(e)}"
        )
