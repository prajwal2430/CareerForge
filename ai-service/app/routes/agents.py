from fastapi import APIRouter
from app.agents import (
    CoordinatorAgent,
    SkillAssessmentAgent,
    LearningRecommendationAgent,
    CodingMentorAgent,
    InterviewMentorAgent,
    ProgressAnalyticsAgent,
)

router = APIRouter(prefix="/api/ai/agents", tags=["Agents (Placeholder)"])

coordinator = CoordinatorAgent()
skill_assessor = SkillAssessmentAgent()
learning_strategist = LearningRecommendationAgent()
coding_mentor = CodingMentorAgent()
interview_mentor = InterviewMentorAgent()
analytics_agent = ProgressAnalyticsAgent()


@router.get("/")
async def list_agents():
    """
    List all registered AI agents in the CareerForge Multi-Agent cluster.
    """
    return {
        "status": "ready",
        "agents": [
            {"id": "coordinator", "name": coordinator.name, "role": coordinator.role},
            {"id": "skill_assessment", "name": skill_assessor.name, "role": skill_assessor.role},
            {"id": "learning_recommendation", "name": learning_strategist.name, "role": learning_strategist.role},
            {"id": "coding_mentor", "name": coding_mentor.name, "role": coding_mentor.role},
            {"id": "interview_mentor", "name": interview_mentor.name, "role": interview_mentor.role},
            {"id": "progress_analytics", "name": analytics_agent.name, "role": analytics_agent.role},
        ]
    }
