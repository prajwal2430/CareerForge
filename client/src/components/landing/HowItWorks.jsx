import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  { q: 'Is LearnHub free to use?', a: 'Yes! LearnHub has a generous free plan that includes access to 500+ coding problems, 3 courses, and community forums. Premium plans unlock everything including mock interviews and AI mentoring.' },
  { q: 'How is LearnHub different from LeetCode?', a: 'LearnHub is a complete placement preparation ecosystem. While LeetCode focuses on coding problems, LearnHub combines coding practice with video courses, system design, roadmaps, resume building, and an AI mentor — all in one platform.' },
  { q: 'Can freshers use this platform?', a: 'Absolutely! LearnHub is specifically designed for students and freshers. We have beginner-friendly learning paths, campus recruitment preparation, and aptitude sections tailored for on-campus placements.' },
  { q: 'Do I get a certificate after completing courses?', a: 'Yes, every completed course comes with a shareable certificate of completion. These certificates are recognized by our hiring partners and can be directly added to your LinkedIn and resume.' },
  { q: 'How does the AI Mentor work?', a: 'The AI Mentor analyzes your performance, identifies weak areas, creates personalized study plans, conducts mock interviews, and provides real-time feedback on your code and answers — just like having a personal tutor available 24/7.' },
];

const HowItWorks = () => {
  const [open, setOpen] = useState(null);

  const steps = [
    { num: '01', title: 'Create Your Profile', desc: 'Sign up and tell us your target companies, current skill level, and placement timeline. Our AI personalizes your learning path.', icon: '👤' },
    { num: '02', title: 'Follow Your Roadmap', desc: 'Get a structured, week-by-week preparation plan with curated resources, coding problems, and mini-projects tailored to your goals.', icon: '🗺️' },
    { num: '03', title: 'Practice & Build', desc: 'Solve DSA problems, complete hands-on courses, build portfolio projects, and participate in coding contests to sharpen your skills.', icon: '💻' },
    { num: '04', title: 'Get Placed', desc: 'Ace mock interviews, get your resume reviewed, apply through our job board, and receive mentorship from students who\'ve been placed at your target companies.', icon: '🎯' },
  ];

  return (
    <>
      {/* How It Works */}
      <section style={{ padding: '6rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-tag">🚀 How It Works</div>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#1E1E1E', marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
              Your Journey to <span style={{ background: 'linear-gradient(135deg, #FF6B00, #FFA64D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Getting Placed</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', position: 'relative' }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute', top: '2.5rem', left: '12.5%', right: '12.5%',
              height: 2, background: 'linear-gradient(to right, #FF6B00, #FFA64D)',
              zIndex: 0, opacity: 0.3
            }} />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
              >
                <div style={{
                  width: 64, height: 64, margin: '0 auto 1.25rem',
                  background: i === 0 ? 'linear-gradient(135deg, #FF6B00, #FFA64D)' : 'white',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem',
                  border: `2px solid ${i === 0 ? 'transparent' : '#E5E7EB'}`,
                  boxShadow: i === 0 ? '0 8px 24px rgba(255,107,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)'
                }}>
                  {step.icon}
                </div>
                <div style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.75rem', fontWeight: 700, color: '#FF6B00',
                  marginBottom: '0.4rem', letterSpacing: '0.1em'
                }}>{step.num}</div>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#1E1E1E', marginBottom: '0.75rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.6 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '6rem 0', background: '#F9FAFB' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-tag">❓ Common Questions</div>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#1E1E1E', marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
              Frequently Asked <span style={{ background: 'linear-gradient(135deg, #FF6B00, #FFA64D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Questions</span>
            </h2>
          </div>

          <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`accordion-item ${open === i ? 'open' : ''}`}
              >
                <div className="accordion-header" onClick={() => setOpen(open === i ? null : i)}>
                  <span>{faq.q}</span>
                  <FiChevronDown className="accordion-icon" />
                </div>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="accordion-body"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
