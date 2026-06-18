import React, { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { FiDownload, FiEdit3, FiFileText } from 'react-icons/fi';

const ResumeBuilder = () => {
  return (
    <div className="pb-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">
      {/* Editor Side */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 overflow-y-auto pr-2 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resume Builder</h1>
          <p className="text-text-muted">Create an ATS-friendly resume for tech roles.</p>
        </div>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2"><FiEdit3 /> Personal Information</h3>
            <button className="text-xs text-accent-primary">Edit</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" className="form-input" defaultValue="John Doe" />
            <input type="email" placeholder="Email" className="form-input" defaultValue="john@example.com" />
            <input type="tel" placeholder="Phone" className="form-input" defaultValue="+1 234 567 890" />
            <input type="text" placeholder="LinkedIn URL" className="form-input" defaultValue="linkedin.com/in/johndoe" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2"><FiFileText /> Experience</h3>
            <button className="text-xs text-accent-primary">+ Add</button>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-surface-2 rounded-lg border border-glass-border">
              <input type="text" placeholder="Role" className="form-input w-full mb-2 bg-transparent border-none p-0 focus:ring-0 text-white font-bold" defaultValue="Software Engineering Intern" />
              <input type="text" placeholder="Company" className="form-input w-full mb-2 bg-transparent border-none p-0 focus:ring-0 text-text-secondary text-sm" defaultValue="Google" />
              <textarea className="form-input w-full bg-transparent border-none p-0 focus:ring-0 text-sm min-h-[60px]" placeholder="Description..." defaultValue="• Developed a new feature...\n• Improved performance by 20%..."></textarea>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-bold mb-4">Skills Analyzer</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-color-success flex items-center justify-center font-bold text-xl text-color-success">
              85%
            </div>
            <div>
              <p className="text-sm text-text-muted">ATS Score Match for <span className="text-white font-semibold">Software Engineer</span> role.</p>
              <p className="text-xs text-color-warning mt-1">Suggestion: Add "Docker" and "Kubernetes"</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Preview Side */}
      <div className="w-full lg:w-1/2 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-text-muted uppercase tracking-wider text-sm">Live Preview</h3>
          <button className="btn btn-primary btn-sm flex items-center gap-2">
            <FiDownload /> Export PDF
          </button>
        </div>
        
        <div className="flex-1 bg-white rounded-lg shadow-2xl p-8 overflow-y-auto text-black font-serif">
           {/* Mock Resume Rendering */}
           <div className="text-center mb-6 border-b border-gray-300 pb-4">
             <h1 className="text-3xl font-bold text-gray-900 mb-1">John Doe</h1>
             <div className="text-sm text-gray-600 flex justify-center gap-4">
               <span>john@example.com</span>
               <span>•</span>
               <span>+1 234 567 890</span>
               <span>•</span>
               <span>linkedin.com/in/johndoe</span>
             </div>
           </div>
           
           <div className="mb-6">
             <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-300 mb-2">Experience</h2>
             <div className="mb-4">
               <div className="flex justify-between items-baseline font-bold">
                 <span>Software Engineering Intern</span>
                 <span className="text-sm font-normal text-gray-600">June 2024 - Aug 2024</span>
               </div>
               <div className="italic text-gray-700 mb-2">Google</div>
               <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                 <li>Developed a new feature that increased user engagement by 15%.</li>
                 <li>Improved application performance by 20% through code optimization.</li>
                 <li>Collaborated with cross-functional teams using Agile methodologies.</li>
               </ul>
             </div>
           </div>

           <div className="mb-6">
             <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-300 mb-2">Education</h2>
             <div className="mb-4">
               <div className="flex justify-between items-baseline font-bold">
                 <span>Bachelor of Technology in Computer Science</span>
                 <span className="text-sm font-normal text-gray-600">2021 - 2025</span>
               </div>
               <div className="italic text-gray-700">XYZ University</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
