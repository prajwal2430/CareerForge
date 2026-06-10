import React from 'react';
import { FiFilter } from 'react-icons/fi';
import SearchBar from '../ui/SearchBar';

const CourseFilters = ({ activeCategory = 'All', onChange }) => {
  const categories = ['All', 'DSA', 'Web Dev', 'System Design', 'Aptitude', 'AI/ML', 'DevOps'];

  return (
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
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        <select className="bg-surface-2 border border-glass-border text-sm rounded-lg px-3 py-2 text-text-primary outline-none">
          <option>Difficulty</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        
        <button className="bg-surface-2 border border-glass-border text-text-secondary hover:text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
          <FiFilter /> Filter
        </button>
      </div>
    </div>
  );
};

export default CourseFilters;
