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
      <GlassCard variant="accent" className="overflow-hidden relative">
        {/* Background Decorative Elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-accent-primary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute left-1/4 bottom-0 w-48 h-48 bg-gradient-to-tr from-accent-secondary/20 to-transparent rounded-full blur-3xl translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Welcome back, <span className="text-gradient">{user?.name || 'Student'}</span>! 👋
            </h1>
            <p className="text-text-muted">
              You're making great progress. Ready to tackle today's challenges?
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-bg-primary/50 backdrop-blur-md border border-glass-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-color-warning-bg text-color-warning flex items-center justify-center text-xl">
                <FiTrendingUp />
              </div>
              <div>
                <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">Current Streak</p>
                <p className="text-xl font-bold text-white">{mockData?.user?.streak || 0} Days</p>
              </div>
            </div>

            <div className="hidden sm:flex bg-bg-primary/50 backdrop-blur-md border border-glass-border rounded-xl p-4 items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-primary-glow text-accent-primary flex items-center justify-center text-xl">
                <FiCrosshair />
              </div>
              <div>
                <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">Global Rank</p>
                <p className="text-xl font-bold text-white">#{mockData?.user?.rank?.toLocaleString() || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default WelcomeBanner;
