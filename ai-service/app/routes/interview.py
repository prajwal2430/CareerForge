"""
CareerForge AI Service - Interview Mentor Routes
===============================================
Endpoints:
- POST /api/ai/interview/start               : Start mock interview (HR or Technical mode)
- POST /api/ai/interview/answer              : Submit answer, receive rubric evaluation & next question
- POST /api/ai/interview/finish              : Wrap up interview & generate comprehensive scorecard
- GET  /api/ai/interview/history/{student_id} : View past interview sessions and rubric history
"""

from fastapi import APIRouter, HTTPException, status, Path
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from app.agents.interview_mentor import interview_mentor_agent
from app.services.student_memory import student_memory
from app.utils.logger import logger

router = APIRouter(prefix="/api/ai/interview", tags=["Interview Mentor"])


# ==============================================================================
# Request & Response Schemas
# ==============================================================================

class StartInterviewRequest(BaseModel):
    student_id: str = Field(..., description="Unique student or user identifier")
    mode: Optional[str] = Field(default="technical", description="Interview mode: 'hr' or 'technical'")
    target_company: Optional[str] = Field(default="General", description="Target company (e.g. Amazon, Google)")
    role: Optional[str] = Field(default="Software Development Engineer", description="Target job title")
    max_questions: Optional[int] = Field(default=4, ge=1, le=10, description="Total questions in this session")


class AnswerQuestionRequest(BaseModel):
    sessionId: str = Field(..., description="Active interview session identifier")
    student_id: str = Field(..., description="Student identifier")
    answer: str = Field(..., description="Written candidate response")


class FinishInterviewRequest(BaseModel):
    sessionId: str = Field(..., description="Interview session identifier")
    student_id: str = Field(..., description="Student identifier")


# ==============================================================================
# Route Implementations
# ==============================================================================

@router.post("/start")
async def start_interview_endpoint(payload: StartInterviewRequest):
    """
    Starts an interactive placement mock interview:
    - Supports two modes: 'hr' (behavioral/culture) and 'technical' (engineering concepts/architecture).
    - Adapts Question 1 based on candidate's career goal, branch, year, and known weak areas.
    - Stores session in MongoDB.
    """
    try:
        session = await interview_mentor_agent.start_interview(
            student_id=payload.student_id,
            mode=payload.mode or "technical",
            target_company=payload.target_company or "General",
            role=payload.role,
            max_questions=payload.max_questions or 4
        )
        return session
    except Exception as e:
        logger.error(f"Error starting interview for '{payload.student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start interview session: {str(e)}"
        )


@router.post("/answer")
async def answer_question_endpoint(payload: AnswerQuestionRequest):
    """
    Submits an answer to the active interview question:
    - Evaluates using Mode-Specific Rubrics:
      * HR Mode: communication, clarity, relevance, confidence indicators, answer quality.
      * Technical Mode: correctness, technical depth, explanation, problem-solving, missing concepts.
    - Gives constructive feedback and generates the next adaptive question.
    """
    try:
        result = await interview_mentor_agent.answer_question(
            session_id=payload.sessionId,
            student_id=payload.student_id,
            answer=payload.answer
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except Exception as e:
        logger.error(f"Error evaluating interview answer for session '{payload.sessionId}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to evaluate answer: {str(e)}"
        )


@router.post("/finish")
async def finish_interview_endpoint(payload: FinishInterviewRequest):
    """
    Concludes the mock interview session:
    - Computes aggregate overall score and dimensional rubric scores.
    - Synthesizes observed strengths, weak areas, and hiring recommendation.
    - Updates student profile mock interview history in MongoDB.
    """
    try:
        summary = await interview_mentor_agent.finish_interview(
            session_id=payload.sessionId,
            student_id=payload.student_id
        )
        return summary
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except Exception as e:
        logger.error(f"Error finishing interview session '{payload.sessionId}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to finalize interview: {str(e)}"
        )


@router.get("/history/{student_id}")
async def get_interview_history_endpoint(student_id: str = Path(..., description="Student identifier")):
    """
    Retrieves all past mock interview sessions, transcripts, and rubric scorecards for a student from MongoDB.
    """
    try:
        history = await student_memory.read_interview_history(student_id)
        return {
            "student_id": student_id,
            "total_sessions": len(history),
            "sessions": history
        }
    except Exception as e:
        logger.error(f"Error retrieving interview history for '{student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve interview history: {str(e)}"
        )
