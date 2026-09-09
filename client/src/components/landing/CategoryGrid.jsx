import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
  { emoji: '🧩', title: 'Data Structures & Algorithms', problems: '850+ Problems', tag: 'Most Popular', isAccent: true },
  { emoji: '☕', title: 'Java Full Stack', problems: '12 Courses', tag: 'Beginner Friendly', isAccent: false },
  { emoji: '⚛️', title: 'MERN Stack Dev', problems: '8 Courses', tag: 'Job Ready', isAccent: false },
  { emoji: '🏗️', title: 'System Design', problems: '200+ Concepts', tag: 'Advanced', isAccent: false },
  { emoji: '🧠', title: 'Aptitude & Reasoning', problems: '1200+ Questions', tag: 'Campus Prep', isAccent: false },
  { emoji: '🤖', title: 'AI & Data Science', problems: '10 Courses', tag: 'Trending', isAccent: true },
  { emoji: '🔄', title: 'DevOps & CI/CD', problems: '6 Courses', tag: 'In Demand', isAccent: false },
  { emoji: '☁️', title: 'Cloud Computing', problems: 'AWS, GCP, Azure', tag: 'Certification', isAccent: false },
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <section style={{ padding: '6rem 0', background: 'white' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div className="section-tag" style={{ background: '#F0FDFA', color: '#0F766E', border: '1px solid rgba(15, 118, 110, 0.2)' }}>📚 What You'll Learn</div>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800,
            color: '#1C1917', letterSpacing: '-0.02em',
            marginTop: '0.75rem'
          }}>
            Explore Our <span style={{ color: '#0F766E' }}>Learning Tracks</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#78716C', marginTop: '1rem', maxWidth: 550, margin: '1rem auto 0' }}>
            From beginner to placement-ready, we cover everything you need to land your first tech role.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {categories.map((cat, i) => {
            const color = cat.isAccent ? '#F97360' : '#0F766E';
            const bg = cat.isAccent ? '#FFF1F0' : '#F0FDFA';
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => navigate('/courses')}
                style={{
                  background: 'white', border: '1.5px solid #E7E5E4',
                  borderRadius: 16, padding: '1.5rem',
                  cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.boxShadow = `0 12px 30px rgba(15, 118, 110, 0.08)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E7E5E4';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{cat.emoji}</div>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#1C1917', marginBottom: '0.4rem' }}>
                  {cat.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#78716C', marginBottom: '1rem' }}>{cat.problems}</p>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: color,
                  background: bg,
                  border: `1px solid ${color}30`,
                  padding: '3px 10px', borderRadius: 999
                }}>
                  {cat.tag}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
