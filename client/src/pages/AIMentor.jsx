import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiUser, FiCpu } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';

const AIMentor = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your CareerForge AI Mentor. How can I help you with your placement preparation today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: 'Based on your recent activity, I suggest focusing on Dynamic Programming. Would you like me to generate a 3-day study plan for DP?' 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div style={{ paddingBottom: '3rem', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#1E1E1E', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiCpu style={{ color: 'var(--accent-primary)' }} /> AI Placement Mentor
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Get personalized guidance, mock interviews, and study plans.
        </p>
      </div>

      <GlassCard style={{
        flex: 1,
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: '1px solid rgba(255,107,0,0.15)',
        background: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 10
        }}>
          {messages.map(msg => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                gap: '1rem',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: msg.sender === 'user' ? 'var(--gray-100)' : 'var(--gradient-primary)',
                color: msg.sender === 'user' ? 'var(--text-primary)' : 'white',
                boxShadow: msg.sender === 'user' ? 'none' : 'var(--shadow-orange)'
              }}>
                {msg.sender === 'user' ? <FiUser /> : <FiCpu />}
              </div>
              <div style={{
                maxWidth: '75%',
                padding: '1rem',
                borderRadius: '16px',
                background: msg.sender === 'user' ? 'rgba(255,107,0,0.05)' : '#F9FAFB',
                border: msg.sender === 'user' ? '1px solid rgba(255,107,0,0.1)' : '1px solid var(--gray-200)',
                borderTopRightRadius: msg.sender === 'user' ? '4px' : '16px',
                borderTopLeftRadius: msg.sender === 'ai' ? '4px' : '16px'
              }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#1E1E1E', lineHeight: 1.5 }}>{msg.text}</p>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: 'var(--gradient-primary)',
                color: 'white',
                boxShadow: 'var(--shadow-orange)'
              }}>
                <FiCpu />
              </div>
              <div style={{
                padding: '1rem',
                borderRadius: '16px',
                background: '#F9FAFB',
                border: '1px solid var(--gray-200)',
                borderTopLeftRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--text-muted)', borderRadius: '50%' }} className="animate-bounce"></div>
                <div style={{ width: '8px', height: '8px', background: 'var(--text-muted)', borderRadius: '50%', animationDelay: '0.2s' }} className="animate-bounce"></div>
                <div style={{ width: '8px', height: '8px', background: 'var(--text-muted)', borderRadius: '50%', animationDelay: '0.4s' }} className="animate-bounce"></div>
              </div>
            </motion.div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        <div style={{
          padding: '1.25rem',
          background: 'rgba(249,250,251,0.8)',
          borderTop: '1px solid var(--gray-200)',
          position: 'relative',
          zIndex: 10
        }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your placement prep..."
              style={{
                flex: 1,
                background: 'white',
                border: '1px solid var(--gray-200)',
                borderRadius: '30px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            <button 
              type="submit" 
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-orange)',
                cursor: 'pointer',
                border: 'none'
              }}
              disabled={!input.trim()}
            >
              <FiSend />
            </button>
          </form>
          
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '0.75rem',
            overflowX: 'auto',
            paddingBottom: '4px'
          }} className="scrollbar-hide">
            {['Generate DP Study Plan', 'Conduct Mock Interview', 'Review my Resume'].map((prompt, idx) => (
              <button 
                key={idx} 
                type="button"
                onClick={() => setInput(prompt)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: 'white',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--gray-200)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AIMentor;
