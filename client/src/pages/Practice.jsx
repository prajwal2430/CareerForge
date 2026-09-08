import React, { useState, useRef } from 'react';
import { FiTrendingUp, FiChevronLeft, FiChevronRight, FiSearch, FiFilter } from 'react-icons/fi';
import { MOCK_DATA } from '../data/mockData';
import ProblemTable from '../components/practice/ProblemTable';

const Practice = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active filter states
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  
  const sliderRef = useRef(null);

  const slideLeft = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
  };
  const slideRight = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
  };
  
  const problemsList = [
    { id: 1, title: 'Two Sum', acceptance: '52.3%', difficulty: 'Easy', status: 'solved', tags: ['Array', 'Hash Table'], companies: ['Google', 'Amazon'] },
    { id: 2, title: 'Add Two Numbers', acceptance: '41.8%', difficulty: 'Medium', status: 'unsolved', tags: ['Linked List', 'Math'], companies: ['Amazon', 'Microsoft'] },
    { id: 3, title: 'Longest Substring Without Repeating Characters', acceptance: '34.5%', difficulty: 'Medium', status: 'attempted', tags: ['Hash Table', 'String', 'Sliding Window'], companies: ['Google'] },
    { id: 4, title: 'Median of Two Sorted Arrays', acceptance: '39.4%', difficulty: 'Hard', status: 'unsolved', tags: ['Array', 'Binary Search', 'Divide and Conquer'], companies: ['Google', 'Microsoft'] },
    { id: 5, title: 'Longest Palindromic Substring', acceptance: '33.7%', difficulty: 'Medium', status: 'solved', tags: ['String', 'Dynamic Programming'], companies: ['Amazon'] },
    { id: 6, title: 'Zigzag Conversion', acceptance: '47.1%', difficulty: 'Medium', status: 'unsolved', tags: ['String'], companies: ['Google'] },
    { id: 7, title: 'Reverse Integer', acceptance: '28.3%', difficulty: 'Medium', status: 'unsolved', tags: ['Math'], companies: ['Microsoft'] },
    { id: 8, title: 'String to Integer (atoi)', acceptance: '17.4%', difficulty: 'Medium', status: 'unsolved', tags: ['String'], companies: ['Amazon'] },
    { id: 9, title: 'Palindrome Number', acceptance: '55.6%', difficulty: 'Easy', status: 'solved', tags: ['Math'], companies: ['Google', 'Amazon'] },
    { id: 10, title: 'Regular Expression Matching', acceptance: '28.5%', difficulty: 'Hard', status: 'unsolved', tags: ['String', 'Dynamic Programming', 'Recursion'], companies: ['Microsoft'] },
  ];

  const filteredProblems = problemsList.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = activeTab === 'all' || 
                       p.tags.some(tag => tag.toLowerCase() === activeTab.toLowerCase()) ||
                       (activeTab === 'algorithms' && p.tags.includes('Dynamic Programming'));
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesTag = tagFilter === 'All' || p.tags.some(tag => tag.toLowerCase() === tagFilter.toLowerCase());
    const matchesCompany = companyFilter === 'All' || (p.companies && p.companies.includes(companyFilter));
    
    return matchesSearch && matchesTab && matchesDifficulty && matchesStatus && matchesTag && matchesCompany;
  });

  return (
    <div className="pb-12 max-w-[1400px] mx-auto px-4 sm:px-6">
      <div className="mb-8 mt-4">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#F8FAFC] mb-2">Technical Interview Prep</h1>
        <p className="text-[#94A3B8]">Master data structures, algorithms, and system design.</p>
      </div>

      <div className="bg-[#111827] border border-[#263248] rounded-[24px] p-6 sm:p-8 mb-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#7C3AED]/10 to-transparent pointer-events-none" />
        
        {/* Carousel */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-display text-[#F8FAFC]">Featured Curriculums</h2>
            <div className="flex gap-2">
              <button onClick={slideLeft} className="w-8 h-8 rounded-full bg-[#151D2F] border border-[#263248] text-[#CBD5E1] hover:text-[#7C3AED] hover:border-[#7C3AED] flex items-center justify-center transition-all"><FiChevronLeft /></button>
              <button onClick={slideRight} className="w-8 h-8 rounded-full bg-[#151D2F] border border-[#263248] text-[#CBD5E1] hover:text-[#7C3AED] hover:border-[#7C3AED] flex items-center justify-center transition-all"><FiChevronRight /></button>
            </div>
          </div>
          
          <div ref={sliderRef} className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-2" style={{msOverflowStyle:'none', scrollbarWidth:'none'}}>
            
            <div className="min-w-[280px] h-[140px] bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] rounded-[20px] p-6 flex flex-col justify-center relative overflow-hidden text-white cursor-pointer hover:shadow-[0_10px_30px_rgba(124,58,237,0.3)] hover:-translate-y-1 transition-all">
                <span className="w-max bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">🔥 Top Curated</span>
                <h3 className="text-xl font-bold font-display leading-tight">{MOCK_DATA.courses[0].title}</h3>
            </div>
            
            <div className="min-w-[280px] h-[140px] bg-[#151D2F] border border-[#263248] rounded-[20px] p-6 flex flex-col justify-center text-[#F8FAFC] cursor-pointer hover:border-[#7C3AED] hover:-translate-y-1 transition-all group">
                <h3 className="text-sm font-bold text-[#06B6D4] mb-1 uppercase tracking-wider">{MOCK_DATA.courses[2].category} Crash Course</h3>
                <p className="text-lg font-bold font-display group-hover:text-[#7C3AED] transition-colors">{MOCK_DATA.courses[2].title}</p>
            </div>

            <div className="min-w-[280px] h-[140px] bg-[#151D2F] border border-[#263248] rounded-[20px] p-6 flex flex-col justify-center text-[#F8FAFC] cursor-pointer hover:border-[#7C3AED] hover:-translate-y-1 transition-all group">
                <h3 className="text-sm font-bold text-[#7C3AED] mb-1 uppercase tracking-wider">{MOCK_DATA.courses[1].category} Bootcamp</h3>
                <p className="text-lg font-bold font-display group-hover:text-[#06B6D4] transition-colors">{MOCK_DATA.courses[1].title}</p>
            </div>

          </div>
        </div>

        {/* Global Stats */}
        <h2 className="text-sm font-bold text-[#64748B] uppercase tracking-wider mb-3">Popular Topics</h2>
        <div className="flex flex-wrap gap-3 relative z-10">
          {[
            { label: 'Array', count: 342, color: '#06B6D4' },
            { label: 'String', count: 156, color: '#7C3AED' },
            { label: 'Hash Table', count: 89, color: '#F59E0B' },
            { label: 'Math', count: 214, color: '#10B981' },
            { label: 'Dynamic Programming', count: 412, color: '#EF4444' }
          ].map((tag, idx) => (
            <button 
              key={idx} 
              onClick={() => setTagFilter(tagFilter === tag.label ? 'All' : tag.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] font-semibold transition-colors ${
                tagFilter === tag.label ? 'bg-[#7C3AED]/20 border-[#7C3AED] text-[#FFFFFF]' : 'bg-[#151D2F] border-[#263248] text-[#CBD5E1] hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/10'
              }`}
            >
              <span>{tag.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>{tag.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Problems Board */}
      <div className="premium-card !p-6 sm:!p-8">
        
        {/* Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8 border-b border-[#263248] pb-6">
          <div className="flex gap-2 p-1 bg-[#111827] border border-[#263248] rounded-[14px]">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 text-[13px] font-bold rounded-[10px] transition-all ${activeTab === 'all' ? 'bg-[#263248] text-[#F8FAFC] shadow-sm' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}
            >
              All Topics
            </button>
            <button 
              onClick={() => setActiveTab('algorithms')}
              className={`px-5 py-2 text-[13px] font-bold rounded-[10px] transition-all flex items-center gap-2 ${activeTab === 'algorithms' ? 'bg-[#263248] text-[#F8FAFC] shadow-sm' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}
            >
              <FiTrendingUp className={activeTab === 'algorithms' ? 'text-[#06B6D4]' : ''} /> Algorithms
            </button>
          </div>
          
          <div className="form-input-icon w-full lg:w-[350px]">
            <FiSearch className="input-icon" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems, questions or tags..."
              className="form-input !h-11 !rounded-[12px]" 
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-[#64748B] font-medium text-[13px] mr-2">
            <FiFilter /> Filters:
          </div>
          <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="form-input !w-[160px] !h-10 !py-0 !text-[13px] !bg-[#0B1020]">
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-input !w-[160px] !h-10 !py-0 !text-[13px] !bg-[#0B1020]">
            <option value="All">All Statuses</option>
            <option value="solved">Solved</option>
            <option value="attempted">Attempted</option>
            <option value="unsolved">Unsolved</option>
          </select>
          <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="form-input !w-[160px] !h-10 !py-0 !text-[13px] !bg-[#0B1020] text-[#7C3AED] font-semibold border-[#7C3AED]/30">
            <option value="All">All Companies</option>
            <option value="Google">Google</option>
            <option value="Amazon">Amazon</option>
            <option value="Microsoft">Microsoft</option>
          </select>
        </div>

        <ProblemTable problems={filteredProblems} />
      </div>
    </div>
  );
};

export default Practice;
