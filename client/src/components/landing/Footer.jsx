import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiLinkedin, FiGithub, FiYoutube, FiArrowRight } from 'react-icons/fi';

const Footer = () => {
  const links = {
    Preparation: [
      { label: 'Coding Practice', to: '/practice' },
      { label: 'Video Courses', to: '/courses' },
      { label: 'Company Wise Prep', to: '/companies' },
      { label: 'Learning Roadmaps', to: '/roadmaps' },
      { label: 'Resume Builder', to: '/resume' },
    ],
    Resources: [
      { label: 'Community Forum', to: '/community' },
      { label: 'Interview Experiences', to: '/community' },
      { label: 'AI Mentor', to: '/ai-mentor' },
      { label: 'Blog', to: '#' },
      { label: 'Cheatsheets', to: '#' },
    ],
    Company: [
      { label: 'About Us', to: '#' },
      { label: 'Careers', to: '#' },
      { label: 'Press', to: '#' },
      { label: 'Privacy Policy', to: '#' },
      { label: 'Terms of Service', to: '#' },
    ],
  };

  const socials = [
    { icon: <FiTwitter />, href: '#' },
    { icon: <FiLinkedin />, href: '#' },
    { icon: <FiGithub />, href: '#' },
    { icon: <FiYoutube />, href: '#' },
  ];

  return (
    <footer style={{ background: '#1E1E1E', color: 'white', paddingTop: '5rem', paddingBottom: '2.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
              <div style={{
                width: 40, height: 40, background: 'linear-gradient(135deg, #FF6B00, #FFA64D)',
                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.1rem', color: 'white',
                fontFamily: "'Poppins', sans-serif"
              }}>L</div>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.5rem', color: 'white' }}>
                Learn<span style={{ color: '#FFA64D' }}>Hub</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 280 }}>
              Your complete platform for placement preparation. Master DSA, build projects, and land your dream tech job.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map((s, i) => (
                <a key={i} href={s.href} style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#9CA3AF', fontSize: '1rem', textDecoration: 'none',
                  transition: 'all 0.2s', border: '1px solid #333'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FF6B00'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#FF6B00'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#2A2A2A'; e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = '#333'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: 'white', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {section}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map((item, i) => (
                  <li key={i}>
                    <Link to={item.to} style={{
                      fontSize: '0.88rem', color: '#9CA3AF', textDecoration: 'none',
                      transition: 'color 0.15s'
                    }}
                      onMouseEnter={e => e.target.style.color = '#FFA64D'}
                      onMouseLeave={e => e.target.style.color = '#9CA3AF'}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{
          background: '#2A2A2A', borderRadius: 16, padding: '2rem 2.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem',
          marginBottom: '3rem', border: '1px solid #333'
        }}>
          <div>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, marginBottom: '0.4rem' }}>Stay ahead of the curve</h3>
            <p style={{ fontSize: '0.88rem', color: '#9CA3AF' }}>Get weekly placement tips, new problems, and company news.</p>
          </div>
          <form style={{ display: 'flex', gap: 0, minWidth: 380 }} onSubmit={e => e.preventDefault()}>
            <input
              type="email" placeholder="Enter your email"
              style={{
                flex: 1, background: '#1E1E1E', border: '1.5px solid #444',
                borderRight: 'none', borderRadius: '10px 0 0 10px',
                padding: '0.75rem 1rem', color: 'white', fontSize: '0.88rem',
                outline: 'none', fontFamily: "'Inter', sans-serif"
              }}
            />
            <button type="submit" style={{
              background: 'linear-gradient(135deg, #FF6B00, #FFA64D)',
              color: 'white', padding: '0.75rem 1.25rem',
              borderRadius: '0 10px 10px 0', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              fontWeight: 600, fontSize: '0.88rem', fontFamily: "'Poppins', sans-serif",
              transition: 'opacity 0.2s'
            }}>
              Subscribe <FiArrowRight />
            </button>
          </form>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid #2A2A2A', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>
            © {new Date().getFullYear()} LearnHub. Built with 🧡 for placement aspirants.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <a key={item} href="#" style={{
                fontSize: '0.82rem', color: '#6B7280', textDecoration: 'none',
                transition: 'color 0.15s'
              }}
                onMouseEnter={e => e.target.style.color = '#FFA64D'}
                onMouseLeave={e => e.target.style.color = '#6B7280'}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
