import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';
import { MOCK_DATA } from '../data/mockData';
import GlassCard from '../components/ui/GlassCard';

const RoadmapDetail = () => {
  const { id } = useParams();
  const roadmap = MOCK_DATA.roadmaps.find(r => r.id === id) || MOCK_DATA.roadmaps[0];

  const nodes = [
    { id: 1, title: 'Internet Fundamentals', completed: true },
    { id: 2, title: 'HTML & CSS', completed: true },
    { id: 3, title: 'JavaScript Basics', completed: false },
    { id: 4, title: 'React.js', completed: false },
    { id: 5, title: 'Node.js', completed: false },
  ];

  return (
    <div className="pb-12 max-w-4xl mx-auto">
      <Link to="/roadmaps" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white mb-6 transition-colors">
        <FiChevronLeft /> Back to Roadmaps
      </Link>

      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">{roadmap.title} Roadmap</h1>
        <p className="text-text-muted">Follow this structured path to become a professional {roadmap.title}.</p>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-surface-3 -translate-x-1/2 rounded-full"></div>
        
        <div className="space-y-12">
          {nodes.map((node, index) => (
            <div key={node.id} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} relative z-10 w-full`}>
              <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                <GlassCard className={`inline-block ${node.completed ? 'border-accent-primary' : ''}`}>
                  <h3 className={`font-bold ${node.completed ? 'text-white' : 'text-text-muted'}`}>{node.title}</h3>
                  <p className="text-xs text-text-secondary mt-2">Explore resources →</p>
                </GlassCard>
              </div>
              
              <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center border-4 border-bg-primary z-20 transition-colors bg-surface-3 text-transparent">
                <div className={`w-full h-full rounded-full flex items-center justify-center ${node.completed ? 'bg-accent-primary text-white' : ''}`}>
                  {node.completed && <FiCheck />}
                </div>
              </div>
              
              <div className="w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;
