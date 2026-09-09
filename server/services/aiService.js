/**
 * LearnHub / CareerForge AI Service Client
 * ========================================
 * Secure proxy client communicating with the internal FastAPI AI service.
 * Handles timeouts, network retries/failures, error normalization,
 * and prevents direct browser exposure to the AI microservice.
 */

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
const DEFAULT_TIMEOUT_MS = parseInt(process.env.AI_SERVICE_TIMEOUT_MS, 10) || 15000;

class AIServiceError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = 'AIServiceError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Executes a JSON HTTP request to the FastAPI AI service with timeout and error handling.
 */
async function callAIService(endpoint, options = {}) {
  const url = `${AI_SERVICE_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers,
    signal: AbortSignal.timeout(timeoutMs),
  };

  if (options.body && options.method !== 'GET') {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type') || '';
    
    let responseData;
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = { message: text };
    }

    if (!response.ok) {
      const errorMessage =
        responseData.detail ||
        responseData.message ||
        `AI Service responded with status ${response.status}`;
      throw new AIServiceError(errorMessage, response.status, responseData);
    }

    return responseData;
  } catch (err) {
    if (err instanceof AIServiceError) {
      throw err;
    }

    // Timeout handling
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      throw new AIServiceError(
        `AI Service request timed out after ${timeoutMs}ms. Please try again.`,
        504,
        { code: 'GATEWAY_TIMEOUT', timeoutMs }
      );
    }

    // Connection refused / Network down
    if (err.cause?.code === 'ECONNREFUSED' || err.code === 'ECONNREFUSED') {
      throw new AIServiceError(
        'AI Service is currently unavailable. Please verify the AI service is running.',
        503,
        { code: 'SERVICE_UNAVAILABLE' }
      );
    }

    // Generic error
    throw new AIServiceError(
      err.message || 'An unexpected error occurred while communicating with the AI service.',
      500,
      { originalError: err.message }
    );
  }
}

module.exports = {
  callAIService,
  AIServiceError,
  AI_SERVICE_URL,
};
