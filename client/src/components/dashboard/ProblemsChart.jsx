import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '../ui/GlassCard';

const ProblemsChart = ({ data }) => {
  const chartData = [
    { name: 'Easy', value: data?.easy?.solved || 0, color: 'var(--color-easy)' },
    { name: 'Medium', value: data?.medium?.solved || 0, color: 'var(--color-medium)' },
    { name: 'Hard', value: data?.hard?.solved || 0, color: 'var(--color-hard)' },
  ];

  const totalSolved = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <GlassCard className="h-full flex flex-col">
      <h3 className="text-lg font-bold mb-2">Solved Problems</h3>
      
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
                backgroundColor: 'var(--glass-strong-bg)', 
                borderColor: 'var(--glass-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold">{totalSolved}</span>
          <span className="text-xs text-text-muted">Solved</span>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProblemsChart;
