const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true }, // DSA, Web Dev, System Design, Aptitude
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    topics: [{ type: String }],
    total_questions: { type: Number, default: 10 },
    duration_minutes: { type: Number, default: 30 },
  },
  { timestamps: true }
);

const assessmentResultSchema = new mongoose.Schema(
  {
    assessment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', default: null },
    student_id: { type: String, required: true },
    category: { type: String, required: true },
    score: { type: Number, required: true },
    total_score: { type: Number, default: 100 },
    passed: { type: Boolean, default: true },
    topic_breakdown: { type: mongoose.Schema.Types.Mixed, default: {} },
    feedback: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = {
  Assessment: mongoose.model('Assessment', assessmentSchema),
  AssessmentResult: mongoose.model('AssessmentResult', assessmentResultSchema, 'assessment_results'),
};
