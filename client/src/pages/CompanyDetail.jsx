import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiCheckCircle } from 'react-icons/fi';
import { MOCK_DATA } from '../data/mockData';
import { PROBLEMS } from '../data/problemsData';
import { INTERVIEW_EXPERIENCES } from '../data/experiencesData';
import Tabs from '../components/ui/Tabs';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('oa');
  const [expandedExp, setExpandedExp] = useState(null);
  
  const company = MOCK_DATA.companies.find(c => c.id === id) || MOCK_DATA.companies[0];
  
  const tabs = [
    { id: 'oa', label: 'Online Assessment' },
    { id: 'experiences', label: 'Interview Experiences' },
    { id: 'faqs', label: 'FAQs' }
  ];

  // Dynamic filtered questions asked by this specific company
  const companyProblems = PROBLEMS.filter(p => p.companies && p.companies.includes(company.id));

  // Dynamic filtered experiences
  const companyExperiences = INTERVIEW_EXPERIENCES.filter(exp => exp.companyId === company.id);

  // Dynamic FAQs
  const faqs = [
    { q: `How should I prepare for the ${company.name} technical interview?`, a: `Focus heavily on standard algorithms (trees, dynamic programming, graphs) for coding rounds. For ${company.name}, you should also practice past online assessment (OA) questions which are available on our platform.` },
    { q: `What is the difficulty of interviews at ${company.name}?`, a: `Usually graded as ${company.difficulty}. Coding rounds require high optimization, clear code writing, and articulating your design decisions under constraints.` },
    { q: `What is the average compensation package at ${company.name}?`, a: `The typical package is ${company.package} depending on your role, experience level, and location.` }
  ];

  return (
    <div className="pb-12 max-w-5xl mx-auto" style={{ paddingBottom: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/companies" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white mb-6 transition-colors" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        <FiChevronLeft /> Back to Companies
      </Link>
      
      <div className="glass-card-accent p-8 rounded-2xl mb-8 flex items-center gap-6" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }}>
        <div className="w-24 h-24 rounded-2xl bg-surface-2 border border-glass-border flex items-center justify-center font-black text-4xl shadow-lg" style={{ width: '6rem', height: '6rem', borderRadius: '16px', background: 'var(--bg-input)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 900, fontSize: '2.25rem', color: 'var(--accent-primary)', boxShadow: 'var(--shadow-md)' }}>
          {company.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', margin: '0 0 0.5rem 0' }}>{company.name} Preparation</h1>
          <p className="text-text-muted" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Targeted practice questions and interview experiences for {company.name}.</p>
        </div>
      </div>

      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }} />
        
        <div style={{ padding: '1.5rem' }}>
          {activeTab === 'oa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: 'white', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>
                Frequently Asked OA Questions ({companyProblems.length})
              </h3>
              
              {companyProblems.length > 0 ? (
                companyProblems.map((problem) => (
                  <div 
                    key={problem.id} 
                    onClick={() => navigate(`/practice/${problem.id}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: 'var(--bg-input)',
                      borderRadius: '12px',
                      border: '1px solid var(--glass-border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    className="problem-row-hover hover-border-primary"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <FiCheckCircle style={{ 
                        color: problem.status === 'solved' ? 'var(--color-success)' : 'var(--text-muted)',
                        fontSize: '1.2rem',
                        flexShrink: 0
                      }} />
                      <div>
                        <h4 style={{ fontWeight: 600, color: 'white', margin: 0, fontSize: '0.95rem' }}>
                          {problem.id}. {problem.title}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                          <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• Acceptance: {problem.acceptance}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {problem.tags.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: '16px', padding: '0.4rem 1rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/practice/${problem.id}`);
                      }}
                    >
                      Solve
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                  No questions found for this company.
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'experiences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: 'white', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>
                Interview Experiences ({companyExperiences.length})
              </h3>
              {companyExperiences.length > 0 ? (
                companyExperiences.map((exp) => {
                  const isExpanded = expandedExp === exp.id;
                  return (
                    <div 
                      key={exp.id}
                      style={{
                        background: 'var(--bg-input)',
                        borderRadius: '16px',
                        border: '1px solid var(--glass-border)',
                        padding: '1.5rem',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div 
                        onClick={() => setExpandedExp(isExpanded ? null : exp.id)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          cursor: 'pointer',
                          gap: '1rem',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontWeight: 700, color: 'white', margin: 0, fontSize: '1.05rem', fontFamily: "'Poppins', sans-serif" }}>
                            {exp.title}
                          </h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Shared by {exp.author} • {exp.role} • {exp.date}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <Badge variant={exp.difficulty.toLowerCase()}>{exp.difficulty}</Badge>
                          <Badge variant={exp.verdict === 'Accepted' ? 'success' : 'danger'}>{exp.verdict}</Badge>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
                            {isExpanded ? '▼' : '►'}
                          </span>
                        </div>
                      </div>
                      
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.75rem', marginBottom: 0, lineHeight: 1.5 }}>
                        {exp.summary}
                      </p>

                      {isExpanded && (
                        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)' }}>
                          <h5 style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Interview Rounds:</h5>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {exp.rounds.map((round, rIdx) => (
                              <div key={rIdx} style={{ background: 'rgba(255,255,255,0.01)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  Round {rIdx + 1}: {round.name}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                                  {round.detail}
                                </div>
                              </div>
                            ))}
                          </div>
                          {exp.tips && (
                            <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: '12px', background: 'var(--accent-primary-light)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                              <strong style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>💡 Key Tips for Candidates:</strong>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', lineHeight: 1.5 }}>
                                {exp.tips}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
                  No experiences found for this company.
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'faqs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: 'white', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>
                Frequently Asked Questions ({company.name})
              </h3>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    Q: {faq.q}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    A: {faq.a}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default CompanyDetail;
