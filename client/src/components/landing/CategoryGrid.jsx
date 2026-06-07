import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
  { emoji: '🧩', title: 'Data Structures & Algorithms', problems: '850+ Problems', tag: 'Most Popular', color: '#FF6B00' },
  { emoji: '☕', title: 'Java Full Stack', problems: '12 Courses', tag: 'Beginner Friendly', color: '#F59E0B' },
  { emoji: '⚛️', title: 'MERN Stack Dev', problems: '8 Courses', tag: 'Job Ready', color: '#3B82F6' },
  { emoji: '🏗️', title: 'System Design', problems: '200+ Concepts', tag: 'Advanced', color: '#8B5CF6' },
  { emoji: '🧠', title: 'Aptitude & Reasoning', problems: '1200+ Questions', tag: 'Campus Prep', color: '#10B981' },
  { emoji: '🤖', title: 'AI / Machine Learning', problems: '10 Courses', tag: 'Trending', color: '#EC4899' },
  { emoji: '🔄', title: 'DevOps & CI/CD', problems: '6 Courses', tag: 'In Demand', color: '#06B6D4' },
  { emoji: '☁️', title: 'Cloud Computing', problems: 'AWS, GCP, Azure', tag: 'Certification', color: '#FF6B00' },
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
          <div className="section-tag">📚 What You'll Learn</div>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800,
            color: '#1E1E1E', letterSpacing: '-0.02em',
            marginTop: '0.75rem'
          }}>
            Explore Our <span style={{ background: 'linear-gradient(135deg, #FF6B00, #FFA64D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Learning Tracks</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#6B7280', marginTop: '1rem', maxWidth: 550, margin: '1rem auto 0' }}>
            From beginner to placement-ready, we cover everything you need to land your first tech role.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => navigate('/courses')}
              style={{
                background: 'white', border: '1.5px solid #F3F4F6',
                borderRadius: 16, padding: '1.5rem',
                cursor: 'pointer', transition: 'all 0.3s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = cat.color;
                e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.1), 0 0 0 1px ${cat.color}22`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#F3F4F6';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{cat.emoji}</div>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#1E1E1E', marginBottom: '0.4rem' }}>
                {cat.title}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#9CA3AF', marginBottom: '1rem' }}>{cat.problems}</p>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                color: cat.color,
                background: `${cat.color}15`,
                padding: '3px 10px', borderRadius: 999
              }}>
                {cat.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
