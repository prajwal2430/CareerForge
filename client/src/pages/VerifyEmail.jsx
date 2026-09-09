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
    <div className="auth-page min-h-screen flex items-center justify-center p-4 bg-[#FAFAF9] text-[#1C1917]">
      <motion.div 
        className="w-full max-w-md bg-white border border-[#E7E5E4] rounded-[24px] p-8 sm:p-10 text-center shadow-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Link to="/" className="inline-flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-[#0F766E] rounded-xl flex items-center justify-center font-black text-white text-2xl shadow-sm">
            C
          </div>
        </Link>
        
        {!isVerified ? (
          <>
            <h2 className="text-2xl font-bold font-display text-[#1C1917] mb-2">Verify your email</h2>
            <p className="text-[#78716C] text-sm mb-8">
              We've sent a 6-digit verification code to your email. Please enter it below.
            </p>

            <div className="flex justify-center gap-2 sm:gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  className="w-10 h-12 sm:w-12 sm:h-14 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl text-center text-xl font-bold text-[#1C1917] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all outline-none"
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

            <p className="text-sm text-[#78716C]">
              Didn't receive the code?{' '}
              <button 
                onClick={() => toast.success('Verification code resent!')}
                className="text-[#0F766E] hover:underline font-semibold bg-transparent border-none cursor-pointer"
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
            <div className="w-20 h-20 bg-[#F0FDFA] text-[#0F766E] border border-[#0F766E]/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              <FiCheckCircle />
            </div>
            <h2 className="text-2xl font-bold font-display text-[#1C1917] mb-2">Email Verified!</h2>
            <p className="text-[#78716C]">Redirecting you to dashboard...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
