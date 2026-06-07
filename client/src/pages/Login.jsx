import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiGithub, FiArrowLeft } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { values, loading, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    async ({ email, password }) => {
      try {
        await login(email, password);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } catch (err) {
        toast.error('Invalid credentials. Please try again.');
        throw err;
      }
    }
  );

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #FFF7F0 0%, #FFFFFF 50%, #F9FAFB 100%)'
    }}>
      {/* Left Panel */}
      <div style={{
        width: '45%', background: 'linear-gradient(135deg, #FF6B00, #FFA64D)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '4rem', position: 'relative', overflow: 'hidden'
      }} className="hide-mobile">
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '3rem' }}>
            <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: 'white', fontFamily: "'Poppins', sans-serif", backdropFilter: 'blur(8px)' }}>L</div>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: 'white' }}>LearnHub</span>
          </Link>

          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2.5rem', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Pick up where you left off.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '3rem' }}>
            Your streak is waiting. Keep learning, keep growing, and land your dream placement.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>💡</div>
              <div>
                <div style={{ fontWeight: 700, color: 'white', fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem' }}>Today's Insight</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>Consistency wins placements</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Students who solve 2 problems daily have a 60% higher chance of cracking technical interviews.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
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

          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#1E1E1E', marginBottom: '0.5rem' }}>Sign In</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '2rem', fontSize: '0.9rem' }}>Welcome back! Let's continue your journey.</p>

          {/* Social Buttons */}
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-input-icon">
              <FiMail className="input-icon" />
              <input type="email" name="email" className="form-input w-full" placeholder="Email address" value={values.email} onChange={handleChange} required />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: '#FF6B00', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div className="form-input-icon">
                <FiLock className="input-icon" />
                <input type="password" name="password" className="form-input w-full" placeholder="Password" value={values.password} onChange={handleChange} required />
              </div>
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
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: '#9CA3AF' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#FF6B00', fontWeight: 700, textDecoration: 'none' }}>Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
