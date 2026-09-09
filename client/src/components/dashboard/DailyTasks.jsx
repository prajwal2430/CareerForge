import React from 'react';
import GlassCard from '../ui/GlassCard';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';

const DailyTasks = ({ tasks }) => {
  return (
    <div className="bg-white border border-[#E7E5E4] rounded-[16px] p-6 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold font-display text-[#1C1917]">Daily Tasks</h3>
        <span className="text-xs font-semibold bg-[#F0FDFA] text-[#0F766E] border border-[#0F766E]/20 px-2.5 py-1 rounded-full">
          {tasks.filter(t => t.completed).length}/{tasks.length} Done
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
              task.completed 
                ? 'bg-[#F0FDFA] border-[#0F766E]/20 opacity-80' 
                : 'bg-[#FAFAF9] border-[#E7E5E4] hover:border-[#0F766E]'
            }`}
          >
            <div className={`mt-0.5 text-lg ${task.completed ? 'text-[#0F766E]' : 'text-[#78716C]'}`}>
              {task.completed ? <FiCheckSquare /> : <FiSquare />}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${task.completed ? 'line-through text-[#78716C]' : 'text-[#1C1917]'}`}>
                {task.title}
              </p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-[#78716C]">+{task.points} Points</span>
                {task.completed && <span className="text-xs text-[#0F766E] font-semibold">Claimed</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyTasks;
