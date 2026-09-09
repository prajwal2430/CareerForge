const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --------------- CORS Configuration ---------------
const getAllowedOrigins = () => {
  const configured = [];
  if (process.env.CLIENT_URL) {
    configured.push(...process.env.CLIENT_URL.split(',').map((s) => s.trim()));
  }
  if (process.env.CORS_ORIGIN) {
    configured.push(...process.env.CORS_ORIGIN.split(',').map((s) => s.trim()));
  }

  // Non-production fallback for local development & automated test suites
  if (process.env.NODE_ENV !== 'production') {
    return [
      ...new Set([
        ...configured,
        'http://localhost:3000',
        'http://localhost:5000',
        'http://localhost:5002',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
      ]),
    ];
  }

  return [...new Set(configured)];
};

const allowedOrigins = getAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests or CLI tools with no origin header
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy rejection: Origin '${origin}' is not authorized.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// --------------- Body Parsing Middleware ---------------
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// --------------- Request Logging ---------------
if (process.env.NODE_ENV === 'production') {
  app.use(
    morgan('combined', {
      skip: (req) => req.originalUrl === '/api/health',
    })
  );
} else {
  app.use(morgan('dev'));
}

// --------------- Routes ---------------
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

// --------------- Health Check Endpoint ---------------
app.get('/api/health', async (req, res) => {
  const dbStates = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const dbStatus = dbStates[mongoose.connection.readyState] || 'unknown';

  let aiServiceStatus = 'unknown';
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

  try {
    const aiRes = await fetch(`${aiServiceUrl}/api/ai/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (aiRes.ok) {
      aiServiceStatus = 'connected';
    } else {
      aiServiceStatus = `unhealthy (${aiRes.status})`;
    }
  } catch (err) {
    aiServiceStatus = 'unreachable';
  }

  const isHealthy = dbStatus === 'connected' && (aiServiceStatus === 'connected' || process.env.NODE_ENV !== 'production');

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    service: 'career-forge-server',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
    aiService: aiServiceStatus,
  });
});

// --------------- 404 Catch-All Handler ---------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// --------------- Error Handling Middleware ---------------
app.use(require('./middleware/errorHandler'));

// --------------- Start Server ---------------
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
