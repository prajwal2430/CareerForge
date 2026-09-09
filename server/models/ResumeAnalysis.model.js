const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    analysis_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    student_id: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    career_goal: {
      type: String,
      default: 'Software Development Engineer (SDE-1)',
      trim: true,
    },
    file_name: {
      type: String,
      default: 'resume.pdf',
    },
    file_type: {
      type: String,
      default: 'pdf',
    },
    raw_text_length: {
      type: Number,
      default: 0,
    },
    // The 6 extracted dimensions
    parsed_data: {
      skills: [{ type: String }],
      education: [
        {
          degree: String,
          institution: String,
          field_of_study: String,
          year: String,
          gpa: String,
        },
      ],
      projects: [
        {
          title: String,
          description: String,
          technologies: [{ type: String }],
          highlights: [{ type: String }],
        },
      ],
      experience: [
        {
          role: String,
          company: String,
          duration: String,
          description: String,
          achievements: [{ type: String }],
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
          date: String,
        },
      ],
      technologies: [{ type: String }],
    },
    // The generated benchmark & analysis
    analysis: {
      ats_score: { type: Number, default: 0, min: 0, max: 100 },
      career_goal: String,
      target_role_title: String,
      detected_skills: [{ type: String }],
      missing_skills: [{ type: String }],
      recommended_skills: [{ type: String }],
      recommended_projects: [
        {
          title: String,
          technologies: [{ type: String }],
          description: String,
          goal_alignment: String,
        },
      ],
      recommended_learning_topics: [{ type: String }],
      summary: String,
    },
  },
  {
    timestamps: true,
    strict: false,
    collection: 'resume_analyses',
  }
);

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
