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
          className="bg-[#111827] border border-[#263248] rounded-[20px] p-5 cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(124,58,237,0.25)] hover:border-[#7C3AED] transition-all group flex flex-col h-full relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-4">
             <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${
                  problem.difficulty === 'Easy' ? 'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20' : 
                  problem.difficulty === 'Medium' ? 'bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20' : 
                  'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
                }`}>
                  {problem.difficulty}
                </span>
                
                {problem.status === 'solved' && (
                   <span className="flex items-center gap-1 text-[11px] font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full">
                      <FiCheckCircle /> Solved
                   </span>
                )}
                {problem.status === 'attempted' && (
                   <span className="flex items-center gap-1 text-[11px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-full">
                      <FiClock /> Attempted
                   </span>
                )}
             </div>
             
             <div className="text-[#94A3B8] font-mono text-[11px] font-medium bg-[#151D2F] px-2 py-1 rounded-md">
                Acc: {problem.acceptance}
             </div>
          </div>
          
          <h3 className="text-[16px] font-bold text-[#F8FAFC] group-hover:text-[#7C3AED] transition-colors mb-4 line-clamp-2">
            {problem.id}. {problem.title}
          </h3>
          
          <div className="flex-1" />
          
          <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#263248]">
             <div className="flex gap-1.5 flex-wrap">
               {problem.tags.slice(0, 2).map(tag => (
                 <span key={tag} className="text-[10px] font-semibold text-[#CBD5E1] bg-[#151D2F] px-2 py-1 rounded-full">
                   {tag}
                 </span>
               ))}
               {problem.tags.length > 2 && (
                 <span className="text-[10px] font-bold text-[#94A3B8] bg-[#151D2F] px-2 py-1 rounded-full">+{problem.tags.length - 2}</span>
               )}
             </div>
             
             <button className="w-8 h-8 rounded-full bg-[#151D2F] text-[#CBD5E1] flex items-center justify-center group-hover:bg-[#7C3AED] group-hover:text-white transition-colors border border-[#263248] group-hover:border-transparent">
               <FiChevronRight />
             </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProblemTable;
