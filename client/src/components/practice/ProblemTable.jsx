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
              className="cursor-pointer hover:bg-surface-1/50"
              onClick={() => navigate(`/practice/${problem.id}`)}
            >
              <td className="text-center">
                {problem.status === 'solved' && <FiCheckCircle className="text-color-success inline" />}
                {problem.status === 'attempted' && <span className="text-color-warning font-bold">?</span>}
              </td>
              <td className="font-medium text-text-primary hover:text-accent-primary transition-colors">
                {problem.id}. {problem.title}
              </td>
              <td>{problem.acceptance}</td>
              <td>
                <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
              </td>
              <td className="hidden md:table-cell">
                <div className="flex gap-2 flex-wrap">
                  {problem.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-surface-2 text-text-muted px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {problem.tags.length > 3 && (
                    <span className="text-xs bg-surface-2 text-text-muted px-2 py-1 rounded-full">+{problem.tags.length - 3}</span>
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
