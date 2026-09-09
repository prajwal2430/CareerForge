import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Send,
  RefreshCw,
  User,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Code,
  Briefcase,
  BookOpen,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Play,
  FileText,
  Clock,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Human-friendly mapping for specialized agent tags
const AGENT_LABELS = {
  learning_recommendation: {
    label: 'Learning Mentor',
    icon: BookOpen,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700'
  },
  coding_mentor: {
    label: 'Coding Mentor',
    icon: Code,
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700'
  },
  interview_mentor: {
    label: 'Interview Mentor',
    icon: Briefcase,
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700'
  },
  progress_analytics: {
    label: 'Analytics Mentor',
    icon: TrendingUp,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700'
  },
  skill_assessment: {
    label: 'Assessment Mentor',
    icon: Target,
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700'
  },
  coordinator: {
    label: 'Placement Coordinator',
    icon: Bot,
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700'
  }
};

const SUGGESTED_PROMPTS = [
  { icon: BookOpen, label: 'What should I study today?' },
  { icon: TrendingUp, label: 'Am I placement ready?' },
  { icon: Code, label: 'Help me debug this code' },
  { icon: Briefcase, label: 'Start an HR interview' },
  { icon: Target, label: 'I want to know my weak areas' },
  { icon: Sparkles, label: 'Create my preparation plan' }
];

const AIMentor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Student Identity
  const studentId = user?._id || user?.id || 'demo_student';
  const studentName = user?.name || 'Candidate';
  const branch = user?.branch || 'Computer Science & Engineering';
  const year = user?.year || '4th Year';
  const careerGoal = user?.careerGoal || user?.targetRole || 'Software Development Engineer (SDE-1)';

  // Chat State
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'ai',
      agent: 'coordinator',
      text: `Hello ${studentName}! I am your CareerForge AI Placement Mentor.\n\nI dynamically coordinate across your specialized mentors (Assessment, Learning, Coding, Interview, and Analytics) to prepare you for placement drives.\n\nHow can I accelerate your placement journey today?`,
      actions: [
        { label: 'Check Readiness', message: 'Am I placement ready?' },
        { label: "Today's Study Plan", message: 'What should I study today?' },
        { label: 'Start HR Interview', message: 'Start an HR interview' }
      ],
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Context & Performance State
  const [readinessData, setReadinessData] = useState({
    readinessScore: 72,
    status: 'Needs Improvement',
    skills: { dsa: 80, java: 70, sql: 65, aptitude: 85, interview: 75 },
    strongAreas: ['Quantitative Aptitude', 'Core DSA'],
    weakAreas: ['Dynamic Programming', 'SQL Normalization', 'System Design']
  });
  const [analyticsData, setAnalyticsData] = useState({
    weeklyHours: 3.5,
    trend: 'steady',
    activitySummary: { assessmentsCompleted: 3, codingSubmissions: 4, mockInterviews: 2 }
  });
  const [loadingContext, setLoadingContext] = useState(true);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Fetch real-time student context and placement readiness
  useEffect(() => {
    let isMounted = true;
    const fetchStudentMetrics = async () => {
      try {
        setLoadingContext(true);
        // Call Node.js backend proxy
        const [readinessRes, analyticsRes] = await Promise.allSettled([
          api.get(`/ai/readiness/${studentId}`),
          api.get(`/ai/analytics/${studentId}`)
        ]);

        if (isMounted) {
          if (readinessRes.status === 'fulfilled' && readinessRes.value?.data) {
            setReadinessData(readinessRes.value.data);
          }
          if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.data) {
            setAnalyticsData(analyticsRes.value.data);
          }
        }
      } catch (err) {
        console.warn('Could not load live student metrics from backend:', err);
      } finally {
        if (isMounted) setLoadingContext(false);
      }
    };

    fetchStudentMetrics();
    return () => {
      isMounted = false;
    };
  }, [studentId]);

  // Send message to AI Coordinator via Node.js Backend API
  const handleSend = async (textToSend) => {
    const query = (typeof textToSend === 'string' ? textToSend : input).trim();
    if (!query || isTyping) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // POST to Node.js proxy route: /api/ai/mentor/chat
      const response = await api.post('/ai/mentor/chat', {
        studentId,
        message: query
      });

      const responseData = response.data;
      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        agent: responseData.agent || 'coordinator',
        text: responseData.response || 'I have analyzed your profile and updated your placement strategy.',
        actions: responseData.actions || [],
        data: responseData.data || {},
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If response updated readiness or data, refresh context
      if (responseData.data?.readinessScore !== undefined) {
        setReadinessData((prev) => ({
          ...prev,
          readinessScore: responseData.data.readinessScore,
          status: responseData.data.status || prev.status
        }));
      }
    } catch (error) {
      console.error('Error communicating with AI Mentor:', error);
      const errorMsg = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        agent: 'coordinator',
        text: 'I encountered a temporary connection issue reaching the AI service. Please ensure the AI microservice is active or try again shortly.',
        actions: [
          { label: 'Retry Question', message: query }
        ],
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Quick Action Triggers
  const handleQuickAction = (actionKey) => {
    switch (actionKey) {
      case 'assessment':
        handleSend('I want to take a placement assessment in my weakest topic.');
        break;
      case 'coding':
        navigate('/practice');
        break;
      case 'aptitude':
        handleSend('I want to practice aptitude and logical reasoning questions.');
        break;
      case 'hr_interview':
        handleSend('Start an HR interview.');
        break;
      case 'technical_interview':
        handleSend('Start a technical mock interview.');
        break;
      case 'roadmap':
        handleSend('Generate my personalized placement roadmap.');
        break;
      case 'readiness':
        handleSend('Am I placement ready? Check my placement readiness.');
        break;
      default:
        break;
    }
  };

  // Execute interactive action returned from AI
  const handleActionClick = (action) => {
    if (action.target) {
      navigate(action.target);
    } else if (action.message) {
      handleSend(action.message);
    } else if (action.action === 'navigate' && action.target) {
      navigate(action.target);
    } else if (action.label) {
      handleSend(action.label);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'ai',
        agent: 'coordinator',
        text: `Chat session refreshed. How can I assist your placement preparation, ${studentName}?`,
        actions: [
          { label: 'Check Readiness', message: 'Am I placement ready?' },
          { label: "Today's Study Plan", message: 'What should I study today?' }
        ],
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & STUDENT CONTEXT BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E7E5E4] rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-[#0F766E]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0F766E] shadow-xs">
                <Sparkles size={18} />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight">
                AI Placement Mentor
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E]">
                Multi-Agent Cluster Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Candidate: <strong className="text-[#1C1917]">{studentName}</strong></span>
              <span className="text-[#D6D3D1]">•</span>
              <span>{year} ({branch})</span>
              <span className="text-[#D6D3D1]">•</span>
              <span>Target: <strong className="text-[#0F766E]">{careerGoal}</strong></span>
            </p>
          </div>

          {/* Placement Readiness Badge */}
          <div className="flex items-center gap-3 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl p-2.5 sm:px-4 sm:py-2.5 shrink-0">
            <div className="relative flex items-center justify-center w-11 h-11">
              <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#E7E5E4]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    readinessData.readinessScore >= 80
                      ? 'text-emerald-500'
                      : readinessData.readinessScore >= 70
                      ? 'text-amber-500'
                      : 'text-rose-500'
                  }
                  strokeDasharray={`${readinessData.readinessScore || 70}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-[#1C1917]">
                {Math.round(readinessData.readinessScore || 72)}%
              </span>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#A8A29E]">
                Placement Readiness
              </div>
              <div className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5 mt-0.5">
                <span>{readinessData.status || 'Needs Improvement'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            QUICK ACTION BAR (USER REQUEST REQUIREMENT)
        ───────────────────────────────────────────────────────────── */}
        <div className="mt-5 pt-4 border-t border-[#E7E5E4]/80">
          <div className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider mb-2.5">
            Quick Actions:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickAction('assessment')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] hover:border-[#0F766E] hover:bg-[#F0FDFA] text-xs font-medium text-[#1C1917] transition-all cursor-pointer shadow-2xs"
            >
              <Target size={13} className="text-[#0F766E]" />
              <span>Take Assessment</span>
            </button>

            <button
              onClick={() => handleQuickAction('coding')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] hover:border-[#0F766E] hover:bg-[#F0FDFA] text-xs font-medium text-[#1C1917] transition-all cursor-pointer shadow-2xs"
            >
              <Code size={13} className="text-[#2563EB]" />
              <span>Practice Coding</span>
            </button>

            <button
              onClick={() => handleQuickAction('aptitude')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] hover:border-[#0F766E] hover:bg-[#F0FDFA] text-xs font-medium text-[#1C1917] transition-all cursor-pointer shadow-2xs"
            >
              <Zap size={13} className="text-[#D97706]" />
              <span>Practice Aptitude</span>
            </button>

            <button
              onClick={() => handleQuickAction('hr_interview')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] hover:border-[#0F766E] hover:bg-[#F0FDFA] text-xs font-medium text-[#1C1917] transition-all cursor-pointer shadow-2xs"
            >
              <Briefcase size={13} className="text-[#7C3AED]" />
              <span>Start HR Interview</span>
            </button>

            <button
              onClick={() => handleQuickAction('technical_interview')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] hover:border-[#0F766E] hover:bg-[#F0FDFA] text-xs font-medium text-[#1C1917] transition-all cursor-pointer shadow-2xs"
            >
              <Code size={13} className="text-[#0F766E]" />
              <span>Start Technical Interview</span>
            </button>

            <button
              onClick={() => handleQuickAction('roadmap')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] hover:border-[#0F766E] hover:bg-[#F0FDFA] text-xs font-medium text-[#1C1917] transition-all cursor-pointer shadow-2xs"
            >
              <BookOpen size={13} className="text-[#059669]" />
              <span>Generate My Roadmap</span>
            </button>

            <button
              onClick={() => handleQuickAction('readiness')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E] hover:bg-[#CCFBF1] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <Award size={13} className="text-[#0F766E]" />
              <span>Check Readiness</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN 2-COLUMN LAYOUT: CHAT (LEFT) + DIAGNOSTICS (RIGHT)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CHAT INTERFACE (8 COLS) */}
        <div className="lg:col-span-8 bg-white border border-[#E7E5E4] rounded-2xl shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-3.5 sm:px-5 sm:py-3 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#1C1917]">Coordinator Chat Session</span>
              <span className="text-[11px] text-[#A8A29E] hidden sm:inline">| Connected to internal AI microservice</span>
            </div>

            <button
              onClick={handleResetChat}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#78716C] hover:text-[#1C1917] hover:bg-white rounded-md transition-all cursor-pointer"
              title="Reset conversation"
            >
              <RefreshCw size={12} />
              <span>Reset</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const agentMeta = AGENT_LABELS[msg.agent] || AGENT_LABELS.coordinator;
                const AgentIcon = agentMeta.icon;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold border ${
                        msg.sender === 'user'
                          ? 'bg-[#F0FDFA] border-[#CCFBF1] text-[#0F766E]'
                          : `${agentMeta.bg} ${agentMeta.border} ${agentMeta.text}`
                      }`}
                    >
                      {msg.sender === 'user' ? <User size={15} /> : <AgentIcon size={16} />}
                    </div>

                    {/* Message Body */}
                    <div className={`max-w-[88%] sm:max-w-[80%] space-y-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      {/* Subtle specialized capability indicator */}
                      {msg.sender === 'ai' && (
                        <div className="flex items-center gap-1.5 pl-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${agentMeta.bg} ${agentMeta.border} border ${agentMeta.text}`}>
                            <AgentIcon size={11} />
                            <span>{agentMeta.label}</span>
                          </span>
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                          msg.sender === 'user'
                            ? 'bg-[#0F766E] text-white rounded-tr-xs'
                            : 'bg-[#FAFAF9] border border-[#E7E5E4] text-[#1C1917] rounded-tl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Interactive Suggested Action Buttons */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                          {msg.actions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(act)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white border border-[#E7E5E4] text-[#0F766E] hover:bg-[#F0FDFA] hover:border-[#0F766E] transition-all cursor-pointer shadow-2xs"
                            >
                              <span>{act.label}</span>
                              <ChevronRight size={12} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-2.5 bg-[#FAFAF9] border border-[#E7E5E4] rounded-2xl rounded-tl-xs flex items-center gap-1.5 h-9">
                    <span className="w-1.5 h-1.5 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Suggested Prompts Pill Bar */}
          <div className="px-4 py-2 bg-[#FAFAF9] border-t border-[#E7E5E4] flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-[10px] uppercase font-bold text-[#A8A29E] shrink-0">Try:</span>
            {SUGGESTED_PROMPTS.map((p, idx) => {
              const PIcon = p.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(p.label)}
                  className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white border border-[#E7E5E4] text-[#78716C] hover:text-[#0F766E] hover:border-[#0F766E] hover:bg-[#F0FDFA] whitespace-nowrap transition-all cursor-pointer shrink-0"
                >
                  <PIcon size={11} className="text-[#0F766E]" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 bg-white border-t border-[#E7E5E4]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything: 'What should I study today?', 'Debug this code', 'Start an interview'..."
                className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl pl-4 pr-12 py-2.5 sm:py-3 text-xs sm:text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 w-8 h-8 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: DIAGNOSTICS, WEAK AREAS & TODAY'S RECOMMENDED TASKS (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">
          {/* CARD 1: CURRENT WEAK AREAS */}
          <div className="bg-white border border-[#E7E5E4] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-rose-500" />
                <h2 className="text-xs sm:text-sm font-bold text-[#1C1917]">
                  Current Weak Areas
                </h2>
              </div>
              <span className="text-[10px] font-semibold text-[#A8A29E] uppercase">
                Diagnostic Gaps
              </span>
            </div>

            <p className="text-[11px] text-[#78716C] mb-3 leading-relaxed">
              Targeted concepts requiring remediation before interview rounds. Click to drill with Mentor:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {(readinessData.weakAreas && readinessData.weakAreas.length > 0
                ? readinessData.weakAreas
                : ['Dynamic Programming', 'SQL Indexing', 'System Design']
              ).map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(`How do I master ${topic} for my placement interview?`)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-all cursor-pointer text-left"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* CARD 2: TODAY'S RECOMMENDED TASKS */}
          <div className="bg-white border border-[#E7E5E4] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0F766E]" />
                <h2 className="text-xs sm:text-sm font-bold text-[#1C1917]">
                  Today's Recommended Tasks
                </h2>
              </div>
              <span className="text-[10px] font-semibold text-[#0F766E] bg-[#F0FDFA] border border-[#CCFBF1] px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4]/70">
                <div className="w-5 h-5 rounded-md bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0F766E] shrink-0 mt-0.5">
                  <Code size={12} />
                </div>
                <div className="text-xs flex-1">
                  <div className="font-semibold text-[#1C1917]">DSA Coding Drill</div>
                  <div className="text-[#78716C] text-[11px]">Solve 1 Medium LeetCode problem in Dynamic Programming.</div>
                </div>
                <button
                  onClick={() => navigate('/practice')}
                  className="text-[11px] font-semibold text-[#0F766E] hover:underline shrink-0 cursor-pointer"
                >
                  Start
                </button>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4]/70">
                <div className="w-5 h-5 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                  <Zap size={12} />
                </div>
                <div className="text-xs flex-1">
                  <div className="font-semibold text-[#1C1917]">Timed Aptitude Drill</div>
                  <div className="text-[#78716C] text-[11px]">Complete 5 probability and logical deduction questions.</div>
                </div>
                <button
                  onClick={() => handleSend('Start an aptitude diagnostic quiz')}
                  className="text-[11px] font-semibold text-amber-700 hover:underline shrink-0 cursor-pointer"
                >
                  Start
                </button>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4]/70">
                <div className="w-5 h-5 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 mt-0.5">
                  <Briefcase size={12} />
                </div>
                <div className="text-xs flex-1">
                  <div className="font-semibold text-[#1C1917]">Mock Interview Round</div>
                  <div className="text-[#78716C] text-[11px]">Practice STAR method response for behavioral questions.</div>
                </div>
                <button
                  onClick={() => handleSend('Start an HR interview')}
                  className="text-[11px] font-semibold text-purple-700 hover:underline shrink-0 cursor-pointer"
                >
                  Start
                </button>
              </div>
            </div>
          </div>

          {/* CARD 3: RECENT ASSESSMENT SUMMARY */}
          <div className="bg-white border border-[#E7E5E4] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-[#D97706]" />
                <h2 className="text-xs sm:text-sm font-bold text-[#1C1917]">
                  Recent Assessment Summary
                </h2>
              </div>
              <span className="text-[10px] text-[#78716C]">Multi-Domain</span>
            </div>

            <div className="space-y-2">
              {Object.entries(readinessData.skills || {}).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-[#78716C] uppercase">{key}</span>
                    <span className="font-bold text-[#1C1917]">{Math.round(val)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E7E5E4] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        val >= 75 ? 'bg-[#0F766E]' : val >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, val))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E7E5E4] flex items-center justify-between text-xs">
              <span className="text-[#78716C]">Weekly Practice Hours:</span>
              <strong className="text-[#1C1917]">{analyticsData.weeklyHours || 3.5} hrs</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMentor;
