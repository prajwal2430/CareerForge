import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft, FiCheckCircle } from 'react-icons/fi';
import { MOCK_DATA } from '../data/mockData';
import Tabs from '../components/ui/Tabs';
import GlassCard from '../components/ui/GlassCard';

const CompanyDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('oa');
  const [openFaq, setOpenFaq] = useState(null);
  
  const company = MOCK_DATA.companies.find(c => c.id === id) || MOCK_DATA.companies[0];
  
  const tabs = [
    { id: 'oa', label: 'Online Assessment' },
    { id: 'experiences', label: 'Interview Experiences' },
    { id: 'faqs', label: 'FAQs' }
  ];

  return (
    <div className="pb-12 max-w-5xl mx-auto">
      <Link to="/companies" className="inline-flex items-center gap-2 text-sm text-[#78716C] hover:text-[#0F766E] mb-6 transition-colors">
        <FiChevronLeft /> Back to Companies
      </Link>
      
      <div className="bg-white border border-[#E7E5E4] p-8 rounded-2xl mb-8 flex items-center gap-6 shadow-sm">
        <div className="w-24 h-24 rounded-2xl bg-[#F0FDFA] border border-[#0F766E]/20 text-[#0F766E] flex items-center justify-center font-black text-4xl shadow-sm">
          {company.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#1C1917] mb-2">{company.name} Preparation</h1>
          <p className="text-[#78716C]">Targeted practice questions and interview experiences for {company.name}.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E7E5E4] rounded-2xl shadow-sm overflow-hidden">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="p-4 border-b border-[#E7E5E4]" />
        
        <div className="p-6">
          {activeTab === 'oa' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4 text-[#1C1917]">Frequently Asked OA Questions</h3>
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex items-center justify-between p-4 bg-[#FAFAF9] rounded-xl border border-[#E7E5E4] hover:border-[#0F766E] transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <FiCheckCircle className="text-[#0F766E]" />
                    <div>
                      <h4 className="font-medium text-[#1C1917] hover:text-[#0F766E] transition-colors">{company.name} Specific Problem {num}</h4>
                      <p className="text-xs text-[#78716C] mt-1">Asked in 2025 • Array, Hash Table</p>
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm border-[#E7E5E4] text-[#1C1917] hover:bg-[#F0FDFA] hover:text-[#0F766E] hover:border-[#0F766E]">Solve</button>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'experiences' && (
            <div className="space-y-6">
              {[
                { author: 'Siddharth Roy', role: 'SDE Intern', date: 'Jan 2025', text: `Online assessment for ${company.name} had 2 coding problems (Medium difficulty, focused on Graphs and Trie). Technical interviews had 3 rounds: Round 1 DSA (DP & Binary Tree), Round 2 LLD (Design a parking lot), and Round 3 HM (Managerial).` },
                { author: 'Neha Gupta', role: 'Full Time SDE', date: 'Nov 2024', text: `Applied off-campus to ${company.name}. Resume was shortlisted via referral. OA was challenging, with 3 questions. Tech rounds focused heavily on system design and clean code principles. Highly recommend mastering tree traversals and database optimization.` }
              ].map((exp, idx) => (
                <div key={idx} className="p-5 bg-[#FAFAF9] rounded-xl border border-[#E7E5E4]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-[#1C1917] text-sm">{exp.author} ({exp.role})</span>
                    <span className="text-xs text-[#78716C]">{exp.date}</span>
                  </div>
                  <p className="text-sm text-[#44403C] leading-relaxed">{exp.text}</p>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'faqs' && (
            <div className="space-y-3">
              {[
                { q: `What is the recruitment process for ${company.name}?`, a: `The typical process for ${company.name} consists of a resume screening, an online coding assessment (2-3 questions), followed by 3-4 rounds of technical and behavioral interviews.` },
                { q: `Are there specific topics ${company.name} focuses on?`, a: 'Yes, they focus heavily on Data Structures & Algorithms (Trees, Graphs, Dynamic Programming), Object-Oriented Design, and System Architecture.' },
                { q: `What is the difficulty level of the coding questions at ${company.name}?`, a: 'Coding questions generally range from Medium to Hard Leetcode equivalents. Prioritizing array manipulations, graph traversals, and dynamic programming is recommended.' }
              ].map((faq, idx) => (
                <div key={idx} className="border border-[#E7E5E4] rounded-lg overflow-hidden">
                  <div 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="p-4 bg-[#FAFAF9] font-semibold text-[#1C1917] flex justify-between items-center cursor-pointer hover:bg-[#F0FDFA] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#0F766E]">{openFaq === idx ? '▲' : '▼'}</span>
                  </div>
                  {openFaq === idx && (
                    <div className="p-4 text-sm text-[#44403C] bg-white border-t border-[#E7E5E4]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
