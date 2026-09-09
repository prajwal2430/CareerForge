import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../ui/GlassCard';

const WeeklyChart = ({ data }) => {
  return (
    <div className="bg-white border border-[#E7E5E4] rounded-[16px] p-6 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold font-display text-[#1C1917]">Weekly Progress</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0F766E]"></div>
            <span className="text-[#78716C] font-medium">Problems</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F97360]"></div>
            <span className="text-[#78716C] font-medium">Hours</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F766E" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97360" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#F97360" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
            <XAxis dataKey="day" stroke="#78716C" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#78716C" fontSize={12} tickLine={false} axisLine={false} />
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
            <Area type="monotone" dataKey="problems" stroke="#0F766E" strokeWidth={3} fillOpacity={1} fill="url(#colorProblems)" />
            <Area type="monotone" dataKey="hours" stroke="#F97360" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyChart;
