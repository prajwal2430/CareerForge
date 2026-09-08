import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Bell, Settings, LogOut, User, Bot, Command } from 'lucide-react';

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

  const sidebarWidth = isSidebarCollapsed ? 72 : 260;

  return (
    <header
      className={`fixed top-0 right-0 h-16 z-[190] flex items-center justify-between px-4 lg:px-6 transition-all duration-300 ${isSidebarCollapsed ? 'md:left-[72px]' : 'md:left-[72px] lg:left-[260px]'} left-0`}
      style={{
        background: 'rgba(11, 16, 32, 0.80)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #263248',
      }}
    >
      {/* ── Left Toggle (Mobile only) ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#263248] transition-colors"
        >
          <Menu size={22} strokeWidth={2} />
        </button>
      </div>

      {/* ── Right Action Area ── */}
      <div className="flex items-center gap-4">
        
        {/* Search */}
        <div className={`hidden sm:flex relative items-center transition-all duration-300 ease-out ${searchFocused ? 'w-64' : 'w-48'}`}>
          <Search size={14} strokeWidth={2} className="absolute left-3 text-[#94A3B8] pointer-events-none" />
          <input
            id="global-search"
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="
              w-full pl-9 pr-12 py-1.5 text-sm rounded-full
              bg-[#111827] border border-[#263248]
              text-[#F8FAFC] placeholder:text-[#94A3B8]
              focus:outline-none focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED]
              transition-all duration-300
            "
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[10px] font-mono bg-[#151D2F] border border-[#263248] rounded text-[#94A3B8]">
            ⌘K
          </kbd>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1">
          <button className="relative p-2 rounded-full text-[#94A3B8] hover:text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-colors duration-200">
            <Bot size={18} strokeWidth={2} />
          </button>
          
          <button className="relative p-2 rounded-full text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#263248] transition-colors duration-200">
            <Bell size={18} strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-[#0B1020]" />
          </button>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-[#263248] mx-1" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-[#151D2F] border border-transparent hover:border-[#263248] transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-[#F8FAFC] text-sm font-bold shadow-primary">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#F8FAFC] leading-none mb-1">{user?.name || 'User'}</p>
              <p className="text-[10px] text-[#94A3B8] leading-none font-mono">PRO TEAM</p>
            </div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 mt-3 w-56 bg-[#151D2F] border border-[#263248] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 origin-top-right"
              >
                <div className="px-4 py-3 border-b border-[#263248] bg-[#111827]">
                  <p className="text-sm font-bold text-[#F8FAFC] truncate">{user?.name}</p>
                  <p className="text-xs text-[#94A3B8] truncate">{user?.email || 'student@careerforge.io'}</p>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#7C3AED] transition-colors"
                  >
                    <User size={15} strokeWidth={2} /> Profile
                  </button>
                  <button
                    onClick={() => { setIsDropdownOpen(false); navigate('/settings'); }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#7C3AED] transition-colors"
                  >
                    <Settings size={15} strokeWidth={2} /> Settings
                  </button>
                </div>

                <div className="p-2 border-t border-[#263248]">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-bold text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
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
