import React from 'react';
import GlassCard from '../ui/GlassCard';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';

const DailyTasks = ({ tasks }) => {
  return (
    <GlassCard className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Daily Tasks</h3>
        <span className="text-xs font-semibold bg-accent-primary/20 text-accent-primary px-2 py-1 rounded-md">
          {tasks.filter(t => t.completed).length}/{tasks.length} Done
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
              task.completed 
                ? 'bg-color-success-bg border-color-success/20 opacity-70' 
                : 'bg-bg-primary border-glass-border hover:border-accent-primary/50'
            }`}
          >
            <div className={`mt-0.5 text-lg ${task.completed ? 'text-color-success' : 'text-text-muted'}`}>
              {task.completed ? <FiCheckSquare /> : <FiSquare />}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${task.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                {task.title}
              </p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-text-muted">+{task.points} Points</span>
                {task.completed && <span className="text-xs text-color-success font-semibold">Claimed</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default DailyTasks;
