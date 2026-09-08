import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Play, Zap } from 'lucide-react';

const categoryImages = {
  'dsa-thumb':    'https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=600&auto=format&fit=crop',
  'dsa2-thumb':   'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop',
  'dsa3-thumb':   'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=600&auto=format&fit=crop',
  'mern-thumb':   'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
  'next-thumb':   'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=600&auto=format&fit=crop',
  'react-thumb':  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop',
  'sd-thumb':     'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop',
  'sd2-thumb':    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop',
  'sd3-thumb':    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
  'apti-thumb':   'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
  'verbal-thumb': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop',
  'di-thumb':     'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
  'aiml-thumb':   'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
  'dl-thumb':     'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=600&auto=format&fit=crop',
  'nlp-thumb':    'https://images.unsplash.com/photo-1686191128892-3b37add4c844?q=80&w=600&auto=format&fit=crop',
  'devops-thumb': 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop',
  'k8s-thumb':    'https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=600&auto=format&fit=crop',
  'aws-thumb':    'https://images.unsplash.com/photo-1667372393913-59292cffe9e3?q=80&w=600&auto=format&fit=crop',
};

const levelColors = {
  'Beginner':     { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-100 dark:border-green-900/50' },
  'Intermediate': { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/50' },
  'Advanced':     { bg: 'bg-rose-50 dark:bg-rose-900/20',   text: 'text-rose-600 dark:text-rose-400',   border: 'border-rose-100 dark:border-rose-900/50' },
};

const CourseCard = ({ course, onClick }) => {
  const img = categoryImages[course.image] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop';
  const lvl = levelColors[course.level] || levelColors['Beginner'];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="h-full cursor-pointer group flex flex-col"
      onClick={onClick}
    >
      <div className="
        flex-1 flex flex-col bg-card border-none
        border border-slate-100 dark:border-slate-800 rounded-2xl
        overflow-hidden shadow-sm hover:shadow-md transition-all duration-300
      ">
        {/* Thumbnail */}
        <div className="h-40 relative overflow-hidden flex-shrink-0">
          <div
            style={{ backgroundImage: `url(${img})` }}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent z-10" />

          {/* Category badge */}
          <span className="absolute top-3 left-3 z-20 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-600/90 backdrop-blur-md text-white tracking-wide uppercase">
            {course.category}
          </span>

          {/* Level badge */}
          <span className={`absolute top-3 right-3 z-20 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${lvl.bg} ${lvl.text} ${lvl.border}`}>
            {course.level || 'Beginner'}
          </span>

          {/* Progress bar overlay */}
          {course.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/20 z-20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          )}

          {/* Play Icon Hover Effect */}
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/25">
              <Play size={18} fill="white" className="ml-0.5" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 gap-3.5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
              {course.title}
            </h3>
            <p className="text-xs text-slate-400 dark:text-text-muted">{course.instructor}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-amber-500">{course.rating}</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < Math.floor(course.rating) ? 'currentColor' : 'transparent'}
                  className="text-amber-400"
                />
              ))}
            </div>
            <span className="text-slate-400 dark:text-text-muted">({course.students})</span>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/60 pt-3.5 mt-auto text-xs text-slate-400 dark:text-text-muted">
            <span className="flex items-center gap-1">
              <Clock size={13} /> {course.duration}
            </span>
            {course.progress > 0 ? (
              <span className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1">
                <Zap size={13} /> {course.progress}% done
              </span>
            ) : (
              <span className="flex items-center gap-1 text-text-muted dark:text-slate-400 font-semibold group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Start Now
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
