"""
CareerForge AI Service - Progress Analytics Routes
==================================================
Endpoints:
- GET /api/ai/readiness/{student_id} : Returns deterministic readiness score, status, skills, strengths, weaknesses, and improvements.
- GET /api/ai/analytics/{student_id} : Returns comprehensive multi-modal performance analytics, trends, activity counts, and narrative.
- GET /api/ai/analytics/history/{student_id} : Returns historical readiness and analytics snapshots.
"""

from fastapi import APIRouter, HTTPException, status, Path
from typing import Dict, Any, List

from app.agents.progress_analytics import progress_analytics_agent
from app.services.student_memory import student_memory
from app.utils.logger import logger

router = APIRouter(prefix="/api/ai", tags=["Progress Analytics"])


@router.get("/readiness/{student_id}")
async def get_placement_readiness(
    student_id: str = Path(..., description="Unique student or user identifier")
):
    """
    Computes deterministic placement readiness scoring:
    - Synthesizes assessment scores, coding acceptance, SQL, Java, aptitude, mock interviews, roadmap milestones, and consistency.
    - Applies transparent configurable weighting (reproducible application logic, never fabricated by AI).
    - Returns:
      {
        "readinessScore": 72,
        "status": "Needs Improvement",
        "skills": {},
        "strongAreas": [],
        "weakAreas": [],
        "improvements": []
      }
    - Stores result in MongoDB history.
    """
    try:
        readiness = await progress_analytics_agent.generate_readiness_report(student_id)
        return readiness
    except Exception as e:
        logger.error(f"Error computing placement readiness for student '{student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate readiness score: {str(e)}"
        )


@router.get("/analytics/{student_id}")
async def get_student_analytics(
    student_id: str = Path(..., description="Unique student or user identifier")
):
    """
    Retrieves full progress analytics dashboard metrics:
    - Readiness score & milestone status
    - Individual skill breakdown
    - Improvement trends (velocity delta vs prior snapshots)
    - Weekly hours & practice consistency
    - Multi-modal activity counts
    - AI-generated analytical narrative
    """
    try:
        analytics = await progress_analytics_agent.generate_full_analytics(student_id)
        return analytics
    except Exception as e:
        logger.error(f"Error retrieving analytics for student '{student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate progress analytics: {str(e)}"
        )


@router.get("/analytics/history/{student_id}")
async def get_analytics_history(
    student_id: str = Path(..., description="Unique student or user identifier")
):
    """
    Retrieves historical placement readiness and progress analytics snapshots from MongoDB.
    """
    try:
        history = await student_memory.read_analytics_history(student_id, limit=20)
        return {
            "student_id": student_id,
            "total_records": len(history),
            "history": history
        }
    except Exception as e:
        logger.error(f"Error retrieving analytics history for student '{student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve analytics history: {str(e)}"
        )


@router.get("/dashboard/{student_id}")
async def get_student_dashboard(
    student_id: str = Path(..., description="Unique student or user identifier")
):
    """
    Synthesizes complete real-time dashboard data for the frontend:
    1. Placement Readiness Score
    2. Skill breakdown (DSA, Java, SQL, Aptitude, Communication, Interview)
    3. Strong areas
    4. Weak areas
    5. Learning progress
    6. Current roadmap
    7. Today's tasks (Today's Plan)
    8. Coding progress
    9. Aptitude progress
    10. Interview progress
    11. Recent AI recommendations
    12. Learning streak
    """
    try:
        dashboard = await progress_analytics_agent.generate_dashboard_data(student_id)
        return dashboard
    except Exception as e:
        logger.error(f"Error generating dashboard for student '{student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate student dashboard: {str(e)}"
        )
