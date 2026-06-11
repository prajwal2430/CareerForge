import React, { useState, useRef } from 'react';
import { FiCheckCircle, FiTrendingUp, FiBarChart2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MOCK_DATA } from '../data/mockData';
import ProblemTable from '../components/practice/ProblemTable';
import SearchBar from '../components/ui/SearchBar';
import GlassCard from '../components/ui/GlassCard';
import Tabs from '../components/ui/Tabs';

const Practice = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const sliderRef = useRef(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };
  
  // Create mock problems list from the problems counts in mockData
  // In a real app this would come from an API
  const problemsList = [
    { id: 1, title: 'Two Sum', acceptance: '52.3%', difficulty: 'Easy', status: 'solved', tags: ['Array', 'Hash Table'] },
    { id: 2, title: 'Add Two Numbers', acceptance: '41.8%', difficulty: 'Medium', status: 'unsolved', tags: ['Linked List', 'Math'] },
    { id: 3, title: 'Longest Substring Without Repeating Characters', acceptance: '34.5%', difficulty: 'Medium', status: 'attempted', tags: ['Hash Table', 'String', 'Sliding Window'] },
    { id: 4, title: 'Median of Two Sorted Arrays', acceptance: '39.4%', difficulty: 'Hard', status: 'unsolved', tags: ['Array', 'Binary Search', 'Divide and Conquer'] },
    { id: 5, title: 'Longest Palindromic Substring', acceptance: '33.7%', difficulty: 'Medium', status: 'solved', tags: ['String', 'Dynamic Programming'] },
    { id: 6, title: 'Zigzag Conversion', acceptance: '47.1%', difficulty: 'Medium', status: 'unsolved', tags: ['String'] },
    { id: 7, title: 'Reverse Integer', acceptance: '28.3%', difficulty: 'Medium', status: 'unsolved', tags: ['Math'] },
    { id: 8, title: 'String to Integer (atoi)', acceptance: '17.4%', difficulty: 'Medium', status: 'unsolved', tags: ['String'] },
    { id: 9, title: 'Palindrome Number', acceptance: '55.6%', difficulty: 'Easy', status: 'solved', tags: ['Math'] },
    { id: 10, title: 'Regular Expression Matching', acceptance: '28.5%', difficulty: 'Hard', status: 'unsolved', tags: ['String', 'Dynamic Programming', 'Recursion'] },
  ];

  const tabs = [
    { id: 'all', label: 'All Topics' },
    { id: 'algorithms', label: 'Algorithms' },
    { id: 'database', label: 'Database' },
    { id: 'shell', label: 'Shell' },
    { id: 'concurrency', label: 'Concurrency' },
  ];

  const filteredProblems = problemsList.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container section-sm">
      <div style={{ background: '#1a1a1a', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-8)' }}>
        {/* Horizontal Scrollable Cards */}
        <div style={{ position: 'relative' }}>
          <button onClick={slideLeft} style={{ position: 'absolute', left: '-16px', top: '70px', transform: 'translateY(-50%)', zIndex: 10, background: '#2d2d2d', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
            <FiChevronLeft size={20} />
          </button>
          
          <div ref={sliderRef} className="mb-8 scrollbar-hide" style={{ display: 'flex', gap: 'var(--space-4)', overflowX: 'auto', paddingBottom: '8px', scrollBehavior: 'smooth' }}>
          <div style={{ minWidth: '300px', height: '140px', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ zIndex: 1, textAlign: 'center' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px' }}>🔥</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{MOCK_DATA.courses[0].title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '4px' }}>Curated for Placements</p>
            </div>
          </div>
          
          <div style={{ minWidth: '320px', height: '140px', background: 'linear-gradient(135deg, #065f46, #047857)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ zIndex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '4px' }}>{MOCK_DATA.courses[2].category} Crash Course:</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{MOCK_DATA.courses[2].title}</p>
            </div>
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.2 }}>
              <FiCheckCircle size={100} />
            </div>
          </div>

          <div style={{ minWidth: '320px', height: '140px', background: 'linear-gradient(135deg, #6d28d9, #4c1d95)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ zIndex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '4px' }}>{MOCK_DATA.courses[1].category} Bootcamp:</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{MOCK_DATA.courses[1].title}</p>
            </div>
          </div>

          <div style={{ minWidth: '200px', height: '140px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ zIndex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Top Company Tags</h3>
            </div>
          </div>
          </div>

          <button onClick={slideRight} style={{ position: 'absolute', right: '-16px', top: '70px', transform: 'translateY(-50%)', zIndex: 10, background: '#2d2d2d', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
            <FiChevronRight size={20} />
          </button>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-4 mb-6" style={{ color: 'rgba(255,255,255,0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <span>Arrays & Hashing</span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '12px' }}>342</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <span>Two Pointers</span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '12px' }}>156</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <span>Sliding Window</span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '12px' }}>89</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'white' }}>
            <span>Trees</span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '12px' }}>214</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <span>Dynamic Programming</span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '12px' }}>412</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <span>Graphs</span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '12px' }}>178</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
            <span>Expand</span>
            <span>▼</span>
          </div>
        </div>

        {/* Pill Filters */}
        <div className="flex flex-wrap gap-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: '#1a1a1a', padding: '8px 16px', borderRadius: '20px', fontWeight: 500, cursor: 'pointer' }}>
            <FiCheckCircle />
            <span>All Topics</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '20px', fontWeight: 500, cursor: 'pointer' }}>
            <span style={{ color: '#f59e0b' }}><FiTrendingUp /></span>
            <span>Data Structures</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '20px', fontWeight: 500, cursor: 'pointer' }}>
            <span style={{ color: '#3b82f6' }}><FiBarChart2 /></span>
            <span>Algorithms</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '20px', fontWeight: 500, cursor: 'pointer' }}>
            <span style={{ color: '#10b981' }}><FiCheckCircle /></span>
            <span>System Design</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '20px', fontWeight: 500, cursor: 'pointer' }}>
            <span style={{ color: '#a855f7' }}><FiTrendingUp /></span>
            <span>Aptitude</span>
          </div>
        </div>
      </div>

      <GlassCard>
        <div className="flex justify-between items-center mb-6 gap-4 flex-wrap" style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: 'var(--space-4)' }}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <SearchBar 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or tags"
          />
        </div>
        
        <div className="flex gap-3 mb-6 flex-wrap">
          <select className="form-input" style={{ minWidth: '150px' }}>
            <option>Difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select className="form-input" style={{ minWidth: '150px' }}>
            <option>Status</option>
            <option>Solved</option>
            <option>Attempted</option>
            <option>Unsolved</option>
          </select>
          <select className="form-input" style={{ minWidth: '150px' }}>
            <option>Tags</option>
            <option>Array</option>
            <option>String</option>
            <option>Dynamic Programming</option>
          </select>
          <select className="form-input" style={{ minWidth: '150px', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', fontWeight: 600 }}>
            <option>Company</option>
            <option>Google</option>
            <option>Amazon</option>
            <option>Microsoft</option>
          </select>
        </div>

        <ProblemTable problems={filteredProblems} />
      </GlassCard>
    </div>
  );
};

export default Practice;
