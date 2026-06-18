import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { FiBriefcase, FiDollarSign } from 'react-icons/fi';

const Companies = () => {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#1E1E1E', margin: 0 }}>
          Company Preparation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Targeted preparation for top tier technology companies.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {MOCK_DATA.companies.map((company) => (
          <GlassCard 
            key={company.id} 
            style={{
              cursor: 'pointer',
              border: '1px solid rgba(255,107,0,0.1)',
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              padding: '1.5rem',
              transition: 'transform 0.2s, border-color 0.2s'
            }}
            whileHover={{ y: -4, borderColor: 'var(--accent-primary)' }}
            onClick={() => navigate(`/companies/${company.id}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'rgba(255,107,0,0.06)',
                border: '1px solid rgba(255,107,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 900,
                fontSize: '1.5rem',
                color: company.color || 'var(--accent-primary)'
              }}>
                {company.name.charAt(0)}
              </div>
              <Badge variant={company.difficulty.toLowerCase()}>{company.difficulty}</Badge>
            </div>
            
            <h3 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#1E1E1E',
              marginBottom: '1rem',
              marginTop: 0
            }}>{company.name}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <FiBriefcase style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {company.roles.map((role, idx) => (
                    <span 
                      key={idx} 
                      style={{
                        background: 'var(--gray-100)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <FiDollarSign style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>{company.package}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Companies;
