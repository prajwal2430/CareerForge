import React, { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { FiSettings, FiBell, FiShield, FiSliders, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('teal');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="pb-12 max-w-4xl mx-auto px-4">
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-display font-bold text-[#1C1917] mb-2">Settings</h1>
        <p className="text-[#78716C]">Configure your placement workspace settings.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0F766E] text-white font-medium cursor-pointer shadow-sm">
            <FiSliders />
            <span>General Settings</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#78716C] hover:bg-[#F0FDFA] hover:text-[#0F766E] transition-all cursor-pointer" onClick={() => toast('Notification details coming soon!')}>
            <FiBell />
            <span>Notifications</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#78716C] hover:bg-[#F0FDFA] hover:text-[#0F766E] transition-all cursor-pointer" onClick={() => toast('Privacy settings coming soon!')}>
            <FiShield />
            <span>Privacy & Security</span>
          </div>
        </div>

        {/* Settings Forms */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-[#E7E5E4] rounded-[20px] p-6 shadow-sm">
            <h3 className="font-bold font-display text-[#1C1917] mb-4 flex items-center gap-2 border-b border-[#E7E5E4] pb-3">
              <FiSettings className="text-[#0F766E]" /> Preferences
            </h3>

            <div className="space-y-6">
              {/* Theme Settings */}
              <div>
                <label className="form-label mb-2 block text-[#1C1917] text-sm font-semibold">Brand Color Identity</label>
                <div className="flex gap-4">
                  <div 
                    onClick={() => setCurrentTheme('teal')}
                    className="flex-1 flex items-center justify-between p-3.5 rounded-xl border border-[#0F766E] bg-[#F0FDFA] text-[#0F766E] font-medium cursor-pointer transition-all"
                  >
                    <span>Deep Teal & Coral (Active)</span>
                    <FiCheck className="text-[#0F766E]" />
                  </div>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="flex items-center justify-between border-t border-[#E7E5E4] pt-4">
                <div>
                  <div className="font-bold text-[#1C1917] text-sm">Email Notifications</div>
                  <div className="text-xs text-[#78716C] mt-0.5">Receive daily tasks, rank updates, and company news.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications} 
                  onChange={(e) => setNotifications(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: '#0F766E', cursor: 'pointer' }}
                />
              </div>

              {/* Profile Privacy Toggles */}
              <div className="flex items-center justify-between border-t border-[#E7E5E4] pt-4">
                <div>
                  <div className="font-bold text-[#1C1917] text-sm">Public Profile Visibility</div>
                  <div className="text-xs text-[#78716C] mt-0.5">Allow recruiters and other students to search for you.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={profileVisible} 
                  onChange={(e) => setProfileVisible(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: '#0F766E', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E7E5E4] rounded-[20px] p-6 shadow-sm">
            <h3 className="font-bold font-display text-[#1C1917] mb-4 flex items-center gap-2 border-b border-[#E7E5E4] pb-3">
              🔑 Change Password
            </h3>
            
            <div className="space-y-4">
              <div className="form-group mb-0">
                <label className="form-label text-[#1C1917] text-xs">Current Password</label>
                <input type="password" placeholder="••••••••" className="form-input bg-[#FAFAF9] border-[#E7E5E4] text-[#1C1917] focus:border-[#0F766E]" />
              </div>
              <div className="form-group mb-0">
                <label className="form-label text-[#1C1917] text-xs">New Password</label>
                <input type="password" placeholder="••••••••" className="form-input bg-[#FAFAF9] border-[#E7E5E4] text-[#1C1917] focus:border-[#0F766E]" />
              </div>
              <div className="form-group mb-0">
                <label className="form-label text-[#1C1917] text-xs">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="form-input bg-[#FAFAF9] border-[#E7E5E4] text-[#1C1917] focus:border-[#0F766E]" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              Save Preferences
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
