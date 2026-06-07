import React from 'react';
import { motion } from 'framer-motion';

const companies = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Adobe', 'Netflix',
  'Flipkart', 'Salesforce', 'Oracle', 'Infosys', 'Wipro', 'TCS'
];

const CompanyCarousel = () => {
  const doubled = [...companies, ...companies];

  return (
    <section style={{ padding: '4rem 0', background: '#F9FAFB', borderTop: '1px solid #F3F4F6' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <p style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '0.85rem', fontWeight: 700,
          color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.12em'
        }}>
          Our students are placed at top companies
        </p>
      </div>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Gradient fades */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to right, #F9FAFB, transparent)', zIndex: 10 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to left, #F9FAFB, transparent)', zIndex: 10 }} />

        <div className="animate-shimmer" style={{ display: 'flex', width: 'max-content', gap: '1.5rem', alignItems: 'center' }}>
          {doubled.map((company, i) => (
            <div key={i} style={{
              flexShrink: 0, padding: '0.75rem 2rem',
              background: 'white',
              border: '1.5px solid #E5E7EB', borderRadius: 12,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700, fontSize: '1rem',
              color: '#9CA3AF',
              cursor: 'default', transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.color = '#FF6B00'; e.currentTarget.style.background = '#FFF7F0'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'white'; }}
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyCarousel;
