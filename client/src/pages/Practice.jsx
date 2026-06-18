import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_DATA } from '../data/mockData';
import { PROBLEMS } from '../data/problemsData';
import ProblemTable from '../components/practice/ProblemTable';
import SearchBar from '../components/ui/SearchBar';
import GlassCard from '../components/ui/GlassCard';
import Tabs from '../components/ui/Tabs';

const Practice = () => {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Operational state for filters
  const [difficultyFilter, setDifficultyFilter] = useState('Difficulty');
  const [statusFilter, setStatusFilter] = useState('Status');
  const [tagFilter, setTagFilter] = useState('Tags');

  const tabs = [
    { id: 'all', label: 'All Topics' },
    { id: 'algorithms', label: 'Algorithms' },
    { id: 'database', label: 'Database' },
    { id: 'shell', label: 'Shell' },
    { id: 'concurrency', label: 'Concurrency' },
  ];

  // Dynamic tags extraction
  const allTags = Array.from(new Set(PROBLEMS.flatMap(p => p.tags)));

  // Complete Filtering Logic
  const filteredProblems = PROBLEMS.filter(p => {
    // 1. Course filter
    if (selectedCourse !== 'all' && p.courseId.toString() !== selectedCourse) {
      return false;
    }

    // 2. Tab topic filter
    if (activeTab !== 'all') {
      const topicTagMap = {
        algorithms: ['array', 'string', 'linked list', 'binary search', 'recursion', 'dynamic programming', 'divide and conquer'],
        database: ['database', 'hash table', 'mongodb', 'database design'],
        shell: ['shell'],
        concurrency: ['concurrency']
      };
      const allowedTags = topicTagMap[activeTab] || [];
      const hasMatchingTag = p.tags.some(tag => allowedTags.includes(tag.toLowerCase()));
      if (!hasMatchingTag) return false;
    }

    // 3. Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = p.title.toLowerCase().includes(query) || 
                            p.tags.some(tag => tag.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // 4. Difficulty filter
    if (difficultyFilter !== 'Difficulty' && p.difficulty !== difficultyFilter) {
      return false;
    }

    // 5. Status filter
    if (statusFilter !== 'Status' && p.status !== statusFilter.toLowerCase()) {
      return false;
    }

    // 6. Tag filter
    if (tagFilter !== 'Tags' && !p.tags.includes(tagFilter)) {
      return false;
    }

    return true;
  });

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header section with accent gradient bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Coding Practice
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Master skills across DSA, Web Development, and System Design with curated practice problems.
          </p>
        </div>

        {/* Dynamic Stats Pill container */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          background: 'var(--bg-card)',
          padding: '0.75rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ textAlign: 'center', paddingRight: '1rem', borderRight: '1px solid var(--glass-border)' }}>
            <div style={{ color: '#10B981', fontWeight: 700, fontSize: '1.1rem' }}>
              {PROBLEMS.filter(p => p.difficulty === 'Easy' && p.status === 'solved').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Easy Solved</div>
          </div>
          <div style={{ textAlign: 'center', paddingRight: '1rem', borderRight: '1px solid var(--glass-border)' }}>
            <div style={{ color: '#F59E0B', fontWeight: 700, fontSize: '1.1rem' }}>
              {PROBLEMS.filter(p => p.difficulty === 'Medium' && p.status === 'solved').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Medium Solved</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#EF4444', fontWeight: 700, fontSize: '1.1rem' }}>
              {PROBLEMS.filter(p => p.difficulty === 'Hard' && p.status === 'solved').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hard Solved</div>
          </div>
        </div>
      </div>

      {/* Course Filter Cards */}
      <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', marginTop: 0 }}>
        Practice by Enrolled Course
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* All Courses Card */}
        <div 
          onClick={() => setSelectedCourse('all')}
          style={{
            cursor: 'pointer',
            padding: '1.25rem',
            borderRadius: '16px',
            border: selectedCourse === 'all' ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
            background: selectedCourse === 'all' ? 'rgba(139, 92, 246, 0.08)' : 'var(--bg-card)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.3s ease',
            transform: selectedCourse === 'all' ? 'translateY(-2px)' : 'none'
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>All Courses</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {PROBLEMS.length} Practice Problems
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
              {PROBLEMS.filter(p => p.status === 'solved').length} / {PROBLEMS.length} Solved
            </span>
          </div>
        </div>

        {/* Dynamic Course Cards */}
        {MOCK_DATA.courses.map(course => {
          const courseProblems = PROBLEMS.filter(p => p.courseId === course.id);
          const solvedCount = courseProblems.filter(p => p.status === 'solved').length;
          const isSelected = selectedCourse === course.id.toString();
          
          return (
            <div 
              key={course.id}
              onClick={() => setSelectedCourse(course.id.toString())}
              style={{
                cursor: 'pointer',
                padding: '1.25rem',
                borderRadius: '16px',
                border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                background: isSelected ? 'rgba(139, 92, 246, 0.08)' : 'var(--bg-card)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s ease',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                fontSize: '0.65rem',
                fontWeight: 700,
                background: course.category === 'DSA' ? 'var(--accent-primary-light)' : course.category === 'Web Dev' ? 'var(--color-info-bg)' : 'var(--color-warning-bg)',
                color: course.category === 'DSA' ? 'var(--accent-primary)' : course.category === 'Web Dev' ? 'var(--color-info)' : 'var(--color-warning)',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                {course.category}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.25rem', paddingRight: '4.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {course.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {courseProblems.length} Problems
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {solvedCount} / {courseProblems.length} Solved
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  • {courseProblems.length > 0 ? Math.round((solvedCount / courseProblems.length) * 100) : 0}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <GlassCard style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
        {/* Search & Navigation Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} style={{ border: 'none', margin: 0 }} />
          <SearchBar 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or tags..."
          />
        </div>
        
        {/* Filters Panel */}
        <div style={{
          background: 'rgba(255,255,255,0.01)',
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}>
          <select 
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--glass-border)',
              fontSize: '0.85rem',
              fontWeight: 500,
              borderRadius: '10px',
              padding: '0.5rem 1rem',
              color: 'var(--text-secondary)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option>Difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--glass-border)',
              fontSize: '0.85rem',
              fontWeight: 500,
              borderRadius: '10px',
              padding: '0.5rem 1rem',
              color: 'var(--text-secondary)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option>Status</option>
            <option>Solved</option>
            <option>Attempted</option>
            <option>Unsolved</option>
          </select>

          <select 
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--glass-border)',
              fontSize: '0.85rem',
              fontWeight: 500,
              borderRadius: '10px',
              padding: '0.5rem 1rem',
              color: 'var(--text-secondary)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option>Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>

          {(difficultyFilter !== 'Difficulty' || statusFilter !== 'Status' || tagFilter !== 'Tags') && (
            <button 
              onClick={() => {
                setDifficultyFilter('Difficulty');
                setStatusFilter('Status');
                setTagFilter('Tags');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        <ProblemTable problems={filteredProblems} />
      </GlassCard>
    </div>
  );
};

export default Practice;

