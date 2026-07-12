import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import CustomChart from '../components/common/CustomChart';
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiSliders,
  FiDownload,
  FiUserCheck,
  FiArchive,
  FiX,
  FiUserPlus
} from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('complaints'); // complaints or users

  // Statistics
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalComplaints: 0,
    status: { pending: 0, accepted: 0, inProgress: 0, resolved: 0, rejected: 0 },
    categories: []
  });

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');

  // User creation state
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    roomNumber: '',
    hostelBlock: 'A Block',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
  });
  const [creatingUser, setCreatingUser] = useState(false);

  // Status Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState('Pending');
  const [modalStaff, setModalStaff] = useState('');
  const [updating, setUpdating] = useState(false);

  const categoriesList = ['All', 'Electrical', 'Water', 'Internet', 'Cleaning', 'Furniture', 'Mess', 'Room', 'Security', 'Others'];
  const statusList = ['All', 'Pending', 'Accepted', 'In Progress', 'Resolved', 'Rejected'];
  const priorityList = ['All', 'Low', 'Medium', 'High'];

  // Fetch Dashboard aggregate stats
  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error('Failed to load dashboard metrics', error);
    }
  };

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (status !== 'All') params.status = status;
      if (priority !== 'All') params.priority = priority;

      const res = await api.get('/admin/complaints', { params });
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users (students list)
  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const handleNewUserChange = (e) => {
    setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, phone, roomNumber, hostelBlock } = newUserData;

    if (!name || !email || !password || !phone || !roomNumber || !hostelBlock) {
      return toast.error('Please fill in all fields for the new student account');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    setCreatingUser(true);
    try {
      const res = await api.post('/admin/users', {
        ...newUserData,
        role: 'student'
      });

      if (res.data.success) {
        toast.success('Student account created successfully!');
        setNewUserData({
          name: '',
          email: '',
          password: '',
          phone: '',
          roomNumber: '',
          hostelBlock: 'A Block',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
        });
        fetchUsers();
      } else {
        toast.error(res.data.message || 'Failed to create student account');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create student account');
    } finally {
      setCreatingUser(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [category, status, priority]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  // Open Status update modal
  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setModalStatus(complaint.status);
    setModalStaff(complaint.assignedStaff || '');
    setModalOpen(true);
  };

  // Close Status modal
  const closeStatusModal = () => {
    setSelectedComplaint(null);
    setModalOpen(false);
  };

  // Handle Status Update Submit
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setUpdating(true);
    try {
      const res = await api.put(`/admin/complaints/${selectedComplaint._id}/status`, {
        status: modalStatus,
        assignedStaff: modalStaff
      });
      if (res.data.success) {
        toast.success('Complaint status updated successfully!');
        closeStatusModal();
        fetchComplaints();
        fetchStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  // Handle Delete Complaint
  const handleDeleteComplaint = async (id) => {
    if (!window.confirm('Delete this complaint record permanently?')) return;
    try {
      const res = await api.delete(`/admin/complaints/${id}`);
      if (res.data.success) {
        toast.success('Complaint deleted successfully');
        fetchComplaints();
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to delete complaint');
    }
  };

  // Handle Delete Student User
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this student profile and all associated complaints? This cannot be undone.')) return;
    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        toast.success('Student profile removed successfully');
        fetchUsers();
        fetchComplaints();
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to remove user account');
    }
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    if (complaints.length === 0) return toast.error('No complaints to export');

    const headers = ['Complaint ID', 'Title', 'Category', 'Priority', 'Status', 'Room', 'Block', 'Student Name', 'Student Email', 'Assigned Staff', 'Created At'];
    
    const rows = complaints.map(c => [
      c._id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.priority,
      c.status,
      c.student?.roomNumber || 'N/A',
      c.student?.hostelBlock || 'N/A',
      c.student?.name || 'N/A',
      c.student?.email || 'N/A',
      `"${(c.assignedStaff || '').replace(/"/g, '""')}"`,
      new Date(c.createdAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hostel_complaints_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV file downloaded successfully!');
  };

  // Format category distribution chart data
  const chartCategoryData = categoriesList.slice(1).map(cat => {
    const statItem = stats.categories.find(item => item._id === cat);
    return { label: cat, value: statItem ? statItem.count : 0 };
  }).filter(item => item.value > 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Upper Header Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Admin Control Panel</h1>
            <p className="text-slate-400 text-xs mt-1 font-semibold">Monitor statistics, manage campus facility tickets, and update students.</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="btn-neon-secondary px-5 py-2.5 flex items-center justify-center gap-2"
          >
            <FiDownload className="w-5 h-5" /> Export Complaints
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <GlassCard className="border-l-4 border-indigo-500 text-center" hoverEffect={false}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Students</p>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1.5">{stats.totalStudents}</p>
          </GlassCard>
          
          <GlassCard className="border-l-4 border-slate-500 text-center" hoverEffect={false}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-semibold">Total Complaints</p>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1.5">{stats.totalComplaints}</p>
          </GlassCard>

          <GlassCard className="border-l-4 border-amber-500 text-center" hoverEffect={false}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1.5">{stats.status.pending}</p>
          </GlassCard>

          <GlassCard className="border-l-4 border-purple-500 text-center" hoverEffect={false}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Progress</p>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1.5">{stats.status.inProgress + stats.status.accepted}</p>
          </GlassCard>

          <GlassCard className="border-l-4 border-emerald-500 text-center" hoverEffect={false}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved</p>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1.5">{stats.status.resolved}</p>
          </GlassCard>

          <GlassCard className="border-l-4 border-rose-500 text-center" hoverEffect={false}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rejected</p>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1.5">{stats.status.rejected}</p>
          </GlassCard>
        </div>

        {/* Charts & Analytics */}
        {complaints.length > 0 && chartCategoryData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2" hoverEffect={false}>
              <CustomChart
                type="donut"
                data={chartCategoryData}
                title="Category Breakdown (Aggregate)"
              />
            </GlassCard>
            
            <GlassCard hoverEffect={false}>
              <CustomChart
                type="bar"
                data={[
                  { label: 'Low Urgency', value: complaints.filter(c => c.priority === 'Low').length, colorClass: 'bg-slate-500' },
                  { label: 'Medium Urgency', value: complaints.filter(c => c.priority === 'Medium').length, colorClass: 'bg-amber-500' },
                  { label: 'High Urgency', value: complaints.filter(c => c.priority === 'High').length, colorClass: 'bg-rose-500' }
                ]}
                title="Priority Urgency breakdown"
              />
            </GlassCard>
          </div>
        )}

        {/* View Switcher Tabs */}
        <div className="flex gap-4 border-b border-slate-200/10 pb-1">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`pb-2 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'complaints'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Manage Complaints ({complaints.length})
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'users'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Manage Students ({users.length})
          </button>
        </div>

        {/* Tab Components */}
        {activeTab === 'complaints' ? (
          <GlassCard hoverEffect={false}>
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Active Complaint Pipeline</h2>
              </div>
              
              {/* Filter inputs */}
              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative lg:col-span-2">
                  <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, description, keywords..."
                    className="glass-input w-full pl-10 pr-4 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="glass-input w-full py-2.5 px-3.5 text-xs rounded-xl outline-none text-slate-800 dark:text-white appearance-none"
                  >
                    <option value="All">All Categories</option>
                    {categoriesList.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="glass-input w-full py-2.5 px-3.5 text-xs rounded-xl outline-none text-slate-800 dark:text-white appearance-none"
                  >
                    <option value="All">All Statuses</option>
                    {statusList.slice(1).map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="glass-input w-full py-2.5 px-3.5 text-xs rounded-xl outline-none text-slate-800 dark:text-white appearance-none"
                  >
                    <option value="All">All Priorities</option>
                    {priorityList.slice(1).map(pr => (
                      <option key={pr} value={pr}>{pr}</option>
                    ))}
                  </select>
                </div>
              </form>

              {/* List */}
              {loading ? (
                <div className="space-y-4 py-6">
                  {[1, 2].map(i => (
                    <div key={i} className="shimmer-bg h-24 rounded-2xl w-full" />
                  ))}
                </div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-slate-400 text-sm">No complaints logged matching search selection</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200/10 text-slate-400 text-xs uppercase tracking-wider font-bold">
                        <th className="py-3 px-4">Student Info</th>
                        <th className="py-3 px-4">Complaint Title</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((c) => (
                        <tr key={c._id} className="border-b border-slate-200/10 hover:bg-slate-500/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={c.student?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'}
                                alt="avatar"
                                className="w-8 h-8 rounded-full object-cover border border-slate-200/30"
                              />
                              <div>
                                <p className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[120px]">{c.student?.name || 'Deleted User'}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{c.student?.roomNumber} | {c.student?.hostelBlock.split(' ')[0]}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-xs">{c.title}</p>
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{c.description}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                            {c.category}
                          </td>
                          <td className="py-4 px-4">
                            <StatusBadge type="priority" value={c.priority} />
                          </td>
                          <td className="py-4 px-4">
                            <StatusBadge type="status" value={c.status} />
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/complaints/${c._id}`}
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors"
                                title="View Details"
                              >
                                <FiEye className="w-4 h-4" />
                              </Link>
                              
                              <button
                                onClick={() => openStatusModal(c)}
                                className="p-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 rounded-xl transition-colors"
                                title="Update Status"
                              >
                                <FiEdit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteComplaint(c._id)}
                                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-colors"
                                title="Delete Complaint"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
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
        ) : (
          /* Students Manage Tab */
          <GlassCard hoverEffect={false}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 lg:grid-cols-[1fr_320px] items-start">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Registered Students</h2>
                  <p className="text-slate-400 text-sm mt-1">Create new student accounts and manage existing profiles.</p>
                </div>
                <div className="bg-slate-100/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/20 dark:border-slate-800/70 p-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Add Student Account</h3>
                  <form onSubmit={handleCreateUserSubmit} className="space-y-3">
                    <input
                      type="text"
                      name="name"
                      value={newUserData.name}
                      onChange={handleNewUserChange}
                      placeholder="Full name"
                      className="glass-input w-full py-2.5 px-3 rounded-xl text-sm text-slate-800 dark:text-white outline-none"
                    />
                    <input
                      type="email"
                      name="email"
                      value={newUserData.email}
                      onChange={handleNewUserChange}
                      placeholder="Email address"
                      className="glass-input w-full py-2.5 px-3 rounded-xl text-sm text-slate-800 dark:text-white outline-none"
                    />
                    <input
                      type="password"
                      name="password"
                      value={newUserData.password}
                      onChange={handleNewUserChange}
                      placeholder="Password"
                      className="glass-input w-full py-2.5 px-3 rounded-xl text-sm text-slate-800 dark:text-white outline-none"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={newUserData.phone}
                      onChange={handleNewUserChange}
                      placeholder="Phone number"
                      className="glass-input w-full py-2.5 px-3 rounded-xl text-sm text-slate-800 dark:text-white outline-none"
                    />
                    <input
                      type="text"
                      name="roomNumber"
                      value={newUserData.roomNumber}
                      onChange={handleNewUserChange}
                      placeholder="Room number"
                      className="glass-input w-full py-2.5 px-3 rounded-xl text-sm text-slate-800 dark:text-white outline-none"
                    />
                    <select
                      name="hostelBlock"
                      value={newUserData.hostelBlock}
                      onChange={handleNewUserChange}
                      className="glass-input w-full py-2.5 px-3 rounded-xl text-sm text-slate-800 dark:text-white outline-none appearance-none"
                    >
                      <option value="A Block">A Block</option>
                      <option value="B Block">B Block</option>
                      <option value="C Block">C Block</option>
                      <option value="D Block">D Block</option>
                      <option value="PG Block">PG Block</option>
                    </select>
                    <button
                      type="submit"
                      disabled={creatingUser}
                      className="btn-neon-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
                    >
                      <FiUserPlus className="w-4 h-4" />
                      {creatingUser ? 'Creating...' : 'Create Account'}
                    </button>
                  </form>
                </div>
              </div>
              
              {users.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-10">No students registered in the database.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200/10 text-slate-400 text-xs uppercase tracking-wider font-bold">
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Room & Block</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-slate-200/10 hover:bg-slate-500/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'}
                                alt="avatar"
                                className="w-9 h-9 rounded-full object-cover border border-primary-500/40"
                              />
                              <span className="font-bold text-sm text-slate-800 dark:text-white">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-300 font-semibold">{u.email}</td>
                          <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-300 font-semibold">{u.phone}</td>
                          <td className="py-4 px-4 text-xs font-black uppercase text-indigo-500 tracking-wider">
                            Room {u.roomNumber} | {u.hostelBlock}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-colors"
                              title="Delete Student Profile"
                            >
                              <FiTrash2 className="w-4.5 h-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* Modal Status Changer Component */}
        <AnimatePresence>
          {modalOpen && selectedComplaint && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={closeStatusModal}
                className="fixed inset-0 bg-black z-50"
              />
              
              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 top-1/4 md:left-[35%] md:w-[450px] bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-2xl z-50"
              >
                <div className="flex justify-between items-center border-b border-slate-200/10 pb-3 mb-4">
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Modify Complaint Status</h3>
                  <button onClick={closeStatusModal} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleStatusUpdate} className="space-y-4">
                  <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-200/5 text-xs text-slate-400">
                    <p className="font-bold text-slate-300">Complaint: {selectedComplaint.title}</p>
                    <p className="mt-1">Filed by: {selectedComplaint.student?.name} (Room {selectedComplaint.student?.roomNumber})</p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Transition Status
                    </label>
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value)}
                      className="glass-input w-full py-2.5 px-3 text-sm rounded-xl outline-none text-slate-800 dark:text-white"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Assigned Staff Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Assigned Staff / Maintenance Unit
                    </label>
                    <input
                      type="text"
                      value={modalStaff}
                      onChange={(e) => setModalStaff(e.target.value)}
                      placeholder="e.g. Electrician Unit 2, IT Support Team"
                      className="glass-input block w-full px-3 py-2.5 text-sm rounded-xl text-slate-800 dark:text-white outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeStatusModal}
                      className="btn-glass px-4.5 py-2 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="btn-neon-primary px-5 py-2 text-xs"
                    >
                      {updating ? 'Updating...' : 'Save Transitions'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
