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
    <div className="min-h-screen flex bg-[#FAFAF9] text-[#1C1917]">
      
      {/* Left Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-[#78716C] text-sm hover:text-[#0F766E] transition-colors mb-6 font-medium">
            <FiArrowLeft /> Back to Home
          </Link>

          <h2 className="font-display text-3xl font-bold text-[#1C1917] mb-2">Create Account</h2>
          <p className="text-[#78716C] mb-8">Start your placement journey — it's completely free.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
               onClick={() => toast('Coming soon!', { icon: '🚧' })}
               className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#E7E5E4] rounded-xl text-sm font-semibold text-[#1C1917] hover:bg-[#F0FDFA] hover:border-[#0F766E] hover:text-[#0F766E] transition-all"
            >
               <FcGoogle size={18} /> Google
            </button>
            <button
               onClick={() => toast('Coming soon!', { icon: '🚧' })}
               className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#E7E5E4] rounded-xl text-sm font-semibold text-[#1C1917] hover:bg-[#F0FDFA] hover:border-[#0F766E] hover:text-[#0F766E] transition-all"
            >
               <FiGithub size={18} /> GitHub
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8 text-[11px] text-[#78716C] font-bold uppercase tracking-wider">
            <div className="flex-1 h-px bg-[#E7E5E4]" />
            or with email
            <div className="flex-1 h-px bg-[#E7E5E4]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group mb-0">
               <div className="form-input-icon">
                 <FiUser className="input-icon text-[#78716C]" />
                 <input type="text" name="name" className="form-input bg-white border-[#E7E5E4] text-[#1C1917] focus:border-[#0F766E]" placeholder="Full Name" value={values.name} onChange={handleChange} required />
               </div>
            </div>
            <div className="form-group mb-0">
               <div className="form-input-icon">
                 <FiMail className="input-icon text-[#78716C]" />
                 <input type="email" name="email" className="form-input bg-white border-[#E7E5E4] text-[#1C1917] focus:border-[#0F766E]" placeholder="Email address" value={values.email} onChange={handleChange} required />
               </div>
            </div>
            <div className="form-group mb-0">
               <div className="form-input-icon">
                 <FiLock className="input-icon text-[#78716C]" />
                 <input type="password" name="password" className="form-input bg-white border-[#E7E5E4] text-[#1C1917] focus:border-[#0F766E]" placeholder="Password (min 6 characters)" value={values.password} onChange={handleChange} required minLength={6} />
               </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Creating...</span> : 'Create Free Account'}
            </button>

            <p className="text-center text-[12px] text-[#78716C] mt-4">
              By signing up you agree to our{' '}
              <a href="#" className="text-[#0F766E] font-semibold hover:underline transition-colors">Terms of Service</a>
            </p>
          </form>

          <p className="text-center mt-8 text-sm text-[#78716C]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0F766E] font-bold hover:underline transition-colors">Sign In</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex w-[45%] flex-col justify-center p-16 relative overflow-hidden bg-gradient-to-br from-[#0F766E] to-[#115E59] border-l border-[#0F766E]/40 text-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 opacity-[0.15] blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F97360]/20 opacity-[0.2] blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-md">
          <div className="font-display text-xs font-bold tracking-[0.15em] uppercase text-[#F0FDFA] mb-4">
            🚀 JOIN CAREERFORGE
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
            Everything you need to get placed
          </h2>

          <div className="flex flex-col gap-4 mb-10">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0">
                  <FiCheckCircle size={14} />
                </div>
                <span className="text-[#F0FDFA] text-[15px]">{perk}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/10 border border-white/20 rounded-[16px] shadow-sm backdrop-blur-sm">
            <div className="flex -space-x-3">
              {['R', 'P', 'A', 'S'].map((letter, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-[#115E59] border-2 border-[#0F766E] flex items-center justify-center font-bold text-xs text-white">
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <div className="font-bold text-white text-[15px]">Join 10,000+ students</div>
              <div className="text-[13px] text-[#F0FDFA]/80">already on CareerForge</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
