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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { label: 'Courses', to: '/courses' },
    { label: 'Practice', to: '/practice' },
    { label: 'Roadmaps', to: '/roadmaps' },
    { label: 'Companies', to: '/companies' },
    { label: 'Community', to: '/community' },
  ];

  return (
    <>
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: 38, height: 38,
              background: '#0F766E',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.1rem', color: 'white',
              boxShadow: '0 4px 15px rgba(15, 118, 110, 0.3)',
              fontFamily: "'Poppins', sans-serif"
            }}>L</div>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: '#1C1917' }}>
              Learn<span style={{ color: '#0F766E' }}>Hub</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="hover-underline" style={{
                fontSize: '0.95rem', fontWeight: 500,
                color: '#78716C',
                textDecoration: 'none',
                fontFamily: "'Inter', sans-serif"
              }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/login" className="hide-mobile" style={{
              fontSize: '0.9rem', fontWeight: 600, color: '#78716C',
              textDecoration: 'none', fontFamily: "'Inter', sans-serif"
            }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-accent btn-sm">
              Get Started Free
            </Link>
            {/* Mobile Menu Button */}
            <button
              className="show-mobile"
              style={{
                background: 'none', border: '1.5px solid #E5E7EB',
                borderRadius: 10, width: 40, height: 40,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', cursor: 'pointer', color: '#4B5563',
                transition: 'all 0.2s'
              }}
              onClick={() => setMobileOpen(true)}
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#1E1E1E' }}>
            Menu
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              background: 'none', border: 'none', fontSize: '1.5rem',
              cursor: 'pointer', color: '#4B5563', padding: 4
            }}
          >
            <FiX />
          </button>
        </div>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.5rem', borderTop: '1px solid #F3F4F6' }}>
          <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-ghost w-full" style={{ justifyContent: 'center' }}>
            Sign In
          </Link>
          <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>
            Get Started Free
          </Link>
        </div>
      </div>
    </>
  );
};

export default LandingNav;
