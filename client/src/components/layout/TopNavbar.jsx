import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Settings, LogOut, User, Bot, Command } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const TopNavbar = ({ isSidebarCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 z-[190] flex items-center justify-between px-4 lg:px-6 transition-all duration-300 ${isSidebarCollapsed ? 'md:left-[72px]' : 'md:left-[72px] lg:left-[260px]'} left-0 bg-white/95 backdrop-blur-md border-b border-[#E7E5E4] shadow-xs`}
    >
      {/* ── Left Toggle (Mobile only) ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-lg text-[#78716C] hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-colors"
        >
          <Menu size={22} strokeWidth={2} />
        </button>
      </div>

      {/* ── Right Action Area ── */}
      <div className="flex items-center gap-4">
        
        {/* Search */}
        <div className={`hidden sm:flex relative items-center transition-all duration-300 ease-out ${searchFocused ? 'w-64' : 'w-48'}`}>
          <Search size={14} strokeWidth={2} className="absolute left-3 text-[#A8A29E] pointer-events-none" />
          <input
            id="global-search"
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="
              w-full pl-9 pr-12 py-1.5 text-sm rounded-full
              bg-[#FAFAF9] border border-[#E7E5E4]
              text-[#1C1917] placeholder:text-[#A8A29E]
              focus:outline-none focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E]
              transition-all duration-300
            "
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#E7E5E4] rounded text-[#78716C]">
            ⌘K
          </kbd>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => navigate('/ai-mentor')}
            className="relative p-2 rounded-full text-[#78716C] hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-colors duration-200 cursor-pointer" 
            title="AI Mentor"
          >
            <Bot size={18} strokeWidth={2} />
          </button>
          
          <NotificationCenter />
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-[#E7E5E4] mx-1" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-[#FAFAF9] border border-transparent hover:border-[#E7E5E4] transition-all duration-200 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#0F766E] flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#1C1917] leading-none mb-1">{user?.name || 'User'}</p>
              <p className="text-[10px] text-[#78716C] leading-none font-mono">STUDENT</p>
            </div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 mt-3 w-56 bg-white border border-[#E7E5E4] rounded-xl shadow-[0_10px_30px_rgba(28,25,23,0.08)] overflow-hidden z-50 origin-top-right"
              >
                <div className="px-4 py-3 border-b border-[#E7E5E4] bg-[#FAFAF9]">
                  <p className="text-sm font-bold text-[#1C1917] truncate">{user?.name}</p>
                  <p className="text-xs text-[#78716C] truncate">{user?.email || 'student@careerforge.io'}</p>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-[#44403C] hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-colors cursor-pointer"
                  >
                    <User size={15} strokeWidth={2} /> Profile
                  </button>
                  <button
                    onClick={() => { setIsDropdownOpen(false); navigate('/settings'); }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-[#44403C] hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-colors cursor-pointer"
                  >
                    <Settings size={15} strokeWidth={2} /> Settings
                  </button>
                </div>

                <div className="p-2 border-t border-[#E7E5E4]">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-bold text-[#EA6250] hover:bg-[#FFF1F0] transition-colors cursor-pointer"
                  >
                    <LogOut size={15} strokeWidth={2.5} /> Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </header>
  );
};

export default TopNavbar;
