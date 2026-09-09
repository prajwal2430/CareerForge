const mongoose = require('mongoose');

const progressAnalyticsSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true },
    weekly_hours: { type: Number, default: 0 },
    problems_solved_weekly: { type: Number, default: 0 },
    dsa_accuracy: { type: Number, default: 0 },
    streak_days: { type: Number, default: 0 },
    recent_velocity: { type: String, default: 'steady' },
    calculated_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const placementReadinessSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true },
    overall_score: { type: Number, default: 0 },
    dsa_mastery: { type: Number, default: 0 },
    core_cs_score: { type: Number, default: 0 },
    interview_score: { type: Number, default: 0 },
    resume_score: { type: Number, default: 0 },
    company_match_scores: { type: mongoose.Schema.Types.Mixed, default: {} },
    predicted_tier: { type: String, default: 'Tier 2 Ready' },
    calculated_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = {
  ProgressAnalytics: mongoose.model('ProgressAnalytics', progressAnalyticsSchema, 'progress_analytics'),
  PlacementReadiness: mongoose.model('PlacementReadiness', placementReadinessSchema, 'placement_readiness'),
};
