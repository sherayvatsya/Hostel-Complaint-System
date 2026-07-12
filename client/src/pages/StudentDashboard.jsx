import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import CustomChart from '../components/common/CustomChart';
import { FiPlus, FiSearch, FiSliders, FiEye, FiEdit3, FiTrash2, FiFileText } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0
  });

  const categoriesList = ['All', 'Electrical', 'Water', 'Internet', 'Cleaning', 'Furniture', 'Mess', 'Room', 'Security', 'Others'];
  const statusList = ['All', 'Pending', 'Accepted', 'In Progress', 'Resolved', 'Rejected'];
  const priorityList = ['All', 'Low', 'Medium', 'High'];

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (status !== 'All') params.status = status;
      if (priority !== 'All') params.priority = priority;

      const res = await api.get('/complaints', { params });
      if (res.data.success) {
        setComplaints(res.data.complaints);
        
        // Calculate stats based on all active student complaints
        const total = res.data.complaints.length;
        const pending = res.data.complaints.filter(c => c.status === 'Pending').length;
        const resolved = res.data.complaints.filter(c => c.status === 'Resolved').length;
        const inProgress = res.data.complaints.filter(c => c.status === 'In Progress' || c.status === 'Accepted').length;

        setStats({ total, pending, resolved, inProgress });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [category, status, priority]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint? This action is permanent.')) return;
    
    try {
      const res = await api.delete(`/complaints/${id}`);
      if (res.data.success) {
        toast.success('Complaint deleted successfully');
        fetchComplaints();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete complaint');
    }
  };

  // Compile data format for custom charts
  const categoryData = categoriesList.slice(1).map(cat => {
    const count = complaints.filter(c => c.category === cat).length;
    return { label: cat, value: count };
  }).filter(item => item.value > 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Upper Header Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Student Dashboard</h1>
            <p className="text-slate-400 text-xs mt-1 font-semibold">Monitor, update, and lodge facilities issues in your room block.</p>
          </div>
          <Link to="/create-complaint" className="btn-neon-primary px-5 py-2.5 flex items-center justify-center gap-2">
            <FiPlus className="w-5 h-5" /> File Complaint
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <GlassCard className="border-l-4 border-indigo-500" hoverEffect={false}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Registered</p>
            <p className="text-4xl font-extrabold text-slate-800 dark:text-white mt-2 tracking-tight">{stats.total}</p>
          </GlassCard>
          
          <GlassCard className="border-l-4 border-amber-500" hoverEffect={false}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Review</p>
            <p className="text-4xl font-extrabold text-slate-800 dark:text-white mt-2 tracking-tight">{stats.pending}</p>
          </GlassCard>

          <GlassCard className="border-l-4 border-purple-500" hoverEffect={false}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Repair</p>
            <p className="text-4xl font-extrabold text-slate-800 dark:text-white mt-2 tracking-tight">{stats.inProgress}</p>
          </GlassCard>

          <GlassCard className="border-l-4 border-emerald-500" hoverEffect={false}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fully Resolved</p>
            <p className="text-4xl font-extrabold text-slate-800 dark:text-white mt-2 tracking-tight">{stats.resolved}</p>
          </GlassCard>
        </div>

        {/* Charts & Breakdown */}
        {complaints.length > 0 && categoryData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2" hoverEffect={false}>
              <CustomChart
                type="donut"
                data={categoryData}
                title="Category Breakdown (Active Complaints)"
              />
            </GlassCard>
            <GlassCard hoverEffect={false}>
              <CustomChart
                type="bar"
                data={[
                  { label: 'Pending', value: stats.pending, colorClass: 'bg-amber-500' },
                  { label: 'In Progress', value: stats.inProgress, colorClass: 'bg-purple-500' },
                  { label: 'Resolved', value: stats.resolved, colorClass: 'bg-emerald-500' }
                ]}
                title="Status Pipeline Mapping"
              />
            </GlassCard>
          </div>
        )}

        {/* Filters and List */}
        <GlassCard hoverEffect={false}>
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Filter & Search Complaints</h2>
            
            {/* Search/Filters form */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative lg:col-span-2">
                <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by keywords..."
                  className="glass-input w-full pl-10 pr-4 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-white"
                />
              </div>

              {/* Category Select */}
              <div className="flex flex-col gap-1">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input py-2.5 px-3.5 text-xs rounded-xl outline-none text-slate-800 dark:text-white appearance-none"
                >
                  <option value="All">All Categories</option>
                  {categoriesList.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status Select */}
              <div className="flex flex-col gap-1">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="glass-input py-2.5 px-3.5 text-xs rounded-xl outline-none text-slate-800 dark:text-white appearance-none"
                >
                  <option value="All">All Statuses</option>
                  {statusList.slice(1).map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Priority Select */}
              <div className="flex flex-col gap-1">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="glass-input py-2.5 px-3.5 text-xs rounded-xl outline-none text-slate-800 dark:text-white appearance-none"
                >
                  <option value="All">All Priorities</option>
                  {priorityList.slice(1).map(pr => (
                    <option key={pr} value={pr}>{pr}</option>
                  ))}
                </select>
              </div>
            </form>

            {/* Complaints list */}
            {loading ? (
              <div className="space-y-4 py-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="shimmer-bg h-24 rounded-2xl w-full" />
                ))}
              </div>
            ) : complaints.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="text-5xl">📭</div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No complaints found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">No records match your active search terms or category selection filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/10 text-slate-400 text-xs uppercase tracking-wider font-bold">
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Filed On</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((c) => (
                      <tr key={c._id} className="border-b border-slate-200/10 hover:bg-slate-500/5 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-xs">{c.title}</p>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{c.description}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {c.category}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge type="priority" value={c.priority} />
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge type="status" value={c.status} />
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-400 font-semibold">
                          {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <Link
                              to={`/complaints/${c._id}`}
                              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors"
                              title="View Details"
                            >
                              <FiEye className="w-4 h-4" />
                            </Link>
                            
                            {c.status === 'Pending' && (
                              <>
                                <Link
                                  to={`/edit-complaint/${c._id}`}
                                  className="p-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 rounded-xl transition-colors"
                                  title="Edit Complaint"
                                >
                                  <FiEdit3 className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleDelete(c._id)}
                                  className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-colors"
                                  title="Delete Complaint"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
