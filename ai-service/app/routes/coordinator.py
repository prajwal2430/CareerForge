"""
CareerForge AI Service - Placement Mentor Coordinator Routes
============================================================
Endpoints:
- POST /api/ai/mentor/chat : Primary interactive chat endpoint that routes student requests
                             to the appropriate specialized agent.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from app.agents.coordinator import coordinator_agent
from app.utils.logger import logger

router = APIRouter(prefix="/api/ai/mentor", tags=["Placement Mentor Coordinator"])


class MentorChatRequest(BaseModel):
    studentId: str = Field(..., description="Unique student or user identifier")
    message: str = Field(..., description="Student inquiry, request, or prompt")


class MentorChatResponse(BaseModel):
    agent: str = Field(..., description="Specialized agent ID that handled the request")
    response: str = Field(..., description="Natural language response and guidance")
    actions: List[Dict[str, Any]] = Field(default_factory=list, description="Interactive UI action shortcuts")
    data: Dict[str, Any] = Field(default_factory=dict, description="Structured domain data from the agent")


@router.post("/chat", response_model=MentorChatResponse)
async def mentor_chat(payload: MentorChatRequest):
    """
    Central Coordinator Chat Dispatcher:
    1. Identifies the student's intent.
    2. Reads relevant student memory from MongoDB.
    3. Selects only the appropriate specialized agent.
    4. Passes minimal required context.
    5. Updates shared student memory and execution history.
    6. Returns structured result to frontend.
    """
    try:
        result = await coordinator_agent.handle_student_request(
            student_id=payload.studentId,
            message=payload.message
        )
        return result
    except Exception as e:
        logger.error(f"[COORDINATOR ROUTE] Error handling request for student '{payload.studentId}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Coordinator failed to process request: {str(e)}"
        )
