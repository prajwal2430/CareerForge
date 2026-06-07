import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

const testimonials = [
  {
    id: 1, name: 'Rahul Sharma', role: 'SDE at Google', avatar: 'R', avatarColor: '#FF6B00',
    content: 'LearnHub completely changed my prep game. The structured DSA roadmaps, company-specific OA questions, and mock interviews — everything is exactly what a placement aspirant needs. Cracked Google within 6 months of consistent prep!',
    rating: 5, company: 'Google', lpa: '₹28 LPA',
  },
  {
    id: 2, name: 'Priya Patel', role: 'Frontend Engineer at Amazon', avatar: 'P', avatarColor: '#3B82F6',
    content: 'I was spending hours on scattered resources. LearnHub gave me everything in one place — React courses, system design, and mock interviews. The AI mentor literally felt like having a personal tutor!',
    rating: 5, company: 'Amazon', lpa: '₹22 LPA',
  },
  {
    id: 3, name: 'Amit Kumar', role: 'SDE-2 at Microsoft', avatar: 'A', avatarColor: '#10B981',
    content: "System Design was my weak area. The visual explanations and case studies on LearnHub made concepts crystal clear. I could confidently answer questions that used to intimidate me. Got my dream offer!",
    rating: 5, company: 'Microsoft', lpa: '₹32 LPA',
  },
];

const TestimonialSlider = () => {
  const [idx, setIdx] = useState(0);

  return (
    <section style={{ padding: '6rem 0', background: '#F9FAFB' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-tag">⭐ Success Stories</div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#1E1E1E', marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
            Students Who <span style={{ background: 'linear-gradient(135deg, #FF6B00, #FFA64D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Cracked It</span>
          </h2>
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
          {/* Arrows */}
          <button
            onClick={() => setIdx(i => (i === 0 ? testimonials.length - 1 : i - 1))}
            style={{
              position: 'absolute', left: -60, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: '50%', background: 'white',
              border: '1.5px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.1rem', color: '#4B5563',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.color = '#FF6B00'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#4B5563'; }}
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => setIdx(i => (i === testimonials.length - 1 ? 0 : i + 1))}
            style={{
              position: 'absolute', right: -60, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: '50%', background: 'white',
              border: '1.5px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.1rem', color: '#4B5563',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.color = '#FF6B00'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#4B5563'; }}
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
                padding: '3rem', boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                border: '1px solid #F3F4F6', position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute', top: '1.5rem', right: '2rem',
                fontSize: '6rem', lineHeight: 1, color: '#FFF7F0',
                fontFamily: 'Georgia, serif', pointerEvents: 'none'
              }}>"</div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem' }}>
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} style={{ color: '#FF6B00', fill: '#FF6B00', fontSize: '1.1rem' }} />
                ))}
              </div>

              <p style={{
                fontSize: '1.1rem', color: '#374151', lineHeight: 1.8,
                fontFamily: "'Inter', sans-serif", marginBottom: '2rem',
                position: 'relative', zIndex: 1
              }}>
                "{testimonials[idx].content}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${testimonials[idx].avatarColor}, ${testimonials[idx].avatarColor}cc)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '1.25rem', color: 'white',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    {testimonials[idx].avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1E1E1E', fontFamily: "'Poppins', sans-serif" }}>
                      {testimonials[idx].name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>{testimonials[idx].role}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: "'Poppins', sans-serif", fontWeight: 800,
                    fontSize: '1.25rem', color: '#10B981'
                  }}>{testimonials[idx].lpa}</div>
                  <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Package</div>
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
                background: i === idx ? '#FF6B00' : '#E5E7EB',
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
