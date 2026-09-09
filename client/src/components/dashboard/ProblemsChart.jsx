import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '../ui/GlassCard';

const ProblemsChart = ({ data }) => {
  const chartData = [
    { name: 'Easy', value: data?.easy?.solved || 0, color: '#0F766E' },
    { name: 'Medium', value: data?.medium?.solved || 0, color: '#14B8A6' },
    { name: 'Hard', value: data?.hard?.solved || 0, color: '#F97360' },
  ];

  const totalSolved = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-[16px] p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold font-display text-[#1C1917] mb-2">Solved Problems</h3>
      
      <div className="flex-1 relative min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                borderColor: '#E7E5E4',
                borderRadius: '12px',
                color: '#1C1917',
                boxShadow: '0 4px 12px rgba(28, 25, 23, 0.08)'
              }}
              itemStyle={{ color: '#1C1917' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold font-display text-[#1C1917]">{totalSolved}</span>
          <span className="text-xs text-[#78716C]">Solved</span>
        </div>
      </div>
    </div>
  );
};

export default ProblemsChart;
