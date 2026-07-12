import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import GlassCard from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiPhone, FiHome, FiGrid, FiLock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    roomNumber: user?.roomNumber || '',
    hostelBlock: user?.hostelBlock || 'A Block',
    avatar: user?.avatar || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
  ];

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (url) => {
    setProfileData({ ...profileData, avatar: url });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name || !profileData.phone) {
      return toast.error('Name and Phone fields are required');
    }

    setProfileLoading(true);
    try {
      const res = await updateProfile(profileData);
      if (res.success) {
        toast.success('Profile details updated successfully!');
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('Please enter all password details');
    }

    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters long');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setPassLoading(true);
    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(res.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('An error occurred changing password');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Account Settings</h1>
          <p className="text-slate-400 text-xs mt-1 font-semibold">Manage profile, change password keys, and select avatars.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <GlassCard hoverEffect={false} className="space-y-6 glass-card-solid">
              <h2 className="text-base font-extrabold text-slate-800 dark:text-white border-b border-slate-200/10 pb-3">Edit Profile Details</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                
                {/* Avatar Presets Selection */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Profile Avatar Preset
                  </label>
                  <div className="flex flex-wrap items-center gap-3 bg-slate-500/5 p-3 rounded-xl border border-slate-200/5">
                    {avatarPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAvatarSelect(preset)}
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-200 relative group ${
                          profileData.avatar === preset ? 'border-primary-500 scale-105 shadow-neon-indigo' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt={`preset ${idx}`} className="w-full h-full object-cover" />
                        {profileData.avatar === preset && (
                          <div className="absolute inset-0 bg-primary-500/30 flex items-center justify-center text-white">
                            <FiCheck className="w-5 h-5 font-bold" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
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
                      <FiPhone className="absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="glass-input block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-slate-800 dark:text-white outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Room and block (students only) */}
                {user?.role === 'student' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Room Number
                      </label>
                      <div className="relative">
                        <FiHome className="absolute left-3 top-3.5 text-slate-400" />
                        <input
                          type="text"
                          name="roomNumber"
                          value={profileData.roomNumber}
                          onChange={handleProfileChange}
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
                        <FiGrid className="absolute left-3 top-3.5 text-slate-400" />
                        <select
                          name="hostelBlock"
                          value={profileData.hostelBlock}
                          onChange={handleProfileChange}
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
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="btn-neon-primary px-8 py-3"
                  >
                    {profileLoading ? 'Saving...' : 'Save Profile Details'}
                  </button>
                </div>
              </form>
            </GlassCard>
          </div>

          {/* Change Password Form */}
          <div>
            <GlassCard hoverEffect={false} className="space-y-6 glass-card-solid">
              <h2 className="text-base font-extrabold text-slate-800 dark:text-white border-b border-slate-200/10 pb-3">Update Keys</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="glass-input block w-full pl-10 pr-4 py-2 text-sm rounded-xl text-slate-800 dark:text-white outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Min 6 characters"
                      className="glass-input block w-full pl-10 pr-4 py-2 text-sm rounded-xl text-slate-800 dark:text-white outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="glass-input block w-full pl-10 pr-4 py-2 text-sm rounded-xl text-slate-800 dark:text-white outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passLoading}
                    className="btn-neon-primary w-full py-3"
                  >
                    {passLoading ? 'Updating Keys...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </GlassCard>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
