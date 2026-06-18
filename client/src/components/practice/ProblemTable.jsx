import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import Badge from '../ui/Badge';

const ProblemTable = ({ problems }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th className="w-12 text-center">Status</th>
            <th>Title</th>
            <th>Acceptance</th>
            <th>Difficulty</th>
            <th className="hidden md:table-cell">Tags</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr 
              key={problem.id} 
              onClick={() => navigate(`/practice/${problem.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <td className="text-center">
                {problem.status === 'solved' && <FiCheckCircle style={{ color: 'var(--color-success)', display: 'inline', fontSize: '1.2rem' }} />}
                {problem.status === 'attempted' && <span style={{ color: 'var(--color-warning)', fontWeight: 'bold', fontSize: '1.2rem' }}>?</span>}
              </td>
              <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                {problem.id}. {problem.title}
              </td>
              <td>{problem.acceptance}</td>
              <td>
                <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
              </td>
              <td className="hidden md:table-cell">
                <div className="flex gap-2 flex-wrap">
                  {problem.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{ fontSize: 'var(--text-xs)', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: 'var(--radius-full)' }}>
                      {tag}
                    </span>
                  ))}
                  {problem.tags.length > 3 && (
                    <span style={{ fontSize: 'var(--text-xs)', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: 'var(--radius-full)' }}>+{problem.tags.length - 3}</span>
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
