import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiGithub, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { values, loading, handleChange, handleSubmit } = useForm(
    { name: '', email: '', password: '' },
    async ({ name, email, password }) => {
      try {
        await register(name, email, password);
        toast.success('Account created! Welcome to LearnHub 🎉');
        navigate('/dashboard');
      } catch (err) {
        toast.error('Failed to create account. Try again.');
        throw err;
      }
    }
  );

  const perks = [
    'Access to 500+ coding problems for free',
    'Personalized AI-powered study plan',
    'Community of 10,000+ placement aspirants',
    'Certificate on course completion',
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)'
    }}>
      {/* Left Panel — Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#9CA3AF', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '2rem', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#FF6B00'}
            onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
          >
            <FiArrowLeft /> Back to Home
          </Link>

          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#1E1E1E', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '2rem', fontSize: '0.9rem' }}>Start your placement journey — it's completely free.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.5rem' }}>
            {[
              { icon: <FcGoogle style={{ fontSize: '1.1rem' }} />, label: 'Google' },
              { icon: <FiGithub style={{ fontSize: '1.1rem' }} />, label: 'GitHub' },
            ].map((s, i) => (
              <button key={i} onClick={() => toast('Coming soon!', { icon: '🚧' })} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '0.7rem', border: '1.5px solid #E5E7EB', borderRadius: 10,
                background: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                color: '#374151', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.background = '#FFF7F0'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'white'; }}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>or with email</span>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-input-icon">
              <FiUser className="input-icon" />
              <input type="text" name="name" className="form-input w-full" placeholder="Full Name" value={values.name} onChange={handleChange} required />
            </div>
            <div className="form-input-icon">
              <FiMail className="input-icon" />
              <input type="email" name="email" className="form-input w-full" placeholder="Email address" value={values.email} onChange={handleChange} required />
            </div>
            <div className="form-input-icon">
              <FiLock className="input-icon" />
              <input type="password" name="password" className="form-input w-full" placeholder="Password (min 6 characters)" value={values.password} onChange={handleChange} required minLength={6} />
            </div>

            <button type="submit" disabled={loading} style={{
              background: 'linear-gradient(135deg, #FF6B00, #FFA64D)',
              color: 'white', padding: '0.875rem', borderRadius: 12,
              border: 'none', fontFamily: "'Poppins', sans-serif",
              fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255,107,0,0.3)',
              transition: 'all 0.2s', marginTop: 4
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,107,0,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,107,0,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? 'Creating Account...' : 'Create Free Account →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9CA3AF' }}>
              By signing up you agree to our{' '}
              <a href="#" style={{ color: '#FF6B00', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</a>
            </p>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: '#9CA3AF' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#FF6B00', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div style={{
        width: '45%', background: 'linear-gradient(135deg, #FF6B00, #FFA64D)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '4rem', position: 'relative', overflow: 'hidden'
      }} className="hide-mobile">
        <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginBottom: '1rem' }}>
            🚀 JOIN LEARNHUB
          </div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2.25rem', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '1.5rem' }}>
            Everything you need to get placed
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {perks.map((perk, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', flexShrink: 0
                }}>
                  <FiCheckCircle style={{ fontSize: '0.9rem' }} />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>{perk}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              {['R', 'P', 'A', 'S'].map((letter, i) => (
                <div key={i} style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: `rgba(255,255,255,${0.5 - i * 0.08})`,
                  border: '2px solid rgba(255,255,255,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.8rem', color: 'white',
                  marginLeft: i > 0 ? -10 : 0
                }}>
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>Join 10,000+ students</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)' }}>already on LearnHub</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
