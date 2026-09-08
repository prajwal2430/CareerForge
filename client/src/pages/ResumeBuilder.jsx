import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import { FiDownload, FiEdit3, FiFileText, FiPlus, FiBriefcase, FiAward, FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ResumeBuilder = () => {
  return (
    <div className="pb-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 h-auto lg:h-[calc(100vh-100px)]">
      
      {/* Editor Side */}
      <div className="w-full lg:w-[45%] flex flex-col gap-6 overflow-y-auto pr-2 pb-8 scrollbar-hide">
        <div className="mb-2">
          <h1 className="text-3xl font-display font-bold text-[#F8FAFC] mb-2">Resume Builder</h1>
          <p className="text-[#94A3B8]">Craft a professional ATS-friendly resume for top tech roles.</p>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-[#7C3AED]/20 to-[#06B6D4]/10 border border-[#7C3AED]/30 rounded-[20px] p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
           <div className="relative w-24 h-24 flex-shrink-0">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" className="stroke-[#263248]" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="42" className="stroke-[#06B6D4]" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="40" style={{ animation: 'progressLoad 1s ease-out forwards' }} />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-xl font-bold font-display text-[#F8FAFC] opacity-0" style={{ animation: 'fadeIn 0.5s ease-out 0.3s forwards' }}>85%</span>
             </div>
           </div>
           <div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-1">ATS Match Score</h3>
              <p className="text-sm text-[#CBD5E1] leading-relaxed mb-3">Great fit for <strong className="text-[#F8FAFC]">Software Engineer</strong> roles.</p>
              <div className="flex items-start gap-2 bg-[#151D2F] border border-[#263248] p-3 rounded-xl border-l-[3px] border-l-[#F59E0B]">
                <FiSettings className="text-[#F59E0B] mt-0.5 shrink-0" />
                <p className="text-[12px] text-[#94A3B8]">Suggestion: Add <strong className="text-[#CBD5E1]">"Docker"</strong> and <strong className="text-[#CBD5E1]">"Kubernetes"</strong></p>
              </div>
           </div>
        </div>

        {/* Personal Info */}
        <GlassCard className="!p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#263248]">
            <h3 className="font-bold font-display text-[#F8FAFC] flex items-center gap-2">
               <div className="p-2 bg-[#7C3AED]/20 rounded-lg text-[#7C3AED]"><FiEdit3 size={16} /></div> 
               Personal Data
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group mb-0">
              <label className="form-label text-[12px]">Full Name</label>
              <input type="text" className="form-input" defaultValue="John Doe" />
            </div>
            <div className="form-group mb-0">
              <label className="form-label text-[12px]">Email</label>
              <input type="email" className="form-input" defaultValue="john@example.com" />
            </div>
            <div className="form-group mb-0">
              <label className="form-label text-[12px]">Phone</label>
              <input type="tel" className="form-input" defaultValue="+1 234 567 890" />
            </div>
            <div className="form-group mb-0">
              <label className="form-label text-[12px]">LinkedIn</label>
              <input type="text" className="form-input" defaultValue="linkedin.com/in/johndoe" />
            </div>
          </div>
        </GlassCard>

        {/* Experience */}
        <GlassCard className="!p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#263248]">
            <h3 className="font-bold font-display text-[#F8FAFC] flex items-center gap-2">
               <div className="p-2 bg-[#06B6D4]/20 rounded-lg text-[#06B6D4]"><FiBriefcase size={16} /></div> 
               Experience
            </h3>
            <button className="btn btn-secondary btn-sm rounded-full text-xs hover:!translate-y-0 h-auto py-1.5"><FiPlus size={14} /> Add Role</button>
          </div>
          
          <div className="bg-[#0B1020] border border-[#263248] rounded-[16px] p-5 relative group">
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-[#94A3B8] hover:text-[#EF4444] text-xs">Remove</button>
             </div>
             <input type="text" placeholder="Job Title" className="w-full bg-transparent border-none text-[#F8FAFC] font-bold text-[16px] focus:outline-none mb-1 placeholder:text-[#475569]" defaultValue="Software Engineering Intern" />
             <div className="flex items-center gap-2 mb-3">
               <input type="text" placeholder="Company" className="w-[120px] bg-transparent border-none text-[13px] text-[#06B6D4] font-medium focus:outline-none placeholder:text-[#475569]" defaultValue="Google" />
               <span className="text-[#475569]">•</span>
               <input type="text" placeholder="Dates" className="w-[120px] bg-transparent border-none text-[13px] text-[#94A3B8] focus:outline-none placeholder:text-[#475569]" defaultValue="June 2024 - Aug 2024" />
             </div>
             <textarea className="w-full bg-transparent border-none text-[#CBD5E1] text-[13.5px] leading-relaxed focus:outline-none resize-none placeholder:text-[#475569] min-h-[80px]" defaultValue="• Developed a new feature that increased user engagement...&#10;• Improved performance by 20% by refactoring core modules." />
          </div>
        </GlassCard>
      </div>

      {/* Preview Side */}
      <div className="w-full lg:w-[55%] flex flex-col h-full bg-[#111827] border border-[#263248] rounded-[24px] p-6 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#263248] shrink-0">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <h3 className="font-bold text-[#CBD5E1] uppercase tracking-wider text-[12px] font-display">Live Preview</h3>
          </div>
          <button className="btn btn-primary h-auto py-2.5 px-5 text-sm gap-2">
            <FiDownload size={16} /> Export PDF
          </button>
        </div>
        
        {/* Rendered Mock Resume Box */}
        <div className="flex-1 bg-[#F8FAFC] rounded-[12px] border border-[#CBD5E1] p-8 md:p-12 overflow-y-auto font-serif text-[#1E293B] shadow-[inset_0_4px_20px_rgba(0,0,0,0.05)]">
           <div className="text-center mb-7 border-b-2 border-[#94A3B8] pb-5">
             <h1 className="text-4xl font-bold font-sans text-[#0F172A] mb-2 tracking-tight">John Doe</h1>
             <div className="text-[13px] text-[#334155] flex flex-wrap justify-center items-center gap-x-3 gap-y-1 font-sans">
               <span className="hover:text-[#2563EB] cursor-pointer">john@example.com</span>
               <span className="text-[#94A3B8]">•</span>
               <span>+1 234 567 890</span>
               <span className="text-[#94A3B8]">•</span>
               <span className="hover:text-[#2563EB] cursor-pointer">linkedin.com/in/johndoe</span>
             </div>
           </div>
           
           <div className="mb-6">
             <h2 className="text-[14px] font-bold text-[#0F172A] uppercase border-b border-[#CBD5E1] pb-1 mb-3 font-sans tracking-widest text-[#2563EB]">Experience</h2>
             <div className="mb-4">
               <div className="flex justify-between items-baseline mb-0.5">
                 <span className="font-bold text-[15px] font-sans">Software Engineering Intern</span>
                 <span className="text-[12px] font-medium text-[#475569] font-sans">June 2024 - Aug 2024</span>
               </div>
               <div className="italic text-[#334155] text-[14px] mb-2">Google</div>
               <ul className="list-disc pl-5 text-[14px] text-[#334155] space-y-1.5 leading-relaxed">
                 <li>Developed a new feature that increased user engagement by 15%.</li>
                 <li>Improved application performance by 20% through code optimization.</li>
                 <li>Collaborated with cross-functional teams using Agile methodologies.</li>
               </ul>
             </div>
           </div>

           <div className="mb-6">
             <h2 className="text-[14px] font-bold text-[#0F172A] uppercase border-b border-[#CBD5E1] pb-1 mb-3 font-sans tracking-widest text-[#2563EB]">Education</h2>
             <div className="mb-4">
               <div className="flex justify-between items-baseline mb-0.5">
                 <span className="font-bold text-[15px] font-sans">Bachelor of Technology</span>
                 <span className="text-[12px] font-medium text-[#475569] font-sans">2021 - 2025</span>
               </div>
               <div className="italic text-[#334155] text-[14px]">Computer Science • XYZ University</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
