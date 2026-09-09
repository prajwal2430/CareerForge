"""
CareerForge AI Service - Resume Analysis Routes
===============================================
Endpoints:
- POST /api/ai/resume/analyze: Upload / paste resume for extraction, career goal benchmarking, and skill syncing.
- GET  /api/ai/resume/latest/{student_id}: Retrieve most recent structured analysis.
- GET  /api/ai/resume/history/{student_id}: Retrieve historical analyses.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Query

from app.services.resume_service import resume_service
from app.services.student_memory import student_memory
from app.utils.logger import logger

router = APIRouter(prefix="/api/ai/resume", tags=["Resume Analysis"])


class AnalyzeResumeRequest(BaseModel):
    student_id: str = Field(..., description="Unique Student ID or username")
    file_base64: Optional[str] = Field(None, description="Base64 encoded PDF or document bytes")
    resume_text: Optional[str] = Field(None, description="Plain text resume content")
    file_name: Optional[str] = Field("resume.pdf", description="Original file name")
    file_type: Optional[str] = Field("pdf", description="File extension / MIME type")
    career_goal_override: Optional[str] = Field(None, description="Override target role for benchmark")


@router.post("/analyze", response_model=Dict[str, Any])
async def analyze_resume(req: AnalyzeResumeRequest):
    """
    Extracts structured resume sections, compares against student's career goal,
    synchronizes skills and weaknesses with student profile, and persists record in MongoDB.
    """
    try:
        result = await resume_service.analyze_and_sync(
            student_id=req.student_id,
            file_base64=req.file_base64,
            resume_text=req.resume_text,
            file_name=req.file_name or "resume.pdf",
            file_type=req.file_type or "pdf",
            career_goal_override=req.career_goal_override
        )
        return {
            "success": True,
            "analysis": result
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error in resume analysis endpoint for {req.student_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")


@router.get("/latest/{student_id}")
async def get_latest_resume_analysis(student_id: str):
    """
    Retrieves the most recent structured resume analysis for the student.
    """
    analysis = await student_memory.read_latest_resume_analysis(student_id)
    if not analysis:
        # Check student profile for embedded resume data
        profile = await student_memory.read_student_profile(student_id)
        if profile and profile.get("resume_analysis"):
            return {
                "success": True,
                "analysis": {
                    "student_id": student_id,
                    "analysis": profile.get("resume_analysis"),
                    "parsed_data": {
                        "skills": profile.get("resume", {}).get("extracted_skills", [])
                    }
                }
            }
        return {
            "success": False,
            "message": f"No resume analysis found for student '{student_id}'"
        }
    return {
        "success": True,
        "analysis": analysis
    }


@router.get("/history/{student_id}")
async def get_resume_history(student_id: str, limit: int = Query(10, ge=1, le=50)):
    """
    Retrieves historical resume analysis records.
    """
    history = await student_memory.read_resume_history(student_id, limit=limit)
    return {
        "success": True,
        "student_id": student_id,
        "total": len(history),
        "history": history
    }
