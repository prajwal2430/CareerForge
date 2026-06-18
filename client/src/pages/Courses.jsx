import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import CourseRow from '../components/courses/CourseRow';
import CourseFilters from '../components/courses/CourseFilters';
import CourseCard from '../components/courses/CourseCard';
import { FiTrendingUp, FiPlay } from 'react-icons/fi';

const Courses = () => {
  const { courses } = MOCK_DATA;
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter lists for the "All" view rows
  const trendingCourses = [...courses, ...courses];
  const newCourses = [...courses].reverse();
  const dsaCourses = courses.filter(c => c.category === 'DSA');
  const webCourses = courses.filter(c => c.category === 'Web Dev');
  const aptiCourses = courses.filter(c => c.category === 'Aptitude');

  // Filtered list for category grid view
  const filteredCourses = courses.filter(c => c.category === selectedCategory);

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
            <button className="btn btn-primary btn-lg rounded-full" onClick={() => navigate('/courses/2')}>
              <FiPlay className="mr-2" /> Start Watching
            </button>
            <button className="btn btn-ghost btn-lg rounded-full" onClick={() => navigate('/courses/2')}>
              More Info
            </button>
          </div>
        </div>
      </div>

      <CourseFilters activeCategory={selectedCategory} onChange={setSelectedCategory} />

      {selectedCategory === 'All' ? (
        <div className="space-y-4">
          <CourseRow title="Continue Learning" courses={courses.map(c => ({...c, progress: Math.floor(Math.random() * 80) + 10}))} />
          <CourseRow title="Trending Now" courses={trendingCourses} />
          <CourseRow title="Data Structures & Algorithms" courses={[...dsaCourses, ...dsaCourses]} />
          <CourseRow title="Web Development" courses={[...webCourses, ...webCourses]} />
          {aptiCourses.length > 0 && (
            <CourseRow title="Aptitude & Reasoning" courses={aptiCourses} />
          )}
          <CourseRow title="New Releases" courses={newCourses} />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-end mb-6 px-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">{selectedCategory} Learning Track</h2>
            <span className="text-sm text-text-muted">{filteredCourses.length} Courses available</span>
          </div>
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCourses.map(course => (
                <div key={course.id} className="snap-start shrink-0">
                  <CourseCard course={course} onClick={() => navigate(`/courses/${course.id}`)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface-2 rounded-2xl border border-glass-border">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-white mb-2">{selectedCategory} Track Coming Soon</h3>
              <p className="text-text-muted">Our expert instructors are crafting this learning path. Stay tuned!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;
