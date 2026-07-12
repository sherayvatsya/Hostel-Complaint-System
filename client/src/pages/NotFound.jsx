import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-radial-gradient-light dark:bg-radial-gradient-dark flex flex-col justify-center text-center">
      <Navbar />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-500/10 blur-[120px] pointer-events-none animate-pulse" />

      <div className="max-w-md mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-3xl p-10 border border-slate-200/20 dark:border-slate-800/80 shadow-2xl"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-7xl mb-6"
          >
            🧑‍🚀
          </motion.div>
          
          <h1 className="text-5xl font-black bg-gradient-to-r from-primary-500 to-cyber-violet bg-clip-text text-transparent tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-4">
            Lost in Space
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-semibold leading-relaxed">
            The page you are trying to visit does not exist or has been shifted. Let's redirect you back to safety.
          </p>

          <div className="mt-8">
            <Link to="/" className="btn-neon-primary px-8 py-3 block text-sm">
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
