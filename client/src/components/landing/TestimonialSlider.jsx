import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

const testimonials = [
  {
    id: 1, name: 'Rahul Sharma', role: 'SDE at Google', avatar: 'R', avatarColor: '#0F766E',
    content: 'LearnHub completely changed my prep game. The structured DSA roadmaps, company-specific OA questions, and mock interviews — everything is exactly what a placement aspirant needs. Cracked Google within 6 months of consistent prep!',
    rating: 5, company: 'Google', lpa: '₹28 LPA',
  },
  {
    id: 2, name: 'Priya Patel', role: 'Frontend Engineer at Amazon', avatar: 'P', avatarColor: '#115E59',
    content: 'I was spending hours on scattered resources. LearnHub gave me everything in one place — React courses, system design, and mock interviews. The AI mentor literally felt like having a personal tutor!',
    rating: 5, company: 'Amazon', lpa: '₹22 LPA',
  },
  {
    id: 3, name: 'Amit Kumar', role: 'SDE-2 at Microsoft', avatar: 'A', avatarColor: '#0F766E',
    content: "System Design was my weak area. The visual explanations and case studies on LearnHub made concepts crystal clear. I could confidently answer questions that used to intimidate me. Got my dream offer!",
    rating: 5, company: 'Microsoft', lpa: '₹32 LPA',
  },
];

const TestimonialSlider = () => {
  const [idx, setIdx] = useState(0);

  return (
    <section style={{ padding: '6rem 0', background: '#FAFAF9' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-tag" style={{ background: '#F0FDFA', color: '#0F766E', border: '1px solid rgba(15, 118, 110, 0.2)' }}>⭐ Success Stories</div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#1C1917', marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
            Students Who <span style={{ color: '#0F766E' }}>Cracked It</span>
          </h2>
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
          {/* Arrows */}
          <button
            onClick={() => setIdx(i => (i === 0 ? testimonials.length - 1 : i - 1))}
            style={{
              position: 'absolute', left: -60, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: '50%', background: 'white',
              border: '1.5px solid #E7E5E4', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.1rem', color: '#78716C',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0F766E'; e.currentTarget.style.color = '#0F766E'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E5E4'; e.currentTarget.style.color = '#78716C'; }}
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => setIdx(i => (i === testimonials.length - 1 ? 0 : i + 1))}
            style={{
              position: 'absolute', right: -60, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: '50%', background: 'white',
              border: '1.5px solid #E7E5E4', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.1rem', color: '#78716C',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0F766E'; e.currentTarget.style.color = '#0F766E'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E5E4'; e.currentTarget.style.color = '#78716C'; }}
          >
            <FiChevronRight />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              style={{
                background: 'white', borderRadius: 24,
                padding: '3rem', boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                border: '1px solid #E7E5E4', position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute', top: '1.5rem', right: '2rem',
                fontSize: '6rem', lineHeight: 1, color: '#F0FDFA',
                fontFamily: 'Georgia, serif', pointerEvents: 'none'
              }}>"</div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem' }}>
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} style={{ color: '#F97360', fill: '#F97360', fontSize: '1.1rem' }} />
                ))}
              </div>

              <p style={{
                fontSize: '1.1rem', color: '#44403C', lineHeight: 1.8,
                fontFamily: "'Inter', sans-serif", marginBottom: '2rem',
                position: 'relative', zIndex: 1
              }}>
                "{testimonials[idx].content}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: testimonials[idx].avatarColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '1.25rem', color: 'white',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    {testimonials[idx].avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1C1917', fontFamily: "'Poppins', sans-serif" }}>
                      {testimonials[idx].name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#78716C' }}>{testimonials[idx].role}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: "'Poppins', sans-serif", fontWeight: 800,
                    fontSize: '1.25rem', color: '#0F766E'
                  }}>{testimonials[idx].lpa}</div>
                  <div style={{ fontSize: '0.8rem', color: '#78716C' }}>Package</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '2rem' }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} style={{
                width: i === idx ? 28 : 8, height: 8,
                borderRadius: 999, border: 'none',
                background: i === idx ? '#0F766E' : '#E7E5E4',
                cursor: 'pointer', transition: 'all 0.3s'
              }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
