import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../ui/SearchBar';
import { FiMenu, FiBell, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';

const TopNavbar = ({ isSidebarCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`topbar ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="topbar-left">
        <button className="topbar-toggle" onClick={toggleSidebar}>
          <FiMenu />
        </button>
        <SearchBar 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search courses, problems, companies..."
          shortcut="⌘K"
        />
      </div>

      <div className="topbar-right">
        <div className="topbar-streak">
          🔥 12 Day Streak
        </div>
        
        <button className="topbar-icon-btn">
          <FiBell />
          <span className="topbar-badge"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <div 
            className="topbar-avatar"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          {isDropdownOpen && (
            <div className="avatar-dropdown">
              <button className="avatar-dropdown-item" onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}>
                <FiUser /> Profile
              </button>
              <button className="avatar-dropdown-item" onClick={() => { setIsDropdownOpen(false); navigate('/settings'); }}>
                <FiSettings /> Settings
              </button>
              <div className="avatar-dropdown-divider"></div>
              <button className="avatar-dropdown-item text-danger" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
