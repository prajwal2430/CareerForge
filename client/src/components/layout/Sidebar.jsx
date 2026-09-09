import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Code2, Briefcase, Map, FileText,
  Bot, Users, LogOut, Zap
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Main',
    links: [
      { path: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
      { path: '/courses',   label: 'Courses',    icon: BookOpen },
      { path: '/practice',  label: 'Practice',   icon: Code2 },
    ],
  },
  {
    label: 'Placement',
    links: [
      { path: '/companies', label: 'Companies',      icon: Briefcase },
      { path: '/roadmaps',  label: 'Roadmaps',       icon: Map },
      { path: '/resume',    label: 'Resume Builder',  icon: FileText },
    ],
  },
  {
    label: 'Community',
    links: [
      { path: '/ai-mentor',  label: 'AI Mentor',  icon: Bot },
      { path: '/community',  label: 'Community',  icon: Users },
    ],
  },
];

const Sidebar = ({ isCollapsed, isMobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen z-[200] flex flex-col
        bg-white border-r border-[#E7E5E4] shadow-sm
        transition-all duration-300 ease-in-out overflow-hidden
        ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[#E7E5E4] flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-[#0F766E] shadow-[0_4px_12px_rgba(15,118,110,0.25)] flex items-center justify-center flex-shrink-0">
          <Zap size={18} className="text-white" strokeWidth={2.5} />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-display font-bold text-xl text-[#1C1917] tracking-tight whitespace-nowrap"
            >
              CareerForge
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-8 scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="space-y-2">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] font-semibold tracking-wider text-[#A8A29E] px-3 mb-1 uppercase"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {group.links.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={({ isActive }) => `
                    relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                    text-[15px] font-medium transition-all duration-200
                    ${isCollapsed ? 'justify-center' : ''}
                    ${isActive
                      ? 'bg-[rgba(15,118,110,0.10)] text-[#0F766E] font-semibold shadow-xs'
                      : 'text-[#78716C] hover:bg-[#F0FDFA] hover:text-[#0F766E] group'}
                  `}
                  title={isCollapsed ? label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Left Accent Indicator */}
                      {isActive && (
                        <motion.span 
                           layoutId="activeTab"
                           className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#0F766E] rounded-r-full shadow-[0_0_8px_rgba(15,118,110,0.4)]" 
                        />
                      )}
                      
                      <div className={`relative flex items-center justify-center ${isActive ? 'text-[#0F766E]' : 'text-[#78716C] group-hover:text-[#0F766E]'}`}>
                        <Icon
                          size={20}
                          strokeWidth={isActive ? 2.5 : 2}
                          className="flex-shrink-0 transition-all duration-200"
                        />
                      </div>
                      
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            transition={{ duration: 0.2 }}
                            className="whitespace-nowrap flex-1"
                          >
                            {label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Area */}
      <div className={`border-t border-[#E7E5E4] p-4 flex-shrink-0 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {isCollapsed ? (
          <div
            className="w-10 h-10 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0F766E] text-sm font-bold cursor-pointer hover:border-[#0F766E] transition-colors"
            title={user?.name || 'User'}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4]">
            <div className="w-9 h-9 rounded-lg bg-[#0F766E] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1C1917] truncate">{user?.name || 'Guest User'}</p>
              <p className="text-[11px] text-[#78716C] truncate">{user?.role || 'Student Account'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-[#78716C] hover:text-[#EA6250] hover:bg-[#FFF1F0] transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={16} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
