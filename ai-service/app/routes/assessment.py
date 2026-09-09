"""
CareerForge AI Service - Assessment Routes
=========================================
Endpoints:
- POST /api/ai/assessment/start       : Start diagnostic assessment & generate questions
- POST /api/ai/assessment/submit      : Submit answers for deterministic scoring & AI feedback
- GET  /api/ai/assessment/history/{student_id} : View past assessment results
- GET  /api/ai/assessment/skills/{student_id}  : View student skill profile & gap analysis
"""

from fastapi import APIRouter, HTTPException, status, Path
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from app.agents.skill_assessment import skill_assessment_agent
from app.services.student_memory import student_memory
from app.utils.logger import logger

router = APIRouter(prefix="/api/ai/assessment", tags=["Skill Assessment"])


# ==============================================================================
# Request & Response Schemas
# ==============================================================================

class StartAssessmentRequest(BaseModel):
    student_id: str = Field(..., description="Unique student or user identifier")
    category: str = Field(..., description="Category: Java, SQL, DSA, Aptitude, or Technical Fundamentals")
    difficulty: Optional[str] = Field(default="Medium", description="Easy, Medium, Hard, or Adaptive")
    question_count: Optional[int] = Field(default=5, ge=1, le=20, description="Number of questions to generate")
    use_ai: Optional[bool] = Field(default=True, description="Whether to invoke Gemini for adaptive question tailoring")


class StudentQuestionDTO(BaseModel):
    id: str
    category: str
    topic: str
    difficulty: str
    question: str
    options: List[str]


class StartAssessmentResponse(BaseModel):
    assessmentId: str
    category: str
    difficulty: str
    totalQuestions: int
    durationMinutes: int
    questions: List[StudentQuestionDTO]


class SubmitAssessmentRequest(BaseModel):
    assessmentId: str = Field(..., description="ID of the started assessment")
    student_id: str = Field(..., description="Student identifier")
    answers: Dict[str, Any] = Field(..., description="Mapping of questionId -> selected answer index (0..3), letter ('A'..'D'), or option text")


class AssessmentSummaryResponse(BaseModel):
    assessmentId: str
    category: str
    score: int
    strengths: List[str]
    weakAreas: List[str]
    recommendedTopics: List[str]
    passed: Optional[bool] = True
    totalQuestions: Optional[int] = None
    correctCount: Optional[int] = None
    feedback: Optional[str] = None
    topicBreakdown: Optional[Dict[str, float]] = None


# ==============================================================================
# Route Implementations
# ==============================================================================

@router.post("/start", response_model=StartAssessmentResponse)
async def start_assessment(payload: StartAssessmentRequest):
    """
    Starts a new diagnostic assessment session:
    - Queries student memory for existing weaknesses to tailor questions adaptively.
    - Generates questions for Java, SQL, DSA, Aptitude, or Technical Fundamentals.
    - Returns questions to student (with answer keys safely hidden).
    """
    try:
        result = await skill_assessment_agent.start_assessment(
            student_id=payload.student_id,
            category=payload.category,
            difficulty=payload.difficulty or "Medium",
            question_count=payload.question_count or 5,
            use_ai=payload.use_ai if payload.use_ai is not None else True
        )
        return result
    except Exception as e:
        logger.error(f"Error starting assessment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start assessment: {str(e)}"
        )


@router.post("/submit", response_model=AssessmentSummaryResponse)
async def submit_assessment(payload: SubmitAssessmentRequest):
    """
    Submits student answers for evaluation:
    - Evaluates MCQ answers deterministically (NO arbitrary LLM scoring).
    - Calculates exact percentage score, strengths (>=70%), and weak areas (<70%).
    - Generates personalized AI coaching feedback.
    - Updates student profile, skills, weaknesses, and readiness in shared memory.
    """
    try:
        evaluation = await skill_assessment_agent.submit_assessment(
            assessment_id=payload.assessmentId,
            student_id=payload.student_id,
            submitted_answers=payload.answers
        )
        return evaluation
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except Exception as e:
        logger.error(f"Error evaluating assessment submission: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to evaluate assessment submission: {str(e)}"
        )


@router.get("/history/{student_id}")
async def get_assessment_history(student_id: str = Path(..., description="Student identifier")):
    """
    Retrieves all past assessment results for a student from shared memory.
    """
    try:
        history = await student_memory.read_assessment_history(student_id)
        return {
            "student_id": student_id,
            "total_assessments": len(history),
            "history": history
        }
    except Exception as e:
        logger.error(f"Error reading assessment history for '{student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch assessment history: {str(e)}"
        )


@router.get("/skills/{student_id}")
async def get_student_skills(student_id: str = Path(..., description="Student identifier")):
    """
    Retrieves the student's evaluated skills, verified competencies,
    strengths, weak areas, and placement readiness score.
    """
    try:
        profile = await student_memory.read_student_profile(student_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Student profile '{student_id}' not found."
            )

        return {
            "student_id": student_id,
            "name": profile.get("name"),
            "skills": profile.get("skills", []),
            "strengths": profile.get("strengths", []),
            "weaknesses": profile.get("weaknesses", []),
            "readinessScore": profile.get("readinessScore", 0.0),
            "progress": profile.get("progress", {})
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error reading skills for '{student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch student skill profile: {str(e)}"
        )
