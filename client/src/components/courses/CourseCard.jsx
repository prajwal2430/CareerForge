import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiUsers, FiPlayCircle } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';

const CourseCard = ({ course, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full cursor-pointer group"
      onClick={onClick}
    >
      <GlassCard className="h-full flex flex-col p-0 overflow-hidden relative">
        {/* Course Thumbnail placeholder */}
        <div className="h-40 bg-surface-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-tertiary to-transparent opacity-60 z-10"></div>
          <div className="absolute top-2 left-2 z-20">
            <span className="text-xs font-bold bg-accent-primary text-white px-2 py-1 rounded-md">
              {course.category}
            </span>
          </div>
          {course.progress !== undefined && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-3 z-20">
              <div 
                className="h-full bg-color-success" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          )}
          
          {/* Mock play button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 z-30 transition-opacity bg-bg-primary/40 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-accent-primary text-white flex items-center justify-center text-xl shadow-glow-primary">
              <FiPlayCircle />
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-text-primary mb-1 line-clamp-2 leading-tight group-hover:text-accent-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-text-muted mb-3">{course.instructor}</p>
          
          <div className="flex items-center gap-1 text-sm mb-4">
            <span className="font-bold text-color-warning">{course.rating}</span>
            <div className="flex text-color-warning text-xs">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < Math.floor(course.rating) ? 'fill-current' : ''} />
              ))}
            </div>
            <span className="text-text-muted ml-1">({course.students})</span>
          </div>

          <div className="flex justify-between items-center text-xs text-text-muted mt-auto pt-3 border-t border-glass-border">
            <div className="flex items-center gap-1">
              <FiClock /> {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <FiUsers /> Beginner Friendly
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default CourseCard;
