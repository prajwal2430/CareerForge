import React from 'react';
import GlassCard from '../ui/GlassCard';
import { FiCode, FiVideo, FiAward, FiFileText } from 'react-icons/fi';

const RecentActivity = () => {
  const activities = [
    { id: 1, type: 'problem', title: 'Solved Two Sum', time: '2 hours ago', icon: <FiCode />, color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
    { id: 2, type: 'course', title: 'Completed React Context API', time: '5 hours ago', icon: <FiVideo />, color: 'var(--accent-primary)', bg: 'rgba(108, 92, 231, 0.15)' },
    { id: 3, type: 'mock', title: 'Scored 8.5 in System Design Mock', time: '1 day ago', icon: <FiAward />, color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
    { id: 4, type: 'resume', title: 'Updated Resume Skills', time: '2 days ago', icon: <FiFileText />, color: 'var(--color-info)', bg: 'var(--color-info-bg)' },
  ];

  return (
    <GlassCard className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Recent Activity</h3>
        <button className="text-xs text-accent-primary hover:text-accent-primary-hover font-medium">View All</button>
      </div>

      <div className="space-y-6 relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-2 bottom-2 w-px bg-glass-border"></div>

        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 relative z-10">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-glass-border"
              style={{ backgroundColor: activity.bg, color: activity.color }}
            >
              {activity.icon}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm font-medium text-text-primary leading-tight">{activity.title}</p>
              <p className="text-xs text-text-muted mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default RecentActivity;
