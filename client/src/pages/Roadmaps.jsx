import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import GlassCard from '../components/ui/GlassCard';
import ProgressRing from '../components/ui/ProgressRing';

const Roadmaps = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Learning Roadmaps</h1>
        <p className="text-text-muted">Structured paths to achieve your career goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DATA.roadmaps.map((roadmap) => (
          <GlassCard 
            key={roadmap.id} 
            className="cursor-pointer hover:border-accent-primary/50 transition-colors flex flex-col"
            onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center font-bold text-white text-xl shadow-glow-primary">
                {roadmap.id === 'java' ? '☕' : roadmap.id === 'mern' ? '⚛️' : '📊'}
              </div>
              <ProgressRing 
                progress={roadmap.progress} 
                size={50} 
                strokeWidth={4} 
                valueText={`${roadmap.progress}%`} 
              />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{roadmap.title}</h3>
            
            <div className="flex gap-4 text-sm text-text-muted mt-auto pt-4 border-t border-glass-border">
              <span>{roadmap.steps} Modules</span>
              <span>•</span>
              <span>{roadmap.duration}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;
