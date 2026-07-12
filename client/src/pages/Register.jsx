import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiHome, FiGrid, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    roomNumber: '',
    hostelBlock: 'A Block',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80' // default
  });

  const [loading, setLoading] = useState(false);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80', // Male 1
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', // Female 1
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80', // Male 2
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80', // Female 2
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', // Male 3
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'  // Female 3
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePresetSelect = (url) => {
    setFormData({ ...formData, avatar: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, phone, roomNumber, hostelBlock } = formData;

    if (!name || !email || !password || !phone || !roomNumber || !hostelBlock) {
      return toast.error('Please fill in all required fields');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    setLoading(true);
    const toastId = toast.loading('Registering student account...');

    try {
      const res = await register(formData);
      if (res.success) {
        toast.success('Registration successful! Welcome.', { id: toastId });
        navigate('/dashboard');
      } else {
        toast.error(res.message || 'Registration failed', { id: toastId });
      }
    } catch (err) {
      toast.error('An error occurred during registration', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-radial-gradient-light dark:bg-radial-gradient-dark flex flex-col justify-center py-12">
      <Navbar />

      {/* Decorative Orbs */}
      <div className="absolute top-12 left-1/4 w-80 h-80 rounded-full bg-cyber-violet/10 blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl px-4 pt-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-3xl p-8 shadow-2xl border border-slate-200/30 dark:border-slate-800/80"
        >
          <div className="text-center mb-6">
            <span className="text-4xl">📝</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white mt-3">
              Create Account
            </h2>
            <p className="text-slate-400 text-xs mt-1 font-semibold">
              Fill in details to set up your hostel student profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="glass-input block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-slate-800 dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="glass-input block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-slate-800 dark:text-white outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiLock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="glass-input block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-slate-800 dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiPhone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="glass-input block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-slate-800 dark:text-white outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Room Number and Hostel Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Room Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiHome className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    placeholder="204-B"
                    className="glass-input block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-slate-800 dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Hostel Block
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiGrid className="w-4 h-4" />
                  </div>
                  <select
                    name="hostelBlock"
                    value={formData.hostelBlock}
                    onChange={handleChange}
                    className="glass-input block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-slate-800 dark:text-white outline-none appearance-none"
                    required
                  >
                    <option value="A Block">A Block</option>
                    <option value="B Block">B Block</option>
                    <option value="C Block">C Block</option>
                    <option value="D Block">D Block</option>
                    <option value="PG Block">PG Block</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Avatar Selectors */}
            <div className="flex flex-col gap-2 pt-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Select Profile Avatar Preset
              </label>
              <div className="flex flex-wrap items-center gap-3 bg-slate-500/5 p-3.5 rounded-xl border border-slate-200/5">
                {avatarPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                      formData.avatar === preset ? 'border-primary-500 scale-110 shadow-neon-indigo' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-neon-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Sign Up'} <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 font-semibold">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
