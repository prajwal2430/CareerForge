import React from 'react';
import GlassCard from '../ui/GlassCard';
import { motion } from 'framer-motion';

const PlacementReadiness = ({ score = 65 }) => {
  // Calculate stroke dash array for semi-circle
  const radius = 60;
  const circumference = radius * Math.PI; // Semi-circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return 'var(--color-success)';
    if (s >= 60) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const color = getColor(score);

  return (
    <GlassCard className="h-full flex flex-col items-center">
      <h3 className="text-lg font-bold mb-6 self-start">Placement Readiness</h3>
      
      <div className="relative w-40 h-24 overflow-hidden flex justify-center mt-4">
        {/* Background track */}
        <svg className="absolute w-40 h-40" viewBox="0 0 140 140">
          <path
            d="M 20 120 A 50 50 0 0 1 120 120"
            fill="none"
            stroke="var(--surface-3)"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Progress track */}
        <svg className="absolute w-40 h-40" viewBox="0 0 140 140">
          <motion.path
            d="M 20 120 A 50 50 0 0 1 120 120"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        <div className="absolute bottom-0 flex flex-col items-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}%</span>
        </div>
      </div>
      
      <div className="mt-8 w-full space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">DSA Prep</span>
          <span className="font-semibold text-color-warning">Medium</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Projects</span>
          <span className="font-semibold text-color-success">Strong</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">CS Core</span>
          <span className="font-semibold text-color-danger">Weak</span>
        </div>
      </div>
    </GlassCard>
  );
};

export default PlacementReadiness;
