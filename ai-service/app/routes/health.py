from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel

from app.config.settings import settings
from app.services.db import get_client
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api/ai", tags=["Health"])


class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str
    timestamp: str
    database: str
    gemini: str


async def get_health_status() -> HealthResponse:
    db_status = "disconnected"
    mongo_client = get_client()
    if mongo_client is not None:
        try:
            await mongo_client.admin.command("ping")
            db_status = "connected"
        except Exception:
            db_status = "unreachable"

    gemini_status = "configured" if gemini_service.is_configured() else "offline_fallback"
    is_healthy = db_status == "connected"

    return HealthResponse(
        status="ok" if is_healthy else "degraded",
        service=settings.service_name,
        environment=settings.environment,
        timestamp=datetime.utcnow().isoformat() + "Z",
        database=db_status,
        gemini=gemini_status,
    )


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint for the CareerForge AI Service (/api/ai/health).
    Reports database connectivity and Gemini readiness without leaking secrets.
    """
    return await get_health_status()

