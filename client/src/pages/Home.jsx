import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LandingNav from '../components/landing/LandingNav';
import HeroSection from '../components/landing/HeroSection';
import StatsBar from '../components/landing/StatsBar';
import CompanyCarousel from '../components/landing/CompanyCarousel';
import CategoryGrid from '../components/landing/CategoryGrid';
import HowItWorks from '../components/landing/HowItWorks';
import TestimonialSlider from '../components/landing/TestimonialSlider';
import Footer from '../components/landing/Footer';
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="public-page">
      <LandingNav />

      <main>
        <HeroSection />
        <StatsBar />
        <CompanyCarousel />
        <CategoryGrid />
        <HowItWorks />

        {/* CTA Banner */}
        <section style={{
          padding: '6rem 0',
          background: 'linear-gradient(135deg, #FF6B00, #FFA64D)',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

          <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800, color: 'white',
                lineHeight: 1.2, letterSpacing: '-0.02em',
                marginBottom: '1.25rem'
              }}>
                Ready to Crack Your Dream Company?
              </h2>
              <p style={{
                fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)',
                marginBottom: '2.5rem', maxWidth: 520, margin: '0 auto 2.5rem'
              }}>
                Join 10,000+ students who've transformed their careers with LearnHub. Start free, no credit card required.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" style={{
                  background: 'white', color: '#FF6B00',
                  padding: '1rem 2.5rem', borderRadius: 12,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700, fontSize: '1rem',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
                >
                  Start for Free <FiArrowRight />
                </Link>
                <Link to="/practice" style={{
                  background: 'transparent', color: 'white',
                  padding: '1rem 2.5rem', borderRadius: 12,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600, fontSize: '1rem',
                  textDecoration: 'none', border: '2px solid rgba(255,255,255,0.5)',
                  transition: 'all 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
                >
                  Browse Courses
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <TestimonialSlider />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
