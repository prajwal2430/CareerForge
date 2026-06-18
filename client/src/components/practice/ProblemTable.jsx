import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import Badge from '../ui/Badge';

const ProblemTable = ({ problems }) => {
  const navigate = useNavigate();

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ width: '80px', textAlign: 'center' }}>Status</th>
            <th style={{ textAlign: 'left' }}>Title</th>
            <th style={{ textAlign: 'left' }}>Acceptance</th>
            <th style={{ textAlign: 'left' }}>Difficulty</th>
            <th style={{ textAlign: 'left' }}>Tags</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr 
              key={problem.id} 
              className="problem-row-hover"
              style={{ cursor: 'pointer', borderBottom: '1px solid var(--gray-100)' }}
              onClick={() => navigate(`/practice/${problem.id}`)}
            >
              <td style={{ textAlign: 'center', padding: '1rem' }}>
                {problem.status === 'solved' && <FiCheckCircle style={{ color: 'var(--color-success)', fontSize: '1.2rem' }} />}
                {problem.status === 'attempted' && <span style={{ color: 'var(--color-warning)', fontWeight: 'bold' }}>?</span>}
              </td>
              <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {problem.id}. {problem.title}
              </td>
              <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{problem.acceptance}</td>
              <td style={{ padding: '1rem' }}>
                <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
              </td>
              <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {problem.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag} 
                      style={{
                        fontSize: '0.75rem',
                        background: 'var(--gray-100)',
                        color: 'var(--text-secondary)',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontWeight: 500
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {problem.tags.length > 3 && (
                    <span 
                      style={{
                        fontSize: '0.75rem',
                        background: 'var(--gray-100)',
                        color: 'var(--text-secondary)',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontWeight: 500
                      }}
                    >
                      +{problem.tags.length - 3}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemTable;
