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
      case 0: return 'var(--surface-3)';
      case 1: return 'rgba(81, 207, 102, 0.3)';
      case 2: return 'rgba(81, 207, 102, 0.5)';
      case 3: return 'rgba(81, 207, 102, 0.8)';
      case 4: return 'var(--color-success)';
      default: return 'var(--surface-3)';
    }
  };

  return (
    <GlassCard className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Learning Activity</h3>
        <select className="bg-bg-input border border-glass-border text-sm rounded-md px-2 py-1 text-text-secondary outline-none">
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      <div className="flex flex-col h-full justify-center">
        <div className="grid grid-cols-10 gap-2 mb-4">
          {heatmapData.map((day, i) => (
            <div 
              key={i} 
              className="w-full aspect-square rounded-sm"
              style={{ backgroundColor: getIntensityColor(day.intensity) }}
              title={`${day.date.toDateString()} - Level ${day.intensity}`}
            ></div>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-text-muted mt-auto pt-4 border-t border-glass-border">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div 
                key={level} 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: getIntensityColor(level) }}
              ></div>
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </GlassCard>
  );
};

export default StreakHeatmap;
