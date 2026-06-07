import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay, FiCheckCircle, FiStar, FiZap } from 'react-icons/fi';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          {/* Left Content */}
          <div>
            <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.6 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #FFF7F0, #FFE8D0)',
                color: '#FF6B00',
                border: '1px solid rgba(255,107,0,0.2)',
                padding: '6px 16px', borderRadius: 999,
                fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', marginBottom: '1.5rem',
                fontFamily: "'Poppins', sans-serif"
              }}>
                <FiZap style={{ fontSize: '0.85rem' }} /> #1 Placement Prep Platform
              </div>
            </motion.div>

            <motion.h1 {...fadeUp} transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 800, color: '#1E1E1E',
                lineHeight: 1.1, letterSpacing: '-0.03em',
                marginBottom: '1.5rem'
              }}
            >
              Your Complete{' '}
              <span style={{
                background: 'linear-gradient(135deg, #FF6B00, #FFA64D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Placement Prep
              </span>
              {' '}Platform
            </motion.h1>

            <motion.p {...fadeUp} transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                fontSize: '1.15rem', color: '#4B5563', lineHeight: 1.7,
                marginBottom: '2rem', fontFamily: "'Inter', sans-serif"
              }}
            >
              Learn DSA, build real projects, crack mock interviews, and land your dream job at top tech companies — all in one place.
            </motion.p>

            <motion.div {...fadeUp} transition={{ delay: 0.4, duration: 0.6 }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: '3rem' }}
            >
              <Link to="/register" className="btn btn-primary btn-xl"
                style={{ gap: 10 }}
              >
                Start Learning Free <FiArrowRight />
              </Link>
              <Link to="/practice" className="btn btn-ghost btn-xl"
                style={{ gap: 10 }}
              >
                <FiPlay style={{ color: '#FF6B00' }} /> Explore Roadmaps
              </Link>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.5, duration: 0.6 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              {[
                'No credit card required — Free forever plan',
                '10,000+ students placed at top companies',
                '3000+ curated coding problems'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FiCheckCircle style={{ color: '#FF6B00', fontSize: '1.1rem', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: '#6B7280', fontFamily: "'Inter', sans-serif" }}>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Floating Dashboard Cards */}
          <div style={{ position: 'relative', height: 520 }} className="hide-mobile">
            {/* Main Card */}
            <motion.div
              className="animate-float"
              style={{
                position: 'absolute', top: 40, left: 20, right: 0,
                background: 'white',
                borderRadius: 20, padding: '1.5rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
                border: '1px solid #F3F4F6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: 'linear-gradient(135deg, #FF6B00, #FFA64D)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '1.1rem'
                }}>📊</div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#1E1E1E' }}>Placement Dashboard</div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Rahul Sharma • 7 days streak 🔥</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: '1rem' }}>
                {[
                  { label: 'Problems', val: '247', sub: '+12 this week', color: '#FF6B00' },
                  { label: 'Mock Score', val: '9.2', sub: 'Top 5%', color: '#10B981' },
                  { label: 'Courses', val: '3/5', sub: '60% done', color: '#3B82F6' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center', background: '#F9FAFB', borderRadius: 12, padding: '12px 8px' }}>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#4B5563' }}>{s.label}</div>
                    <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: 2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563' }}>Placement Readiness</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FF6B00' }}>78%</span>
                </div>
                <div style={{ height: 8, background: '#F3F4F6', borderRadius: 999 }}>
                  <div style={{ width: '78%', height: '100%', background: 'linear-gradient(135deg, #FF6B00, #FFA64D)', borderRadius: 999 }} />
                </div>
              </div>
            </motion.div>

            {/* Mini Card 1 */}
            <motion.div
              className="animate-float"
              style={{ animationDelay: '1s', position: 'absolute', bottom: 60, left: 0,
                background: 'white', borderRadius: 16, padding: '1rem 1.25rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #F3F4F6',
                display: 'flex', alignItems: 'center', gap: 12
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #10B981, #6EE7B7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
              }}>✓</div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E1E1E', fontFamily: "'Poppins', sans-serif" }}>Offer Accepted!</div>
                <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Amazon — SDE 1 · ₹24 LPA</div>
              </div>
            </motion.div>

            {/* Mini Card 2 */}
            <motion.div
              className="animate-float"
              style={{ animationDelay: '1.5s', position: 'absolute', top: 0, right: -20,
                background: 'linear-gradient(135deg, #FF6B00, #FFA64D)', borderRadius: 16, padding: '1rem 1.25rem',
                boxShadow: '0 10px 30px rgba(255,107,0,0.3)', color: 'white',
                display: 'flex', alignItems: 'center', gap: 12
              }}
            >
              <div style={{ fontSize: '1.5rem' }}>🔥</div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>21 Day Streak!</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Keep going!</div>
              </div>
            </motion.div>

            {/* Rating Card */}
            <motion.div
              className="animate-float"
              style={{ animationDelay: '0.8s', position: 'absolute', bottom: 20, right: 0,
                background: 'white', borderRadius: 14, padding: '0.75rem 1rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.07)', border: '1px solid #F3F4F6',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => (
                  <FiStar key={i} style={{ color: '#FF6B00', fontSize: '0.85rem', fill: '#FF6B00' }} />
                ))}
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E1E1E' }}>4.9/5</span>
              <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>10k+ Reviews</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
