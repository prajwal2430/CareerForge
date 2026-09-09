import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { MOCK_DATA } from '../data/mockData';
import { FiUser, FiMail, FiBriefcase, FiCalendar, FiAward, FiBookOpen, FiCode } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const data = MOCK_DATA;

  return (
    <div className="pb-12 max-w-4xl mx-auto px-4">
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-display font-bold text-[#1C1917] mb-2">My Profile</h1>
        <p className="text-[#78716C]">Manage your personal info and track placement readiness.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white border border-[#E7E5E4] rounded-[20px] shadow-sm md:col-span-1 flex flex-col items-center text-center p-6">
          <div className="w-24 h-24 rounded-full bg-[#0F766E] flex items-center justify-center font-bold text-white text-3xl shadow-sm mb-4">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="text-xl font-bold font-display text-[#1C1917] mb-1">{user?.name || 'Student Name'}</h2>
          <p className="text-xs bg-[#F0FDFA] border border-[#0F766E]/20 px-3 py-1 rounded-full text-[#0F766E] font-semibold mb-4 uppercase tracking-wider">
            {user?.role || 'Aspirant'}
          </p>
          
          <div className="w-full space-y-4 text-left border-t border-[#E7E5E4] pt-4 mt-2">
            <div className="flex items-center gap-3 text-sm text-[#78716C]">
              <FiMail className="text-[#0F766E] shrink-0" />
              <span className="truncate">{user?.email || 'student@learnhub.com'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#78716C]">
              <FiBriefcase className="text-[#0F766E] shrink-0" />
              <span>Target: SDE 1</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#78716C]">
              <FiCalendar className="text-[#0F766E] shrink-0" />
              <span>Graduation: 2026</span>
            </div>
          </div>
        </div>

        {/* Preparation Stats & Highlights */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-[#E7E5E4] rounded-[16px] text-center p-4 shadow-sm hover:border-[#0F766E]/40 transition-colors">
              <FiCode className="text-2xl text-[#0F766E] mx-auto mb-2" />
              <div className="text-2xl font-black font-display text-[#1C1917]">{data.user.dsaProgress}%</div>
              <div className="text-xs text-[#78716C] mt-1">DSA Rank</div>
            </div>
            <div className="bg-white border border-[#E7E5E4] rounded-[16px] text-center p-4 shadow-sm hover:border-[#0F766E]/40 transition-colors">
              <FiBookOpen className="text-2xl text-[#0F766E] mx-auto mb-2" />
              <div className="text-2xl font-black font-display text-[#1C1917]">{data.user.courseProgress}%</div>
              <div className="text-xs text-[#78716C] mt-1">Courses Done</div>
            </div>
            <div className="bg-white border border-[#E7E5E4] rounded-[16px] text-center p-4 shadow-sm hover:border-[#0F766E]/40 transition-colors">
              <FiAward className="text-2xl text-[#F97360] mx-auto mb-2" />
              <div className="text-2xl font-black font-display text-[#1C1917]">{data.user.mockScore}/10</div>
              <div className="text-xs text-[#78716C] mt-1">Mock Interview</div>
            </div>
          </div>

          {/* Placement Goals */}
          <div className="bg-white border border-[#E7E5E4] rounded-[20px] p-6 shadow-sm">
            <h3 className="font-bold font-display text-[#1C1917] mb-4 flex items-center gap-2">
              🎯 Placement Targets & Goals
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1 text-[#78716C]">
                  <span>Target Company Match (Amazon)</span>
                  <span className="font-bold text-[#1C1917]">78%</span>
                </div>
                <div className="h-2 bg-[#E7E5E4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F766E]" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1 text-[#78716C]">
                  <span>Target Company Match (Google)</span>
                  <span className="font-bold text-[#1C1917]">65%</span>
                </div>
                <div className="h-2 bg-[#E7E5E4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F766E]" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1 text-[#78716C]">
                  <span>Resume (ATS Score)</span>
                  <span className="font-bold text-[#1C1917]">85%</span>
                </div>
                <div className="h-2 bg-[#E7E5E4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F766E]" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white border border-[#E7E5E4] rounded-[20px] p-6 shadow-sm">
            <h3 className="font-bold font-display text-[#1C1917] mb-3">🏆 Achievements</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#FAFAF9] rounded-xl border border-[#E7E5E4] flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="font-bold text-sm text-[#1C1917]">Streak Master</div>
                  <div className="text-xs text-[#78716C]">12 Days Active Prep</div>
                </div>
              </div>
              <div className="p-3 bg-[#FAFAF9] rounded-xl border border-[#E7E5E4] flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <div className="font-bold text-sm text-[#1C1917]">Problem Solver</div>
                  <div className="text-xs text-[#78716C]">Solved 10+ Hard Problems</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
