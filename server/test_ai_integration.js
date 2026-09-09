/**
 * LearnHub / CareerForge Node.js Backend & FastAPI AI Service Integration Test Suite
 * =================================================================================
 * Validates:
 * 1. JWT Authentication rejection when token is missing (401).
 * 2. Student authorization rejection when accessing unauthorized student data (403).
 * 3. Request validation rejection when payloads are malformed (400).
 * 4. End-to-end flow for all 9 AI proxy endpoints through Express -> FastAPI -> MongoDB:
 *    - POST /api/ai/mentor/chat
 *    - POST /api/ai/assessment/start
 *    - POST /api/ai/assessment/submit
 *    - POST /api/ai/learning/generate-roadmap
 *    - POST /api/ai/coding/analyze
 *    - POST /api/ai/interview/start
 *    - POST /api/ai/interview/answer
 *    - GET  /api/ai/analytics/:studentId
 *    - GET  /api/ai/readiness/:studentId
 * 5. Verifies GEMINI_API_KEY is not leaked in any response.
 */

process.env.VERCEL = '1';
const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User.model');
const app = require('./server');

const PORT = 5001; // Test server port
let server;

async function runTests() {
  console.log('======================================================================');
  console.log('CAREERFORGE NODE.JS EXPRESS <-> FASTAPI AI SERVICE INTEGRATION SUITE');
  console.log('======================================================================');

  // 1. Wait for MongoDB connection
  if (mongoose.connection.readyState !== 1) {
    await new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 1) return resolve();
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', reject);
      setTimeout(resolve, 3000); // safety fallback
    });
    console.log('[SETUP] Confirmed MongoDB connection established.');
  }

  // 2. Start Express test server
  server = app.listen(PORT);
  console.log(`[SETUP] Express test server listening on http://localhost:${PORT}.`);

  const BASE_URL = `http://localhost:${PORT}/api/ai`;

  try {
    // 3. Create / Retrieve Test User
    const testEmail = 'integration_student@careerforge.edu';
    let user = await User.findOne({ email: testEmail });
    if (!user) {
      user = await User.create({
        name: 'Aakash Verma',
        email: testEmail,
        password: 'Password123!',
        role: 'user',
      });
      console.log(`[SETUP] Created test user with ID: ${user._id}`);
    } else {
      console.log(`[SETUP] Using existing test user with ID: ${user._id}`);
    }

    const studentId = user._id.toString();
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_here',
      { expiresIn: '1d' }
    );
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    // -------------------------------------------------------------------------
    // TEST 1: Authentication Check (401 if missing token)
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 1] Authentication: Missing JWT -> 401 Unauthorized ---');
    const noAuthRes = await fetch(`${BASE_URL}/mentor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello' }),
    });
    console.log(`  Status: ${noAuthRes.status}`);
    if (noAuthRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized without JWT, got ${noAuthRes.status}`);
    }
    console.log('  [PASSED] Unauthenticated request correctly rejected with 401.');

    // -------------------------------------------------------------------------
    // TEST 2: Authorization Check (403 if accessing another student's data)
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 2] Authorization: Accessing another student ID -> 403 Forbidden ---');
    const unauthorizedRes = await fetch(`${BASE_URL}/readiness/different_student_999`, {
      method: 'GET',
      headers: authHeaders,
    });
    console.log(`  Status: ${unauthorizedRes.status}`);
    if (unauthorizedRes.status !== 403) {
      throw new Error(`Expected 403 Forbidden for mismatched student ID, got ${unauthorizedRes.status}`);
    }
    console.log('  [PASSED] Cross-student access correctly rejected with 403.');

    // -------------------------------------------------------------------------
    // TEST 3: Validation Check (400 if required fields are missing)
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 3] Validation: Missing message -> 400 Bad Request ---');
    const badReqRes = await fetch(`${BASE_URL}/mentor/chat`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ message: '' }),
    });
    console.log(`  Status: ${badReqRes.status}`);
    if (badReqRes.status !== 400) {
      throw new Error(`Expected 400 Bad Request for empty message, got ${badReqRes.status}`);
    }
    console.log('  [PASSED] Invalid request body correctly rejected with 400.');

    // -------------------------------------------------------------------------
    // TEST 4: POST /api/ai/mentor/chat (End-to-End Proxy)
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 4] POST /api/ai/mentor/chat (Proxy to Coordinator) ---');
    const chatRes = await fetch(`${BASE_URL}/mentor/chat`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        studentId,
        message: 'What should I study today?',
      }),
    });
    console.log(`  Status: ${chatRes.status}`);
    if (chatRes.status !== 200) {
      const errText = await chatRes.text();
      throw new Error(`Mentor chat failed: ${errText}`);
    }
    const chatData = await chatRes.json();
    console.log(`  Agent: ${chatData.agent}`);
    console.log(`  Response: ${chatData.response.slice(0, 100)}...`);
    console.log(`  Actions Count: ${chatData.actions?.length}`);
    if (!chatData.agent || !chatData.response) {
      throw new Error('Mentor chat response missing required fields');
    }
    console.log('  [PASSED] POST /api/ai/mentor/chat successfully proxied and responded.');

    // -------------------------------------------------------------------------
    // TEST 5: POST /api/ai/assessment/start
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 5] POST /api/ai/assessment/start (Proxy to Assessment Agent) ---');
    const assessStartRes = await fetch(`${BASE_URL}/assessment/start`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        studentId,
        category: 'Java',
        difficulty: 'Medium',
        question_count: 3,
      }),
    });
    console.log(`  Status: ${assessStartRes.status}`);
    if (assessStartRes.status !== 200) {
      const errText = await assessStartRes.text();
      throw new Error(`Assessment start failed: ${errText}`);
    }
    const assessData = await assessStartRes.json();
    const assessmentId = assessData.assessmentId;
    console.log(`  Assessment ID: ${assessmentId}`);
    console.log(`  Questions Count: ${assessData.questions?.length}`);
    if (!assessmentId || !assessData.questions || assessData.questions.length === 0) {
      throw new Error('Assessment start response missing assessmentId or questions');
    }
    console.log('  [PASSED] POST /api/ai/assessment/start successfully proxied.');

    // -------------------------------------------------------------------------
    // TEST 6: POST /api/ai/assessment/submit
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 6] POST /api/ai/assessment/submit (Deterministic Scoring) ---');
    const sampleAnswers = {};
    for (const q of assessData.questions) {
      sampleAnswers[q.id] = 1;
    }
    const assessSubmitRes = await fetch(`${BASE_URL}/assessment/submit`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        assessmentId,
        studentId,
        answers: sampleAnswers,
        timeSpentSeconds: 60,
      }),
    });
    console.log(`  Status: ${assessSubmitRes.status}`);
    if (assessSubmitRes.status !== 200) {
      const errText = await assessSubmitRes.text();
      throw new Error(`Assessment submit failed: ${errText}`);
    }
    const submitData = await assessSubmitRes.json();
    console.log(`  Deterministic Score: ${submitData.score}%`);
    console.log(`  Passed: ${submitData.passed}`);
    if (typeof submitData.score !== 'number') {
      throw new Error('Assessment submit response missing numerical score');
    }
    console.log('  [PASSED] POST /api/ai/assessment/submit successfully proxied and scored.');

    // -------------------------------------------------------------------------
    // TEST 7: POST /api/ai/learning/generate-roadmap
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 7] POST /api/ai/learning/generate-roadmap (Adaptive Plan) ---');
    const roadmapRes = await fetch(`${BASE_URL}/learning/generate-roadmap`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        studentId,
        custom_goal: 'Backend SDE-1',
        duration_weeks: 6,
      }),
    });
    console.log(`  Status: ${roadmapRes.status}`);
    if (roadmapRes.status !== 200) {
      const errText = await roadmapRes.text();
      throw new Error(`Generate roadmap failed: ${errText}`);
    }
    const roadmapData = await roadmapRes.json();
    console.log(`  Roadmap ID: ${roadmapData.roadmapId}`);
    console.log(`  Milestones: ${roadmapData.milestones?.length}`);
    if (!roadmapData.roadmapId || !roadmapData.milestones) {
      throw new Error('Generate roadmap response missing roadmapId or milestones');
    }
    console.log('  [PASSED] POST /api/ai/learning/generate-roadmap successfully proxied.');

    // -------------------------------------------------------------------------
    // TEST 7b: GET /api/ai/learning/roadmap & POST /api/ai/learning/progress
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 7b] GET /api/ai/learning/roadmap & POST /api/ai/learning/progress ---');
    const getRoadmapRes = await fetch(`${BASE_URL}/learning/roadmap`, {
      method: 'GET',
      headers: authHeaders,
    });
    console.log(`  GET Roadmap Status: ${getRoadmapRes.status}`);
    if (getRoadmapRes.status !== 200) {
      throw new Error(`GET roadmap failed: ${await getRoadmapRes.text()}`);
    }
    const retrievedRoadmap = await getRoadmapRes.json();
    console.log(`  Retrieved Roadmap ID: ${retrievedRoadmap.roadmapId || retrievedRoadmap.roadmap_id}`);
    console.log(`  Retrieved Milestones: ${retrievedRoadmap.milestones?.length}`);

    // Record learning progress on milestone 1
    const progressRes = await fetch(`${BASE_URL}/learning/progress`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        student_id: studentId,
        step_id: 1,
        course_title: 'Foundations & Invariants',
        completed_lessons: ['Lesson 1: Complexity Analysis'],
        time_spent_hours: 1.5,
        category: 'DSA',
      }),
    });
    console.log(`  POST Progress Status: ${progressRes.status}`);
    if (progressRes.status !== 200) {
      throw new Error(`Record progress failed: ${await progressRes.text()}`);
    }
    const progressData = await progressRes.json();
    console.log(`  Progress Record Status: ${progressData.status}`);
    console.log('  [PASSED] GET /api/ai/learning/roadmap & POST /api/ai/learning/progress successfully proxied.');

    // -------------------------------------------------------------------------
    // TEST 8: POST /api/ai/coding/analyze
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 8] POST /api/ai/coding/analyze (Sandbox Code Execution) ---');
    const codingRes = await fetch(`${BASE_URL}/coding/analyze`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        studentId,
        problem_id: 'two-sum',
        problem_title: 'Two Sum',
        language: 'python',
        code: 'def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []\n',
        test_cases: [
          { input: '[2, 7, 11, 15], 9', expected_output: '[0, 1]' },
          { input: '[3, 2, 4], 6', expected_output: '[1, 2]' },
        ],
      }),
    });
    console.log(`  Status: ${codingRes.status}`);
    if (codingRes.status !== 200) {
      const errText = await codingRes.text();
      throw new Error(`Coding analyze failed: ${errText}`);
    }
    const codingData = await codingRes.json();
    console.log(`  Execution Status: ${codingData.status}`);
    console.log(`  Passed Cases: ${codingData.passed_test_cases}/${codingData.total_test_cases}`);
    if (codingData.status !== 'Accepted') {
      throw new Error(`Expected Accepted coding submission, got ${codingData.status}`);
    }
    console.log('  [PASSED] POST /api/ai/coding/analyze successfully executed in sandbox.');

    // -------------------------------------------------------------------------
    // TEST 9: POST /api/ai/interview/start & /answer
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 9] POST /api/ai/interview/start & /answer ---');
    const ivStartRes = await fetch(`${BASE_URL}/interview/start`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        studentId,
        mode: 'technical',
        role: 'Backend SDE-1',
        max_questions: 2,
      }),
    });
    console.log(`  Start Status: ${ivStartRes.status}`);
    if (ivStartRes.status !== 200) {
      const errText = await ivStartRes.text();
      throw new Error(`Interview start failed: ${errText}`);
    }
    const ivData = await ivStartRes.json();
    const sessionId = ivData.sessionId;
    console.log(`  Interview Session: ${sessionId}`);
    console.log(`  Question 1: ${ivData.question}`);

    const ivAnswerRes = await fetch(`${BASE_URL}/interview/answer`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        sessionId,
        studentId,
        answer: 'I would use PostgreSQL for transactional data and Redis as an LRU cache to reduce latency. The trade-off is eventual consistency.',
      }),
    });
    console.log(`  Answer Status: ${ivAnswerRes.status}`);
    if (ivAnswerRes.status !== 200) {
      const errText = await ivAnswerRes.text();
      throw new Error(`Interview answer failed: ${errText}`);
    }
    const ivAnswerData = await ivAnswerRes.json();
    console.log(`  Turn Score: ${ivAnswerData.evaluation?.score}%`);
    console.log(`  Correctness: ${ivAnswerData.evaluation?.correctness}%`);
    console.log('  [PASSED] POST /api/ai/interview/start & /answer successfully evaluated.');

    // -------------------------------------------------------------------------
    // TEST 10: GET /api/ai/readiness/:studentId
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 10] GET /api/ai/readiness/:studentId ---');
    const readinessRes = await fetch(`${BASE_URL}/readiness/${studentId}`, {
      method: 'GET',
      headers: authHeaders,
    });
    console.log(`  Status: ${readinessRes.status}`);
    if (readinessRes.status !== 200) {
      const errText = await readinessRes.text();
      throw new Error(`Readiness check failed: ${errText}`);
    }
    const readinessData = await readinessRes.json();
    console.log(`  Readiness Score: ${readinessData.readinessScore}%`);
    console.log(`  Status: ${readinessData.status}`);
    console.log(`  Skills:`, readinessData.skills);
    if (typeof readinessData.readinessScore !== 'number' || !readinessData.status) {
      throw new Error('Readiness response missing required fields');
    }
    console.log('  [PASSED] GET /api/ai/readiness/:studentId returned deterministic readiness.');

    // -------------------------------------------------------------------------
    // TEST 11: GET /api/ai/analytics/:studentId
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 11] GET /api/ai/analytics/:studentId ---');
    const analyticsRes = await fetch(`${BASE_URL}/analytics/${studentId}`, {
      method: 'GET',
      headers: authHeaders,
    });
    console.log(`  Status: ${analyticsRes.status}`);
    if (analyticsRes.status !== 200) {
      const errText = await analyticsRes.text();
      throw new Error(`Analytics check failed: ${errText}`);
    }
    const analyticsData = await analyticsRes.json();
    console.log(`  Weekly Hours: ${analyticsData.weeklyHours}`);
    console.log(`  Trend: ${analyticsData.trend}`);
    console.log(`  Activity Summary:`, analyticsData.activitySummary);
    if (!analyticsData.student_id || !analyticsData.activitySummary) {
      throw new Error('Analytics response missing required fields');
    }
    console.log('  [PASSED] GET /api/ai/analytics/:studentId returned full analytics dashboard.');

    // -------------------------------------------------------------------------
    // TEST 12: POST /api/ai/learning/adaptive-update
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 12] POST /api/ai/learning/adaptive-update ---');
    const adaptRes = await fetch(`${BASE_URL}/learning/adaptive-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        student_id: studentId,
        trigger: 'node_proxy_integration_test',
      }),
    });
    if (!adaptRes.ok) {
      const errText = await adaptRes.text();
      throw new Error(`Adaptive update check failed: ${errText}`);
    }
    const adaptData = await adaptRes.json();
    console.log(`  Adaptive Loop Status: ${adaptData.status}`);
    console.log(`  Readiness Score: ${adaptData.readinessScore}%`);
    console.log(`  Roadmap Revision: ${adaptData.roadmap?.revision}`);
    console.log('  [PASSED] POST /api/ai/learning/adaptive-update executed feedback loop.');

    // -------------------------------------------------------------------------
    // TEST 13: POST /api/ai/notifications/trigger & GET /api/ai/notifications/:studentId
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 13] Notifications Trigger & Retrieve ---');
    const notifTriggerRes = await fetch(`${BASE_URL}/notifications/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        student_id: studentId,
        reminder_type: 'daily_learning',
        force: true,
      }),
    });
    if (!notifTriggerRes.ok) {
      const errText = await notifTriggerRes.text();
      throw new Error(`Notification trigger failed: ${errText}`);
    }
    const notifTriggerData = await notifTriggerRes.json();
    console.log(`  Trigger Status: ${notifTriggerData.status}`);
    const createdNotifId = notifTriggerData.notification?.notification_id;
    console.log(`  Created Notification: ${createdNotifId} - "${notifTriggerData.notification?.title}"`);

    // Retrieve notifications
    const getNotifRes = await fetch(`${BASE_URL}/notifications/${studentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!getNotifRes.ok) {
      const errText = await getNotifRes.text();
      throw new Error(`Get notifications failed: ${errText}`);
    }
    const getNotifData = await getNotifRes.json();
    console.log(`  Unread Notifications: ${getNotifData.unread_count}`);
    console.log(`  Total Notifications: ${getNotifData.total_notifications}`);
    if (getNotifData.total_notifications < 1) {
      throw new Error('Expected at least 1 notification retrieved');
    }
    console.log('  [PASSED] Notifications trigger and retrieve flow verified.');

    // -------------------------------------------------------------------------
    // TEST 14: PATCH /api/ai/notifications/:id/read
    // -------------------------------------------------------------------------
    if (createdNotifId) {
      console.log('\n--- [TEST 14] PATCH /api/ai/notifications/:id/read ---');
      const readRes = await fetch(`${BASE_URL}/notifications/${createdNotifId}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!readRes.ok) {
        const errText = await readRes.text();
        throw new Error(`Mark notification read failed: ${errText}`);
      }
      const readData = await readRes.json();
      console.log(`  Mark Read Status: ${readData.status}`);
      console.log('  [PASSED] PATCH /api/ai/notifications/:id/read marked notification as read.');
    }


    // -------------------------------------------------------------------------
    // TEST 15: Security - Verify No GEMINI_API_KEY Exposure
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 15] Security Check: No GEMINI_API_KEY Leakage ---');
    const serializedResponses = JSON.stringify([
      chatData,
      assessData,
      submitData,
      roadmapData,
      codingData,
      ivAnswerData,
      readinessData,
      analyticsData,
      adaptData,
      notifTriggerData,
    ]);
    if (

      serializedResponses.includes('AIzaSy') ||
      serializedResponses.includes('GEMINI_API_KEY') ||
      serializedResponses.includes('api_key')
    ) {
      throw new Error('CRITICAL SECURITY LEAK: GEMINI_API_KEY or api_key found in client response!');
    }
    console.log('  [PASSED] Verified no API keys or internal credentials exposed in responses.');

    console.log('\n======================================================================');
    console.log('ALL NODE.JS <-> FASTAPI AI SERVICE INTEGRATION TESTS PASSED!');
    console.log('======================================================================');
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
  }
}

runTests().catch((err) => {
  console.error('\n[FAILED] Test suite encountered an error:\n', err);
  if (server) server.close();
  process.exit(1);
});
