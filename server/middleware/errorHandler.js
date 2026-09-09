// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    console.error('❌ Error:', err.stack);
  } else {
    console.error(`❌ [${new Date().toISOString()}] ${req.method} ${req.originalUrl}: ${err.message}`);
  }

  // CORS policy rejection
  if (err.message && err.message.startsWith('CORS policy rejection')) {
    return res.status(403).json({ success: false, message: err.message });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({ success: false, message: `Duplicate value for field: ${field}` });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Invalid ${err.path}: ${err.value}` });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  // Default server error
  const statusCode = err.statusCode || err.status || 500;
  const message = isProduction && statusCode === 500
    ? 'Internal Server Error'
    : (err.message || 'Internal Server Error');

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;

