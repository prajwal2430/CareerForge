import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiCrosshair } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';

const WelcomeBanner = ({ user, mockData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="bg-gradient-to-r from-[#0F766E] to-[#115E59] text-white rounded-[24px] p-8 relative overflow-hidden shadow-sm">
        {/* Background Decorative Elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute left-1/4 bottom-0 w-48 h-48 bg-[#F97360]/20 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-white mb-2">
              Welcome back, <span className="text-[#F0FDFA] underline decoration-[#F97360] decoration-2">{user?.name || 'Student'}</span>! 👋
            </h1>
            <p className="text-[#F0FDFA]/90">
              You're making great progress. Ready to tackle today's challenges?
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F97360] text-white flex items-center justify-center text-xl shadow-sm">
                <FiTrendingUp />
              </div>
              <div>
                <p className="text-xs text-[#F0FDFA]/80 font-semibold uppercase tracking-wider">Current Streak</p>
                <p className="text-xl font-bold text-white">{mockData?.user?.streak || 0} Days</p>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center text-xl shadow-sm">
                <FiCrosshair />
              </div>
              <div>
                <p className="text-xs text-[#F0FDFA]/80 font-semibold uppercase tracking-wider">Global Rank</p>
                <p className="text-xl font-bold text-white">#{mockData?.user?.rank?.toLocaleString() || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
