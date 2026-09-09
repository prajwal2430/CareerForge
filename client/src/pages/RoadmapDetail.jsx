import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiChevronLeft,
  FiCheck,
  FiRefreshCw,
  FiClock,
  FiTarget,
  FiBookOpen,
  FiAlertCircle,
  FiAward,
  FiTrendingUp,
} from 'react-icons/fi';
import { Sparkles, CheckCircle2, History } from 'lucide-react';
import { MOCK_DATA } from '../data/mockData';
import api from '../services/api';
import toast from 'react-hot-toast';

const RoadmapDetail = () => {
  const { id } = useParams();
  const isAdaptive = id === 'adaptive';

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(isAdaptive);
  const [adapting, setAdapting] = useState(false);
  const [markingStep, setMarkingStep] = useState(null);

  useEffect(() => {
    if (isAdaptive) {
      fetchAdaptiveRoadmap();
    } else {
      const found = MOCK_DATA.roadmaps.find((r) => r.id === id) || MOCK_DATA.roadmaps[0];
      setRoadmap({
        track_title: found.title,
        revision: 1,
        milestones: [
          { step_id: 1, title: 'Internet & Networking Fundamentals', category: 'CS Fundamentals', completed: true, resources: ['HTTP/HTTPS protocol overview', 'DNS & TCP handshake'] },
          { step_id: 2, title: 'Language Foundations & Syntax', category: 'Core Language', completed: true, resources: ['Type systems & scopes', 'Memory model basics'] },
          { step_id: 3, title: 'Data Structures & Algorithmic Foundations', category: 'DSA', completed: false, resources: ['Arrays, Hash Maps, Two Pointers', 'Big-O Analysis'] },
          { step_id: 4, title: 'Advanced Framework Architecture', category: 'Engineering', completed: false, resources: ['Component lifecycles & state machines', 'RESTful API contracts'] },
          { step_id: 5, title: 'System Design & Scalability Patterns', category: 'Architecture', completed: false, resources: ['Load balancing, caching, database indexing'] },
        ],
        daily_practice_plan: {
          target_hours_per_day: 2.0,
          schedule: [
            { time_minutes: 60, domain: 'DSA Practice', action: 'Solve 2 medium pattern problems.' },
            { time_minutes: 30, domain: 'Language Mastery', action: 'Core syntax and concurrency drills.' },
            { time_minutes: 30, domain: 'System Concepts', action: 'Architecture deep dive.' },
          ],
        },
        topics_to_study_next: ['Hash Maps & Invariants', 'Two Pointers', 'State Management'],
      });
    }
  }, [id, isAdaptive]);

  const fetchAdaptiveRoadmap = async () => {
    try {
      const res = await api.get('/ai/learning/roadmap');
      setRoadmap(res.data);
    } catch (err) {
      toast.error('Failed to load adaptive roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerAdaptation = async () => {
    setAdapting(true);
    try {
      const res = await api.post('/ai/learning/adaptive-update', {
        trigger: 'roadmap_detail_re_evaluation',
      });
      toast.success(`Adaptive Loop Executed! Revision updated to Rev ${res.data?.roadmap?.revision || '+1'}`);
      await fetchAdaptiveRoadmap();
    } catch (err) {
      toast.error('Could not adapt roadmap. Check service connectivity.');
    } finally {
      setAdapting(false);
    }
  };

  const handleToggleMilestone = async (stepId, currentCompleted, stepTitle, stepCategory) => {
    if (!isAdaptive) return;
    setMarkingStep(stepId);
    try {
      // Record progress via API
      await api.post('/ai/learning/progress', {
        step_id: stepId,
        course_title: stepTitle,
        category: stepCategory || 'General',
        time_spent_hours: 1.5,
      });
      toast.success(`Milestone #${stepId} marked completed! Adaptive loop refreshed.`);
      await fetchAdaptiveRoadmap();
    } catch (err) {
      toast.error('Could not update milestone completion.');
    } finally {
      setMarkingStep(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <FiRefreshCw className="animate-spin text-[#0F766E] mx-auto mb-3" size={28} />
        <p className="text-sm text-[#78716C]">Loading your personalized adaptive roadmap...</p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#78716C]">Roadmap not found.</p>
        <Link to="/roadmaps" className="text-[#0F766E] underline text-sm mt-2 inline-block">Back to roadmaps</Link>
      </div>
    );
  }

  const milestones = roadmap.milestones || [];
  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0;
  const history = roadmap.adaptation_history || [];

  return (
    <div className="pb-16 max-w-5xl mx-auto px-4 md:px-6">
      {/* Top Breadcrumb */}
      <div className="pt-6 mb-6 flex items-center justify-between">
        <Link
          to="/roadmaps"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#78716C] hover:text-[#0F766E] transition-colors"
        >
          <FiChevronLeft size={18} /> Back to Roadmaps
        </Link>

        {isAdaptive && (
          <button
            onClick={handleTriggerAdaptation}
            disabled={adapting}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#0F766E]/30 text-[#0F766E] hover:bg-[#F0FDFA] transition-colors text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            <FiRefreshCw size={14} className={adapting ? 'animate-spin' : ''} />
            {adapting ? 'Re-evaluating...' : 'Sync Adaptive Loop'}
          </button>
        )}
      </div>

      {/* Header Banner */}
      <div className="bg-white border border-[#E7E5E4] rounded-[20px] p-6 md:p-8 mb-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-0.5 rounded-full bg-[#0F766E] text-white text-xs font-bold uppercase tracking-wider">
            {isAdaptive ? 'AI Adaptive Track' : 'Curated Track'}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F4] text-[#44403C] text-xs font-semibold border border-[#E7E5E4]">
            Revision {roadmap.revision || 1}
          </span>
          {isAdaptive && (
            <span className="text-xs text-[#0F766E] font-semibold flex items-center gap-1">
              <Sparkles size={13} /> Continuous Feedback Active
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-display font-bold text-[#1C1917] mb-2">
          {roadmap.track_title || 'Personalized Placement Track'}
        </h1>

        <p className="text-[#78716C] text-sm max-w-2xl mb-6">
          {roadmap.personalization_summary?.difficulty_escalation ||
            'Customized to your verified competencies, diagnosed weaknesses, and target company standards.'}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-[#78716C]">
            <span>Roadmap Completion</span>
            <span className="text-[#1C1917]">{completedCount} of {milestones.length} Completed ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-[#F5F5F4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0F766E] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Adaptive Cards: Practice, Coding, Next Topics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {/* Card 1: Daily Practice Plan */}
        <div className="bg-white border border-[#E7E5E4] rounded-[16px] p-5 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-[#0F766E]">
            <FiClock size={18} />
            <h3 className="font-bold font-display text-sm text-[#1C1917]">Daily Practice Plan</h3>
          </div>
          <div className="text-2xl font-bold font-display text-[#1C1917] mb-1">
            {roadmap.daily_practice_plan?.target_hours_per_day || 2.5}h <span className="text-xs font-normal text-[#78716C]">/ day</span>
          </div>
          <div className="mt-3 space-y-2 text-xs text-[#44403C] flex-1">
            {(roadmap.daily_practice_plan?.schedule || []).slice(0, 3).map((item, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-[#FAFAF9] border border-[#F5F5F4]">
                <div className="font-semibold text-[#1C1917] flex justify-between">
                  <span>{item.domain}</span>
                  <span className="text-[#0F766E]">{item.time_minutes}m</span>
                </div>
                <p className="text-[#78716C] mt-0.5 text-[11px] leading-relaxed line-clamp-2">{item.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Coding Practice */}
        <div className="bg-white border border-[#E7E5E4] rounded-[16px] p-5 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-[#0F766E]">
            <FiTarget size={18} />
            <h3 className="font-bold font-display text-sm text-[#1C1917]">Coding Practice Target</h3>
          </div>
          <div className="text-2xl font-bold font-display text-[#1C1917] mb-1">
            {roadmap.coding_practice?.target_weekly_problems || 14} <span className="text-xs font-normal text-[#78716C]">problems / week</span>
          </div>
          <p className="text-xs text-[#78716C] mb-3">
            Focus: <strong className="text-[#1C1917]">{roadmap.coding_practice?.focus_area || 'Algorithmic Patterns'}</strong>
          </p>
          {roadmap.coding_practice?.difficulty_mix && (
            <div className="mt-auto p-2.5 rounded-lg bg-[#F0FDFA]/50 border border-[#0F766E]/20 text-xs">
              <div className="font-semibold text-[#0F766E] mb-1">Difficulty Allocation</div>
              <div className="flex justify-between text-[11px] text-[#44403C]">
                <span>Easy: {roadmap.coding_practice.difficulty_mix.easy || 0}</span>
                <span>Med: {roadmap.coding_practice.difficulty_mix.medium || 0}</span>
                <span>Hard: {roadmap.coding_practice.difficulty_mix.hard || 0}</span>
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Topics to Study Next */}
        <div className="bg-white border border-[#E7E5E4] rounded-[16px] p-5 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-[#0F766E]">
            <FiBookOpen size={18} />
            <h3 className="font-bold font-display text-sm text-[#1C1917]">Topics to Study Next</h3>
          </div>
          <p className="text-xs text-[#78716C] mb-3">Prioritized gap-filling & prerequisites:</p>
          <div className="space-y-1.5 flex-1">
            {(roadmap.topics_to_study_next || []).slice(0, 4).map((topic, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[#1C1917] bg-[#FAFAF9] p-2 rounded-lg border border-[#F5F5F4]">
                <span className="w-4 h-4 rounded-full bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="truncate">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestone Progression Timeline */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-display font-bold text-[#1C1917]">Milestone Sequence</h2>
            <p className="text-xs text-[#78716C]">In-place preserved roadmap steps updated by measurable progress.</p>
          </div>
          {isAdaptive && (
            <span className="text-xs text-[#78716C]">Click checkbox to toggle completion</span>
          )}
        </div>

        <div className="space-y-4">
          {milestones.map((m, index) => {
            const isCompleted = Boolean(m.completed);
            const isRemediation = m.category?.toLowerCase().includes('remediation') || m.title?.toLowerCase().includes('prerequisite');
            const isInterview = m.category?.toLowerCase().includes('interview');

            return (
              <div
                key={m.step_id || index}
                className={`p-5 rounded-[16px] border transition-all ${
                  isCompleted
                    ? 'bg-[#F0FDFA]/30 border-[#0F766E]/40'
                    : isRemediation
                    ? 'bg-amber-50/40 border-amber-300/60'
                    : 'bg-white border-[#E7E5E4] hover:border-[#0F766E]/40'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleMilestone(m.step_id, isCompleted, m.title, m.category)}
                    disabled={!isAdaptive || markingStep === m.step_id}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
                      isCompleted
                        ? 'bg-[#0F766E] border-[#0F766E] text-white'
                        : 'border-[#D6D3D1] hover:border-[#0F766E] bg-white text-transparent'
                    }`}
                  >
                    <FiCheck size={16} className={isCompleted ? 'opacity-100' : 'opacity-0'} />
                  </button>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-[#78716C]">Step {m.step_id || index + 1}</span>

                      {/* Category Badges */}
                      {isRemediation && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold tracking-wide">
                          Prerequisite Remediation
                        </span>
                      )}
                      {isInterview && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold tracking-wide">
                          Interview Simulation
                        </span>
                      )}
                      {m.category && !isRemediation && !isInterview && (
                        <span className="px-2 py-0.5 rounded-full bg-[#F5F5F4] text-[#44403C] text-[10px] font-semibold">
                          {m.category}
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-full bg-[#F0FDFA] text-[#0F766E] text-[10px] font-bold">
                          Completed
                        </span>
                      )}
                    </div>

                    <h3 className={`text-base font-bold font-display ${isCompleted ? 'text-[#0F766E] line-through' : 'text-[#1C1917]'}`}>
                      {m.title}
                    </h3>

                    {m.resources && m.resources.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {m.resources.map((res, rIdx) => (
                          <span key={rIdx} className="text-[11px] bg-[#FAFAF9] border border-[#E7E5E4] px-2.5 py-1 rounded-md text-[#57534E]">
                            📚 {res}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adaptation History Audit Trail */}
      {history.length > 0 && (
        <div className="bg-white border border-[#E7E5E4] rounded-[20px] p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <History size={18} className="text-[#0F766E]" />
            <h2 className="text-base font-bold font-display text-[#1C1917]">Adaptation History & Audit Trail</h2>
          </div>
          <div className="space-y-3">
            {history.slice(-5).reverse().map((entry, hIdx) => (
              <div key={hIdx} className="p-3 rounded-xl bg-[#FAFAF9] border border-[#F5F5F4] text-xs">
                <div className="flex items-center justify-between font-semibold text-[#1C1917] mb-1">
                  <span>Revision {entry.revision}</span>
                  <span className="text-[11px] text-[#78716C]">
                    Trigger: <code className="font-mono text-[#0F766E]">{entry.trigger}</code>
                  </span>
                </div>
                {entry.rules_applied && entry.rules_applied.length > 0 && (
                  <ul className="list-disc list-inside text-[#57534E] text-[11px] space-y-0.5 mt-1">
                    {entry.rules_applied.map((rule, rIdx) => (
                      <li key={rIdx}>{rule}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapDetail;
