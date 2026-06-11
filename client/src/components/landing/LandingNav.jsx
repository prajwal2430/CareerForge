import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Courses', to: '/courses' },
    { label: 'Practice', to: '/practice' },
    { label: 'Roadmaps', to: '/roadmaps' },
    { label: 'Companies', to: '/companies' },
    { label: 'Community', to: '/community' },
  ];

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #FF6B00, #FFA64D)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.1rem', color: 'white',
            boxShadow: '0 4px 15px rgba(255,107,0,0.3)',
            fontFamily: "'Poppins', sans-serif"
          }}>L</div>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: '#1E1E1E' }}>
            Learn
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              fontSize: '0.9rem', fontWeight: 500,
              color: '#4B5563',
              textDecoration: 'none',
              transition: 'color 0.15s',
              fontFamily: "'Inter', sans-serif"
            }}
              onMouseEnter={e => e.target.style.color = '#FF6B00'}
              onMouseLeave={e => e.target.style.color = '#4B5563'}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/login" style={{
            fontSize: '0.9rem', fontWeight: 600, color: '#4B5563',
            textDecoration: 'none', fontFamily: "'Inter', sans-serif"
          }}>
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Get Started Free
          </Link>
          <button
            className="hide-mobile"
            style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#4B5563' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
