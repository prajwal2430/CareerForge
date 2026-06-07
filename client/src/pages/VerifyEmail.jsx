import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
    
    // Auto submit if all filled
    if (value && index === 5 && newOtp.every(val => val !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (codeToVerify) => {
    const code = codeToVerify || otp.join('');
    if (code.length !== 6) {
      toast.error('Please enter the complete verification code.');
      return;
    }

    setIsVerifying(true);
    
    // Mock API call
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast.success('Email verified successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-4 bg-bg-primary">
      <motion.div 
        className="w-full max-w-md glass-card-accent p-8 sm:p-10 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Link to="/" className="inline-flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center font-black text-white text-2xl shadow-glow-primary">
            C
          </div>
        </Link>
        
        {!isVerified ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Verify your email</h2>
            <p className="text-text-muted text-sm mb-8">
              We've sent a 6-digit verification code to your email. Please enter it below.
            </p>

            <div className="flex justify-center gap-2 sm:gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  className="w-10 h-12 sm:w-12 sm:h-14 bg-bg-input border border-glass-border rounded-lg text-center text-xl font-bold text-white focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  value={digit}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isVerifying}
                />
              ))}
            </div>

            <button 
              onClick={() => handleVerify()} 
              className="btn btn-primary w-full mb-6"
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </button>

            <p className="text-sm text-text-muted">
              Didn't receive the code?{' '}
              <button 
                onClick={() => toast.success('Verification code resent!')}
                className="text-accent-primary hover:text-accent-primary-hover font-medium"
              >
                Resend code
              </button>
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8"
          >
            <div className="w-20 h-20 bg-color-success-bg text-color-success rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              <FiCheckCircle />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-text-muted">Redirecting you to dashboard...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
