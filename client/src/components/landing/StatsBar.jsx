import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBookOpen, FiCode, FiMap } from 'react-icons/fi';

const stats = [
  { icon: <FiUsers />, value: '10,000+', label: 'Active Students', desc: 'And growing every day' },
  { icon: <FiBookOpen />, value: '500+', label: 'Expert Courses', desc: 'Across all tech domains' },
  { icon: <FiCode />, value: '3,000+', label: 'Coding Problems', desc: 'With editorial solutions' },
  { icon: <FiMap />, value: '100+', label: 'Career Roadmaps', desc: 'Curated by industry experts' },
];

const StatsBar = () => {
  return (
    <section style={{ padding: '5rem 0', background: '#F9FAFB', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                width: 56, height: 56, margin: '0 auto 1rem',
                background: 'linear-gradient(135deg, #FF6B00, #FFA64D)',
                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', color: 'white',
                boxShadow: '0 8px 20px rgba(255,107,0,0.25)'
              }}>
                {s.icon}
              </div>
              <div style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: 800, color: '#1E1E1E', lineHeight: 1,
                marginBottom: '0.4rem'
              }}>
                {s.value}
              </div>
              <div style={{ fontWeight: 700, color: '#1E1E1E', fontSize: '1rem', marginBottom: '0.25rem', fontFamily: "'Poppins', sans-serif" }}>
                {s.label}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
