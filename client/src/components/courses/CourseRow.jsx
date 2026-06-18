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
    <div style={{ marginBottom: '2.5rem', position: 'relative' }} className="group">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '1rem',
        padding: '0 8px'
      }}>
        <h2 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0
        }}>{title}</h2>
        <button style={{
          fontSize: '0.85rem',
          color: 'var(--accent-primary)',
          fontWeight: 600,
          background: 'none',
          cursor: 'pointer'
        }}>
          View All
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => handleScroll('left')}
          style={{
            position: 'absolute',
            left: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer'
          }}
        >
          <FiChevronLeft style={{ fontSize: '1.25rem' }} />
        </button>

        <div 
          ref={rowRef}
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '1.5rem',
            paddingBottom: '1rem',
            paddingTop: '0.5rem',
            paddingLeft: '8px',
            paddingRight: '8px'
          }}
          className="scrollbar-hide"
        >
          {courses.map((course, idx) => (
            <div key={idx} style={{
              minWidth: '300px',
              width: '300px',
              flexShrink: 0
            }}>
              <CourseCard course={course} onClick={() => navigate(`/courses/${course.id}`)} />
            </div>
          ))}
        </div>

        <button 
          onClick={() => handleScroll('right')}
          style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer'
          }}
        >
          <FiChevronRight style={{ fontSize: '1.25rem' }} />
        </button>
      </div>
    </div>
  );
};

export default CourseRow;
