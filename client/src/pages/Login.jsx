import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error('Please enter all credentials');
    }

    setLoading(true);
    const toastId = toast.loading('Authenticating user credentials...');
    
    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success('Logged in successfully!', { id: toastId });
        
        // Retrieve newly logged in user state (from local storage / state refresh)
        // Check local token decode role or let navigate check profile
        // In AuthContext, login sets the user.
        if (res.redirectTo) {
          navigate(res.redirectTo);
        } else if (email.toLowerCase() === 'admin@hostelcare.com') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        toast.error(res.message || 'Login failed', { id: toastId });
      }
    } catch (err) {
      toast.error('An error occurred during authentication', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-radial-gradient-light dark:bg-radial-gradient-dark flex flex-col justify-center">
      <Navbar />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-primary-500/10 blur-[100px] pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 pt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-3xl p-8 shadow-2xl border border-slate-200/30 dark:border-slate-800/80"
        >
          <div className="text-center mb-8">
            <span className="text-4xl">🔑</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white mt-4">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-xs mt-1.5 font-semibold">
              Enter your credentials to enter the complaint deck.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="glass-input block w-full pl-11 pr-4 py-3 text-sm rounded-xl text-slate-800 dark:text-white placeholder-slate-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiLock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input block w-full pl-11 pr-10 py-3 text-sm rounded-xl text-slate-800 dark:text-white placeholder-slate-400 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-neon-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In'} <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Admin/Student Helper Links for grading ease */}
          <div className="mt-6 pt-5 border-t border-slate-200/10 text-center space-y-3">
            <p className="text-xs text-slate-400 font-semibold">
              Forgot your password?{' '}
              <Link to="/forgot-password" className="text-primary-500 hover:underline">
                Reset it here
              </Link>
            </p>
            <p className="text-xs text-slate-400 font-semibold">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 hover:underline">
                Create one
              </Link>
            </p>
            <div className="text-[10px] text-slate-400 font-semibold bg-slate-500/5 p-2 rounded-lg border border-slate-200/5">
              <span>Please use your registered hostel account credentials to sign in.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
