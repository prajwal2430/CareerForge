# Career Forge - Production Deployment Manual

This document provides a comprehensive, production-grade guide for deploying the entire **Career Forge** multi-agent platform.

---

## Architecture Overview

```
                   Internet / Users
                          │
                          ▼
            ┌───────────────────────────┐
            │  Cloudflare / Reverse     │
            │  Proxy / Nginx (SSL/TLS)  │
            └─────────────┬─────────────┘
                          │
         ┌────────────────┴────────────────┐
         │                                 │
         ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐
│  React Frontend  │             │   Node Backend   │
│   (Vite Build)   │             │ (Express API GW) │
│  Static CDN / S3 │             │  Port 5000 (PM2) │
└──────────────────┘             └─────────┬────────┘
                                           │ (Internal Network Only)
                                           ▼
                                 ┌──────────────────┐
                                 │ FastAPI Service  │
                                 │ (CrewAI & Agents)│
                                 │  Port 8000 (ASGI)│
                                 └─────────┬────────┘
                                           │
                                           ▼
                                 ┌──────────────────┐
                                 │  MongoDB Atlas   │
                                 │ (Replica Set TLS)│
                                 └──────────────────┘
```

The system comprises three independently scalable tiers:
1. **Frontend**: Static React Single Page Application (SPA) built with Vite, served via CDN or Nginx.
2. **Node.js Express Backend**: API Gateway managing authentication, validation, session security, and proxying requests to the AI microservice.
3. **FastAPI AI Microservice**: Multi-agent inference engine running specialist agents (Assessment, Coding Mentor, Interview Mentor, Learning Recommendation, Progress Analytics, and Coordinator) backed by Google Gemini and persistent student memory.
4. **MongoDB**: High-throughput database storing student profiles, assessments, coding submissions, roadmaps, and analytics history.

---

## 1. Frontend Deployment

The client is built with React and Vite. It compiles into optimized, minified static HTML, CSS, and JavaScript bundles.

### Build Configuration

```bash
# Navigate to client directory
cd client

# Install dependencies (use clean install in CI/CD)
npm ci

# Build the production bundle
npm run build
```

The build artifacts are generated in `client/dist/`.

### Deployment Options

#### Option A: Vercel / Netlify
1. Connect the repository to Vercel/Netlify.
2. Set **Root Directory** to `client`.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Configure Environment Variables:
   - `VITE_API_URL=https://api.yourdomain.com/api`
6. For client-side routing, add a rewrite rule. In `client/public/_redirects`:
   ```text
   /*    /index.html   200
   ```

#### Option B: Nginx Static Server
Serve the compiled `dist/` directory behind Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/careerforge/client/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA Routing: Fall back to index.html for React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public, max-age=15552000, immutable";
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

---

## 2. Node.js Backend Deployment

The Node.js Express backend acts as the secure entry point for all API requests.

### Process Management with PM2

Install PM2 globally:
```bash
npm install -g pm2
```

Create `server/ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'careerforge-server',
      script: 'server.js',
      cwd: './server',
      instances: 'max',       // Cluster mode utilizing all available CPU cores
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      max_memory_restart: '1G',
      kill_timeout: 5000,
      listen_timeout: 8000,
      autorestart: true,
      error_file: '/var/log/careerforge/server-err.log',
      out_file: '/var/log/careerforge/server-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
```

Start the application:
```bash
cd server
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Systemd Service Unit (Alternative to PM2)

If deploying directly with systemd, create `/etc/systemd/system/careerforge-server.service`:
```ini
[Unit]
Description=CareerForge Node.js Express Gateway
After=network.target mongodb.service

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/careerforge/server
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
EnvironmentFile=/var/www/careerforge/server/.env

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable careerforge-server
sudo systemctl start careerforge-server
```

### Nginx Reverse Proxy Configuration

Proxy API requests from `https://api.yourdomain.com` to the Node.js backend:

```nginx
upstream node_backend {
    server 127.0.0.1:5000;
    keepalive 32;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    client_max_body_size 20M;

    location / {
        proxy_pass http://node_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts for long-running AI streaming requests
        proxy_connect_timeout 30s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
}
```

---

## 3. FastAPI AI Microservice Deployment

The AI service must be deployed separately as an isolated microservice. It should **never be exposed directly to the public internet**; only the Node.js backend should communicate with it.

### Production ASGI Server: Gunicorn with Uvicorn Workers

In production, run FastAPI using Gunicorn as the process supervisor and Uvicorn workers for asynchronous throughput:

```bash
cd ai-service

# Create and activate Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install production dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn
```

Run Gunicorn command:
```bash
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 127.0.0.1:8000 \
  --timeout 120 \
  --keep-alive 5 \
  --access-logfile /var/log/careerforge/ai-access.log \
  --error-logfile /var/log/careerforge/ai-error.log
```

> **Worker sizing rule of thumb**: `(2 * Number of CPU Cores) + 1`

### Systemd Service Unit for FastAPI

Create `/etc/systemd/system/careerforge-ai.service`:
```ini
[Unit]
Description=CareerForge FastAPI AI Microservice
After=network.target mongodb.service

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/careerforge/ai-service
ExecStart=/var/www/careerforge/ai-service/venv/bin/gunicorn app.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 127.0.0.1:8000 \
    --timeout 120
Restart=always
RestartSec=5
Environment=ENVIRONMENT=production
EnvironmentFile=/var/www/careerforge/ai-service/.env

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable careerforge-ai
sudo systemctl start careerforge-ai
```

### Docker Deployment (Alternative)

Build and run using Docker:

`ai-service/Dockerfile`:
```dockerfile
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    ENVIRONMENT=production

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir gunicorn

COPY . .

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/api/ai/health || exit 1

CMD ["gunicorn", "app.main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--timeout", "120"]
```

---

## 4. MongoDB Configuration

Career Forge relies on MongoDB for unified student state.

### Recommended: MongoDB Atlas

1. **Cluster Tier**: Dedicated cluster (`M10` or higher) with a minimum 3-node replica set for high availability.
2. **TLS / SSL**: Enforce TLS 1.2+ for all client connections.
3. **Network Access**:
   - Whitelist only the static IP addresses of your Node.js backend and FastAPI servers (or configure AWS VPC Peering / Azure VNet).
   - Never allow `0.0.0.0/0` in production.
4. **Database User Security**:
   - Create a dedicated user (`careerforge_app`) with `readWrite` access scoped exclusively to the `learnhub` database.
   - Enforce `SCRAM-SHA-256` authentication.

### Self-Hosted MongoDB (Replica Set)

If self-hosting, ensure a 3-node replica set:
```bash
# In /etc/mongod.conf
replication:
  replSet: "rs0"
security:
  authorization: "enabled"
net:
  bindIp: 127.0.0.1,10.0.0.1  # Private network IP only
  ssl:
    mode: requireSSL
    PEMKeyFile: /etc/ssl/mongodb.pem
```

### Performance Indexing Strategy

Execute the following index creations in MongoDB shell (`mongosh`):

```javascript
use learnhub;

// 1. Users collection
db.users.createIndex({ email: 1 }, { unique: true });

// 2. Students collection
db.students.createIndex({ student_id: 1 }, { unique: true });
db.students.createIndex({ email: 1 }, { unique: true });
db.students.createIndex({ readinessScore: -1 });

// 3. Assessment Results collection
db.assessment_results.createIndex({ student_id: 1, timestamp: -1 });
db.assessment_results.createIndex({ assessment_id: 1 });
db.assessment_results.createIndex({ category: 1 });

// 4. Coding Submissions collection
db.coding_submissions.createIndex({ student_id: 1, timestamp: -1 });
db.coding_submissions.createIndex({ status: 1 });

// 5. Interview Sessions collection
db.interview_sessions.createIndex({ student_id: 1, created_at: -1 });
db.interview_sessions.createIndex({ session_id: 1 }, { unique: true });

// 6. Learning Roadmaps collection
db.learning_roadmaps.createIndex({ student_id: 1 }, { unique: true });
db.learning_roadmaps.createIndex({ roadmap_id: 1 });

// 7. Notifications collection
db.notifications.createIndex({ student_id: 1, read: 1, created_at: -1 });
db.notifications.createIndex({ notif_id: 1 }, { unique: true });

// 8. Resume Analyses collection
db.resume_analyses.createIndex({ student_id: 1, created_at: -1 });
db.resume_analyses.createIndex({ analysis_id: 1 }, { unique: true });
```

### Automated Backup Schedule
- Enable Atlas Continuous Cloud Backups (PITR: Point-in-time recovery).
- For self-hosted, schedule automated daily snapshots:
  ```bash
  mongodump --uri="mongodb://localhost:27017/learnhub" --gzip --archive=/backups/learnhub-$(date +%Y%m%d).gz
  ```

---

## 5. Environment Variables Reference

> [!CAUTION]
> Never commit `.env` files with actual secrets to GitHub or public repositories. Store production secrets in a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler, or GitHub Actions Secrets).

### Frontend (`client/.env`)

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | **Yes** | `http://localhost:5000/api` | Public base URL of the Node.js backend Express API. Example: `https://api.yourdomain.com/api` |

---

### Node.js Backend (`server/.env`)

| Variable | Required | Recommended Production Value | Description |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | **Yes** | `production` | Enables production optimizations, disables stack trace leaks. |
| `PORT` | **Yes** | `5000` | Port on which the Express gateway listens. |
| `MONGO_URI` | **Yes** | `mongodb+srv://user:pass@cluster0.mongodb.net/learnhub?retryWrites=true&w=majority&tls=true` | MongoDB connection string with TLS and retryable writes. |
| `MONGO_MAX_POOL_SIZE` | No | `50` | Maximum concurrent connections in Mongoose connection pool. |
| `MONGO_MIN_POOL_SIZE` | No | `5` | Minimum idle connections retained in connection pool. |
| `JWT_SECRET` | **Yes** | Generated via `openssl rand -hex 32` | 64-character high-entropy cryptographic secret for signing authentication tokens. |
| `JWT_EXPIRES_IN` | No | `7d` | Lifetime of user authentication JWTs. |
| `CLIENT_URL` | **Yes** | `https://yourdomain.com` | Primary frontend web application URL for CORS whitelist. |
| `CORS_ORIGIN` | No | `https://yourdomain.com,https://app.yourdomain.com` | Comma-separated list of secondary authorized origins. |
| `AI_SERVICE_URL` | **Yes** | `http://127.0.0.1:8000` | Internal private network address of the FastAPI AI service. |
| `AI_SERVICE_TIMEOUT_MS`| No | `15000` | Gateway timeout before returning `504 Gateway Timeout` for AI inference. |

---

### FastAPI AI Microservice (`ai-service/.env`)

| Variable | Required | Recommended Production Value | Description |
| :--- | :---: | :--- | :--- |
| `ENVIRONMENT` | **Yes** | `production` | Enables strict CORS and security rules in FastAPI. |
| `PORT` | **Yes** | `8000` | Port on which the FastAPI microservice listens. |
| `SERVICE_NAME` | No | `career-forge-ai` | Service identifier reported in health metrics and log messages. |
| `LOG_LEVEL` | No | `info` | Logging verbosity (`debug`, `info`, `warning`, `error`). |
| `GEMINI_API_KEY` | **Yes** | `AIzaSy...` (from Google AI Studio) | Production Google Gemini API key. Never logged or exposed. |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Selected Gemini model identifier. |
| `GEMINI_TIMEOUT_SECONDS`| No | `30` | Async timeout for individual Gemini API calls before offline fallback triggers. |
| `MONGO_URI` | **Yes** | `mongodb+srv://user:pass@cluster0.mongodb.net/learnhub?retryWrites=true&w=majority&tls=true` | MongoDB connection string matching the shared database. |
| `MONGO_DB_NAME` | No | `learnhub` | Name of the shared database. |
| `ALLOWED_ORIGINS` | **Yes** | `https://yourdomain.com,https://api.yourdomain.com` | Comma-separated list of authorized domains for FastAPI CORS. |

---

## 6. CORS Configuration

Career Forge strictly enforces origin whitelisting in production (`NODE_ENV=production` and `ENVIRONMENT=production`).

### Architecture
- **Browser $\rightarrow$ Node Gateway**: The browser communicates only with `https://api.yourdomain.com`.
- **Node Gateway $\rightarrow$ AI Service**: Server-to-server internal communication occurs over private localhost or internal VPC networking.

### Express Backend CORS Implementation
In `server/server.js`:
- Allowed origins are read dynamically from `CLIENT_URL` and `CORS_ORIGIN`.
- Requests with origins not in the whitelist receive a `403 Forbidden` response.
- Server-to-server requests (e.g. cURL, internal proxies) with no origin header are permitted.
- `credentials: true` is enabled, permitting authenticated sessions.
- Preflight `OPTIONS` requests are answered with status `200 OK`.

### FastAPI AI Service CORS Implementation
In `ai-service/app/main.py`:
- `CORSMiddleware` parses `ALLOWED_ORIGINS` from `Settings`.
- In development (`ENVIRONMENT=development`), localhost origins are automatically permitted.
- In production, wildcard `["*"]` is disallowed with credentials.

---

## 7. Google Gemini API Configuration

Career Forge leverages Google Gemini models for multi-agent reasoning, coding evaluations, interview feedback, and natural language study plans.

### Provisioning Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create an API key under your production Google Cloud project.
3. Verify your billing account and quota limits:
   - **Recommended Model**: `gemini-2.5-flash` (balanced latency and inference quality).
   - **Quota Target**: Minimum 60 RPM (Requests Per Minute) for production traffic.

### Resiliency & Offline Fallback
The `GeminiService` class implements enterprise resilience patterns:
1. **Masked Logging**: The system automatically redacts all keys matching `AIza...` from logs.
2. **Configurable Timeout**: If a Gemini call exceeds `GEMINI_TIMEOUT_SECONDS` (default: 30s), the call safely aborts.
3. **Deterministic Fallbacks**:
   - Assessment scoring: Computed using **100% deterministic code logic**, never by LLM prompt.
   - Placement Readiness Score: Calculated using mathematical weighted formulas, never fabricated.
   - Mentoring chat & recommendations: If Gemini is unreachable or rate-limited, the system falls back to rule-based pedagogical feedback without failing the user's request.

---

## 8. Production Testing & Verification

Before opening traffic to students, run the verification commands to confirm all 15 scenario steps and 8 resilience edge cases pass.

### Step 1: Run Automated Verification Suite

```bash
# Run the complete end-to-end multi-agent verification suite
node server/test_complete_lifecycle.js
```

Expected output:
```
======================================================================
ALL 15 SCENARIO STEPS & ALL 8 RESILIENCE TESTS PASSED SUCCESSFULLY!
======================================================================
```

### Step 2: Run Microservice Integration Tests

```bash
# Test Resume Analysis
ai-service/venv/bin/python ai-service/tests/test_resume_analysis.py

# Test Motivation & Reminders
ai-service/venv/bin/python ai-service/tests/test_notifications.py

# Test Adaptive Learning Loop
ai-service/venv/bin/python ai-service/tests/test_adaptive_learning_loop.py

# Test Coordinator Agent Routing
ai-service/venv/bin/python ai-service/tests/test_coordinator.py
```

### Step 3: Manual Smoke Test Checklist

- [ ] Register a new student account (`POST /api/auth/register`).
- [ ] Login and verify JWT issuance (`POST /api/auth/login`).
- [ ] Complete a diagnostic test and verify score updates.
- [ ] Trigger AI Mentor chat and verify Coordinator routing response.
- [ ] Verify Dashboard loads with Placement Readiness Score.
- [ ] Verify unauthenticated requests to `/api/ai/mentor/chat` receive `401 Unauthorized`.

---

## 9. Health Checks & Monitoring

Both services provide standardized health check endpoints.

### 1. Node.js Express Gateway Health Check

**Endpoint**: `GET https://api.yourdomain.com/api/health`

**Sample Response (`200 OK`)**:
```json
{
  "status": "ok",
  "service": "career-forge-server",
  "environment": "production",
  "timestamp": "2026-09-10T00:15:22.174Z",
  "uptime": 86400,
  "database": "connected",
  "aiService": "connected"
}
```

*Note: Returns `503 Service Unavailable` if MongoDB is disconnected.*

---

### 2. FastAPI AI Microservice Health Check

**Endpoints**:
- `GET http://127.0.0.1:8000/api/ai/health`
- `GET http://127.0.0.1:8000/health` (container orchestrator alias)

**Sample Response (`200 OK`)**:
```json
{
  "status": "ok",
  "service": "career-forge-ai",
  "environment": "production",
  "timestamp": "2026-09-10T00:15:22.174Z",
  "database": "connected",
  "gemini": "configured"
}
```

*Note: Never exposes raw database credentials, connection strings, or API keys.*

---

### Monitoring & Alerting Setup
Configure uptime monitors (e.g., UptimeRobot, Datadog, AWS CloudWatch Route 53 Health Checks):
- **Ping Frequency**: Every 30 seconds.
- **Node Gateway**: Probe `https://api.yourdomain.com/api/health`. Alert if HTTP status $\ne 200$.
- **AI Microservice**: Probe `http://127.0.0.1:8000/api/ai/health` (via internal agent). Alert if `database != "connected"`.

---

## 10. Troubleshooting Playbook

### Issue 1: `502 Bad Gateway` from Nginx
* **Symptom**: Browser receives HTTP 502 when querying `/api/*`.
* **Root Cause**: Node.js backend process crashed or is not listening on port 5000.
* **Resolution**:
  ```bash
  # Check PM2 status
  pm2 status
  pm2 logs careerforge-server --lines 50
  
  # If stopped, restart
  pm2 restart careerforge-server
  ```

---

### Issue 2: `CORS policy rejection: Origin '...' is not authorized`
* **Symptom**: Browser console logs CORS error and network request fails.
* **Root Cause**: The client domain is missing from `CLIENT_URL` or `CORS_ORIGIN` in `server/.env`.
* **Resolution**:
  1. Open `server/.env`.
  2. Add the frontend domain to `CORS_ORIGIN`:
     ```bash
     CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
     ```
  3. Restart server: `pm2 restart careerforge-server`.

---

### Issue 3: `AI Service responded with status 503`
* **Symptom**: Frontend mentor chat or assessment endpoints return HTTP 503.
* **Root Cause**: The FastAPI microservice is offline or unreachable on port 8000.
* **Resolution**:
  ```bash
  # Check systemd status
  sudo systemctl status careerforge-ai
  
  # Or check Gunicorn process
  ps aux | grep gunicorn
  
  # Test direct local health
  curl -i http://127.0.0.1:8000/api/ai/health
  
  # Restart service
  sudo systemctl restart careerforge-ai
  ```

---

### Issue 4: MongoDB Connection Timeout (`serverSelectionTimeoutMS`)
* **Symptom**: `MongoDB connection warning` in logs, queries hang or fail.
* **Root Cause**: Server IP is not whitelisted in MongoDB Atlas or network firewall blocks port 27017.
* **Resolution**:
  1. Verify outbound connectivity:
     ```bash
     nc -zv cluster0.mongodb.net 27017
     ```
  2. Log in to [MongoDB Atlas](https://cloud.mongodb.com) $\rightarrow$ **Security** $\rightarrow$ **Network Access**.
  3. Add the server's public IP address to the whitelist.

---

### Issue 5: Gemini `429 Resource Exhausted` / Rate Limit
* **Symptom**: AI responses take long or fallback text is returned.
* **Root Cause**: Gemini API request rate exceeds quota on the project.
* **Resolution**:
  1. Verify quota in [Google Cloud Console](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas).
  2. The system automatically maintains stability via rule-based offline fallbacks for scoring and roadmaps.
  3. Upgrade project quota or switch model to `gemini-2.5-flash` in `ai-service/.env`.

---

## Security Best Practices Checklist

- [x] All database and API credentials are kept exclusively in `.env` files and omitted from version control.
- [x] CORS origin validation strictly enforced in production without wildcard `*`.
- [x] MongoDB URI password masking active in all microservice log outputs.
- [x] Detailed error stack traces suppressed from client responses in production mode.
- [x] Multi-tenant cross-student data access prevented via student ID authorization middleware.
- [x] Assessment scoring and readiness calculations run deterministically in application logic without LLM hallucination risk.
- [x] High-throughput collection indices created on MongoDB.
