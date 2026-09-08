import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  Zap, BookOpen, Mic, FileCheck, CheckCircle2, Play, 
  ChevronLeft, ChevronRight, Trophy, Flame, Bot, ArrowRight,
  TrendingUp, Sparkles, BrainCircuit
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_DATA } from '../data/mockData';

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNT-UP
───────────────────────────────────────────────────────────── */
function useCountUp(target, duration = 1200, start = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, value, suffix = '', label, color, gradientFrom, gradientTo, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const displayCount = useCountUp(value, 1200, visible);

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
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className="premium-card glow group relative overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div 
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-[30px] pointer-events-none transition-opacity duration-300 group-hover:opacity-40" 
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[2.5rem] font-bold text-[#F8FAFC] leading-none font-display tracking-tight">
              {displayCount}
            </span>
            {suffix && (
              <span className="text-xl font-medium text-[#7C3AED] leading-none">{suffix}</span>
            )}
          </div>
        </div>
        <div
          className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${gradientFrom}33, ${gradientTo}33)` }}
        >
          <Icon size={24} strokeWidth={2} style={{ color }} />
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
    <div className="bg-[#151D2F] border border-[#263248] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] px-4 py-3 text-sm">
      <p className="font-semibold text-[#F8FAFC] mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.stroke }} className="font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke }} />
          {p.name}: <span className="font-bold text-[#F8FAFC] ml-1">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  const data = MOCK_DATA;

  // Chart period toggle
  const [period, setPeriod] = useState('week');
  const chartData = period === 'week'
    ? data.weeklyActivity
    : period === 'month' ? data.monthlyActivity : data.yearlyActivity;

  // Tasks state
  const [tasks, setTasks] = useState(data.tasks);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const taskPercent = Math.round((completedTasks / tasks.length) * 100);

  // Donut chart data
  const pieData = [
    { name: 'Easy',   value: data.problems.easy.solved,   color: '#06B6D4' },
    { name: 'Medium', value: data.problems.medium.solved, color: '#7C3AED' },
    { name: 'Hard',   value: data.problems.hard.solved,   color: '#F43F5E' },
  ];
  const totalSolved = pieData.reduce((a, b) => a + b.value, 0);

  // Overall Readiness Score Calculation (mock)
  const readinessScore = Math.round((data.user.dsaProgress + data.user.resumeScore + (data.user.mockScore * 10)) / 3);
  const displayReadiness = useCountUp(readinessScore, 1500, true);

  // Carousel logic
  const carouselRef = useRef(null);
  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="pb-12 space-y-8 max-w-[1400px] mx-auto text-[#F8FAFC]">
      
      {/* ── 1. Header Section ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-display font-bold mb-2 flex items-center gap-2"
          >
            Good Morning, {user?.name?.split(' ')[0] || 'Guest'} <span className="animate-wave origin-bottom-right">👋</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#94A3B8] text-base"
          >
            Let's move one step closer to your dream career.
          </motion.p>
        </div>
      </div>

      {/* ── 2. Top Banner Row: Readiness & AI Mentor ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
        
        {/* Readiness Score Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="premium-card flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden"
        >
          {/* Circular Progress Indicator */}
          <div className="relative w-36 h-36 flex-shrink-0">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="40" 
                  className="stroke-[#263248]" strokeWidth="8" fill="none"
                />
                <motion.circle 
                  cx="50" cy="50" r="40"
                  className="stroke-[#7C3AED]" strokeWidth="8" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 - ((readinessScore / 100) * 2 * Math.PI * 40) }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-3xl font-bold text-[#F8FAFC] tracking-tight tabular-nums">
                 {displayReadiness}%
               </span>
               <span className="text-[10px] text-[#06B6D4] font-semibold uppercase tracking-wider">Score</span>
             </div>
          </div>

          <div className="text-center sm:text-left flex-1 relative z-10">
            <h2 className="text-2xl font-bold font-display text-[#F8FAFC] mb-2">Career Readiness</h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
              Your overall profile strength based on skills, mock interviews, and resume. You are doing fantastic!
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
               <div className="flex items-center gap-1.5 text-sm font-semibold bg-[#263248]/50 border border-[#263248] px-3 py-1.5 rounded-full text-orange-400">
                 <Flame size={16} /> {data.user.streak} Day Streak
               </div>
               <div className="flex items-center gap-1.5 text-sm font-semibold bg-[#263248]/50 border border-[#263248] px-3 py-1.5 rounded-full text-yellow-400">
                 <Trophy size={16} /> #{data.user.rank?.toLocaleString()} Global
               </div>
            </div>
          </div>
        </motion.div>

        {/* AI Mentor Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="rounded-[24px] p-1 shadow-[0_0_40px_rgba(124,58,237,0.15)] relative group cursor-pointer"
           style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-[24px]" />
          <div className="bg-[#111827] w-full h-full rounded-[22px] p-6 sm:p-8 flex flex-col justify-center relative z-10 overflow-hidden">
             
             {/* Decorative Background Icon */}
             <Bot className="absolute -right-8 -bottom-8 w-48 h-48 text-[#7C3AED] opacity-10 transform rotate-12 transition-transform duration-500 group-hover:rotate-6" />

             <div className="flex items-center gap-3 mb-4">
               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                 <Sparkles size={24} className="text-white" />
               </div>
               <h2 className="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-[#F8FAFC] to-[#06B6D4]">AI Career Mentor</h2>
             </div>
             
             <p className="text-[#94A3B8] text-sm leading-relaxed mb-6 max-w-[280px]">
               Practice mock interviews, get instant resume feedback, or map out your career roadmap with personalized AI guidance.
             </p>
             
             <Link to="/ai-mentor" className="inline-flex items-center justify-center gap-2 bg-[#F8FAFC] text-[#111827] font-semibold px-6 py-3 rounded-xl w-max hover:bg-[#06B6D4] hover:text-white transition-colors duration-300">
               Start Session <ArrowRight size={18} />
             </Link>
          </div>
        </motion.div>

      </div>

      {/* ── 3. Statistic Cards Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Code2}
          value={data.user.dsaProgress}
          suffix="%"
          label="DSA Mastery"
          color="#06B6D4" gradientFrom="#06B6D4" gradientTo="#38BDF8"
          delay={0.4}
        />
        <StatCard
          icon={BookOpen}
          value={data.user.courseProgress}
          suffix="%"
          label="Course Progress"
          color="#7C3AED" gradientFrom="#7C3AED" gradientTo="#A78BFA"
          delay={0.45}
        />
        <StatCard
          icon={Mic}
          value={data.user.mockScore * 10}
          suffix="%"
          label="Mock Interview"
          color="#F43F5E" gradientFrom="#F43F5E" gradientTo="#FB7185"
          delay={0.5}
        />
        <StatCard
          icon={FileCheck}
          value={data.user.resumeScore}
          suffix="%"
          label="ATS Resume"
          color="#10B981" gradientFrom="#10B981" gradientTo="#34D399"
          delay={0.55}
        />
      </div>

      {/* ── 4. Charts Content & Tasks ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        
        {/* Progress Analytics Chart */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
           className="premium-card"
        >
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
             <div>
               <h3 className="text-lg font-bold font-display text-[#F8FAFC] flex items-center gap-2">
                 <TrendingUp size={20} className="text-[#06B6D4]" /> Activity Overview
               </h3>
               <p className="text-xs text-[#94A3B8] mt-1">Problems solved vs hours studied</p>
             </div>
             
             <div className="flex items-center gap-1 bg-[#0B1020] border border-[#263248] rounded-xl p-1">
               {['week', 'month', 'year'].map(p => (
                 <button
                   key={p} onClick={() => setPeriod(p)}
                   className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 capitalize ${
                     period === p
                       ? 'bg-[#263248] text-[#F8FAFC]'
                       : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                   }`}
                 >
                   {p}
                 </button>
               ))}
             </div>
          </div>

          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#263248" vertical={false} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="problems" name="Problems" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorProblems)" activeDot={{ r: 6, fill: '#7C3AED', strokeWidth: 2, stroke: '#151D2F' }}/>
                <Area type="monotone" dataKey="hours" name="Hours" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" activeDot={{ r: 6, fill: '#06B6D4', strokeWidth: 2, stroke: '#151D2F' }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right Column: Today's Tasks & Problem Types */}
        <div className="space-y-6 flex flex-col h-full">
           
           {/* Problem Types Donut Chart */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.65 }}
             className="premium-card flex-1 flex flex-col"
           >
              <h3 className="text-lg font-bold font-display text-[#F8FAFC] flex items-center gap-2 mb-4">
                 <BrainCircuit size={20} className="text-[#7C3AED]" /> Problem Breakdown
              </h3>
              
              <div className="relative flex-1" style={{ minHeight: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold font-display">{totalSolved}</span>
                  <span className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wider">Solved</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                       <span className="text-sm font-medium text-[#c0cbd8]">{d.name}</span>
                     </div>
                     <span className="text-sm font-bold" style={{ color: d.color }}>{d.value}</span>
                  </div>
                ))}
              </div>
           </motion.div>

        </div>
      </div>

      {/* ── 5. Today's Career Tasks & Continue Learning Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
         
         {/* Carousel */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.7 }}
           className="premium-card overflow-hidden"
         >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold font-display text-[#F8FAFC] flex items-center gap-2">
                   <Play size={20} className="text-[#7C3AED]" fill="currentColor" /> Continue Learning
                </h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => scrollCarousel(-1)} className="p-2 rounded-xl bg-[#0B1020] border border-[#263248] text-[#94A3B8] hover:text-[#06B6D4] hover:border-[#06B6D4] transition-all">
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>
                <button onClick={() => scrollCarousel(1)} className="p-2 rounded-xl bg-[#0B1020] border border-[#263248] text-[#94A3B8] hover:text-[#06B6D4] hover:border-[#06B6D4] transition-all">
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div ref={carouselRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-none" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
               {data.continueLearning.map((course, idx) => (
                  <div key={course.id} className="flex-shrink-0 w-72 bg-[#0B1020] border border-[#263248] rounded-[20px] p-5 hover:border-[#7C3AED] hover:shadow-[0_0_20px_rgba(124,58,237,0.1)] transition-all group">
                     
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${course.color}22` }}>
                           <BookOpen size={20} style={{ color: course.color }} />
                        </div>
                        <div>
                           <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: course.color, backgroundColor: `${course.color}11` }}>
                              {course.category}
                           </span>
                           <h4 className="text-sm font-bold text-[#F8FAFC] mt-1 line-clamp-1 group-hover:text-[#06B6D4] transition-colors">{course.title}</h4>
                        </div>
                     </div>
                     
                     <div className="space-y-2 mb-5">
                       <div className="flex justify-between text-xs font-semibold">
                         <span className="text-[#94A3B8]">Progress</span>
                         <span style={{ color: course.color }}>{course.progress}%</span>
                       </div>
                       <div className="h-1.5 bg-[#263248] rounded-full overflow-hidden">
                         <div className="h-full rounded-full transition-all duration-700" style={{ width: `${course.progress}%`, backgroundColor: course.color }} />
                       </div>
                     </div>

                     <Link to={`/courses/${course.id}`} className="block w-full py-2.5 rounded-xl text-center text-sm font-semibold border border-[#263248] hover:bg-[#7C3AED] hover:text-white hover:border-[#7C3AED] transition-colors">
                       Resume Module
                     </Link>
                  </div>
               ))}
               
               <Link to="/courses" className="flex-shrink-0 w-64 bg-transparent border-2 border-dashed border-[#263248] rounded-[20px] flex flex-col items-center justify-center gap-3 hover:border-[#06B6D4] hover:bg-[#06B6D4]/5 transition-all text-[#94A3B8] hover:text-[#06B6D4]">
                  <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center">
                     <ArrowRight size={18} />
                  </div>
                  <span className="text-sm font-semibold">View All Courses</span>
               </Link>
            </div>
         </motion.div>

         {/* Today's Tasks */}
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="premium-card overflow-hidden flex flex-col"
         >
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold font-display text-[#F8FAFC]">Today's Tasks</h3>
               <span className="text-sm font-bold text-[#06B6D4]">{completedTasks}/{tasks.length} Done</span>
            </div>

            <div className="h-1.5 bg-[#263248] rounded-full mb-6">
               <motion.div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-full" animate={{ width: `${taskPercent}%` }} />
            </div>

            <div className="space-y-3 flex-1">
               {tasks.map(task => (
                  <button
                     key={task.id} onClick={() => toggleTask(task.id)}
                     className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${task.completed ? 'bg-[#7C3AED]/10 border-[#7C3AED]/30' : 'bg-[#0B1020] border-[#263248] hover:border-[#06B6D4]'}`}
                  >
                     <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors ${task.completed ? 'bg-[#7C3AED] border-[#7C3AED]' : 'border-[#475569]'}`}>
                        {task.completed && <CheckCircle2 size={12} strokeWidth={4} className="text-white" />}
                     </div>
                     <span className={`flex-1 text-sm font-medium transition-colors ${task.completed ? 'text-[#94A3B8] line-through' : 'text-[#F8FAFC]'}`}>
                        {task.title}
                     </span>
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.completed ? 'bg-[#7C3AED]/20 text-[#7C3AED]' : 'bg-[#263248] text-[#94A3B8]'}`}>
                        +{task.points} XP
                     </span>
                  </button>
               ))}
            </div>
         </motion.div>

      </div>
    </div>
  );
};

// Add CSS for pulse/wave if omitted, simple missing icon fix
const Code2 = ({size, strokeWidth, ...props}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;

export default Dashboard;
