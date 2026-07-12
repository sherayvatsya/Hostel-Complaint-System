import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import { FiArrowLeft, FiUser, FiHome, FiMail, FiPhone, FiCalendar, FiActivity, FiTag, FiCheckSquare } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // Modal popup picture

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/complaints/${id}`);
      if (res.data.success) {
        setComplaint(res.data.complaint);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load complaint details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="shimmer-bg h-96 rounded-2xl w-full animate-pulse" />
      </DashboardLayout>
    );
  }

  if (!complaint) return null;

  // Timeline helper
  const statuses = ['Pending', 'Accepted', 'In Progress', 'Resolved'];
  const activeStatusIdx = statuses.indexOf(complaint.status);
  const isRejected = complaint.status === 'Rejected';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Navigation Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Complaint Overview</h1>
            <p className="text-slate-400 text-xs mt-1 font-semibold">Detailed logs, diagnostic tracking, and assigned maintenance personnel.</p>
          </div>
        </div>

        {/* Timeline Component */}
        <GlassCard hoverEffect={false}>
          <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-6">Status Progress Timeline</h2>
          {isRejected ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              This complaint ticket has been Rejected by the chief hostel warden.
            </div>
          ) : (
            <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 pt-4 pb-2">
              
              {/* Connector line for desktop */}
              <div className="absolute top-8 left-10 right-10 h-0.5 bg-slate-200 dark:bg-slate-800 -z-10 hidden md:block" />
              
              {statuses.map((step, idx) => {
                const isPassed = activeStatusIdx >= idx;
                const isCurrent = activeStatusIdx === idx;
                
                return (
                  <div key={step} className="flex flex-col items-center text-center relative z-10 w-full md:w-auto">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: isCurrent ? 1.1 : 1 }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors font-bold text-xs ${
                        isCurrent
                          ? 'bg-primary-500 border-primary-500 text-white shadow-neon-indigo'
                          : isPassed
                          ? 'bg-indigo-900/50 border-primary-500 text-primary-400'
                          : 'bg-slate-800/80 border-slate-700 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </motion.div>
                    <p className={`text-xs font-bold mt-2.5 ${isCurrent ? 'text-primary-500' : 'text-slate-400'}`}>
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>

        {/* Main Details and Side panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Summary description details */}
            <GlassCard hoverEffect={false} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/10 pb-3">
                <StatusBadge type="status" value={complaint.status} />
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Priority: <StatusBadge type="priority" value={complaint.priority} /></span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-wide">{complaint.title}</h2>
              <p className="text-slate-500 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </GlassCard>

            {/* AI Diagnostics details */}
            {complaint.aiSummary && (
              <GlassCard hoverEffect={false} className="border border-indigo-500/20 shadow-neon-indigo">
                <div className="flex items-center gap-2 text-primary-500 mb-2">
                  <FiActivity className="w-5 h-5 animate-pulse" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wider">AI Diagnostic Analysis</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic font-semibold leading-relaxed">
                  {complaint.aiSummary}
                </p>
              </GlassCard>
            )}

            {/* Snap Gallery uploads */}
            {complaint.images && complaint.images.length > 0 && (
              <GlassCard hoverEffect={false}>
                <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-4">Attached Snap Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {complaint.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className="h-28 rounded-xl overflow-hidden cursor-pointer hover:opacity-85 border border-slate-200/15 group relative"
                    >
                      <img src={img} alt={`Complaint Snap ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        Zoom In
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>

          {/* Right Sidebar panel */}
          <div className="space-y-6">
            
            {/* Student Info Card (Admin or Detail) */}
            <GlassCard hoverEffect={false} className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Student Information</h3>
              <div className="flex items-center gap-3">
                <img
                  src={complaint.student?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border border-primary-500"
                />
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{complaint.student?.name || 'Deleted Account'}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Room {complaint.student?.roomNumber} | {complaint.student?.hostelBlock}</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-200/10 text-xs">
                <div className="flex items-center gap-2.5 text-slate-400">
                  <FiMail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{complaint.student?.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <FiPhone className="w-4 h-4 shrink-0" />
                  <span>{complaint.student?.phone}</span>
                </div>
              </div>
            </GlassCard>

            {/* Staff Assignment details */}
            <GlassCard hoverEffect={false} className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Assigned Staff</h3>
              <div className="flex items-start gap-3">
                <FiCheckSquare className="text-cyber-violet w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {complaint.assignedStaff || 'Unassigned'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    {complaint.assignedStaff 
                      ? 'Local maintenance support dispatcher team has received active order details.' 
                      : 'Warden is currently triaging and reviewing the complaint.'}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Time logging detail */}
            <GlassCard hoverEffect={false} className="space-y-3.5 text-xs text-slate-400 font-semibold">
              <div className="flex justify-between">
                <div className="flex items-center gap-2"><FiCalendar /> Filed On</div>
                <div>{new Date(complaint.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2"><FiCalendar /> Last Updated</div>
                <div>{new Date(complaint.updatedAt).toLocaleDateString()}</div>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200/10">
                <div className="flex items-center gap-2"><FiTag /> Category</div>
                <div className="text-slate-200">{complaint.category}</div>
              </div>
            </GlassCard>

          </div>
        </div>

      </div>

      {/* Picture Zoom Modal Popup */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl z-10"
            >
              <img src={selectedImage} alt="Large Review" className="w-full h-full object-contain" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 px-3 py-1 bg-black/60 hover:bg-black text-white text-xs rounded-xl font-bold"
              >
                Close View
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
};

export default ComplaintDetails;
