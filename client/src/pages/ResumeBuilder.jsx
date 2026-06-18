import React, { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { FiDownload, FiEdit3, FiFileText } from 'react-icons/fi';

const ResumeBuilder = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '2rem',
      paddingBottom: '3rem',
      minHeight: 'calc(100vh - 120px)'
    }}>
      {/* Editor Side */}
      <div style={{
        flex: '1 1 450px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#1E1E1E', margin: 0 }}>
            Resume Builder
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Create an ATS-friendly resume for tech roles.
          </p>
        </div>

        <GlassCard style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#1E1E1E', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiEdit3 /> Personal Information
            </h3>
            <button style={{ background: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <input type="text" placeholder="Full Name" className="form-input" defaultValue="John Doe" />
            <input type="email" placeholder="Email" className="form-input" defaultValue="john@example.com" />
            <input type="tel" placeholder="Phone" className="form-input" defaultValue="+1 234 567 890" />
            <input type="text" placeholder="LinkedIn URL" className="form-input" defaultValue="linkedin.com/in/johndoe" />
          </div>
        </GlassCard>

        <GlassCard style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#1E1E1E', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiFileText /> Experience
            </h3>
            <button style={{ background: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>+ Add</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              background: '#F9FAFB',
              borderRadius: '12px',
              border: '1px solid var(--gray-200)'
            }}>
              <input type="text" placeholder="Role" className="form-input" style={{ width: '100%', marginBottom: '0.5rem', fontWeight: 'bold' }} defaultValue="Software Engineering Intern" />
              <input type="text" placeholder="Company" className="form-input" style={{ width: '100%', marginBottom: '0.5rem' }} defaultValue="Google" />
              <textarea className="form-input" style={{ width: '100%', minHeight: '80px', fontFamily: 'var(--font-body)' }} placeholder="Description..." defaultValue="• Developed a new feature...&#10;• Improved performance by 20%..."></textarea>
            </div>
          </div>
        </GlassCard>

        <GlassCard style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#1E1E1E', marginBottom: '1.25rem', marginTop: 0 }}>Skills Analyzer</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '4px solid var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: 'var(--color-success)',
              fontSize: '1.1rem',
              flexShrink: 0
            }}>
              85%
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                ATS Score Match for <strong style={{ color: '#1E1E1E' }}>Software Engineer</strong> role.
              </p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--color-warning)', fontWeight: 600 }}>
                Suggestion: Add "Docker" and "Kubernetes"
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Preview Side */}
      <div style={{
        flex: '1 1 450px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '500px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Live Preview</h3>
          <button className="btn btn-primary btn-sm" style={{ borderRadius: '20px' }}>
            <FiDownload /> Export PDF
          </button>
        </div>
        
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
          border: '1px solid var(--gray-200)',
          padding: '2.5rem',
          color: 'black',
          fontFamily: 'Georgia, serif'
        }}>
           {/* Mock Resume Rendering */}
           <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
             <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.25rem 0' }}>John Doe</h1>
             <div style={{ fontSize: '0.8rem', color: '#4B5563', display: 'flex', justifyContent: 'center', gap: '10px' }}>
               <span>john@example.com</span>
               <span>•</span>
               <span>+1 234 567 890</span>
               <span>•</span>
               <span>linkedin.com/in/johndoe</span>
             </div>
           </div>
           
           <div style={{ marginBottom: '1.5rem' }}>
             <h2 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#1F2937', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB', paddingBottom: '2px', marginBottom: '0.5rem' }}>Experience</h2>
             <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.9rem' }}>
                 <span>Software Engineering Intern</span>
                 <span style={{ fontWeight: 'normal', fontSize: '0.8rem', color: '#6B7280' }}>June 2024 - Aug 2024</span>
               </div>
               <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#4B5563', marginBottom: '0.25rem' }}>Google</div>
               <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#374151', margin: 0 }}>
                 <li style={{ marginBottom: '3px' }}>Developed a new feature that increased user engagement by 15%.</li>
                 <li style={{ marginBottom: '3px' }}>Improved application performance by 20% through code optimization.</li>
                 <li>Collaborated with cross-functional teams using Agile methodologies.</li>
               </ul>
             </div>
           </div>

           <div>
             <h2 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#1F2937', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB', paddingBottom: '2px', marginBottom: '0.5rem' }}>Education</h2>
             <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.9rem' }}>
                 <span>Bachelor of Technology in Computer Science</span>
                 <span style={{ fontWeight: 'normal', fontSize: '0.8rem', color: '#6B7280' }}>2021 - 2025</span>
               </div>
               <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#4B5563' }}>XYZ University</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
