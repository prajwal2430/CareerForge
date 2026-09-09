/**
 * LearnHub / CareerForge AI Proxy Controller
 * ==========================================
 * Securely proxies client requests from the Node.js/Express backend
 * to the internal FastAPI AI service.
 * Handles student ID binding, error wrapping, and prevents key exposure.
 */

const { callAIService, AIServiceError } = require('../services/aiService');
const { errorResponse } = require('../utils/responseHelper');

/**
 * Extracts student ID from authenticated user or request
 */
const getEffectiveStudentId = (req) => {
  return (
    req.body.studentId ||
    req.body.student_id ||
    req.params.studentId ||
    req.user?._id?.toString() ||
    req.user?.student_id ||
    req.user?.id ||
    'default_student'
  );
};

// 1. POST /api/ai/mentor/chat
const mentorChat = async (req, res, next) => {
  try {
    const studentId = getEffectiveStudentId(req);
    const { message } = req.body;

    const result = await callAIService('/api/ai/mentor/chat', {
      method: 'POST',
      body: {
        studentId,
        message,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 2. POST /api/ai/assessment/start
const startAssessment = async (req, res, next) => {
  try {
    const student_id = getEffectiveStudentId(req);
    const { category, difficulty, question_count, use_ai } = req.body;

    const result = await callAIService('/api/ai/assessment/start', {
      method: 'POST',
      body: {
        student_id,
        category,
        difficulty: difficulty || 'Medium',
        question_count: question_count || 5,
        use_ai: use_ai !== undefined ? use_ai : false,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 3. POST /api/ai/assessment/submit
const submitAssessment = async (req, res, next) => {
  try {
    const student_id = getEffectiveStudentId(req);
    const { assessmentId, answers, timeSpentSeconds } = req.body;

    const result = await callAIService('/api/ai/assessment/submit', {
      method: 'POST',
      body: {
        assessmentId,
        student_id,
        answers,
        timeSpentSeconds: timeSpentSeconds || 0,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 4. POST /api/ai/learning/generate-roadmap
const generateRoadmap = async (req, res, next) => {
  try {
    const student_id = getEffectiveStudentId(req);
    const { custom_goal, target_company, duration_weeks } = req.body;

    const result = await callAIService('/api/ai/learning/generate-roadmap', {
      method: 'POST',
      body: {
        student_id,
        custom_goal,
        target_company,
        duration_weeks: duration_weeks || 8,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 4b. GET /api/ai/learning/roadmap or /api/ai/learning/roadmap/:studentId
const getRoadmap = async (req, res, next) => {
  try {
    const student_id = req.params.studentId || getEffectiveStudentId(req);
    const result = await callAIService(`/api/ai/learning/roadmap/${encodeURIComponent(student_id)}`, {
      method: 'GET',
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 4c. POST /api/ai/learning/progress
const recordLearningProgress = async (req, res, next) => {
  try {
    const student_id = getEffectiveStudentId(req);
    const { step_id, course_id, course_title, completed_lessons, time_spent_hours, category } = req.body;

    const result = await callAIService('/api/ai/learning/progress', {
      method: 'POST',
      body: {
        student_id,
        step_id,
        course_id,
        course_title,
        completed_lessons,
        time_spent_hours,
        category,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 4d. GET /api/ai/learning/progress/:studentId
const getLearningProgress = async (req, res, next) => {
  try {
    const student_id = req.params.studentId || getEffectiveStudentId(req);
    const result = await callAIService(`/api/ai/learning/progress/${encodeURIComponent(student_id)}`, {
      method: 'GET',
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 5. POST /api/ai/coding/analyze
const analyzeCodingSubmission = async (req, res, next) => {
  try {
    const student_id = getEffectiveStudentId(req);
    const {
      problem_id,
      problemId,
      problem_title,
      problemTitle,
      language,
      code,
      test_cases,
      testCases,
      problem_description,
    } = req.body;

    const result = await callAIService('/api/ai/coding/analyze', {
      method: 'POST',
      body: {
        student_id,
        problem_id: problem_id || problemId || 'general_problem',
        problem_title: problem_title || problemTitle || 'Algorithm Practice',
        language: language || 'python',
        code,
        test_cases: test_cases || testCases || [],
        problem_description: problem_description || '',
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 6. POST /api/ai/interview/start
const startInterview = async (req, res, next) => {
  try {
    const student_id = getEffectiveStudentId(req);
    const { mode, target_company, role, max_questions } = req.body;

    const result = await callAIService('/api/ai/interview/start', {
      method: 'POST',
      body: {
        student_id,
        mode: mode || 'technical',
        target_company: target_company || 'General',
        role: role || 'Software Development Engineer',
        max_questions: max_questions || 4,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 7. POST /api/ai/interview/answer
const answerInterviewQuestion = async (req, res, next) => {
  try {
    const student_id = getEffectiveStudentId(req);
    const sessionId = req.body.sessionId || req.body.session_id;
    const { answer } = req.body;

    const result = await callAIService('/api/ai/interview/answer', {
      method: 'POST',
      body: {
        sessionId,
        student_id,
        answer,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 8. GET /api/ai/analytics/:studentId
const getStudentAnalytics = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const result = await callAIService(`/api/ai/analytics/${encodeURIComponent(studentId)}`, {
      method: 'GET',
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 9. GET /api/ai/readiness/:studentId
const getStudentReadiness = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const result = await callAIService(`/api/ai/readiness/${encodeURIComponent(studentId)}`, {
      method: 'GET',
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 10. GET /api/ai/dashboard / GET /api/ai/dashboard/:studentId
const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user?._id?.toString() || req.user?.id;
    const result = await callAIService(`/api/ai/dashboard/${encodeURIComponent(studentId)}`, {
      method: 'GET',
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 11. POST /api/ai/learning/adaptive-update
const triggerAdaptiveUpdate = async (req, res, next) => {
  try {
    const student_id = getEffectiveStudentId(req);
    const { trigger, skill_shifts_override } = req.body;

    const result = await callAIService('/api/ai/learning/adaptive-update', {
      method: 'POST',
      body: {
        student_id,
        trigger: trigger || 'manual_request',
        skill_shifts_override,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 12. GET /api/ai/notifications/:studentId
const getNotifications = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || getEffectiveStudentId(req);
    const status = req.query.status;
    const limit = req.query.limit || 20;

    const query = new URLSearchParams();
    if (status) query.append('status', status);
    if (limit) query.append('limit', limit);

    const endpoint = `/api/ai/notifications/${encodeURIComponent(studentId)}?${query.toString()}`;
    const result = await callAIService(endpoint, {
      method: 'GET',
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 13. POST /api/ai/notifications/dispatch
const dispatchNotifications = async (req, res, next) => {
  try {
    const student_id = getEffectiveStudentId(req);
    const result = await callAIService('/api/ai/notifications/dispatch', {
      method: 'POST',
      body: { student_id },
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 14. POST /api/ai/notifications/trigger
const triggerNotification = async (req, res, next) => {
  try {
    const student_id = getEffectiveStudentId(req);
    const { reminder_type, force, milestone_data } = req.body;

    const result = await callAIService('/api/ai/notifications/trigger', {
      method: 'POST',
      body: {
        student_id,
        reminder_type,
        force: Boolean(force),
        milestone_data,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 15. PATCH /api/ai/notifications/:id/read
const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await callAIService(`/api/ai/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 16. DELETE /api/ai/notifications/:id
const dismissNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await callAIService(`/api/ai/notifications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 17. POST /api/ai/resume/analyze
const analyzeResume = async (req, res, next) => {
  try {
    const student_id = getEffectiveStudentId(req);
    const { file_base64, resume_text, file_name, file_type, career_goal_override } = req.body;

    const result = await callAIService('/api/ai/resume/analyze', {
      method: 'POST',
      body: {
        student_id,
        file_base64,
        resume_text,
        file_name,
        file_type,
        career_goal_override,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 18. GET /api/ai/resume/latest / GET /api/ai/resume/latest/:studentId
const getLatestResumeAnalysis = async (req, res, next) => {
  try {
    const student_id = req.params.studentId || getEffectiveStudentId(req);
    const result = await callAIService(`/api/ai/resume/latest/${encodeURIComponent(student_id)}`, {
      method: 'GET',
    });
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

// 19. GET /api/ai/resume/history / GET /api/ai/resume/history/:studentId
const getResumeAnalysisHistory = async (req, res, next) => {
  try {
    const student_id = req.params.studentId || getEffectiveStudentId(req);
    const limit = req.query.limit || 10;
    const result = await callAIService(`/api/ai/resume/history/${encodeURIComponent(student_id)}?limit=${limit}`, {
      method: 'GET',
    });
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
    next(error);
  }
};

module.exports = {
  mentorChat,
  startAssessment,
  submitAssessment,
  generateRoadmap,
  getRoadmap,
  recordLearningProgress,
  getLearningProgress,
  analyzeCodingSubmission,
  startInterview,
  answerInterviewQuestion,
  getStudentAnalytics,
  getStudentReadiness,
  getStudentDashboard,
  triggerAdaptiveUpdate,
  getNotifications,
  dispatchNotifications,
  triggerNotification,
  markNotificationRead,
  dismissNotification,
  analyzeResume,
  getLatestResumeAnalysis,
  getResumeAnalysisHistory,
};

