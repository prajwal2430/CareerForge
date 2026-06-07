// Validate that required fields exist in request body
const validateFields = (requiredFields) => {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => !req.body[field]);
    if (missing.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }
    next();
  };
};

// Validate email format
const validateEmail = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (req.body.email && !emailRegex.test(req.body.email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  next();
};

module.exports = { validateFields, validateEmail };
