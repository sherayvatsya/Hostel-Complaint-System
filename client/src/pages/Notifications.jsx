import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import GlassCard from '../components/common/GlassCard';
import { FiCheckSquare, FiMessageSquare, FiClock } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to retrieve notifications list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    if (notifications.filter(n => !n.read).length === 0) {
      return toast.success('All notifications are already read');
    }

    try {
      const res = await api.put('/notifications/read');
      if (res.data.success) {
        toast.success('Marked all notifications as read!');
        fetchNotifications();
      }
    } catch (error) {
      toast.error('Failed to update notifications status');
    }
  };

  const handleMarkSingleRead = async (id, alreadyRead) => {
    if (alreadyRead) return;
    try {
      const res = await api.put(`/notifications/${id}/read`);
      if (res.data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Notifications</h1>
            <p className="text-slate-400 text-xs mt-1 font-semibold">Track complaint updates, assignment remarks, and account alerts.</p>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="btn-glass px-4.5 py-2.5 flex items-center justify-center gap-2 text-xs"
          >
            <FiCheckSquare className="w-4.5 h-4.5" /> Mark All Read
          </button>
        </div>

        {/* Notifications list block */}
        <GlassCard hoverEffect={false}>
          {loading ? (
            <div className="space-y-4 py-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="shimmer-bg h-14 rounded-2xl w-full animate-pulse" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="text-5xl">🔔</div>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">All caught up!</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">No notifications logged. New status logs will display here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((n) => (
                <motion.div
                  key={n._id}
                  onClick={() => handleMarkSingleRead(n._id, n.read)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                    n.read
                      ? 'bg-slate-100 dark:bg-slate-950 border-slate-300/40 dark:border-slate-700/80 text-slate-500 dark:text-slate-400'
                      : 'bg-primary-500/10 dark:bg-primary-500/15 border-primary-500/40 hover:border-primary-500/60 shadow-lg'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    n.read 
                      ? 'bg-slate-500/10 border-slate-300/30 text-slate-400' 
                      : 'bg-primary-500/20 border-primary-500/40 text-primary-600 dark:text-primary-400'
                  }`}>
                    <FiMessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold leading-normal ${n.read ? 'text-slate-500 dark:text-slate-300' : 'text-slate-900 dark:text-white font-bold'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mt-1.5">
                      <FiClock />
                      <span>{new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {!n.read && <span className="ml-2 w-2 h-2 rounded-full bg-primary-500" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>

      </div>
    </DashboardLayout>
  );
};

export default Notifications;
