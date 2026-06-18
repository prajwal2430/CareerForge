import React from 'react';
import { FiFilter } from 'react-icons/fi';
import SearchBar from '../ui/SearchBar';

const CourseFilters = ({ activeCategory = 'All', onChange }) => {
  const categories = ['All', 'DSA', 'Web Dev', 'System Design', 'Aptitude', 'AI/ML', 'DevOps'];

  return (
<<<<<<< Updated upstream
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        {categories.map((cat, idx) => (
          <button 
            key={idx}
            onClick={() => onChange && onChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-accent-primary text-white' 
                : 'bg-surface-2 border border-glass-border text-text-secondary hover:text-white'
            }`}
=======
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '4px'
      }} className="scrollbar-hide">
        {['All', 'DSA', 'Web Dev', 'System Design', 'AI/ML', 'DevOps'].map((cat, idx) => (
          <button 
            key={idx}
            style={{
              padding: '0.4rem 1.25rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              background: idx === 0 ? 'var(--gradient-primary)' : 'white',
              color: idx === 0 ? 'white' : 'var(--text-secondary)',
              border: idx === 0 ? 'none' : '1px solid var(--gray-200)',
              cursor: 'pointer'
            }}
>>>>>>> Stashed changes
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <select style={{
          background: 'white',
          border: '1px solid var(--gray-200)',
          fontSize: '0.85rem',
          fontWeight: 500,
          borderRadius: '10px',
          padding: '0.5rem 1rem',
          color: 'var(--text-secondary)',
          outline: 'none',
          cursor: 'pointer'
        }}>
          <option>Difficulty</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        
        <button style={{
          background: 'white',
          border: '1px solid var(--gray-200)',
          color: 'var(--text-secondary)',
          padding: '0.5rem 1rem',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          <FiFilter /> Filter
        </button>
      </div>
    </div>
  );
};

export default CourseFilters;
