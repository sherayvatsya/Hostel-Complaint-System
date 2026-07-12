import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid,
  FiPlusSquare,
  FiUser,
  FiBell,
  FiUsers,
  FiList
} from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiGrid className="w-5 h-5" /> },
    { name: 'New Complaint', path: '/create-complaint', icon: <FiPlusSquare className="w-5 h-5" /> },
    { name: 'My Profile', path: '/profile', icon: <FiUser className="w-5 h-5" /> },
    { name: 'Notifications', path: '/notifications', icon: <FiBell className="w-5 h-5" /> }
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin-dashboard', icon: <FiGrid className="w-5 h-5" /> },
    { name: 'Edit Profile', path: '/profile', icon: <FiUser className="w-5 h-5" /> },
    { name: 'Notifications', path: '/notifications', icon: <FiBell className="w-5 h-5" /> }
  ];

  const links = user.role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="hidden md:block w-64 glass-panel h-[calc(100vh-5rem)] sticky top-20 rounded-2xl p-4 shadow-sm">
      <div className="flex flex-col gap-2.5">
        <div className="px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {links.map((link) => {
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-primary-500 to-cyber-violet text-white shadow-neon-indigo'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </div>
      
      {/* Small Card detailing logged User */}
      <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-slate-500/5 rounded-xl border border-slate-200/10 flex items-center gap-3">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'}
          alt={user.name}
          className="w-9 h-9 rounded-full object-cover border border-primary-400"
        />
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none">
            {user.name}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 capitalize">
            {user.role} {user.role === 'student' ? `(Rm ${user.roomNumber})` : ''}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
