import React from 'react';
import GlassCard from '../ui/GlassCard';

const StreakHeatmap = () => {
  // Generate mock heatmap data (last 30 days)
  const today = new Date();
  const heatmapData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (29 - i));
    
    // Random intensity 0-4
    let intensity = Math.floor(Math.random() * 5);
    // Guarantee some intensity for the last few days to show a streak
    if (i >= 18) intensity = Math.max(1, intensity);
    if (i === 29) intensity = 3; // Today

    return {
      date: d,
      intensity
    };
  });

  const getIntensityColor = (intensity) => {
    switch(intensity) {
      case 0: return '#E7E5E4';
      case 1: return 'rgba(15, 118, 110, 0.2)';
      case 2: return 'rgba(15, 118, 110, 0.45)';
      case 3: return 'rgba(15, 118, 110, 0.75)';
      case 4: return '#0F766E';
      default: return '#E7E5E4';
    }
  };

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-[16px] p-6 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold font-display text-[#1C1917]">Learning Activity</h3>
        <select className="bg-[#FAFAF9] border border-[#E7E5E4] text-sm rounded-lg px-2.5 py-1 text-[#1C1917] outline-none focus:border-[#0F766E]">
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      <div className="flex flex-col h-full justify-center">
        <div className="grid grid-cols-10 gap-2 mb-4">
          {heatmapData.map((day, i) => (
            <div 
              key={i} 
              className="w-full aspect-square rounded-[4px] transition-transform hover:scale-110"
              style={{ backgroundColor: getIntensityColor(day.intensity) }}
              title={`${day.date.toDateString()} - Level ${day.intensity}`}
            ></div>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-[#78716C] mt-auto pt-4 border-t border-[#E7E5E4]">
          <span>Less</span>
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2, 3, 4].map(level => (
              <div 
                key={level} 
                className="w-3.5 h-3.5 rounded-[3px]" 
                style={{ backgroundColor: getIntensityColor(level) }}
              ></div>
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default StreakHeatmap;
