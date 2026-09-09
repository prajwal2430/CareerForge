from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.config.settings import settings
from app.utils.logger import logger
from app.services.db import connect_to_mongo, close_mongo_connection
from app.services.gemini import get_gemini_client
from app.routes.health import router as health_router
from app.routes.agents import router as agents_router
from app.routes.memory import router as memory_router
from app.routes.gemini import router as gemini_router
from app.routes.assessment import router as assessment_router
from app.routes.learning import router as learning_router
from app.routes.coding import router as coding_router
from app.routes.interview import router as interview_router
from app.routes.analytics import router as analytics_router
from app.routes.coordinator import router as coordinator_router
from app.routes.notifications import router as notifications_router
from app.routes.resume import router as resume_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifecycle context manager.
    Handles startup connection pooling and graceful shutdown.
    """
    logger.info(f"Starting {settings.service_name} in {settings.environment} mode...")
    
    # Connect to MongoDB
    await connect_to_mongo()

    # Initialize Gemini client
    get_gemini_client()

    yield

    # Teardown database connections
    await close_mongo_connection()
    logger.info(f"{settings.service_name} shutdown complete.")


app = FastAPI(
    title="CareerForge AI Service",
    description="Multi-Agent AI Service for CareerForge built with FastAPI, CrewAI, and Gemini",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware configured securely from settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router)
app.include_router(agents_router)
app.include_router(memory_router)
app.include_router(gemini_router)
app.include_router(assessment_router)
app.include_router(learning_router)
app.include_router(coding_router)
app.include_router(interview_router)
app.include_router(analytics_router)
app.include_router(coordinator_router)
app.include_router(notifications_router)
app.include_router(resume_router)


@app.get("/health", tags=["Root"])
async def root_health():
    """Top-level health check alias for container orchestrators (AWS ECS, K8s, Docker)."""
    from app.routes.health import get_health_status
    return await get_health_status()


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": settings.service_name,
        "status": "online",
        "docs": "/docs",
        "health": "/api/ai/health"
    }



if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=(settings.environment == "development")
    )
