import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Mock API call
    setTimeout(() => {
      setIsSubmitted(true);
      toast.success('Password reset link sent!');
    }, 1000);
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-4 bg-[#FAFAF9] text-[#1C1917]">
      <motion.div 
        className="w-full max-w-md bg-white border border-[#E7E5E4] rounded-[24px] p-8 sm:p-10 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0F766E] rounded-xl flex items-center justify-center font-black text-white text-xl shadow-sm">
              C
            </div>
          </Link>
          <h2 className="text-2xl font-bold font-display text-[#1C1917] mb-2">Reset Password</h2>
          <p className="text-[#78716C] text-sm">
            {isSubmitted 
              ? 'Check your email for a link to reset your password. If it doesn\'t appear within a few minutes, check your spam folder.'
              : 'Enter your email address and we\'ll send you a link to reset your password.'}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group form-input-icon mb-0">
              <FiMail className="input-icon text-[#78716C]" />
              <input
                type="email"
                className="form-input w-full bg-[#FAFAF9] border-[#E7E5E4] text-[#1C1917] focus:border-[#0F766E]"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Send Reset Link
            </button>
          </form>
        ) : (
          <button 
            onClick={() => setIsSubmitted(false)} 
            className="btn btn-secondary w-full border-[#E7E5E4] text-[#1C1917] hover:bg-[#F0FDFA] hover:text-[#0F766E] hover:border-[#0F766E]"
          >
            Try another email
          </button>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[#78716C] hover:text-[#0F766E] transition-colors">
            <FiArrowLeft /> Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
