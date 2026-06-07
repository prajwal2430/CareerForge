import React, { useState } from 'react';
import { MOCK_DATA } from '../data/mockData';
import ProblemTable from '../components/practice/ProblemTable';
import SearchBar from '../components/ui/SearchBar';
import GlassCard from '../components/ui/GlassCard';
import Tabs from '../components/ui/Tabs';

const Practice = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
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
    <div className="pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Coding Practice</h1>
          <p className="text-text-muted">Master DSA with 3000+ problems from top tech companies.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-surface-2 p-2 rounded-xl border border-glass-border">
          <div className="text-center px-4 border-r border-glass-border">
            <div className="text-color-easy font-bold">{MOCK_DATA.problems.easy.solved}</div>
            <div className="text-xs text-text-muted">Easy</div>
          </div>
          <div className="text-center px-4 border-r border-glass-border">
            <div className="text-color-medium font-bold">{MOCK_DATA.problems.medium.solved}</div>
            <div className="text-xs text-text-muted">Medium</div>
          </div>
          <div className="text-center px-4">
            <div className="text-color-hard font-bold">{MOCK_DATA.problems.hard.solved}</div>
            <div className="text-xs text-text-muted">Hard</div>
          </div>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden mb-8">
        <div className="p-4 border-b border-glass-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="border-none mb-0" />
          <SearchBar 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or tags"
          />
        </div>
        
        <div className="bg-surface-1/50 p-4 border-b border-glass-border flex gap-3 flex-wrap">
          <select className="bg-surface-2 border border-glass-border text-sm rounded-lg px-3 py-1.5 text-text-primary outline-none">
            <option>Difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select className="bg-surface-2 border border-glass-border text-sm rounded-lg px-3 py-1.5 text-text-primary outline-none">
            <option>Status</option>
            <option>Solved</option>
            <option>Attempted</option>
            <option>Unsolved</option>
          </select>
          <select className="bg-surface-2 border border-glass-border text-sm rounded-lg px-3 py-1.5 text-text-primary outline-none">
            <option>Tags</option>
            <option>Array</option>
            <option>String</option>
            <option>Dynamic Programming</option>
          </select>
          <select className="bg-surface-2 border border-glass-border text-sm rounded-lg px-3 py-1.5 text-text-primary outline-none text-accent-secondary">
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
