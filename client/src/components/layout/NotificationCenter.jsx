import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Flame,
  Trophy,
  Target,
  Sparkles,
  BookOpen,
  Bot,
  X,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import api from '../../services/api';

const TYPE_CONFIG = {
  daily_learning: {
    icon: BookOpen,
    color: 'text-teal-700 bg-teal-50 border-teal-200',
    badge: 'Daily Focus',
  },
  incomplete_task: {
    icon: Target,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    badge: 'Pending Task',
  },
  learning_streak: {
    icon: Flame,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    badge: 'Streak Alert',
  },
  milestone_notification: {
    icon: Trophy,
    color: 'text-purple-700 bg-purple-50 border-purple-200',
    badge: 'Milestone',
  },
  assessment_reminder: {
    icon: Sparkles,
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    badge: 'Diagnostic',
  },
  interview_practice: {
    icon: Bot,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    badge: 'Interview Drill',
  },
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const now = new Date();
  const date = new Date(dateString);
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
};

const NotificationCenter = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ai/notifications?limit=15');
      if (res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unread_count || 0);
      }
    } catch (err) {
      // Gracefully handle offline / non-blocking network errors
      console.warn('Failed to load notifications:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 90 seconds for proactive reminders
    const interval = setInterval(fetchNotifications, 90000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDispatch = async () => {
    try {
      setDispatching(true);
      await api.post('/ai/notifications/dispatch');
      await fetchNotifications();
    } catch (err) {
      console.warn('Failed to trigger notification sweep:', err?.message);
    } finally {
      setDispatching(false);
    }
  };

  const handleMarkRead = async (notifId, e) => {
    e?.stopPropagation();
    try {
      await api.patch(`/ai/notifications/${notifId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notifId ? { ...n, status: 'read' } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Failed to mark notification read:', err?.message);
    }
  };

  const handleDismiss = async (notifId, e) => {
    e?.stopPropagation();
    try {
      await api.delete(`/ai/notifications/${notifId}`);
      const target = notifications.find((n) => n.notification_id === notifId);
      setNotifications((prev) => prev.filter((n) => n.notification_id !== notifId));
      if (target?.status === 'unread') {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.warn('Failed to dismiss notification:', err?.message);
    }
  };

  const handleActionClick = (notif) => {
    if (notif.status === 'unread') {
      handleMarkRead(notif.notification_id);
    }
    setIsOpen(false);
    if (notif.action_url) {
      navigate(notif.action_url);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2 rounded-full text-[#78716C] hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-colors duration-200 cursor-pointer"
        title="Notifications & Reminders"
        aria-label="Notifications"
      >
        <Bell size={18} strokeWidth={2} />
        {unreadCount > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#F97360] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : (
          notifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0F766E] rounded-full ring-2 ring-white" />
          )
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-[#E7E5E4] rounded-2xl shadow-[0_12px_36px_rgba(28,25,23,0.12)] overflow-hidden z-50 origin-top-right"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#FAFAF9] border-b border-[#E7E5E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1C1917]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={handleDispatch}
                disabled={dispatching}
                className="flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#0F766E] font-medium transition-colors cursor-pointer disabled:opacity-50"
                title="Check for new reminders"
              >
                <RefreshCw size={13} className={dispatching ? 'animate-spin' : ''} />
                <span>Sync</span>
              </button>
            </div>

            {/* Content List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F5F5F4]">
              {loading && notifications.length === 0 ? (
                <div className="py-10 text-center text-sm text-[#A8A29E]">
                  Loading reminders...
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-10 px-6 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center">
                    <CheckCheck size={20} />
                  </div>
                  <p className="text-sm font-semibold text-[#1C1917]">All caught up!</p>
                  <p className="text-xs text-[#78716C] mt-1">
                    No pending study alerts or reminders right now.
                  </p>
                </div>
              ) : (
                notifications.map((n) => {
                  const cfg = TYPE_CONFIG[n.type] || {
                    icon: Bell,
                    color: 'text-stone-700 bg-stone-50 border-stone-200',
                    badge: 'Update',
                  };
                  const Icon = cfg.icon;
                  const isUnread = n.status === 'unread';

                  return (
                    <div
                      key={n.notification_id}
                      onClick={() => handleActionClick(n)}
                      className={`p-3.5 hover:bg-[#FAFAF9] transition-colors cursor-pointer flex gap-3 relative ${
                        isUnread ? 'bg-[#F0FDFA]/40' : 'bg-white'
                      }`}
                    >
                      {/* Left Icon */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${cfg.color}`}
                      >
                        <Icon size={16} strokeWidth={2.2} />
                      </div>

                      {/* Middle Body */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-[#FAFAF9] border border-[#E7E5E4] text-[#78716C]">
                            {cfg.badge}
                          </span>
                          {isUnread && (
                            <span className="w-1.5 h-1.5 bg-[#0F766E] rounded-full" />
                          )}
                          <span className="text-[11px] text-[#A8A29E] ml-auto">
                            {formatTimeAgo(n.created_at)}
                          </span>
                        </div>

                        <h4
                          className={`text-xs font-semibold truncate ${
                            isUnread ? 'text-[#1C1917]' : 'text-[#44403C]'
                          }`}
                        >
                          {n.title}
                        </h4>

                        <p className="text-xs text-[#78716C] line-clamp-2 mt-0.5 leading-relaxed">
                          {n.message}
                        </p>

                        {/* Action Link & Buttons */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F5F5F4]/80">
                          {n.action_url ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F766E] hover:underline">
                              Open <ExternalLink size={10} />
                            </span>
                          ) : (
                            <span />
                          )}

                          <div className="flex items-center gap-1">
                            {isUnread && (
                              <button
                                onClick={(e) => handleMarkRead(n.notification_id, e)}
                                title="Mark as read"
                                className="p-1 rounded text-[#78716C] hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-colors cursor-pointer"
                              >
                                <Check size={13} strokeWidth={2.5} />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDismiss(n.notification_id, e)}
                              title="Dismiss"
                              className="p-1 rounded text-[#A8A29E] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                            >
                              <X size={13} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 bg-[#FAFAF9] border-t border-[#E7E5E4] flex items-center justify-between text-[11px]">
                <span className="text-[#78716C]">
                  {notifications.length} reminder{notifications.length > 1 ? 's' : ''} stored
                </span>
                <button
                  onClick={async () => {
                    for (const n of notifications.filter((x) => x.status === 'unread')) {
                      await api.patch(`/ai/notifications/${n.notification_id}/read`);
                    }
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, status: 'read' }))
                    );
                    setUnreadCount(0);
                  }}
                  className="font-medium text-[#0F766E] hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
