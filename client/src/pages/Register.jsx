import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiGithub, FiArrowLeft, FiCheckCircle, FiCpu } from 'react-icons/fi';
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
        toast.success('Account created! Welcome to CareerForge 🎉');
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
    'AI Resume scoring and interview mocks',
  ];

  return (
    <div className="min-h-screen flex bg-[#0B1020] text-[#F8FAFC]">
      
      {/* Left Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-[#94A3B8] text-sm hover:text-[#7C3AED] transition-colors mb-6 font-medium">
            <FiArrowLeft /> Back to Home
          </Link>

          <h2 className="font-display text-3xl font-bold text-[#F8FAFC] mb-2">Create Account</h2>
          <p className="text-[#94A3B8] mb-8">Start your placement journey — it's completely free.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
               onClick={() => toast('Coming soon!', { icon: '🚧' })}
               className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#111827] border border-[#263248] rounded-xl text-sm font-semibold text-[#CBD5E1] hover:border-[#7C3AED] hover:text-[#F8FAFC] hover:bg-[#7C3AED]/5 transition-all"
            >
               <FcGoogle size={18} /> Google
            </button>
            <button
               onClick={() => toast('Coming soon!', { icon: '🚧' })}
               className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#111827] border border-[#263248] rounded-xl text-sm font-semibold text-[#CBD5E1] hover:border-[#7C3AED] hover:text-[#F8FAFC] hover:bg-[#7C3AED]/5 transition-all"
            >
               <FiGithub size={18} /> GitHub
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8 text-[11px] text-[#64748B] font-bold uppercase tracking-wider">
            <div className="flex-1 h-px bg-[#263248]" />
            or with email
            <div className="flex-1 h-px bg-[#263248]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group mb-0">
               <div className="form-input-icon">
                 <FiUser className="input-icon" />
                 <input type="text" name="name" className="form-input" placeholder="Full Name" value={values.name} onChange={handleChange} required />
               </div>
            </div>
            <div className="form-group mb-0">
               <div className="form-input-icon">
                 <FiMail className="input-icon" />
                 <input type="email" name="email" className="form-input" placeholder="Email address" value={values.email} onChange={handleChange} required />
               </div>
            </div>
            <div className="form-group mb-0">
               <div className="form-input-icon">
                 <FiLock className="input-icon" />
                 <input type="password" name="password" className="form-input" placeholder="Password (min 6 characters)" value={values.password} onChange={handleChange} required minLength={6} />
               </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Creating...</span> : 'Create Free Account'}
            </button>

            <p className="text-center text-[12px] text-[#64748B] mt-4">
              By signing up you agree to our{' '}
              <a href="#" className="text-[#06B6D4] font-semibold hover:text-[#F8FAFC] transition-colors">Terms of Service</a>
            </p>
          </form>

          <p className="text-center mt-8 text-sm text-[#94A3B8]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#06B6D4] font-bold hover:text-[#F8FAFC] transition-colors">Sign In</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex w-[45%] flex-col justify-center p-16 relative overflow-hidden bg-[#111827] border-l border-[#263248]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#06B6D4] opacity-[0.05] blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7C3AED] opacity-[0.05] blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-md">
          <div className="font-display text-xs font-bold tracking-[0.15em] uppercase text-[#06B6D4] mb-4">
            🚀 JOIN CAREERFORGE
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#F8FAFC] leading-tight mb-8">
            Everything you need to get placed
          </h2>

          <div className="flex flex-col gap-4 mb-10">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center text-[#06B6D4] shrink-0">
                  <FiCheckCircle size={14} />
                </div>
                <span className="text-[#CBD5E1] text-[15px]">{perk}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 p-4 bg-[#151D2F] border border-[#263248] rounded-[16px] shadow-sm">
            <div className="flex -space-x-3">
              {['R', 'P', 'A', 'S'].map((letter, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-[#111827] border-2 border-[#151D2F] flex items-center justify-center font-bold text-xs text-[#94A3B8]">
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <div className="font-bold text-[#F8FAFC] text-[15px]">Join 10,000+ students</div>
              <div className="text-[13px] text-[#94A3B8]">already on CareerForge</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
