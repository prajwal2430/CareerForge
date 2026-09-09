/**
 * LearnHub / CareerForge AI Route Validators & Authorizers
 * ========================================================
 */

// Verify student authorization for studentId params
const authorizeStudentAccess = (req, res, next) => {
  const targetStudentId = req.params.studentId || req.body.studentId || req.body.student_id;
  
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  // Admins have universal access
  if (req.user.role === 'admin') {
    return next();
  }

  // If targetStudentId is specified, check against user's own IDs
  if (targetStudentId) {
    const userDbId = req.user._id?.toString();
    const userCustomId = req.user.student_id || req.user.id?.toString();

    if (targetStudentId !== userDbId && targetStudentId !== userCustomId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only access or modify your own learning records.',
      });
    }
  }

  next();
};

// Validate Mentor Chat Request
const validateMentorChat = (req, res, next) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation error: A non-empty "message" string is required.',
    });
  }
  next();
};

// Validate Assessment Start Request
const validateAssessmentStart = (req, res, next) => {
  const { category } = req.body;
  const validCategories = ['java', 'sql', 'dsa', 'aptitude', 'technical fundamentals', 'general'];
  
  if (!category || typeof category !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Validation error: "category" is required (e.g. Java, SQL, DSA, Aptitude).',
    });
  }

  if (!validCategories.includes(category.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Validation error: Invalid category "${category}". Supported: Java, SQL, DSA, Aptitude, Technical Fundamentals.`,
    });
  }

  next();
};

// Validate Assessment Submit Request
const validateAssessmentSubmit = (req, res, next) => {
  const { assessmentId, answers } = req.body;
  if (!assessmentId || typeof assessmentId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Validation error: "assessmentId" string is required.',
    });
  }

  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return res.status(400).json({
      success: false,
      message: 'Validation error: "answers" object mapping question IDs to selections is required.',
    });
  }

  next();
};

// Validate Coding Analysis Request
const validateCodingAnalyze = (req, res, next) => {
  const { code, language } = req.body;
  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation error: Non-empty "code" string is required.',
    });
  }

  if (!language || typeof language !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Validation error: "language" is required (e.g. python, javascript, java, cpp).',
    });
  }

  next();
};

// Validate Interview Start Request
const validateInterviewStart = (req, res, next) => {
  const { mode } = req.body;
  if (mode && !['hr', 'technical', 'behavioral'].includes(mode.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: 'Validation error: "mode" must be either "hr" or "technical".',
    });
  }
  next();
};

// Validate Interview Answer Request
const validateInterviewAnswer = (req, res, next) => {
  const sessionId = req.body.sessionId || req.body.session_id;
  const { answer } = req.body;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Validation error: "sessionId" is required.',
    });
  }

  if (!answer || typeof answer !== 'string' || answer.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation error: Non-empty "answer" response is required.',
    });
  }

  next();
};

// Validate StudentId in params
const validateStudentIdParam = (req, res, next) => {
  const { studentId } = req.params;
  if (!studentId || studentId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation error: "studentId" URL parameter is required.',
    });
  }
  next();
};

module.exports = {
  authorizeStudentAccess,
  validateMentorChat,
  validateAssessmentStart,
  validateAssessmentSubmit,
  validateCodingAnalyze,
  validateInterviewStart,
  validateInterviewAnswer,
  validateStudentIdParam,
};
