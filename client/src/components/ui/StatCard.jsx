import React from 'react';
import GlassCard from './GlassCard';

const StatCard = ({ icon, value, label, change, isPositive }) => {
  return (
    <GlassCard className="stat-card">
      <div className="stat-card-icon" style={{ background: 'var(--surface-2)', color: 'var(--accent-primary)' }}>
        {icon}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="flex justify-between items-end">
        <div className="stat-card-label">{label}</div>
        {change && (
          <div className={`stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default StatCard;
