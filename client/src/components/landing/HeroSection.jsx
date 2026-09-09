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
      {/* Animated decorative orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '5%',
        width: 180, height: 180, borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08), rgba(6, 182, 212, 0.04))',
        filter: 'blur(40px)', pointerEvents: 'none',
        animation: 'float 7s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', top: '60%', right: '15%',
        width: 120, height: 120, borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(13, 148, 136, 0.05))',
        filter: 'blur(30px)', pointerEvents: 'none',
        animation: 'float 9s ease-in-out infinite reverse'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          {/* Left Content */}
          <div>
            <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.6 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#F0FDFA',
                color: '#0F766E',
                border: '1px solid rgba(15, 118, 110, 0.2)',
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
                fontWeight: 800, color: '#1C1917',
                lineHeight: 1.1, letterSpacing: '-0.03em',
                marginBottom: '1.5rem'
              }}
            >
              Your Complete{' '}
              <span style={{ color: '#0F766E' }}>
                Placement Prep
              </span>
              {' '}Platform
            </motion.h1>

            <motion.p {...fadeUp} transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                fontSize: '1.15rem', color: '#78716C', lineHeight: 1.7,
                marginBottom: '2rem', fontFamily: "'Inter', sans-serif"
              }}
            >
              Learn DSA, build real projects, crack mock interviews, and land your dream job at top tech companies — all in one place.
            </motion.p>

            <motion.div {...fadeUp} transition={{ delay: 0.4, duration: 0.6 }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: '3rem' }}
            >
              <Link to="/register" className="btn btn-accent btn-xl hover-lift"
                style={{ gap: 10 }}
              >
                Start Learning Free <FiArrowRight />
              </Link>
              <Link to="/practice" className="btn btn-secondary btn-xl hover-lift"
                style={{ gap: 10, color: '#0F766E', borderColor: '#E7E5E4' }}
              >
                <FiPlay style={{ color: '#0F766E' }} /> Explore Courses
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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: '#0F766E',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FiCheckCircle style={{ color: 'white', fontSize: '0.7rem' }} />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#78716C', fontFamily: "'Inter', sans-serif" }}>{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — Floating Dashboard Cards */}
          <div style={{ position: 'relative', height: 520 }} className="hide-mobile">
            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="animate-float"
              style={{
                position: 'absolute', top: 40, left: 20, right: 0,
                background: 'white',
                borderRadius: 20, padding: '1.5rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
                border: '1px solid #E7E5E4',
                transition: 'all 0.3s ease',
              }}
              whileHover={{ y: -6, borderColor: '#0F766E' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: '#0F766E',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '1.1rem',
                  boxShadow: '0 4px 12px rgba(15, 118, 110, 0.25)'
                }}>📊</div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>Placement Dashboard</div>
                  <div style={{ fontSize: '0.75rem', color: '#78716C' }}>Rahul Sharma • 7 days streak 🔥</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: '1rem' }}>
                {[
                  { label: 'Problems', val: '247', sub: '+12 this week', color: '#0F766E' },
                  { label: 'Mock Score', val: '9.2', sub: 'Top 5%', color: '#0F766E' },
                  { label: 'Courses', val: '3/5', sub: '60% done', color: '#F97360' },
                ].map((s, i) => (
                  <div key={i} style={{
                    textAlign: 'center', background: '#FAFAF9', borderRadius: 12, padding: '12px 8px',
                    transition: 'all 0.2s', cursor: 'default'
                  }}>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#1C1917' }}>{s.label}</div>
                    <div style={{ fontSize: '0.65rem', color: '#78716C', marginTop: 2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1C1917' }}>Placement Readiness</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F766E' }}>78%</span>
                </div>
                <div style={{ height: 8, background: '#E7E5E4', borderRadius: 999, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
                    style={{ height: '100%', background: '#0F766E', borderRadius: 999 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Mini Card 1 — Offer */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="animate-float"
              style={{ animationDelay: '1s', position: 'absolute', bottom: 60, left: 0,
                background: 'white', borderRadius: 16, padding: '1rem 1.25rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #E7E5E4',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.3s',
              }}
              whileHover={{ y: -4, borderColor: '#0F766E' }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#0F766E',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                boxShadow: '0 4px 12px rgba(15, 118, 110, 0.25)'
              }}>✓</div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1C1917', fontFamily: "'Poppins', sans-serif" }}>Offer Accepted!</div>
                <div style={{ fontSize: '0.7rem', color: '#78716C' }}>Amazon — SDE 1 · ₹24 LPA</div>
              </div>
            </motion.div>

            {/* Mini Card 2 — Streak */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="animate-float"
              style={{ animationDelay: '1.5s', position: 'absolute', top: 0, right: -20,
                background: '#F97360', borderRadius: 16, padding: '1rem 1.25rem',
                boxShadow: '0 10px 30px rgba(249, 115, 96, 0.3)', color: 'white',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.3s',
              }}
              whileHover={{ y: -4, boxShadow: '0 15px 40px rgba(249, 115, 96, 0.4)' }}
            >
              <div style={{ fontSize: '1.5rem' }}>🔥</div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>21 Day Streak!</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Keep going!</div>
              </div>
            </motion.div>

            {/* Rating Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="animate-float"
              style={{ animationDelay: '0.8s', position: 'absolute', bottom: 20, right: 0,
                background: 'white', borderRadius: 14, padding: '0.75rem 1rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)', border: '1px solid #E7E5E4',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.3s',
              }}
              whileHover={{ y: -3, borderColor: '#0F766E' }}
            >
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => (
                  <FiStar key={i} style={{ color: '#F97360', fontSize: '0.85rem', fill: '#F97360' }} />
                ))}
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1C1917' }}>4.9/5</span>
              <span style={{ fontSize: '0.72rem', color: '#78716C' }}>10k+ Reviews</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
