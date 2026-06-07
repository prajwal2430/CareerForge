import React from 'react';
import { MOCK_DATA } from '../data/mockData';
import CourseRow from '../components/courses/CourseRow';
import CourseFilters from '../components/courses/CourseFilters';
import { FiTrendingUp, FiPlay } from 'react-icons/fi';

const Courses = () => {
  const { courses } = MOCK_DATA;

  // Duplicate for UI demonstration
  const trendingCourses = [...courses, ...courses];
  const newCourses = [...courses].reverse();
  const dsaCourses = courses.filter(c => c.category === 'DSA');
  const webCourses = courses.filter(c => c.category === 'Web Dev');

  return (
    <div className="pb-12">
      {/* Featured Hero Banner */}
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-12 group cursor-pointer border border-glass-border">
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent z-10"></div>
        
        {/* Placeholder image background */}
        <div className="absolute inset-0 bg-surface-2 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
        
        <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-12 max-w-2xl">
          <div className="flex items-center gap-2 mb-4 text-color-warning text-sm font-bold tracking-widest uppercase">
            <FiTrendingUp /> #1 Bestseller
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            The Ultimate MERN Stack Masterclass
          </h1>
          <p className="text-lg text-text-muted mb-8 line-clamp-2">
            Build 5 production-ready applications from scratch. Learn React, Node.js, Express, MongoDB, and Redux with advanced authentication and deployment.
          </p>
          <div className="flex gap-4">
            <button className="btn btn-primary btn-lg rounded-full">
              <FiPlay className="mr-2" /> Start Watching
            </button>
            <button className="btn btn-ghost btn-lg rounded-full">
              More Info
            </button>
          </div>
        </div>
      </div>

      <CourseFilters />

      <div className="space-y-4">
        <CourseRow title="Continue Learning" courses={courses.map(c => ({...c, progress: Math.floor(Math.random() * 80) + 10}))} />
        <CourseRow title="Trending Now" courses={trendingCourses} />
        <CourseRow title="Data Structures & Algorithms" courses={[...dsaCourses, ...dsaCourses, ...dsaCourses]} />
        <CourseRow title="Web Development" courses={[...webCourses, ...webCourses, ...webCourses]} />
        <CourseRow title="New Releases" courses={newCourses} />
      </div>
    </div>
  );
};

export default Courses;
