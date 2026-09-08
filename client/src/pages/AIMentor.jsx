import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiCpu, FiBriefcase, FiCode, FiFileText } from 'react-icons/fi';
import { Sparkles, Bot } from 'lucide-react';

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

  const SUGGESTED_PROMPTS = [
    { icon: <FiCode />, label: 'Generate DP Study Plan' },
    { icon: <FiBriefcase />, label: 'Conduct Mock Interview' },
    { icon: <FiFileText />, label: 'Review my Resume' },
  ];

  return (
    <div className="pb-12 max-w-5xl mx-auto h-[calc(100vh-100px)] flex flex-col pt-4">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#F8FAFC] mb-2 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              <Sparkles size={20} className="text-white" />
            </span>
            AI Placement Mentor
          </h1>
          <p className="text-[#94A3B8]">Your premium career co-pilot for mock interviews and study plans.</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col rounded-[24px] border border-[#263248] bg-[#111827] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] relative">
        
        {/* Decorative ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[300px] bg-[#7C3AED] opacity-[0.03] blur-[100px] pointer-events-none rounded-full" />
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 relative z-10 scrollbar-thin">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  msg.sender === 'user' 
                    ? 'bg-[#151D2F] border-[#263248] text-[#F8FAFC]' 
                    : 'bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] border-transparent text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                }`}>
                  {msg.sender === 'user' ? <FiUser size={18} /> : <Bot size={20} />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-[75%] p-4 sm:p-5 shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-[20px] rounded-tr-[4px] text-[#F8FAFC]' 
                    : 'bg-[#151D2F] border border-[#263248] rounded-[20px] rounded-tl-[4px] text-[#CBD5E1]'
                }`}>
                  <p className="text-[15px] leading-relaxed">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex gap-4"
              >
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] border-transparent flex items-center justify-center shrink-0 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Bot size={20} />
                </div>
                <div className="px-5 py-4 bg-[#151D2F] border border-[#263248] rounded-[20px] rounded-tl-[4px] flex items-center gap-1.5 h-[52px]">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-[#7C3AED] rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-[#7C3AED] rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-[#06B6D4] rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endOfMessagesRef} className="h-2" />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-[#111827] border-t border-[#263248] relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Suggested Prompts */}
            {messages.length < 3 && !isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 mb-4 overflow-x-auto scrollbar-hide pb-2"
              >
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button 
                    key={idx} 
                    type="button"
                    onClick={() => setInput(prompt.label)}
                    className="flex items-center gap-2 text-[13px] font-medium bg-[#151D2F] border border-[#263248] text-[#CBD5E1] px-4 py-2 rounded-full whitespace-nowrap hover:bg-[#7C3AED]/10 hover:border-[#7C3AED]/40 hover:text-[#F8FAFC] transition-all"
                  >
                    <span className="text-[#06B6D4]">{prompt.icon}</span>
                    {prompt.label}
                  </button>
                ))}
              </motion.div>
            )}
            
            <form onSubmit={handleSend} className="relative flex items-center group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI mentor anything..."
                className="w-full bg-[#151D2F] border border-[#263248] rounded-2xl pl-5 pr-14 py-4 text-[15px] text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/10 transition-all shadow-sm"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6366F1] text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_14px_rgba(124,58,237,0.4)] disabled:shadow-none"
              >
                <FiSend size={18} className="translate-x-[-1px] translate-y-[1px]" />
              </button>
            </form>
            <div className="text-center mt-3">
               <span className="text-[11px] text-[#64748B] font-medium">AI can make mistakes. Verify important career advice.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMentor;
