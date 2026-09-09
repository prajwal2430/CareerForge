"""
CareerForge AI Service - Deterministic Placement Readiness Scoring Service
==========================================================================
Role: Transparent, reproducible scoring engine with configurable weights.
Calculates deterministic skill scores, skill gaps, learning consistency, and placement readiness.

IMPORTANT:
Gemini NEVER invents numerical scores.
All calculations are strictly deterministic, transparent, and reproducible.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field


class ReadinessWeights(BaseModel):
    """
    Configurable transparent scoring weights. Sum of weights equals 1.0.
    """
    dsa_coding: float = Field(default=0.25, description="DSA assessments + coding submissions")
    java: float = Field(default=0.15, description="Java assessments & code challenges")
    sql: float = Field(default=0.15, description="SQL assessments & database problem solving")
    aptitude: float = Field(default=0.15, description="Aptitude & quantitative assessments")
    interview: float = Field(default=0.15, description="Mock technical and HR interview scores")
    learning_completion: float = Field(default=0.10, description="Roadmap milestones & learning progress")
    consistency: float = Field(default=0.05, description="Weekly activity frequency & practice consistency")


# Default transparent weights
DEFAULT_WEIGHTS = ReadinessWeights()


class ReadinessScoringService:
    """
    Deterministic scoring engine that computes:
    - Individual skill scores (DSA, Java, SQL, Aptitude, Interview, Learning, Consistency)
    - Skill gaps and strong areas
    - Practice consistency & weekly hours
    - Overall Placement Readiness score (0-100)
    - Readiness status ('Placement Ready', 'Needs Improvement', 'Needs Significant Preparation')
    """

    def __init__(self, weights: Optional[ReadinessWeights] = None):
        self.weights = weights or DEFAULT_WEIGHTS

    def calculate_skill_scores(self, student_signals: Dict[str, Any]) -> Dict[str, float]:
        """
        Calculates deterministic 0-100 scores for each skill category from collected signals.
        """
        profile = student_signals.get("profile", {})
        progress = profile.get("progress", {})
        assessments = student_signals.get("assessments", [])
        codings = student_signals.get("coding_submissions", [])
        interviews = student_signals.get("interview_sessions", [])
        learnings = student_signals.get("learning_progress", [])
        roadmap = student_signals.get("roadmap", {})

        # 1. DSA & Coding Score
        dsa_assessments = [
            a.get("score", 0.0) for a in assessments
            if a.get("category", "").lower() in ("dsa", "data structures", "algorithms")
        ]
        recent_dsa = dsa_assessments[:4]
        avg_dsa_assess = sum(recent_dsa) / len(recent_dsa) if recent_dsa else None

        if codings:
            recent_codings = codings[:6]
            accepted_codings = sum(1 for c in recent_codings if c.get("status") == "Accepted")
            coding_acc_rate = (accepted_codings / len(recent_codings)) * 100.0
            total_cases = sum(c.get("total_test_cases", 0) for c in recent_codings)
            passed_cases = sum(c.get("passed_test_cases", 0) for c in recent_codings)
            case_pass_rate = (passed_cases / total_cases * 100.0) if total_cases > 0 else coding_acc_rate
            coding_score = (coding_acc_rate * 0.6) + (case_pass_rate * 0.4)
        else:
            coding_score = None

        if avg_dsa_assess is not None and coding_score is not None:
            dsa_final = (avg_dsa_assess * 0.5) + (coding_score * 0.5)
        elif avg_dsa_assess is not None:
            dsa_final = avg_dsa_assess
        elif coding_score is not None:
            dsa_final = coding_score
        else:
            dsa_final = float(progress.get("dsa", 65.0))

        # 2. Java Score
        java_assessments = [
            a.get("score", 0.0) for a in assessments
            if "java" in a.get("category", "").lower()
        ]
        recent_java = java_assessments[:4]
        java_codings = [c for c in codings if c.get("language", "").lower() == "java"]
        if recent_java:
            java_final = sum(recent_java) / len(recent_java)
        elif java_codings:
            recent_jc = java_codings[:4]
            acc_java = sum(1 for c in recent_jc if c.get("status") == "Accepted")
            java_final = (acc_java / len(recent_jc)) * 100.0
        else:
            # Check verified skills in profile
            java_skill = next((s for s in profile.get("skills", []) if s.get("name", "").lower() == "java"), None)
            if java_skill:
                lvl = java_skill.get("level", "intermediate").lower()
                java_final = 85.0 if lvl == "advanced" else (70.0 if lvl == "intermediate" else 55.0)
            else:
                java_final = 65.0

        # 3. SQL Score
        sql_assessments = [
            a.get("score", 0.0) for a in assessments
            if "sql" in a.get("category", "").lower() or "database" in a.get("category", "").lower()
        ]
        recent_sql = sql_assessments[:4]
        if recent_sql:
            sql_final = sum(recent_sql) / len(recent_sql)
        else:
            sql_skill = next((s for s in profile.get("skills", []) if "sql" in s.get("name", "").lower()), None)
            if sql_skill:
                lvl = sql_skill.get("level", "intermediate").lower()
                sql_final = 85.0 if lvl == "advanced" else (70.0 if lvl == "intermediate" else 55.0)
            else:
                sql_final = 65.0

        # 4. Aptitude Score
        aptitude_assessments = [
            a.get("score", 0.0) for a in assessments
            if a.get("category", "").lower() in ("aptitude", "quant", "logical", "verbal")
        ]
        recent_apt = aptitude_assessments[:4]
        if recent_apt:
            aptitude_final = sum(recent_apt) / len(recent_apt)
        else:
            aptitude_final = float(progress.get("aptitude", 70.0))

        # 5. Interview Score
        completed_interviews = [
            i.get("overall_score", 70.0) for i in interviews
            if i.get("overall_score") is not None
        ]
        recent_iv = completed_interviews[:4]
        if recent_iv:
            interview_final = sum(recent_iv) / len(recent_iv)
        else:
            interview_final = float(progress.get("mock", 68.0))

        # 6. Learning Completion Score
        milestones = roadmap.get("milestones", [])
        if milestones:
            completed_m = sum(1 for m in milestones if m.get("completed"))
            learning_final = (completed_m / len(milestones)) * 100.0
        elif learnings:
            learning_final = min(100.0, len(learnings) * 12.0)
        else:
            learning_final = float(progress.get("courses", 50.0))

        # 7. Practice Consistency Score
        consistency_final = self._calculate_consistency_score(student_signals)

        return {
            "dsa": round(dsa_final, 1),
            "java": round(java_final, 1),
            "sql": round(sql_final, 1),
            "aptitude": round(aptitude_final, 1),
            "interview": round(interview_final, 1),
            "learning": round(learning_final, 1),
            "consistency": round(consistency_final, 1)
        }

    def _calculate_consistency_score(self, student_signals: Dict[str, Any]) -> float:
        """
        Calculates consistency score (0-100) from active timestamps across coding, assessments, and learning.
        """
        timestamps = []
        now = datetime.now(timezone.utc)
        thirty_days_ago = now - timedelta(days=30)

        # Collect dates
        for a in student_signals.get("assessments", []):
            t = a.get("timestamp")
            if isinstance(t, datetime):
                timestamps.append(t)
        for c in student_signals.get("coding_submissions", []):
            t = c.get("timestamp")
            if isinstance(t, datetime):
                timestamps.append(t)
        for l in student_signals.get("learning_progress", []):
            t = l.get("last_accessed")
            if isinstance(t, datetime):
                timestamps.append(t)

        if not timestamps:
            # Fallback to profile streak
            streak = student_signals.get("profile", {}).get("streak", 1)
            return min(100.0, max(40.0, streak * 10.0))

        # Count unique active days within the last 30 days
        active_days = set()
        for ts in timestamps:
            if ts.tzinfo is None:
                ts = ts.replace(tzinfo=timezone.utc)
            if ts >= thirty_days_ago:
                active_days.add(ts.date())

        unique_days_count = len(active_days)
        # 10+ distinct days in past 30 days yields 80+, plus bonus for high activity
        base_score = min(80.0, (unique_days_count / 12.0) * 80.0)
        total_activities = len(timestamps)
        activity_bonus = min(20.0, (total_activities / 15.0) * 20.0)

        return min(100.0, round(base_score + activity_bonus, 1))

    def compute_readiness_score(
        self,
        skills: Dict[str, float],
        custom_weights: Optional[ReadinessWeights] = None
    ) -> float:
        """
        Computes the weighted aggregate readiness score deterministically.
        ReadinessScore = sum(weight_i * skill_i)
        """
        w = custom_weights or self.weights
        total_score = (
            (skills.get("dsa", 65.0) * w.dsa_coding) +
            (skills.get("java", 65.0) * w.java) +
            (skills.get("sql", 65.0) * w.sql) +
            (skills.get("aptitude", 65.0) * w.aptitude) +
            (skills.get("interview", 65.0) * w.interview) +
            (skills.get("learning", 50.0) * w.learning_completion) +
            (skills.get("consistency", 50.0) * w.consistency)
        )
        return round(total_score, 1)

    def determine_status(self, score: float) -> str:
        """
        Maps readiness score to human-readable placement milestone status.
        >= 80: 'Placement Ready'
        70 - 79: 'Needs Improvement'
        < 70: 'Needs Significant Preparation'
        """
        if score >= 80.0:
            return "Placement Ready"
        elif score >= 70.0:
            return "Needs Improvement"
        else:
            return "Needs Significant Preparation"

    def identify_strengths_and_weaknesses(
        self,
        skills: Dict[str, float]
    ) -> Dict[str, List[str]]:
        """
        Segments skills into strong areas (>= 75.0) and weak areas (< 70.0).
        """
        skill_labels = {
            "dsa": "Data Structures & Algorithms",
            "java": "Java Core & OOP",
            "sql": "SQL & Relational Databases",
            "aptitude": "Quantitative & Logical Aptitude",
            "interview": "Mock Technical & HR Interviews",
            "learning": "Roadmap Milestone Completion",
            "consistency": "Practice Consistency"
        }

        strong_areas = [
            skill_labels.get(k, k.upper())
            for k, val in skills.items()
            if val >= 75.0
        ]
        weak_areas = [
            skill_labels.get(k, k.upper())
            for k, val in skills.items()
            if val < 70.0
        ]

        # If all >= 70, pick lowest as focus area
        if not weak_areas:
            sorted_by_score = sorted(skills.items(), key=lambda x: x[1])
            lowest_k = sorted_by_score[0][0]
            weak_areas.append(f"{skill_labels.get(lowest_k, lowest_k)} (Optimization Target)")

        return {
            "strongAreas": strong_areas,
            "weakAreas": weak_areas
        }

    def generate_deterministic_improvements(
        self,
        weak_areas: List[str],
        skills: Dict[str, float]
    ) -> List[str]:
        """
        Constructs deterministic, actionable improvement items tailored to diagnosed gaps.
        """
        improvements = []
        if skills.get("dsa", 0) < 70:
            improvements.append("Increase LeetCode medium problem solving velocity in Dynamic Programming and Trees.")
        if skills.get("sql", 0) < 70:
            improvements.append("Practice advanced SQL query optimizations, subqueries, and window functions.")
        if skills.get("java", 0) < 70:
            improvements.append("Strengthen Java concurrency, memory model, and collections framework fundamentals.")
        if skills.get("aptitude", 0) < 70:
            improvements.append("Complete 2 timed aptitude sets weekly focusing on probability and data interpretation.")
        if skills.get("interview", 0) < 70:
            improvements.append("Participate in another Technical Mock Interview to boost communication & trade-off explanation.")
        if skills.get("consistency", 0) < 70:
            improvements.append("Establish a consistent 4-day active weekly coding cadence to protect your placement streak.")

        if not improvements:
            improvements.append("Maintain active solving velocity and begin full-length timed mock placement marathons.")

        return improvements


# Global Singleton Instance
readiness_scoring_service = ReadinessScoringService()
