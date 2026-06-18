import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import GlassCard from '../components/ui/GlassCard';
import ProgressRing from '../components/ui/ProgressRing';

const Roadmaps = () => {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#1E1E1E', margin: 0 }}>
          Learning Roadmaps
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Structured paths to achieve your career goals.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {MOCK_DATA.roadmaps.map((roadmap) => (
          <GlassCard 
            key={roadmap.id} 
            style={{
              cursor: 'pointer',
              border: '1px solid rgba(255,107,0,0.1)',
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s, border-color 0.2s'
            }}
            whileHover={{ y: -4, borderColor: 'var(--accent-primary)' }}
            onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: 'white',
                fontSize: '1.25rem',
                boxShadow: 'var(--shadow-orange)'
              }}>
                {roadmap.id === 'java' ? '☕' : roadmap.id === 'mern' ? '⚛️' : '📊'}
              </div>
              <ProgressRing 
                progress={roadmap.progress} 
                size={48} 
                strokeWidth={4.5} 
                valueText={`${roadmap.progress}%`} 
              />
            </div>
            
            <h3 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#1E1E1E',
              marginBottom: '1rem',
              marginTop: 0
            }}>{roadmap.title}</h3>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--gray-100)'
            }}>
              <span>{roadmap.steps} Modules</span>
              <span>•</span>
              <span>{roadmap.duration}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;
