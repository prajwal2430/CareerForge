from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ResumeData(BaseModel):
    raw_text: Optional[str] = None
    file_url: Optional[str] = None
    ats_score: Optional[int] = 0
    extracted_skills: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)


class SkillItem(BaseModel):
    name: str
    level: str = "Beginner"  # Beginner, Intermediate, Advanced, Expert
    verified: bool = False
    last_assessed: Optional[datetime] = None


class Assessment(BaseModel):
    title: str
    category: str  # DSA, Web Dev, System Design, Aptitude
    difficulty: str = "Medium"  # Easy, Medium, Hard
    topics: List[str] = Field(default_factory=list)
    total_questions: int = 10
    duration_minutes: int = 30
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AssessmentResult(BaseModel):
    assessment_id: Optional[str] = None
    student_id: str
    category: str
    score: float
    total_score: float = 100.0
    passed: bool = True
    topic_breakdown: Dict[str, float] = Field(default_factory=dict)
    feedback: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CodingSubmission(BaseModel):
    student_id: str
    problem_id: str
    problem_title: str
    language: str  # javascript, python, java, cpp
    code: str
    status: str  # Accepted, Wrong Answer, Time Limit Exceeded, Runtime Error
    runtime_ms: Optional[float] = None
    memory_mb: Optional[float] = None
    passed_test_cases: int = 0
    total_test_cases: int = 0
    ai_feedback: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RoadmapMilestone(BaseModel):
    step_id: int
    title: str
    category: str
    completed: bool = False
    resources: List[str] = Field(default_factory=list)


class LearningRoadmap(BaseModel):
    student_id: str
    track_title: str  # e.g. "Full-Stack SDE", "DSA Placement Track"
    target_company: Optional[str] = None
    duration_weeks: int = 12
    progress_percentage: float = 0.0
    milestones: List[RoadmapMilestone] = Field(default_factory=list)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LearningProgress(BaseModel):
    student_id: str
    course_id: str
    course_title: str
    category: str
    completed_lessons: List[str] = Field(default_factory=list)
    total_lessons: int = 0
    progress_percentage: float = 0.0
    time_spent_hours: float = 0.0
    last_accessed: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class InterviewTurn(BaseModel):
    speaker: str  # agent, user
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class InterviewSession(BaseModel):
    session_id: str
    student_id: str
    target_company: str
    interview_type: str  # technical, behavioral, system_design
    role: str = "Software Engineer"
    dialogue: List[InterviewTurn] = Field(default_factory=list)
    overall_score: Optional[float] = None  # 0 to 10
    rubric_scores: Dict[str, float] = Field(default_factory=dict)
    strengths_observed: List[str] = Field(default_factory=list)
    weaknesses_observed: List[str] = Field(default_factory=list)
    recommendations: Optional[str] = None
    status: str = "in_progress"  # in_progress, completed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None


class ProgressAnalytics(BaseModel):
    student_id: str
    weekly_hours: float = 0.0
    problems_solved_weekly: int = 0
    dsa_accuracy: float = 0.0
    streak_days: int = 1
    recent_velocity: str = "steady"  # accelerating, steady, decelerating
    calculated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PlacementReadiness(BaseModel):
    student_id: str
    overall_score: float = 0.0  # 0 to 100
    dsa_mastery: float = 0.0
    core_cs_score: float = 0.0
    interview_score: float = 0.0
    resume_score: float = 0.0
    company_match_scores: Dict[str, float] = Field(default_factory=dict)  # e.g. {"Google": 68.0, "Amazon": 75.0}
    predicted_tier: str = "Tier 2 Ready"  # Tier 1, Tier 2, Tier 3
    calculated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AgentResult(BaseModel):
    student_id: str
    agent_name: str
    task_name: str
    output_summary: str
    details: Dict[str, Any] = Field(default_factory=dict)
    artifacts: List[Dict[str, Any]] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Student(BaseModel):
    student_id: str
    user_id: Optional[str] = None
    name: str
    email: str
    branch: Optional[str] = "Computer Science"
    year: Optional[str] = "4th Year"
    careerGoal: Optional[str] = "Software Development Engineer (SDE-1)"
    resume: ResumeData = Field(default_factory=ResumeData)
    skills: List[SkillItem] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    assessmentHistory: List[Dict[str, Any]] = Field(default_factory=list)
    codingHistory: List[Dict[str, Any]] = Field(default_factory=list)
    learningHistory: List[Dict[str, Any]] = Field(default_factory=list)
    interviewHistory: List[Dict[str, Any]] = Field(default_factory=list)
    roadmap: Dict[str, Any] = Field(default_factory=dict)
    progress: Dict[str, Any] = Field(default_factory=lambda: {
        "dsa": 0.0,
        "courses": 0.0,
        "mock": 0.0,
        "resume": 0.0,
        "overall": 0.0
    })
    readinessScore: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
