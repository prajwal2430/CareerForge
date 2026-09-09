import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiChevronRight } from 'react-icons/fi';

const ProblemTable = ({ problems }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {problems.map((problem) => (
        <div 
          key={problem.id} 
          onClick={() => navigate(`/practice/${problem.id}`)}
          className="bg-white border border-[#E7E5E4] rounded-[20px] p-5 cursor-pointer hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(15,118,110,0.08)] hover:border-[#0F766E] transition-all group flex flex-col h-full relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-4">
             <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${
                  problem.difficulty === 'Easy' ? 'bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1]' : 
                  problem.difficulty === 'Medium' ? 'bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1]' : 
                  'bg-[#FFF1F0] text-[#EA6250] border border-[#FFE4E1]'
                }`}>
                  {problem.difficulty}
                </span>
                
                {problem.status === 'solved' && (
                   <span className="flex items-center gap-1 text-[11px] font-bold text-[#0F766E] bg-[#F0FDFA] border border-[#CCFBF1] px-2.5 py-1 rounded-full">
                      <FiCheckCircle /> Solved
                   </span>
                )}
                {problem.status === 'attempted' && (
                   <span className="flex items-center gap-1 text-[11px] font-bold text-[#EA6250] bg-[#FFF1F0] border border-[#FFE4E1] px-2.5 py-1 rounded-full">
                      <FiClock /> Attempted
                   </span>
                )}
             </div>
             
             <div className="text-[#78716C] font-mono text-[11px] font-medium bg-[#FAFAF9] border border-[#E7E5E4] px-2 py-1 rounded-md">
                Acc: {problem.acceptance}
             </div>
          </div>
          
          <h3 className="text-[16px] font-bold text-[#1C1917] group-hover:text-[#0F766E] transition-colors mb-4 line-clamp-2">
            {problem.id}. {problem.title}
          </h3>
          
          <div className="flex-1" />
          
          <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#E7E5E4]">
             <div className="flex gap-1.5 flex-wrap">
               {problem.tags.slice(0, 2).map(tag => (
                 <span key={tag} className="text-[10px] font-semibold text-[#78716C] bg-[#FAFAF9] border border-[#E7E5E4] px-2 py-1 rounded-full">
                   {tag}
                 </span>
               ))}
               {problem.tags.length > 2 && (
                 <span className="text-[10px] font-bold text-[#A8A29E] bg-[#FAFAF9] border border-[#E7E5E4] px-2 py-1 rounded-full">+{problem.tags.length - 2}</span>
               )}
             </div>
             
             <button className="w-8 h-8 rounded-full bg-[#FAFAF9] text-[#78716C] flex items-center justify-center group-hover:bg-[#0F766E] group-hover:text-white transition-colors border border-[#E7E5E4] group-hover:border-transparent cursor-pointer">
               <FiChevronRight />
             </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProblemTable;
