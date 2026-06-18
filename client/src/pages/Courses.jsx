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

<<<<<<< Updated upstream
  // Filter lists for the "All" view rows
=======
>>>>>>> Stashed changes
  const trendingCourses = [...courses, ...courses];
  const newCourses = [...courses].reverse();
  const dsaCourses = courses.filter(c => c.category === 'DSA');
  const webCourses = courses.filter(c => c.category === 'Web Dev');
  const aptiCourses = courses.filter(c => c.category === 'Aptitude');

  // Filtered list for category grid view
  const filteredCourses = courses.filter(c => c.category === selectedCategory);

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Featured Hero Banner */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '380px',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '2.5rem',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
        cursor: 'pointer'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, var(--bg-primary) 0%, rgba(9,9,14,0.95) 50%, rgba(9,9,14,0.2) 100%)',
          zIndex: 10
        }}></div>
        
        {/* Unsplash background overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          zIndex: 1
        }}></div>
        
        <div style={{
          position: 'relative',
          zIndex: 20,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2.5rem',
          maxWidth: '600px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '1rem',
            color: 'var(--accent-primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            <FiTrendingUp /> #1 Bestseller
          </div>
          <h1 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            lineHeight: 1.25
          }}>
            The Ultimate MERN Stack Masterclass
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            marginBottom: '1.75rem',
            lineHeight: 1.6
          }}>
            Build 5 production-ready applications from scratch. Learn React, Node.js, Express, MongoDB, and Redux with advanced authentication and deployment.
          </p>
<<<<<<< Updated upstream
          <div className="flex gap-4">
            <button className="btn btn-primary btn-lg rounded-full" onClick={() => navigate('/courses/2')}>
              <FiPlay className="mr-2" /> Start Watching
            </button>
            <button className="btn btn-ghost btn-lg rounded-full" onClick={() => navigate('/courses/2')}>
=======
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" style={{ borderRadius: '30px', padding: '0.6rem 1.5rem' }}>
              <FiPlay style={{ marginRight: '8px' }} /> Start Watching
            </button>
            <button className="btn btn-ghost" style={{ borderRadius: '30px', padding: '0.6rem 1.5rem', background: 'var(--bg-card)' }}>
>>>>>>> Stashed changes
              More Info
            </button>
          </div>
        </div>
      </div>

      <CourseFilters activeCategory={selectedCategory} onChange={setSelectedCategory} />

<<<<<<< Updated upstream
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
=======
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <CourseRow title="Continue Learning" courses={courses.map(c => ({...c, progress: Math.floor(Math.random() * 80) + 10}))} />
        <CourseRow title="Trending Now" courses={trendingCourses} />
        <CourseRow title="Data Structures & Algorithms" courses={[...dsaCourses, ...dsaCourses, ...dsaCourses]} />
        <CourseRow title="Web Development" courses={[...webCourses, ...webCourses, ...webCourses]} />
        <CourseRow title="New Releases" courses={newCourses} />
      </div>
>>>>>>> Stashed changes
    </div>
  );
};

export default Courses;
