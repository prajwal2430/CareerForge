const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    student_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    branch: {
      type: String,
      default: 'Computer Science',
      trim: true,
    },
    year: {
      type: String,
      default: '4th Year',
      trim: true,
    },
    careerGoal: {
      type: String,
      default: 'Software Development Engineer (SDE-1)',
      trim: true,
    },
    resume: {
      raw_text: { type: String, default: '' },
      file_url: { type: String, default: '' },
      ats_score: { type: Number, default: 0 },
      extracted_skills: [{ type: String }],
      suggestions: [{ type: String }],
    },
    skills: [
      {
        name: { type: String, required: true },
        level: { type: String, default: 'Intermediate' },
        verified: { type: Boolean, default: false },
        last_assessed: { type: Date, default: null },
      },
    ],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    assessmentHistory: [{ type: mongoose.Schema.Types.Mixed }],
    codingHistory: [{ type: mongoose.Schema.Types.Mixed }],
    learningHistory: [{ type: mongoose.Schema.Types.Mixed }],
    interviewHistory: [{ type: mongoose.Schema.Types.Mixed }],
    roadmap: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    progress: {
      dsa: { type: Number, default: 0 },
      courses: { type: Number, default: 0 },
      mock: { type: Number, default: 0 },
      resume: { type: Number, default: 0 },
      overall: { type: Number, default: 0 },
    },
    readinessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
