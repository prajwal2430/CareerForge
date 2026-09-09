import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import GlassCard from '../components/ui/GlassCard';
import { FiBriefcase, FiDollarSign, FiMapPin, FiChevronRight, FiSearch } from 'react-icons/fi';

const Companies = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-12 max-w-[1400px] mx-auto px-4 md:px-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1C1917] mb-2">Company Preparation</h1>
          <p className="text-[#78716C]">Targeted preparation and roles for top tech companies.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="form-input-icon flex-1 md:w-[300px]">
             <FiSearch className="input-icon text-[#78716C]" />
             <input type="text" className="form-input bg-white border-[#E7E5E4] text-[#1C1917] focus:border-[#0F766E]" placeholder="Search companies or roles..." />
          </div>
          <select className="form-input bg-white border-[#E7E5E4] text-[#1C1917] focus:border-[#0F766E] w-[150px] hidden sm:block">
            <option>All Types</option>
            <option>Full-time</option>
            <option>Internship</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_DATA.companies.map((company) => (
          <div 
            key={company.id} 
            className="bg-white border border-[#E7E5E4] rounded-[16px] p-5 flex flex-col h-full cursor-pointer group shadow-sm hover:shadow-md hover:border-[#0F766E] transition-all"
            onClick={() => navigate(`/companies/${company.id}`)}
          >
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-[14px] bg-[#F0FDFA] border border-[#0F766E]/20 text-[#0F766E] flex items-center justify-center font-display font-bold text-2xl shadow-sm group-hover:scale-105 transition-transform">
                   {company.name.charAt(0)}
                 </div>
                 <div>
                    <h3 className="text-lg font-bold font-display text-[#1C1917] flex items-center gap-1.5 group-hover:text-[#0F766E] transition-colors">{company.name}</h3>
                    <div className="flex items-center gap-1 text-[12px] text-[#78716C]">
                      <FiMapPin size={12} /> {company.roles?.includes('Remote') ? 'Remote Available' : 'Multiple Locations'}
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl p-3">
                 <h4 className="text-[13px] font-bold text-[#1C1917] mb-2 line-clamp-1">{company.roles[0] || 'Software Engineer'}</h4>
                 <div className="flex flex-wrap gap-1.5">
                   {company.roles.slice(0,2).map((role, idx) => (
                     <span key={idx} className="bg-[#F0FDFA] border border-[#0F766E]/20 text-[#0F766E] px-2 py-0.5 rounded-full text-[11px] font-semibold">{role}</span>
                   ))}
                   {company.roles.length > 2 && <span className="text-[11px] text-[#78716C] font-semibold px-1">+{company.roles.length - 2}</span>}
                 </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E7E5E4] flex items-center justify-between">
               <div className="flex items-center gap-1.5 text-sm">
                 <div className="w-6 h-6 rounded-full bg-[#F0FDFA] flex items-center justify-center">
                    <FiDollarSign size={12} className="text-[#0F766E]" />
                 </div>
                 <span className="font-bold text-[#1C1917] text-[13px]">{company.package}</span>
               </div>
               
               <button className="flex items-center gap-1 text-[13px] font-semibold text-[#0F766E] group-hover:text-[#115E59] transition-colors bg-transparent border-none p-0 cursor-pointer">
                 View Prep <FiChevronRight />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies;
