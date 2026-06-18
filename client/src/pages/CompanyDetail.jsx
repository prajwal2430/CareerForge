import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft, FiCheckCircle } from 'react-icons/fi';
import { MOCK_DATA } from '../data/mockData';
import Tabs from '../components/ui/Tabs';
import GlassCard from '../components/ui/GlassCard';

const CompanyDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('oa');
  
  const company = MOCK_DATA.companies.find(c => c.id === id) || MOCK_DATA.companies[0];
  
  const tabs = [
    { id: 'oa', label: 'Online Assessment' },
    { id: 'experiences', label: 'Interview Experiences' },
    { id: 'faqs', label: 'FAQs' }
  ];

  return (
    <div className="pb-12 max-w-5xl mx-auto">
      <Link to="/companies" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white mb-6 transition-colors">
        <FiChevronLeft /> Back to Companies
      </Link>
      
      <div className="glass-card-accent p-8 rounded-2xl mb-8 flex items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-surface-2 border border-glass-border flex items-center justify-center font-black text-4xl shadow-lg">
          {company.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{company.name} Preparation</h1>
          <p className="text-text-muted">Targeted practice questions and interview experiences for {company.name}.</p>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="p-4 border-b border-glass-border" />
        
        <div className="p-6">
          {activeTab === 'oa' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4">Frequently Asked OA Questions</h3>
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex items-center justify-between p-4 bg-surface-2 rounded-lg border border-glass-border hover:border-accent-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <FiCheckCircle className="text-text-muted" />
                    <div>
                      <h4 className="font-medium text-white hover:text-accent-primary transition-colors">{company.name} Specific Problem {num}</h4>
                      <p className="text-xs text-text-muted mt-1">Asked in 2025 • Array, Hash Table</p>
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm">Solve</button>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'experiences' && (
            <div className="text-center text-text-muted py-12">
              Interview experiences coming soon.
            </div>
          )}
          
          {activeTab === 'faqs' && (
            <div className="text-center text-text-muted py-12">
              FAQs coming soon.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default CompanyDetail;
