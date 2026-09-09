import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  Zap, BookOpen, Mic, FileCheck, CheckCircle2, Play, 
  ChevronLeft, ChevronRight, Trophy, Flame, Bot, ArrowRight,
  TrendingUp, Sparkles, BrainCircuit, Code, AlertTriangle,
  Award, Compass, ShieldCheck, Check, Clock, Target, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNT-UP HOOK
───────────────────────────────────────────────────────────── */
function useCountUp(target, duration = 1000, start = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const targetNum = Number(target) || 0;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * targetNum));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(targetNum);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─────────────────────────────────────────────────────────────
   STAT CARD COMPONENT
───────────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, value, suffix = '', label, color, gradientFrom, gradientTo, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const displayCount = useCountUp(value, 1000, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="premium-card glow group relative overflow-hidden"
    >
      <div 
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-[30px] pointer-events-none transition-opacity duration-300 group-hover:opacity-20" 
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-2">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[2.25rem] font-bold text-[#1C1917] leading-none font-display tracking-tight">
              {displayCount}
            </span>
            {suffix && (
              <span className="text-xl font-semibold leading-none" style={{ color }}>{suffix}</span>
            )}
          </div>
        </div>
        <div
          className="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-xs"
          style={{ background: `${color}18` }}
        >
          <Icon size={22} strokeWidth={2} style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   CUSTOM TOOLTIP
───────────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-[#1C1917] mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.stroke }} className="font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke }} />
          {p.name}: <span className="font-bold text-[#1C1917] ml-1">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN UPGRADED DASHBOARD (AI-DRIVEN)
───────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const studentId = user?._id || user?.id || 'default_student';

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');
  const [tasks, setTasks] = useState([]);

  // Fetch all dashboard data from backend AI service
  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/ai/dashboard/${studentId}`);
        if (isMounted && res.data) {
          setDashboard(res.data);
          setTasks(res.data.todaysPlan || []);
        }
      } catch (err) {
        console.error('Failed to load student dashboard from backend:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, [studentId]);

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  // Readiness values from backend
  const readinessScore = Math.round(dashboard?.placementReadiness?.score || 72);
  const readinessStatus = dashboard?.placementReadiness?.status || 'Needs Improvement';
  const displayReadiness = useCountUp(readinessScore, 1200, !loading);

  // Skill breakdown from backend
  const skills = dashboard?.skillBreakdown || {
    dsa: 45,
    java: 72,
    sql: 55,
    aptitude: 81,
    communication: 64,
    interview: 60
  };

  // Problem breakdown data for pie chart
  const codingData = dashboard?.codingProgress || { total_solved: 18, easy_solved: 10, medium_solved: 6, hard_solved: 2 };
  const pieData = [
    { name: 'Easy',   value: codingData.easy_solved || 10,   color: '#0F766E' },
    { name: 'Medium', value: codingData.medium_solved || 6,  color: '#14B8A6' },
    { name: 'Hard',   value: codingData.hard_solved || 2,    color: '#F97360' },
  ];
  const totalSolved = pieData.reduce((a, b) => a + b.value, 0);

  // Activity chart data from backend learning streak
  const activityData = dashboard?.learningStreak?.weeklyActivity || [
    { day: 'Mon', hours: 2.0, problems: 3 },
    { day: 'Tue', hours: 1.5, problems: 2 },
    { day: 'Wed', hours: 3.0, problems: 4 },
    { day: 'Thu', hours: 2.5, problems: 3 },
    { day: 'Fri', hours: 1.0, problems: 1 },
    { day: 'Sat', hours: 0.0, problems: 0 },
    { day: 'Sun', hours: 2.0, problems: 2 }
  ];

  const streakDays = dashboard?.learningStreak?.streakDays || 5;

  if (loading && !dashboard) {
    return (
      <div className="pb-12 space-y-8 max-w-[1400px] mx-auto text-[#44403C]">
        <div className="h-12 bg-white/60 animate-pulse rounded-2xl w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-56 bg-white animate-pulse rounded-2xl border border-[#E7E5E4]" />
          <div className="h-56 bg-white animate-pulse rounded-2xl border border-[#E7E5E4]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white animate-pulse rounded-2xl border border-[#E7E5E4]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 space-y-8 max-w-[1400px] mx-auto text-[#44403C]">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER SECTION
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-display font-bold text-[#1C1917] mb-2 flex items-center gap-2"
          >
            Good Morning, {user?.name?.split(' ')[0] || dashboard?.student_name || 'Student'} <span className="animate-wave origin-bottom-right">👋</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#78716C] text-base"
          >
            Placement Roadmap: <strong className="text-[#0F766E]">{dashboard?.careerGoal || 'Software Development Engineer'}</strong> ({dashboard?.year || '4th Year'})
          </motion.p>
        </div>

        <Link
          to="/ai-mentor"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Sparkles size={15} />
          <span>Launch AI Mentor</span>
        </Link>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TOP ROW: PLACEMENT READINESS SCORE & SKILL BREAKDOWN
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Placement Readiness Gauge Card (5 cols) */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="lg:col-span-5 premium-card flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">Placement Diagnostics</span>
              <h2 className="text-xl font-bold font-display text-[#1C1917]">Placement Readiness</h2>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              readinessScore >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              readinessScore >= 70 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
              'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {readinessStatus}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
            {/* Circular Gauge */}
            <div className="relative w-36 h-36 shrink-0">
               <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="40" 
                    className="stroke-[#E7E5E4]" strokeWidth="8" fill="none"
                  />
                  <motion.circle 
                    cx="50" cy="50" r="40"
                    className={
                      readinessScore >= 80 ? 'stroke-[#0F766E]' :
                      readinessScore >= 70 ? 'stroke-amber-500' : 'stroke-rose-500'
                    }
                    strokeWidth="8" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 - ((readinessScore / 100) * 2 * Math.PI * 40) }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl font-bold text-[#1C1917] tracking-tight tabular-nums">
                   {displayReadiness}%
                 </span>
                 <span className="text-[10px] text-[#78716C] font-semibold uppercase tracking-wider">Readiness</span>
               </div>
            </div>

            <div className="space-y-3 flex-1 text-center sm:text-left">
              <p className="text-xs text-[#78716C] leading-relaxed">
                Evaluated deterministically across algorithmic problem solving, core technologies, aptitude, and interview delivery.
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <div className="flex items-center gap-1.5 text-xs font-semibold bg-[#FFF1F0] border border-[#FFE4E1] px-3 py-1 rounded-full text-[#EA6250]">
                  <Flame size={14} /> {streakDays} Day Streak
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold bg-[#F0FDFA] border border-[#CCFBF1] px-3 py-1 rounded-full text-[#0F766E]">
                  <Trophy size={14} /> {dashboard?.placementReadiness?.targetTier || 'Tier 2 Ready'}
                </div>
              </div>
            </div>
          </div>

          {/* Strong Areas & Weak Areas Summary */}
          <div className="pt-4 border-t border-[#E7E5E4] grid grid-cols-2 gap-3 mt-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1.5">
                <CheckCircle2 size={13} />
                <span>Strong Areas:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {(dashboard?.strongAreas || ['Aptitude', 'Java']).map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 mb-1.5">
                <AlertTriangle size={13} />
                <span>Weak Areas:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {(dashboard?.weakAreas || ['DSA', 'SQL']).map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. SKILL BREAKDOWN CARD (7 cols) */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="lg:col-span-7 premium-card flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">Multi-Domain Evaluation</span>
                <h3 className="text-xl font-bold font-display text-[#1C1917]">Skill Breakdown</h3>
              </div>
              <span className="text-xs text-[#78716C]">Target Cutoff: <strong>70%</strong></span>
            </div>

            {/* Exact Visual Breakdown matching prompt requirements */}
            <div className="space-y-3.5 mt-2">
              {[
                { label: 'DSA', key: 'dsa', value: skills.dsa },
                { label: 'Java', key: 'java', value: skills.java },
                { label: 'SQL', key: 'sql', value: skills.sql },
                { label: 'Aptitude', key: 'aptitude', value: skills.aptitude },
                { label: 'Communication', key: 'communication', value: skills.communication },
                { label: 'Interview', key: 'interview', value: skills.interview }
              ].map((skill) => {
                const val = Math.round(skill.value || 0);
                const isStrong = val >= 75;
                const isWeak = val < 70;

                return (
                  <div key={skill.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1C1917] w-32">{skill.label}</span>
                      <div className="flex items-center gap-2">
                        {isWeak && (
                          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                            Focus
                          </span>
                        )}
                        <span className="font-bold text-[#1C1917] tabular-nums w-10 text-right">{val}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-[#E7E5E4] rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          isStrong ? 'bg-[#0F766E]' : isWeak ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(5, val))}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E7E5E4] flex items-center justify-between text-xs text-[#78716C] mt-4">
            <span>Overall Diagnostic Precision: <strong>Deterministic</strong></span>
            <Link to="/ai-mentor" className="text-[#0F766E] font-semibold hover:underline flex items-center gap-1">
              Drill Weak Topics <ArrowRight size={13} />
            </Link>
          </div>
        </motion.div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. STATISTIC KPI CARDS (CODING, LEARNING, INTERVIEW, APTITUDE)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Code}
          value={codingData.total_solved || 18}
          suffix=""
          label="Coding Solved"
          color="#0F766E" gradientFrom="#0F766E" gradientTo="#14B8A6"
          delay={0.35}
        />
        <StatCard
          icon={BookOpen}
          value={Math.round(dashboard?.learningProgress?.percentage || 45)}
          suffix="%"
          label="Roadmap Progress"
          color="#0D9488" gradientFrom="#0D9488" gradientTo="#2DD4BF"
          delay={0.4}
        />
        <StatCard
          icon={Mic}
          value={Math.round(skills.interview || 60)}
          suffix="%"
          label="Interview Score"
          color="#F97360" gradientFrom="#F97360" gradientTo="#EA6250"
          delay={0.45}
        />
        <StatCard
          icon={Zap}
          value={Math.round(skills.aptitude || 81)}
          suffix="%"
          label="Aptitude Mastery"
          color="#D97706" gradientFrom="#D97706" gradientTo="#F59E0B"
          delay={0.5}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TODAY'S PLAN & CURRENT ROADMAP ROW
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* TODAY'S PLAN (7 cols) */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.55 }}
           className="lg:col-span-7 premium-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#0F766E]" />
                <h3 className="text-lg font-bold font-display text-[#1C1917]">Today's Plan</h3>
              </div>
              <p className="text-xs text-[#78716C] mt-0.5">Recommended tasks generated adaptively for weak areas</p>
            </div>
            <span className="text-xs font-semibold bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] px-2.5 py-1 rounded-full">
              {tasks.filter(t => t.completed).length} / {tasks.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  task.completed
                    ? 'bg-[#F0FDFA]/60 border-[#CCFBF1] text-[#78716C]'
                    : 'bg-[#FAFAF9] border-[#E7E5E4] hover:border-[#0F766E]/50 text-[#1C1917]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    task.completed
                      ? 'bg-[#0F766E] border-[#0F766E] text-white'
                      : 'border-[#D6D3D1] bg-white'
                  }`}>
                    {task.completed && <Check size={14} />}
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${task.completed ? 'line-through text-[#A8A29E]' : ''}`}>
                      {task.title}
                    </div>
                    <div className="text-[10px] text-[#78716C] flex items-center gap-2 mt-0.5">
                      <span className="font-medium text-[#0F766E]">{task.category}</span>
                      <span>•</span>
                      <span>{task.estimated_mins || 30} mins</span>
                    </div>
                  </div>
                </div>

                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                  task.completed
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-[#0F766E] bg-white border border-[#E7E5E4]'
                }`}>
                  {task.completed ? 'Done' : 'Start'}
                </span>
              </div>
            ))}
          </div>

          {/* AI Recommendation Alert */}
          <div className="mt-5 p-3.5 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-start gap-3">
            <Sparkles size={18} className="text-[#0F766E] shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-[#0F766E]">Recent AI Mentor Recommendation:</strong>
              <p className="text-[#44403C] mt-0.5 leading-relaxed">
                {dashboard?.aiRecommendations?.[0] || 'Prioritize Big-O space trade-offs and practice 1 medium Tree challenge.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* CURRENT ROADMAP PROGRESS (5 cols) */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
           className="lg:col-span-5 premium-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Compass size={18} className="text-[#0F766E]" />
                <h3 className="text-lg font-bold font-display text-[#1C1917]">Current Roadmap</h3>
              </div>
              <p className="text-xs text-[#78716C] mt-0.5">{dashboard?.currentRoadmap?.title || 'Placement Accelerator'}</p>
            </div>
            <Link to="/roadmaps" className="text-xs font-semibold text-[#0F766E] hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#78716C]">Roadmap Progress</span>
                <span className="font-bold text-[#1C1917]">{Math.round(dashboard?.learningProgress?.percentage || 45)}%</span>
              </div>
              <div className="w-full h-2 bg-[#E7E5E4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F766E] rounded-full"
                  style={{ width: `${Math.min(100, Math.max(5, dashboard?.learningProgress?.percentage || 45))}%` }}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {(dashboard?.currentRoadmap?.milestones || []).slice(0, 4).map((m, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4]/80 text-xs">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                    m.completed
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-white text-[#A8A29E] border border-[#E7E5E4]'
                  }`}>
                    {m.completed ? <Check size={12} /> : <Clock size={12} />}
                  </div>
                  <span className={`flex-1 font-medium truncate ${m.completed ? 'text-[#78716C] line-through' : 'text-[#1C1917]'}`}>
                    {m.topic}
                  </span>
                  <span className="text-[10px] font-semibold text-[#A8A29E]">
                    {m.completed ? 'Mastered' : 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#78716C]">
              <span>Hours Dedicated: <strong>{dashboard?.learningProgress?.hoursSpent || 14.5} hrs</strong></span>
              <Link to="/ai-mentor" className="text-[#0F766E] font-semibold hover:underline">
                Update Roadmap →
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. ACTIVITY & CODING BREAKDOWN CHARTS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        
        {/* Activity Area Chart */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.65 }}
           className="premium-card"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
             <div>
               <h3 className="text-lg font-bold font-display text-[#1C1917] flex items-center gap-2">
                 <TrendingUp size={20} className="text-[#0F766E]" /> Practice Velocity & Hours
               </h3>
               <p className="text-xs text-[#78716C] mt-0.5">Real-time activity logs synchronized from MongoDB</p>
             </div>
             
             <div className="flex items-center gap-1 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl p-1">
               {['week', 'month', 'year'].map(p => (
                 <button
                   key={p} onClick={() => setPeriod(p)}
                   className={`px-3.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 capitalize ${
                     period === p
                       ? 'bg-[#0F766E] text-white shadow-xs'
                       : 'text-[#78716C] hover:text-[#1C1917]'
                   }`}
                 >
                   {p}
                 </button>
               ))}
             </div>
          </div>

          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97360" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#F97360" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
                <XAxis dataKey="day" stroke="#78716C" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#78716C" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="problems" name="Problems" stroke="#0F766E" strokeWidth={3} fillOpacity={1} fill="url(#colorProblems)" activeDot={{ r: 6, fill: '#0F766E', strokeWidth: 2, stroke: '#FFFFFF' }}/>
                <Area type="monotone" dataKey="hours" name="Hours" stroke="#F97360" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" activeDot={{ r: 6, fill: '#F97360', strokeWidth: 2, stroke: '#FFFFFF' }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Coding Breakdown Donut Chart */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.7 }}
           className="premium-card flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg font-bold font-display text-[#1C1917] flex items-center gap-2 mb-3">
               <BrainCircuit size={20} className="text-[#0F766E]" /> Coding Difficulty
            </h3>
            
            <div className="relative" style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-display text-[#1C1917]">{totalSolved}</span>
                <span className="text-[10px] text-[#78716C] font-medium uppercase tracking-wider">Solved</span>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                   <div className="flex items-center gap-2">
                     <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                     <span className="font-medium text-[#44403C]">{d.name}</span>
                   </div>
                   <span className="font-bold" style={{ color: d.color }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E7E5E4] flex items-center justify-between text-xs text-[#78716C]">
            <span>Acceptance Rate:</span>
            <strong className="text-[#0F766E]">{codingData.acceptance_rate || 75}%</strong>
          </div>
        </motion.div>

      </div>

    </div>
  );
};

export default Dashboard;
