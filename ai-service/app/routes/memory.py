from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from app.services.student_memory import student_memory

router = APIRouter(prefix="/api/ai/memory", tags=["Shared Student Memory"])


class UpdateSkillsPayload(BaseModel):
    skills: List[Dict[str, Any]]
    mode: str = "merge"


class UpdateWeaknessesPayload(BaseModel):
    weaknesses: List[str]
    mode: str = "merge"


class SaveAgentResultPayload(BaseModel):
    agent_name: str
    task_name: str
    result_data: Dict[str, Any]
    artifacts: Optional[List[Dict[str, Any]]] = None


class InitializeStudentPayload(BaseModel):
    student_id: str
    email: str
    name: str
    branch: Optional[str] = "Computer Science"
    year: Optional[str] = "4th Year"
    careerGoal: Optional[str] = "Software Development Engineer (SDE-1)"


@router.post("/init")
async def init_student(payload: InitializeStudentPayload):
    """
    Initialize or retrieve a student profile in the shared memory system.
    """
    student = await student_memory.get_or_create_student(
        student_id=payload.student_id,
        email=payload.email,
        name=payload.name,
        branch=payload.branch or "Computer Science",
        year=payload.year or "4th Year",
        careerGoal=payload.careerGoal or "Software Development Engineer (SDE-1)"
    )
    return {"status": "ok", "student": student}


@router.get("/student/{identifier}")
async def get_student_profile(identifier: str):
    """
    Read full student profile from shared memory.
    """
    profile = await student_memory.read_student_profile(identifier)
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return profile


@router.get("/student/{identifier}/scores")
async def get_latest_scores(identifier: str):
    """
    Read latest scores across assessments, coding submissions, and interviews.
    """
    return await student_memory.read_latest_scores(identifier)


@router.get("/student/{identifier}/weaknesses")
async def get_weaknesses(identifier: str):
    """
    Read student diagnosed weaknesses.
    """
    weaknesses = await student_memory.read_weaknesses(identifier)
    return {"weaknesses": weaknesses}


@router.get("/student/{identifier}/learning-history")
async def get_learning_history(identifier: str, limit: int = Query(default=10, ge=1, le=50)):
    """
    Read course completion history.
    """
    history = await student_memory.read_learning_history(identifier, limit=limit)
    return {"learning_history": history}


@router.get("/student/{identifier}/interview-history")
async def get_interview_history(identifier: str, limit: int = Query(default=5, ge=1, le=20)):
    """
    Read mock interview history.
    """
    history = await student_memory.read_interview_history(identifier, limit=limit)
    return {"interview_history": history}


@router.post("/student/{identifier}/skills")
async def update_skills(identifier: str, payload: UpdateSkillsPayload):
    """
    Update student skills in shared memory.
    """
    updated = await student_memory.update_skills(identifier, payload.skills, mode=payload.mode)
    return {"status": "ok", "skills": updated}


@router.post("/student/{identifier}/weaknesses")
async def update_weaknesses(identifier: str, payload: UpdateWeaknessesPayload):
    """
    Update student weaknesses in shared memory.
    """
    updated = await student_memory.update_weaknesses(identifier, payload.weaknesses, mode=payload.mode)
    return {"status": "ok", "weaknesses": updated}


@router.post("/student/{identifier}/roadmap")
async def update_roadmap(identifier: str, roadmap: Dict[str, Any]):
    """
    Update student learning roadmap in shared memory.
    """
    updated = await student_memory.update_roadmap(identifier, roadmap)
    return {"status": "ok", "roadmap": updated}


@router.post("/student/{identifier}/agent-result")
async def save_agent_result(identifier: str, payload: SaveAgentResultPayload):
    """
    Save agent execution output to shared memory.
    """
    record = await student_memory.save_agent_result(
        identifier=identifier,
        agent_name=payload.agent_name,
        task_name=payload.task_name,
        result_data=payload.result_data,
        artifacts=payload.artifacts
    )
    return {"status": "ok", "record": record}
