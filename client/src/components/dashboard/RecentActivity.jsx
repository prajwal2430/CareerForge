import React from 'react';
import GlassCard from '../ui/GlassCard';
import { FiCode, FiVideo, FiAward, FiFileText } from 'react-icons/fi';

const RecentActivity = () => {
  const activities = [
    { id: 1, type: 'problem', title: 'Solved Two Sum', time: '2 hours ago', icon: <FiCode />, color: '#0F766E', bg: '#F0FDFA' },
    { id: 2, type: 'course', title: 'Completed React Context API', time: '5 hours ago', icon: <FiVideo />, color: '#0F766E', bg: '#F0FDFA' },
    { id: 3, type: 'mock', title: 'Scored 8.5 in System Design Mock', time: '1 day ago', icon: <FiAward />, color: '#F97360', bg: '#FFF1F0' },
    { id: 4, type: 'resume', title: 'Updated Resume Skills', time: '2 days ago', icon: <FiFileText />, color: '#0F766E', bg: '#F0FDFA' },
  ];

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-[16px] p-6 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold font-display text-[#1C1917]">Recent Activity</h3>
        <button className="text-xs text-[#0F766E] hover:text-[#115E59] font-semibold bg-transparent border-none cursor-pointer">View All</button>
      </div>

      <div className="space-y-6 relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-2 bottom-2 w-px bg-[#E7E5E4]"></div>

        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 relative z-10">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-[#E7E5E4]"
              style={{ backgroundColor: activity.bg, color: activity.color }}
            >
              {activity.icon}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm font-medium text-[#1C1917] leading-tight">{activity.title}</p>
              <p className="text-xs text-[#78716C] mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
