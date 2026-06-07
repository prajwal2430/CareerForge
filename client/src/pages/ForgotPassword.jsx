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
    <div className="auth-page min-h-screen flex items-center justify-center p-4 bg-bg-primary">
      <motion.div 
        className="w-full max-w-md glass-card-accent p-8 sm:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center font-black text-white text-xl">
              C
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-text-muted text-sm">
            {isSubmitted 
              ? 'Check your email for a link to reset your password. If it doesn\'t appear within a few minutes, check your spam folder.'
              : 'Enter your email address and we\'ll send you a link to reset your password.'}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group form-input-icon">
              <FiMail className="input-icon" />
              <input
                type="email"
                className="form-input w-full"
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
            className="btn btn-secondary w-full"
          >
            Try another email
          </button>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-colors">
            <FiArrowLeft /> Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
