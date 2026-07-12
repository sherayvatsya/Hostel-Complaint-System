import React from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { motion } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-radial-gradient-light dark:bg-radial-gradient-dark">
      <Navbar />
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary-500/10 dark:bg-primary-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-cyber-violet/10 dark:bg-cyber-violet/25 blur-[120px] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar />
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 w-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
