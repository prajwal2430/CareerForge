import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiGithub, FiArrowLeft, FiCpu } from 'react-icons/fi';
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
    <div className="min-h-screen flex bg-[#FAFAF9] text-[#1C1917]">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[45%] flex-col justify-center p-16 relative overflow-hidden bg-gradient-to-br from-[#0F766E] to-[#115E59] border-r border-[#0F766E]/40 text-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 opacity-[0.15] blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F97360]/20 opacity-[0.2] blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-12 hover:opacity-90 transition-opacity">
            <div className="text-[#0F766E] bg-white p-2 rounded-xl shadow-sm">
              <FiCpu size={22} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">CareerForge</span>
          </Link>

          <h1 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-6">
            Pick up where you left off.
          </h1>
          <p className="text-[#F0FDFA]/90 text-lg leading-relaxed mb-10">
            Your AI career mentor is waiting. Keep learning, keep growing, and land your dream placement.
          </p>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-sm">
                💡
              </div>
              <div>
                <div className="font-bold text-white text-sm">Today's Insight</div>
                <div className="text-[11px] text-[#F0FDFA] uppercase tracking-wider font-semibold">Consistency wins placements</div>
              </div>
            </div>
            <p className="text-[#F0FDFA] text-sm leading-relaxed">
              Students who solve 2 problems daily have a 60% higher chance of cracking technical interviews.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-[#78716C] text-sm hover:text-[#0F766E] transition-colors mb-6 font-medium">
            <FiArrowLeft /> Back to Home
          </Link>

          <h2 className="font-display text-3xl font-bold text-[#1C1917] mb-2">Sign In</h2>
          <p className="text-[#78716C] mb-8">Welcome back! Let's continue your journey.</p>

          {/* Social Buttons */}
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
                 <FiMail className="input-icon text-[#78716C]" />
                 <input type="email" name="email" className="form-input bg-white border-[#E7E5E4] text-[#1C1917] focus:border-[#0F766E]" placeholder="Email address" value={values.email} onChange={handleChange} required />
               </div>
            </div>
            
            <div className="form-group mb-0">
               <div className="flex justify-end mb-1">
                 <Link to="/forgot-password" className="text-[12px] text-[#0F766E] hover:underline font-semibold transition-colors">Forgot password?</Link>
               </div>
               <div className="form-input-icon">
                 <FiLock className="input-icon text-[#78716C]" />
                 <input type="password" name="password" className="form-input bg-white border-[#E7E5E4] text-[#1C1917] focus:border-[#0F766E]" placeholder="Password" value={values.password} onChange={handleChange} required />
               </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Signing In...</span> : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-[#78716C]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0F766E] font-bold hover:underline transition-colors">Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
