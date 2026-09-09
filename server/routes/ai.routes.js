/**
 * LearnHub / CareerForge AI Routes
 * ================================
 * Secure Node.js/Express proxy endpoints forwarding to FastAPI AI service.
 * Includes:
 * - JWT Authentication (protect)
 * - Candidate Authorization (authorizeStudentAccess)
 * - Strict Request Validation
 * - Timeout & Error Handling
 * - Never exposes GEMINI_API_KEY
 */

const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const aiController = require('../controllers/ai.controller');
const {
  authorizeStudentAccess,
  validateMentorChat,
  validateAssessmentStart,
  validateAssessmentSubmit,
  validateCodingAnalyze,
  validateInterviewStart,
  validateInterviewAnswer,
  validateStudentIdParam,
} = require('../validators/ai.validator');

// 1. POST /api/ai/mentor/chat
router.post(
  '/mentor/chat',
  protect,
  authorizeStudentAccess,
  validateMentorChat,
  aiController.mentorChat
);

// 2. POST /api/ai/assessment/start
router.post(
  '/assessment/start',
  protect,
  authorizeStudentAccess,
  validateAssessmentStart,
  aiController.startAssessment
);

// 3. POST /api/ai/assessment/submit
router.post(
  '/assessment/submit',
  protect,
  authorizeStudentAccess,
  validateAssessmentSubmit,
  aiController.submitAssessment
);

// 4. POST /api/ai/learning/generate-roadmap
router.post(
  '/learning/generate-roadmap',
  protect,
  authorizeStudentAccess,
  aiController.generateRoadmap
);

// 4b. GET /api/ai/learning/roadmap
router.get(
  '/learning/roadmap',
  protect,
  aiController.getRoadmap
);

router.get(
  '/learning/roadmap/:studentId',
  protect,
  validateStudentIdParam,
  authorizeStudentAccess,
  aiController.getRoadmap
);

// 4c. POST /api/ai/learning/progress
router.post(
  '/learning/progress',
  protect,
  authorizeStudentAccess,
  aiController.recordLearningProgress
);

// 4d. GET /api/ai/learning/progress/:studentId
router.get(
  '/learning/progress/:studentId',
  protect,
  validateStudentIdParam,
  authorizeStudentAccess,
  aiController.getLearningProgress
);

// 5. POST /api/ai/coding/analyze
router.post(
  '/coding/analyze',
  protect,
  authorizeStudentAccess,
  validateCodingAnalyze,
  aiController.analyzeCodingSubmission
);

// 6. POST /api/ai/interview/start
router.post(
  '/interview/start',
  protect,
  authorizeStudentAccess,
  validateInterviewStart,
  aiController.startInterview
);

// 7. POST /api/ai/interview/answer
router.post(
  '/interview/answer',
  protect,
  authorizeStudentAccess,
  validateInterviewAnswer,
  aiController.answerInterviewQuestion
);

// 8. GET /api/ai/analytics/:studentId
router.get(
  '/analytics/:studentId',
  protect,
  validateStudentIdParam,
  authorizeStudentAccess,
  aiController.getStudentAnalytics
);

// 9. GET /api/ai/readiness/:studentId
router.get(
  '/readiness/:studentId',
  protect,
  validateStudentIdParam,
  authorizeStudentAccess,
  aiController.getStudentReadiness
);

// 10. GET /api/ai/dashboard / GET /api/ai/dashboard/:studentId
router.get(
  '/dashboard',
  protect,
  aiController.getStudentDashboard
);

router.get(
  '/dashboard/:studentId',
  protect,
  validateStudentIdParam,
  authorizeStudentAccess,
  aiController.getStudentDashboard
);

// 11. POST /api/ai/learning/adaptive-update
router.post(
  '/learning/adaptive-update',
  protect,
  authorizeStudentAccess,
  aiController.triggerAdaptiveUpdate
);

// 12. Notifications
router.get(
  '/notifications',
  protect,
  aiController.getNotifications
);

router.get(
  '/notifications/:studentId',
  protect,
  validateStudentIdParam,
  authorizeStudentAccess,
  aiController.getNotifications
);

router.post(
  '/notifications/dispatch',
  protect,
  authorizeStudentAccess,
  aiController.dispatchNotifications
);

router.post(
  '/notifications/trigger',
  protect,
  authorizeStudentAccess,
  aiController.triggerNotification
);

router.patch(
  '/notifications/:id/read',
  protect,
  aiController.markNotificationRead
);

router.delete(
  '/notifications/:id',
  protect,
  aiController.dismissNotification
);

// 13. Resume Analysis
router.post(
  '/resume/analyze',
  protect,
  authorizeStudentAccess,
  aiController.analyzeResume
);

router.get(
  '/resume/latest',
  protect,
  aiController.getLatestResumeAnalysis
);

router.get(
  '/resume/latest/:studentId',
  protect,
  validateStudentIdParam,
  authorizeStudentAccess,
  aiController.getLatestResumeAnalysis
);

router.get(
  '/resume/history',
  protect,
  aiController.getResumeAnalysisHistory
);

router.get(
  '/resume/history/:studentId',
  protect,
  validateStudentIdParam,
  authorizeStudentAccess,
  aiController.getResumeAnalysisHistory
);

module.exports = router;

