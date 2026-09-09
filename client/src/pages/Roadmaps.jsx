import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, RefreshCw, CheckCircle2, Clock, BookOpen, Target, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react';
import { MOCK_DATA } from '../data/mockData';
import ProgressRing from '../components/ui/ProgressRing';
import api from '../services/api';
import toast from 'react-hot-toast';

const Roadmaps = () => {
  const navigate = useNavigate();
  const [adaptiveRoadmap, setAdaptiveRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adapting, setAdapting] = useState(false);

  useEffect(() => {
    fetchActiveRoadmap();
  }, []);

  const fetchActiveRoadmap = async () => {
    try {
      const res = await api.get('/ai/learning/roadmap');
      if (res.data && res.data.roadmap_id) {
        setAdaptiveRoadmap(res.data);
      }
    } catch (err) {
      console.log('No active AI roadmap or unauthenticated, falling back to curated roadmaps.');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerAdaptation = async (e) => {
    e.stopPropagation();
    setAdapting(true);
    try {
      const res = await api.post('/ai/learning/adaptive-update', {
        trigger: 'manual_ui_refresh',
      });
      toast.success(`Roadmap adaptively updated to Revision ${res.data?.roadmap?.revision || '+1'}!`);
      await fetchActiveRoadmap();
    } catch (err) {
      toast.error('Could not adapt roadmap. Make sure AI service is online.');
    } finally {
      setAdapting(false);
    }
  };

  // Calculate completed percentage for adaptive roadmap
  const completedCount = adaptiveRoadmap?.milestones?.filter(m => m.completed)?.length || 0;
  const totalCount = adaptiveRoadmap?.milestones?.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="pb-16 max-w-7xl mx-auto px-4 md:px-8">
      {/* Header */}
      <div className="mb-8 mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDFA] border border-[#0F766E]/20 text-[#0F766E] text-xs font-semibold mb-2">
            <Sparkles size={14} /> Continuous Feedback Engine
          </div>
          <h1 className="text-3xl font-display font-bold text-[#1C1917]">Learning Roadmaps</h1>
          <p className="text-[#78716C] text-sm mt-1">
            Dynamic, performance-driven roadmaps calibrated continuously to your progress.
          </p>
        </div>
      </div>

      {/* Hero: Active Adaptive Learning Roadmap */}
      {adaptiveRoadmap && (
        <div className="mb-10 bg-gradient-to-br from-white via-[#F0FDFA]/40 to-white border-2 border-[#0F766E]/30 rounded-[24px] p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0F766E]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-0.5 rounded-full bg-[#0F766E] text-white text-xs font-bold uppercase tracking-wider">
                  Adaptive Active Path
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F4] text-[#44403C] text-xs font-semibold border border-[#E7E5E4]">
                  Rev {adaptiveRoadmap.revision || 1}
                </span>
                {adaptiveRoadmap.adaptation_history?.length > 0 && (
                  <span className="text-xs text-[#78716C] flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-[#0F766E]" />
                    {adaptiveRoadmap.adaptation_history.length} adaptations applied
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold font-display text-[#1C1917] mb-2">
                {adaptiveRoadmap.track_title || 'Software Engineering Placement Accelerator'}
              </h2>
              <p className="text-sm text-[#78716C] max-w-2xl mb-4">
                {adaptiveRoadmap.personalization_summary?.difficulty_escalation ||
                  'Calibrated in real time to your latest assessments, coding accuracy, and mock interview performance.'}
              </p>

              {/* Dynamic stats pills */}
              <div className="flex flex-wrap gap-3 text-xs text-[#44403C]">
                <div className="flex items-center gap-1.5 bg-white border border-[#E7E5E4] rounded-lg px-3 py-1.5 shadow-xs">
                  <Clock size={14} className="text-[#0F766E]" />
                  <span>Target: <strong>{adaptiveRoadmap.daily_practice_plan?.target_hours_per_day || 2.5}h / day</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-[#E7E5E4] rounded-lg px-3 py-1.5 shadow-xs">
                  <Target size={14} className="text-[#0F766E]" />
                  <span>Weekly Coding: <strong>{adaptiveRoadmap.coding_practice?.target_weekly_problems || 14} problems</strong></span>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-[#E7E5E4] rounded-lg px-3 py-1.5 shadow-xs">
                  <BookOpen size={14} className="text-[#0F766E]" />
                  <span>Next: <strong>{adaptiveRoadmap.topics_to_study_next?.[0] || 'Core Data Structures'}</strong></span>
                </div>
              </div>
            </div>

            {/* Right side: Progress and CTA buttons */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#E7E5E4]">
              <div className="flex items-center gap-4">
                <ProgressRing 
                  progress={progressPercent} 
                  size={64} 
                  strokeWidth={5} 
                  color="#0F766E"
                  trackColor="#E7E5E4"
                  valueText={`${progressPercent}%`} 
                />
                <div className="text-left sm:text-right">
                  <p className="text-xs text-[#78716C] uppercase font-semibold">Milestones</p>
                  <p className="text-base font-bold text-[#1C1917]">{completedCount} of {totalCount} Done</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerAdaptation}
                  disabled={adapting}
                  title="Re-evaluate new performance and adapt roadmap"
                  className="px-3 py-2 rounded-xl bg-white border border-[#0F766E]/30 text-[#0F766E] hover:bg-[#F0FDFA] transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <RefreshCw size={14} className={adapting ? 'animate-spin' : ''} />
                  {adapting ? 'Adapting...' : 'Sync Loop'}
                </button>

                <button
                  onClick={() => navigate('/roadmaps/adaptive')}
                  className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  View Full Plan <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Curated Career Tracks Header */}
      <div className="mb-4">
        <h2 className="text-xl font-display font-bold text-[#1C1917]">Curated Tracks & Specializations</h2>
        <p className="text-xs text-[#78716C]">Foundational curriculum standards for top tech placements.</p>
      </div>

      {/* Grid of standard roadmaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DATA.roadmaps.map((roadmap) => (
          <div 
            key={roadmap.id} 
            className="bg-white border border-[#E7E5E4] rounded-[16px] p-6 shadow-sm hover:shadow-md hover:border-[#0F766E] transition-all cursor-pointer flex flex-col group"
            onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] border border-[#0F766E]/20 flex items-center justify-center font-bold text-2xl shadow-sm">
                {roadmap.id === 'java' ? '☕' : roadmap.id === 'mern' ? '⚛️' : '📊'}
              </div>
              <ProgressRing 
                progress={roadmap.progress} 
                size={50} 
                strokeWidth={4} 
                color="#0F766E"
                trackColor="#E7E5E4"
                valueText={`${roadmap.progress}%`} 
              />
            </div>
            
            <h3 className="text-xl font-bold font-display text-[#1C1917] group-hover:text-[#0F766E] transition-colors mb-2">
              {roadmap.title}
            </h3>
            
            <div className="flex gap-4 text-sm text-[#78716C] mt-auto pt-4 border-t border-[#E7E5E4]">
              <span>{roadmap.steps} Modules</span>
              <span>•</span>
              <span>{roadmap.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;
