const mongoose = require('mongoose');

const learningRoadmapSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true },
    track_title: { type: String, required: true },
    target_company: { type: String, default: null },
    duration_weeks: { type: Number, default: 12 },
    progress_percentage: { type: Number, default: 0 },
    milestones: [
      {
        step_id: { type: Number, required: true },
        title: { type: String, required: true },
        category: { type: String, default: 'General' },
        completed: { type: Boolean, default: false },
        resources: [{ type: String }],
      },
    ],
  },
  { timestamps: true, strict: false }
);

const learningProgressSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true },
    course_id: { type: String, required: true },
    course_title: { type: String, required: true },
    category: { type: String, required: true },
    completed_lessons: [{ type: String }],
    total_lessons: { type: Number, default: 0 },
    progress_percentage: { type: Number, default: 0 },
    time_spent_hours: { type: Number, default: 0 },
    last_accessed: { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false }
);

module.exports = {
  LearningRoadmap: mongoose.model('LearningRoadmap', learningRoadmapSchema, 'learning_roadmaps'),
  LearningProgress: mongoose.model('LearningProgress', learningProgressSchema, 'learning_progress'),
};
