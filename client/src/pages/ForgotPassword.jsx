import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';

const ForgotPassword = () => {
  const { fetchSecurityQuestion, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questionLoaded, setQuestionLoaded] = useState(false);

  const handleFetchQuestion = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error('Please enter your registered email');
    }

    setLoading(true);
    const toastId = toast.loading('Looking up your security question...');

    try {
      const res = await fetchSecurityQuestion(email);
      if (res.success) {
        setSecurityQuestion(res.securityQuestion);
        setQuestionLoaded(true);
        toast.success('Security question loaded', { id: toastId });
      } else {
        toast.error(res.message || 'Unable to find user', { id: toastId });
      }
    } catch (error) {
      toast.error('Unable to load security question', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !securityAnswer || !newPassword) {
      return toast.error('Please complete all fields');
    }

    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters long');
    }

    setLoading(true);
    const toastId = toast.loading('Resetting password...');

    try {
      const res = await resetPassword({ email, securityAnswer, newPassword });
      if (res.success) {
        toast.success('Password reset successful! Sign in with new password.', { id: toastId });
      } else {
        toast.error(res.message || 'Password reset failed', { id: toastId });
      }
    } catch (error) {
      toast.error('An error occurred while resetting password', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-radial-gradient-light dark:bg-radial-gradient-dark flex flex-col justify-center">
      <Navbar />
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-primary-500/10 blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 pt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-3xl p-8 shadow-2xl border border-slate-200/30 dark:border-slate-800/80"
        >
          <div className="text-center mb-8">
            <span className="text-4xl">🔒</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white mt-4">
              Forgot Password
            </h2>
            <p className="text-slate-400 text-xs mt-1.5 font-semibold">
              Use your account email and security answer to reset your password.
            </p>
          </div>

          <form onSubmit={questionLoaded ? handleSubmit : handleFetchQuestion} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Registered Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your email address"
                  className="glass-input block w-full pl-11 pr-4 py-3 text-sm rounded-xl text-slate-800 dark:text-white placeholder-slate-400 outline-none"
                  required
                />
              </div>
            </div>

            {questionLoaded && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Security Question
                  </label>
                  <p className="glass-input block w-full min-h-[3rem] pl-4 pr-4 py-3 text-sm rounded-xl text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200/50">
                    {securityQuestion}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Security Answer
                  </label>
                  <input
                    type="text"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    className="glass-input block w-full pl-3 pr-4 py-3 text-sm rounded-xl text-slate-800 dark:text-white placeholder-slate-400 outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FiLock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
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
              </>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-neon-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {loading ? (questionLoaded ? 'Resetting...' : 'Loading...') : (questionLoaded ? 'Reset Password' : 'Get Question')} <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-slate-400 font-semibold">
              Remembered your password?{' '}
              <Link to="/login" className="text-primary-500 hover:underline">
                Sign In
              </Link>
            </p>
            <p className="text-xs text-slate-400 font-semibold">
              Need a new account?{' '}
              <Link to="/register" className="text-primary-500 hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
