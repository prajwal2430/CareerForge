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
    <div className="min-h-screen flex bg-[#0B1020] text-[#F8FAFC]">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[45%] flex-col justify-center p-16 relative overflow-hidden bg-[#111827] border-r border-[#263248]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED] opacity-[0.05] blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#06B6D4] opacity-[0.05] blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
            <div className="text-[#06B6D4]">
              <FiCpu size={24} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">CareerForge</span>
          </Link>

          <h1 className="text-4xl lg:text-5xl font-display font-bold text-[#F8FAFC] leading-tight mb-6">
            Pick up where you left off.
          </h1>
          <p className="text-[#CBD5E1] text-lg leading-relaxed mb-10">
            Your AI career mentor is waiting. Keep learning, keep growing, and land your dream placement.
          </p>

          <div className="bg-[#151D2F] border border-[#263248] rounded-[20px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                💡
              </div>
              <div>
                <div className="font-bold text-[#F8FAFC] text-sm">Today's Insight</div>
                <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider font-semibold">Consistency wins placements</div>
              </div>
            </div>
            <p className="text-[#CBD5E1] text-sm leading-relaxed">
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
          <Link to="/" className="inline-flex items-center gap-2 text-[#94A3B8] text-sm hover:text-[#7C3AED] transition-colors mb-6 font-medium">
            <FiArrowLeft /> Back to Home
          </Link>

          <h2 className="font-display text-3xl font-bold text-[#F8FAFC] mb-2">Sign In</h2>
          <p className="text-[#94A3B8] mb-8">Welcome back! Let's continue your journey.</p>

          {/* Social Buttons */}
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
                 <FiMail className="input-icon" />
                 <input type="email" name="email" className="form-input" placeholder="Email address" value={values.email} onChange={handleChange} required />
               </div>
            </div>
            
            <div className="form-group mb-0">
               <div className="flex justify-end mb-1">
                 <Link to="/forgot-password" className="text-[12px] text-[#06B6D4] hover:text-[#F8FAFC] font-semibold transition-colors">Forgot password?</Link>
               </div>
               <div className="form-input-icon">
                 <FiLock className="input-icon" />
                 <input type="password" name="password" className="form-input" placeholder="Password" value={values.password} onChange={handleChange} required />
               </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Signing In...</span> : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-[#94A3B8]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#06B6D4] font-bold hover:text-[#F8FAFC] transition-colors">Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
