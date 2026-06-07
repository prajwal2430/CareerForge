import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import { FiMessageSquare, FiHeart, FiShare2, FiMoreHorizontal } from 'react-icons/fi';

const Community = () => {
  const posts = [
    {
      id: 1,
      author: 'Priya Patel',
      role: 'SDE at Google',
      avatar: 'P',
      time: '2 hours ago',
      title: 'My Google Interview Experience (Off-campus 2024)',
      content: 'Just cleared Google L3 in Bangalore! Here is my detailed experience. Round 1 (Coding): Question was a variation of Longest Palindromic Substring. Used DP and optimized it...',
      tags: ['Interview Experience', 'Google', 'Offer'],
      likes: 245,
      comments: 42
    },
    {
      id: 2,
      author: 'Rahul Sharma',
      role: 'Student',
      avatar: 'R',
      time: '5 hours ago',
      title: 'Need help with System Design resources',
      content: 'Hi everyone, I am starting my system design preparation. I have covered the basics but I am confused about where to practice low-level design. Any suggestions?',
      tags: ['Question', 'System Design', 'LLD'],
      likes: 15,
      comments: 8
    }
  ];

  return (
    <div className="pb-12 max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Main Feed */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-white">Community</h1>
          <button className="btn btn-primary btn-sm">Create Post</button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button className="px-4 py-1.5 rounded-full bg-accent-primary text-white text-sm font-medium">All</button>
          <button className="px-4 py-1.5 rounded-full bg-surface-2 text-text-secondary hover:text-white text-sm font-medium transition-colors">Interview Experiences</button>
          <button className="px-4 py-1.5 rounded-full bg-surface-2 text-text-secondary hover:text-white text-sm font-medium transition-colors">Doubt Resolution</button>
          <button className="px-4 py-1.5 rounded-full bg-surface-2 text-text-secondary hover:text-white text-sm font-medium transition-colors">Project Showcase</button>
        </div>

        {/* Posts */}
        {posts.map(post => (
          <GlassCard key={post.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-white">
                  {post.avatar}
                </div>
                <div>
                  <p className="font-bold text-white leading-tight">{post.author}</p>
                  <p className="text-xs text-text-muted">{post.role} • {post.time}</p>
                </div>
              </div>
              <button className="text-text-muted hover:text-white">
                <FiMoreHorizontal />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
            <p className="text-text-secondary text-sm mb-4 line-clamp-3 leading-relaxed">{post.content}</p>
            
            <div className="flex gap-2 mb-4">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-surface-2 px-2 py-1 rounded text-text-muted">{tag}</span>
              ))}
            </div>
            
            <div className="flex items-center gap-6 pt-4 border-t border-glass-border">
              <button className="flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors text-sm font-medium">
                <FiHeart /> {post.likes}
              </button>
              <button className="flex items-center gap-2 text-text-muted hover:text-white transition-colors text-sm font-medium">
                <FiMessageSquare /> {post.comments} Comments
              </button>
              <button className="flex items-center gap-2 text-text-muted hover:text-white transition-colors text-sm font-medium ml-auto">
                <FiShare2 /> Share
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-80 space-y-6">
        <GlassCard>
          <h3 className="font-bold mb-4 border-b border-glass-border pb-2">Trending Topics</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-white">#GoogleOffCampus</p>
              <p className="text-xs text-text-muted">1.2k posts</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">#SystemDesign</p>
              <p className="text-xs text-text-muted">850 posts</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">#ReactInterview</p>
              <p className="text-xs text-text-muted">540 posts</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard>
          <h3 className="font-bold mb-4 border-b border-glass-border pb-2">Top Contributors</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center font-bold text-white">A</div>
              <div>
                <p className="font-semibold text-white">Amit Kumar</p>
                <p className="text-xs text-text-muted">15k rep</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center font-bold text-white">S</div>
              <div>
                <p className="font-semibold text-white">Sneha Rao</p>
                <p className="text-xs text-text-muted">12k rep</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Community;
