import React, { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import CourseCard from './CourseCard';
import { useNavigate } from 'react-router-dom';

const CourseRow = ({ title, courses }) => {
  const rowRef = useRef(null);
  const navigate = useNavigate();

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.8;
      
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-10 relative group">
      <div className="flex justify-between items-end mb-4 px-2">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <button className="text-sm text-accent-primary hover:text-accent-primary-hover font-semibold">
          View All
        </button>
      </div>

      <div className="relative">
        <button 
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-surface-2 border border-glass-border flex items-center justify-center text-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:flex shadow-lg"
        >
          <FiChevronLeft className="text-xl" />
        </button>

        <div 
          ref={rowRef}
          className="flex overflow-x-auto gap-6 pb-4 pt-2 px-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {courses.map((course, idx) => (
            <div key={idx} className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] snap-start shrink-0">
              <CourseCard course={course} onClick={() => navigate(`/courses/${course.id}`)} />
            </div>
          ))}
        </div>

        <button 
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-10 h-10 rounded-full bg-surface-2 border border-glass-border flex items-center justify-center text-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:flex shadow-lg"
        >
          <FiChevronRight className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default CourseRow;
