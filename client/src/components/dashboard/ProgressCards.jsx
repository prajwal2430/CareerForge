import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import ProgressRing from '../ui/ProgressRing';

const ProgressCards = ({ mockData }) => {
  const cards = [
    {
      title: 'DSA Progress',
      progress: mockData?.user?.dsaProgress || 0,
      color: 'var(--color-info)',
      trackColor: 'var(--color-info-bg)',
      label: 'Problems',
      stats: [
        { label: 'Easy', value: mockData?.problems?.easy?.solved || 0, color: 'var(--color-easy)' },
        { label: 'Medium', value: mockData?.problems?.medium?.solved || 0, color: 'var(--color-medium)' },
        { label: 'Hard', value: mockData?.problems?.hard?.solved || 0, color: 'var(--color-hard)' },
      ]
    },
    {
      title: 'Course Progress',
      progress: mockData?.user?.courseProgress || 0,
      color: 'var(--accent-primary)',
      trackColor: 'var(--accent-primary-glow)',
      label: 'Completed',
      stats: [
        { label: 'Enrolled', value: '3', color: 'var(--text-secondary)' },
        { label: 'Completed', value: '1', color: 'var(--color-success)' },
        { label: 'Certificates', value: '1', color: 'var(--color-warning)' },
      ]
    },
    {
      title: 'Mock Interviews',
      progress: (mockData?.user?.mockScore || 0) * 10,
      valueText: `${mockData?.user?.mockScore || 0}/10`,
      color: 'var(--accent-secondary)',
      trackColor: 'var(--accent-secondary-glow)',
      label: 'Avg Score',
      stats: [
        { label: 'Taken', value: '5', color: 'var(--text-secondary)' },
        { label: 'Passed', value: '4', color: 'var(--color-success)' },
        { label: 'Next in', value: '2d', color: 'var(--color-info)' },
      ]
    },
    {
      title: 'Resume Score',
      progress: mockData?.user?.resumeScore || 0,
      color: 'var(--color-success)',
      trackColor: 'var(--color-success-bg)',
      label: 'ATS Match',
      stats: [
        { label: 'Keywords', value: '85%', color: 'var(--text-secondary)' },
        { label: 'Format', value: 'Good', color: 'var(--color-success)' },
        { label: 'Impact', value: 'Med', color: 'var(--color-warning)' },
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <GlassCard className="h-full flex flex-col items-center">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6 self-start w-full border-b border-glass-border pb-3">
              {card.title}
            </h3>
            
            <div className="mb-6 mt-2">
              <ProgressRing 
                progress={card.progress} 
                color={card.color} 
                trackColor={card.trackColor}
                label={card.label}
                valueText={card.valueText}
                size={110}
                strokeWidth={8}
              />
            </div>

            <div className="w-full flex justify-between mt-auto bg-bg-primary/30 rounded-lg p-3">
              {card.stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-xs text-text-muted mb-1">{stat.label}</p>
                  <p className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};

export default ProgressCards;
