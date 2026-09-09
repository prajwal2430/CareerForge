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

const categoryAccentColors = {
  'DSA':            { bg: '#F0FDFA', text: '#0F766E', border: '#CCFBF1' },
  'Web Dev':        { bg: '#F0FDFA', text: '#0F766E', border: '#CCFBF1' },
  'System Design':  { bg: '#F0FDFA', text: '#0D9488', border: '#CCFBF1' },
  'Aptitude':       { bg: '#FFF1F0', text: '#EA6250', border: '#FFE4E1' },
  'AI/ML':          { bg: '#F0FDFA', text: '#0F766E', border: '#CCFBF1' },
  'DevOps':         { bg: '#F0FDFA', text: '#0D9488', border: '#CCFBF1' },
};

const levelColors = {
  'Beginner':     { bg: 'bg-[#F0FDFA]', text: 'text-[#0F766E]', border: 'border-[#CCFBF1]' },
  'Intermediate': { bg: 'bg-[#F0FDFA]', text: 'text-[#0D9488]', border: 'border-[#CCFBF1]' },
  'Advanced':     { bg: 'bg-[#FFF1F0]', text: 'text-[#EA6250]', border: 'border-[#FFE4E1]' },
  'Completed':    { bg: 'bg-[#F0FDFA]', text: 'text-[#0F766E]', border: 'border-[#CCFBF1]' },
};

const CourseCard = ({ course, onClick }) => {
  const img = categoryImages[course.image] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop';
  const lvl = levelColors[course.level] || levelColors['Beginner'];
  const catColor = categoryAccentColors[course.category] || { bg: '#F0FDFA', text: '#0F766E', border: '#CCFBF1' };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="h-full cursor-pointer group flex flex-col"
      onClick={onClick}
    >
      <div className="
        flex-1 flex flex-col bg-white
        border border-[#E7E5E4] rounded-2xl
        overflow-hidden shadow-[0_4px_12px_rgba(28,25,23,0.05)] hover:shadow-md hover:border-[#0F766E] transition-all duration-300
      ">
        {/* Thumbnail */}
        <div className="h-40 relative overflow-hidden flex-shrink-0">
          <div
            style={{ backgroundImage: `url(${img})` }}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/60 via-[#1C1917]/15 to-transparent z-10" />

          {/* Category badge */}
          <span 
            className="absolute top-3 left-3 z-20 text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide uppercase backdrop-blur-md"
            style={{ backgroundColor: catColor.bg, color: catColor.text, borderColor: catColor.border }}
          >
            {course.category}
          </span>

          {/* Level badge */}
          <span className={`absolute top-3 right-3 z-20 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${lvl.bg} ${lvl.text} ${lvl.border}`}>
            {course.level || 'Beginner'}
          </span>

          {/* Progress bar overlay */}
          {course.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200/30 z-20 overflow-hidden">
              <div
                className="h-full bg-[#0F766E]"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          )}

          {/* Play Icon Hover Effect */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#1C1917]/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <div className="w-12 h-12 rounded-full bg-[#0F766E] hover:bg-[#115E59] flex items-center justify-center text-white shadow-lg">
              <Play size={18} fill="white" className="ml-0.5" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#1C1917] leading-snug group-hover:text-[#0F766E] transition-colors line-clamp-2">
              {course.title}
            </h3>
            <p className="text-xs text-[#78716C]">{course.instructor}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-[#EA6250]">{course.rating}</span>
            <div className="flex text-[#F97360]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < Math.floor(course.rating) ? 'currentColor' : 'transparent'}
                  className="text-[#F97360]"
                />
              ))}
            </div>
            <span className="text-[#A8A29E]">({course.students})</span>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center border-t border-[#E7E5E4] pt-3.5 mt-auto text-xs text-[#78716C]">
            <span className="flex items-center gap-1">
              <Clock size={13} /> {course.duration}
            </span>
            {course.progress > 0 ? (
              <span className="font-bold flex items-center gap-1 text-[#0F766E]">
                <Zap size={13} /> {course.progress}% done
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[#0F766E] font-semibold group-hover:translate-x-0.5 transition-transform">
                Start Course →
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
