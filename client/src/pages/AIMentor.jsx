import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiUser, FiCpu } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';

const AIMentor = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your LearnHub AI Mentor. How can I help you with your placement preparation today?' }
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
    <div className="pb-12 max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FiCpu className="text-accent-primary" /> AI Placement Mentor
        </h1>
        <p className="text-text-muted">Get personalized guidance, mock interviews, and study plans.</p>
      </div>

      <GlassCard className="flex-1 p-0 overflow-hidden flex flex-col relative border border-accent-primary/20">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none"></div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
          {messages.map(msg => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-surface-3 text-text-primary' : 'bg-gradient-primary text-white shadow-glow-primary'
              }`}>
                {msg.sender === 'user' ? <FiUser /> : <FiCpu />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-surface-3 rounded-tr-sm' 
                  : 'bg-glass-bg border border-glass-border rounded-tl-sm backdrop-blur-md'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shrink-0 text-white shadow-glow-primary">
                <FiCpu />
              </div>
              <div className="p-4 rounded-2xl bg-glass-bg border border-glass-border rounded-tl-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </motion.div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        <div className="p-4 bg-surface-2 border-t border-glass-border relative z-10">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your placement prep..."
              className="flex-1 bg-bg-input border border-glass-border rounded-full px-6 py-3 text-sm focus:border-accent-primary outline-none transition-colors"
            />
            <button 
              type="submit" 
              className="w-12 h-12 rounded-full bg-accent-primary text-white flex items-center justify-center hover:bg-accent-primary-hover transition-colors shadow-glow-primary"
              disabled={!input.trim()}
            >
              <FiSend />
            </button>
          </form>
          
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
            {['Generate DP Study Plan', 'Conduct Mock Interview', 'Review my Resume'].map((prompt, idx) => (
              <button 
                key={idx} 
                type="button"
                onClick={() => setInput(prompt)}
                className="text-xs bg-surface-3 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-surface-3/80 transition-colors"
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
