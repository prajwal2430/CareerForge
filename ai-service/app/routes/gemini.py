"""
Internal Gemini Integration Endpoints
====================================
Provides diagnostics and controlled connectivity test endpoints for Google Gemini.
API keys and sensitive student information are never exposed in responses or logs.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

from app.services.gemini_service import (
    gemini_service,
    GeminiServiceError,
    GeminiAPIKeyMissingError,
    GeminiTimeoutError,
    GeminiRateLimitError,
    GeminiResponseParsingError,
)
from app.config.settings import settings
from app.utils.logger import logger

router = APIRouter(prefix="/api/ai/gemini", tags=["Gemini"])


class ControlledPromptRequest(BaseModel):
    """
    Optional request body for testing custom controlled prompts internally.
    """
    prompt: Optional[str] = Field(
        default=None,
        description="Controlled prompt to send to Gemini. If null, a standardized test prompt is used."
    )
    model: Optional[str] = Field(
        default=None,
        description="Optional model override (e.g. gemini-2.5-flash)"
    )


class ControlledPromptResponse(BaseModel):
    success: bool
    configured: bool
    model: str
    latency_ms: Optional[float] = None
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


@router.get("/status")
async def get_gemini_status():
    """
    Get Gemini service configuration status.
    NEVER exposes the API key or raw secrets.
    """
    is_conf = gemini_service.is_configured()
    return {
        "service": settings.service_name,
        "configured": is_conf,
        "default_model": settings.gemini_model,
        "timeout_seconds": settings.gemini_timeout_seconds,
        "status": "ready" if is_conf else "api_key_missing",
        "message": (
            "Gemini AI service is configured and ready."
            if is_conf
            else "GEMINI_API_KEY is not configured or is using default placeholder in ai-service/.env."
        )
    }


@router.post("/test", response_model=ControlledPromptResponse)
async def test_gemini_endpoint(request: Optional[ControlledPromptRequest] = None):
    """
    Internal controlled test endpoint.
    Sends a controlled verification prompt to Gemini to verify connectivity and JSON schema parsing.
    Does NOT leak API key or sensitive data.
    """
    model = request.model if request else None

    # Run the controlled connectivity test
    result = await gemini_service.test_connection(model=model)

    if not result.get("success"):
        logger.warning("Gemini test endpoint reported unsuccessful connectivity.")
        return ControlledPromptResponse(
            success=False,
            configured=result.get("configured", False),
            model=result.get("model", settings.gemini_model),
            error=result.get("error", "Unknown error during test")
        )

    return ControlledPromptResponse(
        success=True,
        configured=True,
        model=result["model"],
        latency_ms=result.get("latency_ms"),
        data=result.get("verification")
    )
