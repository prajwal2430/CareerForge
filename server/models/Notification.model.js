const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    notification_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    student_id: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'daily_learning',
        'incomplete_task',
        'learning_streak',
        'milestone_notification',
        'assessment_reminder',
        'interview_practice',
      ],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'dismissed'],
      default: 'unread',
      index: true,
    },
    action_url: {
      type: String,
      default: '/dashboard',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    read_at: {
      type: Date,
      default: null,
    },
    dismissed_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
