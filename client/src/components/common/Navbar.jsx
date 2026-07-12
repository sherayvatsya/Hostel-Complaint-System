import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX, FiBell, FiLogOut, FiUser, FiSliders, FiPlusSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications count if logged in
  useEffect(() => {
    let interval;
    const fetchUnreadNotifications = async () => {
      if (user) {
        try {
          const res = await api.get('/notifications');
          if (res.data.success) {
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.notifications.filter(n => !n.read).length);
          }
        } catch (error) {
          console.error('Error fetching unread notifications count', error);
        }
      }
    };

    fetchUnreadNotifications();
    if (user) {
      interval = setInterval(fetchUnreadNotifications, 10000); // Check every 10s
    }

    return () => clearInterval(interval);
  }, [user, location]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel fixed top-0 left-0 w-full z-50 transition-all duration-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏢</span>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary-500 to-cyber-violet bg-clip-text text-transparent">
              HostelCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                  className={`text-sm font-semibold transition-all hover:text-primary-500 ${
                    isActive('/dashboard') || isActive('/admin-dashboard')
                      ? 'text-primary-500 underline underline-offset-8 decoration-2'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Dashboard
                </Link>
                {user.role === 'student' && (
                  <Link
                    to="/create-complaint"
                    className={`text-sm font-semibold flex items-center gap-1.5 transition-all hover:text-primary-500 ${
                      isActive('/create-complaint')
                        ? 'text-primary-500 underline underline-offset-8 decoration-2'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <FiPlusSquare /> Submit Complaint
                  </Link>
                )}
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* User Dropdown / Login */}
            {user ? (
              <div className="relative">
                <div className="flex items-center gap-3">
                  {/* Notification Dot */}
                  <Link to="/notifications" className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
                    <FiBell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[11px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-lg animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Profile Avatar Trigger */}
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-primary-500"
                    />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>
                </div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="glass-card glass-card-solid absolute right-0 mt-2.5 w-52 rounded-xl py-2 shadow-xl border border-slate-200/50 dark:border-slate-800/80 z-20"
                      >
                        <div className="px-4 py-2 border-b border-slate-200/20">
                          <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                          <p className="text-[10px] uppercase font-extrabold tracking-wider text-primary-500 mt-0.5">{user.role}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-500/10 transition-colors font-medium"
                        >
                          <FiUser /> Edit Profile
                        </Link>
                        <Link
                          to="/notifications"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-500/10 transition-colors font-medium"
                        >
                          <FiBell /> Alerts
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors font-bold text-left"
                        >
                          <FiLogOut /> Log Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="btn-glass px-4 py-2 text-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn-neon-primary px-4 py-2 text-sm shadow-none">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-slate-200/20 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 p-2 border-b border-slate-200/10">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-primary-500"
                    />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white leading-tight">{user.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{user.role} | Room {user.roomNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <Link
                    to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-primary-500/10"
                  >
                    Dashboard
                  </Link>
                  {user.role === 'student' && (
                    <Link
                      to="/create-complaint"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-primary-500/10"
                    >
                      Submit Complaint
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-primary-500/10"
                  >
                    Profile Settings
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-primary-500/10 relative"
                  >
                    Notifications {unreadCount > 0 && <span className="ml-1 text-xs px-2 py-0.5 bg-rose-500 text-white rounded-full">{unreadCount}</span>}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 rounded-xl text-base font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn-glass block text-center py-2.5"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="btn-neon-primary block text-center py-2.5"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
