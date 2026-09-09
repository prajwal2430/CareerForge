"""
CareerForge AI Service - Learning Routes
=======================================
Endpoints:
- POST /api/ai/learning/generate-roadmap  : Generate personalized adaptive learning roadmap
- GET  /api/ai/learning/roadmap/{student_id} : Get current active roadmap
- POST /api/ai/learning/progress          : Record milestone / lesson completion
- GET  /api/ai/learning/progress/{student_id} : Get learning progress summary & hours
"""

from fastapi import APIRouter, HTTPException, status, Path
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from app.agents.learning_recommendation import learning_recommendation_agent
from app.services.student_memory import student_memory
from app.utils.logger import logger

router = APIRouter(prefix="/api/ai/learning", tags=["Learning Recommendation"])


# ==============================================================================
# Request & Response Schemas
# ==============================================================================

class GenerateRoadmapRequest(BaseModel):
    student_id: str = Field(..., description="Unique student or user identifier")
    custom_goal: Optional[str] = Field(default=None, description="Optional career goal override")
    target_company: Optional[str] = Field(default=None, description="Optional target company (e.g. Google, Amazon)")
    duration_weeks: Optional[int] = Field(default=8, ge=2, le=52, description="Target timeline in weeks")


class RecordProgressRequest(BaseModel):
    student_id: str = Field(..., description="Unique student identifier")
    step_id: Optional[int] = Field(default=None, description="Roadmap milestone step_id if a milestone was completed")
    course_id: Optional[str] = Field(default=None, description="Course ID or module identifier")
    course_title: Optional[str] = Field(default="Learning Milestone", description="Title of course or task")
    completed_lessons: Optional[List[str]] = Field(default_factory=list, description="List of completed lesson names")
    time_spent_hours: Optional[float] = Field(default=1.0, ge=0.1, description="Hours spent on this activity")
    category: Optional[str] = Field(default="General", description="Topic category (e.g. DSA, SQL, Java)")


class AdaptiveUpdateRequest(BaseModel):
    student_id: str = Field(..., description="Unique student identifier")
    trigger: Optional[str] = Field(default="manual_request", description="Trigger source description")
    skill_shifts_override: Optional[Dict[str, Any]] = Field(default=None, description="Optional explicit skill shift overrides for testing")


# ==============================================================================
# Route Implementations
# ==============================================================================

@router.post("/generate-roadmap")
async def generate_roadmap_endpoint(payload: GenerateRoadmapRequest):
    """
    Generates a personalized, adaptive learning roadmap:
    - Reads student profile, career goal, weak areas, strong areas, and score trends.
    - Calibrates practice allocations (e.g. increases DSA if weak, reduces aptitude if strong, escalates SQL difficulty if improving).
    - Persists the roadmap to MongoDB `learning_roadmaps` and updates student memory.
    """
    try:
        roadmap = await learning_recommendation_agent.generate_personalized_roadmap(
            student_id=payload.student_id,
            custom_goal=payload.custom_goal,
            target_company=payload.target_company,
            duration_weeks=payload.duration_weeks or 8
        )
        return roadmap
    except Exception as e:
        logger.error(f"Error generating learning roadmap for '{payload.student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate learning roadmap: {str(e)}"
        )


@router.get("/roadmap/{student_id}")
async def get_roadmap_endpoint(student_id: str = Path(..., description="Student identifier")):
    """
    Retrieves the active personalized roadmap for a student from MongoDB.
    If no roadmap exists, automatically generates a personalized roadmap based on current student memory.
    """
    try:
        roadmap = await student_memory.read_roadmap(student_id)
        if not roadmap:
            logger.info(f"No existing roadmap found for '{student_id}'. Generating initial personalized roadmap.")
            roadmap = await learning_recommendation_agent.generate_personalized_roadmap(student_id=student_id)

        return roadmap
    except Exception as e:
        logger.error(f"Error retrieving roadmap for '{student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve learning roadmap: {str(e)}"
        )


@router.post("/adaptive-update")
async def adaptive_update_endpoint(payload: AdaptiveUpdateRequest):
    """
    Explicitly triggers the continuous adaptive learning loop:
    - Analyzes student performance signals across all modalities.
    - Evaluates skill shifts (improved, remains weak, became strong, weak interview, weak coding).
    - Adaptively updates the existing roadmap without blind regeneration.
    """
    try:
        from app.services.adaptive_loop import adaptive_learning_loop
        result = await adaptive_learning_loop.evaluate_and_adapt(
            student_id=payload.student_id,
            trigger_source=payload.trigger or "manual_trigger",
            trigger_payload=payload.skill_shifts_override
        )
        return result
    except Exception as e:
        logger.error(f"Error in adaptive update for '{payload.student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to execute adaptive learning loop: {str(e)}"
        )


@router.post("/progress")
async def record_progress_endpoint(payload: RecordProgressRequest):
    """
    Records completed learning modules or roadmap milestones:
    - Updates `learning_progress` collection in MongoDB.
    - Updates completion status for the corresponding roadmap milestone step in `learning_roadmaps`.
    - Recalculates overall roadmap progress percentage and updates student profile metrics.
    - Dispatches milestone notifications upon milestone completion.
    - Triggers adaptive learning loop to keep recommendations up to date.
    """
    try:
        record = await student_memory.record_learning_progress(
            identifier=payload.student_id,
            progress_data=payload.model_dump()
        )
        # Fetch updated summary
        summary = await student_memory.read_learning_progress_summary(payload.student_id)

        # Trigger milestone notification if milestone completed
        if payload.step_id:
            try:
                from app.services.notification_service import notification_service
                await notification_service.generate_milestone_notification(
                    student_id=payload.student_id,
                    milestone_data={
                        "step_id": payload.step_id,
                        "title": payload.course_title,
                        "category": payload.category
                    }
                )
            except Exception as ne:
                logger.warning(f"Could not generate milestone notification: {ne}")

        # Trigger adaptive learning loop to reflect progress
        try:
            from app.services.adaptive_loop import adaptive_learning_loop
            await adaptive_learning_loop.evaluate_and_adapt(
                student_id=payload.student_id,
                trigger_source="learning_progress",
                trigger_payload=payload.model_dump()
            )
        except Exception as le:
            logger.warning(f"Could not run adaptive loop after learning progress: {le}")

        return {
            "status": "success",
            "recorded": record,
            "summary": summary
        }
    except Exception as e:
        logger.error(f"Error recording learning progress for '{payload.student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record learning progress: {str(e)}"
        )


@router.get("/progress/{student_id}")
async def get_progress_endpoint(student_id: str = Path(..., description="Student identifier")):
    """
    Retrieves learning progress summary, milestone completion status, and hours spent.
    """
    try:
        summary = await student_memory.read_learning_progress_summary(student_id)
        return summary
    except Exception as e:
        logger.error(f"Error reading progress for '{student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve learning progress: {str(e)}"
        )

