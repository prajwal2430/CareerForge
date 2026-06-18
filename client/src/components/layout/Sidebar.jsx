import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, FiBookOpen, FiCode, FiBriefcase, 
  FiMap, FiFileText, FiMessageSquare, FiUsers
} from 'react-icons/fi';

const Sidebar = ({ isCollapsed, setMobileOpen }) => {
  const { user } = useAuth();

  const navLinks = [
    { section: 'Main', links: [
      { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
      { path: '/courses', label: 'Courses', icon: <FiBookOpen /> },
      { path: '/practice', label: 'Practice', icon: <FiCode /> },
    ]},
    { section: 'Placement', links: [
      { path: '/companies', label: 'Companies', icon: <FiBriefcase /> },
      { path: '/roadmaps', label: 'Roadmaps', icon: <FiMap /> },
      { path: '/resume', label: 'Resume Builder', icon: <FiFileText /> },
    ]},
    { section: 'Community', links: [
      { path: '/ai-mentor', label: 'AI Mentor', icon: <FiMessageSquare /> },
      { path: '/community', label: 'Community', icon: <FiUsers /> },
    ]}
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">L</div>
        <span className="sidebar-brand-text">LearnHub</span>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((group, idx) => (
          <div key={idx} className="sidebar-section">
            <h4 className="sidebar-section-title">{group.section}</h4>
            {group.links.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen && setMobileOpen(false)}
              >
                <span className="sidebar-link-icon">{link.icon}</span>
                <span className="sidebar-link-label">{link.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {user && (
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{user.role || 'Student'}</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
