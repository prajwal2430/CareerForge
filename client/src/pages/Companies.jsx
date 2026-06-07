import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_DATA } from '../data/mockData';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { FiBriefcase, FiDollarSign } from 'react-icons/fi';

const Companies = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Company Preparation</h1>
        <p className="text-text-muted">Targeted preparation for top tech companies.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_DATA.companies.map((company) => (
          <GlassCard 
            key={company.id} 
            className="cursor-pointer hover:border-accent-primary/50 transition-colors"
            onClick={() => navigate(`/companies/${company.id}`)}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-xl bg-surface-2 border border-glass-border flex items-center justify-center font-black text-2xl" style={{ color: company.color || 'var(--text-primary)' }}>
                {company.name.charAt(0)}
              </div>
              <Badge variant={company.difficulty.toLowerCase()}>{company.difficulty}</Badge>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-4">{company.name}</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <FiBriefcase className="text-accent-secondary" />
                <div className="flex gap-1 flex-wrap">
                  {company.roles.map((role, idx) => (
                    <span key={idx} className="bg-surface-2 px-2 py-0.5 rounded text-xs">{role}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <FiDollarSign className="text-color-success" />
                <span className="font-medium text-color-success">{company.package}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Companies;
