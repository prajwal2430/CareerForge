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
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '2rem',
      paddingBottom: '3rem'
    }}>
      {/* Main Feed */}
      <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#1E1E1E', margin: 0 }}>Community</h1>
          <button className="btn btn-primary btn-sm" style={{ borderRadius: '20px' }}>Create Post</button>
        </div>
        
        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }} className="scrollbar-hide">
          <button style={{
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: 'var(--gradient-primary)',
            color: 'white'
          }}>All</button>
          <button style={{
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid var(--gray-200)',
            background: 'white',
            color: 'var(--text-secondary)'
          }}>Interview Experiences</button>
          <button style={{
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid var(--gray-200)',
            background: 'white',
            color: 'var(--text-secondary)'
          }}>Doubt Resolution</button>
        </div>

        {/* Posts */}
        {posts.map(post => (
          <GlassCard key={post.id} style={{
            background: 'white',
            border: '1px solid rgba(255,107,0,0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            padding: '1.5rem',
            borderRadius: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {post.avatar}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#1E1E1E', fontSize: '0.95rem' }}>{post.author}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.role} • {post.time}</p>
                </div>
              </div>
              <button style={{ background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <FiMoreHorizontal />
              </button>
            </div>
            
            <h3 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#1E1E1E',
              margin: '0 0 0.5rem 0'
            }}>{post.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>{post.content}</p>
            
            <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {post.tags.map((tag, idx) => (
                <span key={idx} style={{
                  fontSize: '0.75rem',
                  background: 'var(--gray-100)',
                  color: 'var(--text-secondary)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 500
                }}>{tag}</span>
              ))}
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--gray-100)'
            }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>
                <FiHeart /> {post.likes}
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>
                <FiMessageSquare /> {post.comments} Comments
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', marginLeft: 'auto' }}>
                <FiShare2 /> Share
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Right Sidebar */}
      <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <GlassCard style={{ background: 'white', border: '1px solid var(--gray-200)', padding: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#1E1E1E', margin: '0 0 1rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid var(--gray-100)' }}>Trending Topics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#1E1E1E' }}>#GoogleOffCampus</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>1.2k posts</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#1E1E1E' }}>#SystemDesign</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>850 posts</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#1E1E1E' }}>#ReactInterview</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>540 posts</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard style={{ background: 'white', border: '1px solid var(--gray-200)', padding: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#1E1E1E', margin: '0 0 1rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid var(--gray-100)' }}>Top Contributors</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: 'white',
                fontSize: '0.85rem'
              }}>A</div>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#1E1E1E' }}>Amit Kumar</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>15k rep</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: 'white',
                fontSize: '0.85rem'
              }}>S</div>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#1E1E1E' }}>Sneha Rao</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>12k rep</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Community;
