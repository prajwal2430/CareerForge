import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPlayCircle, FiCheckCircle, FiClock, FiStar, FiAward, FiFileText, FiCode, FiHelpCircle } from 'react-icons/fi';
import { MOCK_DATA } from '../data/mockData';
import GlassCard from '../components/ui/GlassCard';
import Tabs from '../components/ui/Tabs';

const CourseDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('curriculum');
  
  // Find course or use first one as fallback
  const course = MOCK_DATA.courses.find(c => c.id.toString() === id) || MOCK_DATA.courses[0];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const curriculum = [
    {
      section: 'Section 1: Introduction to Data Structures',
      duration: '1h 20m',
      lessons: [
        { title: 'What are Data Structures?', duration: '15m', completed: true, type: 'video' },
        { title: 'Time and Space Complexity (Big O)', duration: '45m', completed: true, type: 'video' },
        { title: 'Memory Allocation', duration: '20m', completed: false, type: 'reading' },
      ]
    },
    {
      section: 'Section 2: Arrays and Strings',
      duration: '3h 45m',
      lessons: [
        { title: 'Arrays Fundamentals', duration: '30m', completed: false, type: 'video' },
        { title: 'Two Pointers Technique', duration: '45m', completed: false, type: 'video' },
        { title: 'Sliding Window Pattern', duration: '50m', completed: false, type: 'video' },
        { title: 'Arrays Practice Assignment', duration: '1h', completed: false, type: 'assignment' },
      ]
    },
    {
      section: 'Section 3: Linked Lists',
      duration: '2h 30m',
      lessons: [
        { title: 'Singly Linked Lists', duration: '40m', completed: false, type: 'video' },
        { title: 'Doubly and Circular Linked Lists', duration: '50m', completed: false, type: 'video' },
        { title: 'Fast and Slow Pointers', duration: '30m', completed: false, type: 'video' },
        { title: 'Quiz: Linked Lists', duration: '30m', completed: false, type: 'quiz' },
      ]
    }
  ];

  const getIconForType = (type, completed) => {
    if (completed) return <FiCheckCircle className="text-color-success" />;
    switch(type) {
      case 'video': return <FiPlayCircle className="text-text-muted" />;
      case 'reading': return <FiFileText className="text-text-muted" />;
      case 'assignment': return <FiCode className="text-text-muted" />;
      case 'quiz': return <FiHelpCircle className="text-text-muted" />;
      default: return <FiPlayCircle className="text-text-muted" />;
    }
  };

  return (
    <div className="pb-12 max-w-6xl mx-auto">
      {/* Course Header Banner */}
      <div className="glass-card-accent p-8 rounded-2xl mb-8 flex flex-col md:flex-row gap-8 items-start border border-glass-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl"></div>
        
        <div className="w-full md:w-1/3 aspect-video bg-surface-2 rounded-xl relative overflow-hidden shrink-0 shadow-lg group">
           <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/30 group-hover:bg-bg-primary/50 transition-colors z-10 cursor-pointer">
             <div className="w-16 h-16 rounded-full bg-accent-primary flex items-center justify-center text-white text-3xl shadow-glow-primary">
               <FiPlayCircle className="ml-1" />
             </div>
           </div>
        </div>

        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold bg-surface-2 border border-glass-border text-text-primary px-3 py-1 rounded-full">
              {course.category}
            </span>
            <span className="text-xs font-bold bg-color-info-bg text-color-info px-3 py-1 rounded-full">
              Beginner
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {course.title}
          </h1>
          
          <p className="text-text-muted mb-6">
            Master the fundamentals of {course.category} with comprehensive video lectures, interactive coding assignments, and real-world projects. Designed to make you interview-ready.
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center font-bold text-white">
                {course.instructor.charAt(0)}
              </div>
              <span className="font-semibold text-text-primary">{course.instructor}</span>
            </div>
            
            <div className="flex items-center gap-1 text-color-warning font-semibold">
              <FiStar className="fill-current" /> {course.rating} <span className="text-text-muted font-normal">({course.students} students)</span>
            </div>
            
            <div className="flex items-center gap-1 text-text-muted">
              <FiClock /> {course.duration} total
            </div>

            <div className="flex items-center gap-1 text-text-muted">
              <FiAward /> Certificate of completion
            </div>
          </div>

          <div className="flex gap-4">
            <button className="btn btn-primary px-8">Continue Learning</button>
            <button className="btn btn-ghost">Save to List</button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />
          
          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              {curriculum.map((section, idx) => (
                <GlassCard key={idx} className="p-0 overflow-hidden no-hover">
                  <div className="bg-surface-2 p-4 flex justify-between items-center border-b border-glass-border">
                    <h3 className="font-bold text-white">{section.section}</h3>
                    <span className="text-xs text-text-muted">{section.lessons.length} lessons • {section.duration}</span>
                  </div>
                  <div className="divide-y divide-glass-border">
                    {section.lessons.map((lesson, lIdx) => (
                      <div key={lIdx} className="p-4 flex items-center justify-between hover:bg-surface-1/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {getIconForType(lesson.type, lesson.completed)}
                          </span>
                          <span className={`text-sm ${lesson.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                            {lesson.title}
                          </span>
                        </div>
                        <span className="text-xs text-text-muted">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {activeTab === 'overview' && (
            <GlassCard>
              <h3 className="text-xl font-bold mb-4">About this course</h3>
              <div className="text-text-secondary space-y-4 text-sm leading-relaxed">
                <p>
                  This comprehensive course is designed to take you from a complete beginner to an advanced programmer. You will learn the core concepts that are essential for cracking technical interviews at top tech companies like Google, Amazon, Microsoft, and Meta.
                </p>
                <h4 className="text-white font-bold mt-6 mb-2">What you'll learn</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-color-success mt-1 shrink-0" /> Master fundamental data structures</li>
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-color-success mt-1 shrink-0" /> Understand algorithmic complexity</li>
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-color-success mt-1 shrink-0" /> Solve 100+ LeetCode style problems</li>
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-color-success mt-1 shrink-0" /> Learn common problem-solving patterns</li>
                </ul>
              </div>
            </GlassCard>
          )}

          {activeTab === 'reviews' && (
            <GlassCard>
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-glass-border">
                <div className="text-5xl font-extrabold text-white">4.9</div>
                <div>
                  <div className="flex text-color-warning text-lg mb-1">
                    {[1, 2, 3, 4, 5].map(i => <FiStar key={i} className="fill-current" />)}
                  </div>
                  <div className="text-sm text-text-muted">Course Rating (2,450 ratings)</div>
                </div>
              </div>
              <div className="text-center text-text-muted py-8">
                Reviews placeholder for demonstration.
              </div>
            </GlassCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <GlassCard>
            <h3 className="font-bold mb-4">Your Progress</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-muted">12 / 140 lessons</span>
              <span className="text-sm font-bold text-accent-primary">9%</span>
            </div>
            <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
              <div className="h-full bg-accent-primary" style={{ width: '9%' }}></div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold mb-4">Course Features</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2"><FiVideo className="text-text-muted" /> Video content</div>
                <span>50 hours</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2"><FiCode className="text-text-muted" /> Coding exercises</div>
                <span>120+</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2"><FiFileText className="text-text-muted" /> Articles & notes</div>
                <span>45</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2"><FiAward className="text-text-muted" /> Certificate</div>
                <span>Yes</span>
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
