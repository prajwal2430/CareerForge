const mongoose = require('mongoose');

const interviewTurnSchema = new mongoose.Schema({
  speaker: { type: String, enum: ['agent', 'user'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const interviewSessionSchema = new mongoose.Schema(
  {
    session_id: { type: String, required: true, unique: true },
    student_id: { type: String, required: true },
    target_company: { type: String, required: true },
    interview_type: {
      type: String,
      enum: ['technical', 'behavioral', 'system_design'],
      default: 'technical',
    },
    role: { type: String, default: 'Software Engineer' },
    dialogue: [interviewTurnSchema],
    overall_score: { type: Number, default: null },
    rubric_scores: { type: mongoose.Schema.Types.Mixed, default: {} },
    strengths_observed: [{ type: String }],
    weaknesses_observed: [{ type: String }],
    recommendations: { type: String, default: '' },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
    completed_at: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewSession', interviewSessionSchema, 'interview_sessions');
