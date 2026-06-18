import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiUsers, FiPlayCircle } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';

const categoryImages = {
  'dsa-thumb': 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=600&auto=format&fit=crop',
  'mern-thumb': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
  'sd-thumb': 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop',
  'apti-thumb': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
};

const CourseCard = ({ course, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%', cursor: 'pointer' }}
      onClick={onClick}
    >
<<<<<<< Updated upstream
      <GlassCard className="h-full flex flex-col p-0 overflow-hidden relative">
        {/* Course Thumbnail with background image */}
        <div className="h-40 bg-surface-2 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ 
              backgroundImage: `url(${categoryImages[course.image] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'})` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-tertiary to-transparent opacity-60 z-10"></div>
          <div className="absolute top-2 left-2 z-20">
            <span className="text-xs font-bold bg-accent-primary text-white px-2 py-1 rounded-md">
=======
      <GlassCard style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid var(--glass-border)',
        background: 'var(--bg-card)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}>
        {/* Course Thumbnail placeholder */}
        <div style={{
          height: '160px',
          background: 'var(--gradient-orange-light)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.05), transparent)',
            zIndex: 10
          }}></div>
          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 20 }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              background: 'var(--gradient-primary)',
              color: 'white',
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
>>>>>>> Stashed changes
              {course.category}
            </span>
          </div>
          {course.progress !== undefined && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'var(--gray-200)',
              zIndex: 20
            }}>
              <div 
                style={{ height: '100%', background: 'var(--color-success)', width: `${course.progress}%` }}
              ></div>
            </div>
          )}
          
          <div style={{
            fontSize: '1.2rem',
            fontWeight: 800,
            color: 'var(--accent-primary)',
            opacity: 0.85
          }}>
            {course.category}
          </div>
        </div>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: '0.95rem',
            color: 'var(--text-primary)',
            marginBottom: '0.25rem',
            lineHeight: 1.3
          }}>
            {course.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{course.instructor}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-warning)' }}>{course.rating}</span>
            <div style={{ display: 'flex', color: 'var(--color-warning)', fontSize: '0.75rem' }}>
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < Math.floor(course.rating) ? 'fill-current' : ''} />
              ))}
            </div>
            <span style={{ color: 'var(--text-muted)' }}>({course.students})</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: 'auto',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--gray-100)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiClock /> {course.duration}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiUsers /> Beginner
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default CourseCard;
