const mongoose = require('mongoose');

const codingSubmissionSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true },
    problem_id: { type: String, required: true },
    problem_title: { type: String, required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error'],
      default: 'Accepted',
    },
    runtime_ms: { type: Number, default: 0 },
    memory_mb: { type: Number, default: 0 },
    passed_test_cases: { type: Number, default: 0 },
    total_test_cases: { type: Number, default: 0 },
    ai_feedback: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CodingSubmission', codingSubmissionSchema, 'coding_submissions');
