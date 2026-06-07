import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp, FiCrosshair, FiZap, FiAward } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { MOCK_DATA } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatBlock = ({ icon, value, label, sub, color = '#FF6B00' }) => (
  <div style={{
    background: 'white', border: '1px solid #F3F4F6',
    borderRadius: 16, padding: '1.25rem 1.5rem',
    display: 'flex', alignItems: 'center', gap: 14,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'all 0.25s'
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: `${color}15`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.35rem', color, flexShrink: 0
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#1E1E1E', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4B5563', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 1 }}>{sub}</div>}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const data = MOCK_DATA;

  const pieData = [
    { name: 'Easy', value: data.problems.easy.solved, color: '#10B981' },
    { name: 'Medium', value: data.problems.medium.solved, color: '#F59E0B' },
    { name: 'Hard', value: data.problems.hard.solved, color: '#EF4444' },
  ];
  const totalSolved = pieData.reduce((a, b) => a + b.value, 0);

  // Heatmap data
  const heatmapData = Array.from({ length: 30 }, (_, i) => {
    let intensity = Math.floor(Math.random() * 5);
    if (i >= 18) intensity = Math.max(1, intensity);
    if (i === 29) intensity = 4;
    return intensity;
  });
  const heatmapColors = ['#F3F4F6', '#FFE8D0', '#FFD0A0', '#FFA64D', '#FF6B00'];

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #FF6B00, #FFA64D)',
          borderRadius: 20, padding: '2rem 2.5rem',
          marginBottom: '2rem', position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(255,107,0,0.25)'
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.35rem' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
              You're on a <strong>{data.user.streak}-day streak</strong>! Keep the momentum going.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 14, padding: '1rem 1.5rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 4 }}>
                <FiTrendingUp style={{ color: 'white' }} />
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{data.user.streak}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Day Streak</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 14, padding: '1rem 1.5rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.25)' }} className="hide-mobile">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 4 }}>
                <FiCrosshair style={{ color: 'white' }} />
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>#{data.user.rank?.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Global Rank</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatBlock icon={<FiZap />} value={`${data.user.dsaProgress}%`} label="DSA Progress" sub="Keep solving!" color="#FF6B00" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatBlock icon="📚" value={`${data.user.courseProgress}%`} label="Course Progress" sub="3 enrolled" color="#3B82F6" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatBlock icon={<FiAward />} value={`${data.user.mockScore}/10`} label="Mock Interview" sub="Top 5% score" color="#10B981" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <StatBlock icon="📄" value={`${data.user.resumeScore}%`} label="ATS Resume Score" sub="Good standing" color="#8B5CF6" />
        </motion.div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Area Chart */}
        <div style={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#1E1E1E' }}>Weekly Progress</h3>
            <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6B00' }} />
                <span style={{ color: '#9CA3AF' }}>Problems</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }} />
                <span style={{ color: '#9CA3AF' }}>Hours</span>
              </div>
            </div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weeklyActivity} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gProblems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#FF6B00" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '0.82rem' }} />
                <Area type="monotone" dataKey="problems" stroke="#FF6B00" strokeWidth={2.5} fill="url(#gProblems)" />
                <Area type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2.5} fill="url(#gHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div style={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#1E1E1E', marginBottom: '1rem' }}>Problems Solved</h3>
          <div style={{ position: 'relative', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#1E1E1E' }}>{totalSolved}</span>
              <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Solved</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
            {pieData.map((d, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: d.color, fontSize: '1.1rem' }}>{d.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 2 }}>{d.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
        {/* Heatmap */}
        <div style={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', gridColumn: '1 / 3' }}>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#1E1E1E', marginBottom: '1rem' }}>Learning Activity (Last 30 Days)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 5, marginBottom: '0.75rem' }}>
            {heatmapData.map((level, i) => (
              <div key={i} title={`Level ${level}`} style={{ aspectRatio: '1', borderRadius: 4, background: heatmapColors[level], transition: 'transform 0.1s', cursor: 'default' }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9CA3AF' }}>
            <span>Less</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {heatmapColors.map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />)}
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Daily Tasks */}
        <div style={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#1E1E1E', fontSize: '0.95rem' }}>Daily Tasks</h3>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#FFF7F0', color: '#FF6B00', padding: '3px 10px', borderRadius: 999 }}>
              {data.tasks.filter(t => t.completed).length}/{data.tasks.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.tasks.slice(0, 5).map(task => (
              <div key={task.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0.6rem 0.75rem', borderRadius: 10,
                background: task.completed ? '#F0FDF4' : '#F9FAFB',
                border: `1.5px solid ${task.completed ? '#BBF7D0' : '#F3F4F6'}`,
                cursor: 'pointer', transition: 'all 0.15s'
              }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: task.completed ? '#10B981' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {task.completed && <span style={{ color: 'white', fontSize: '0.65rem' }}>✓</span>}
                </div>
                <span style={{ fontSize: '0.8rem', color: task.completed ? '#6B7280' : '#374151', textDecoration: task.completed ? 'line-through' : 'none', flex: 1, fontWeight: 500 }}>
                  {task.title}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#FF6B00', fontWeight: 700 }}>+{task.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
