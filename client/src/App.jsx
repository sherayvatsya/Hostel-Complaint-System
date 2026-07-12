import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { motion, useScroll, useSpring } from 'framer-motion';

const App = () => {
  // Setup spring-loaded scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Scroll Progress Bar Indicator */}
          <motion.div
            style={{ scaleX }}
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-cyber-violet to-cyber-pink origin-left z-[9999]"
          />

          {/* Toast Alert popups configuration */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'rgba(30, 41, 59, 0.9)',
                color: '#fff',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '13px',
                fontWeight: '600',
                borderRadius: '12px'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff'
                }
              },
              error: {
                iconTheme: {
                  primary: '#f43f5e',
                  secondary: '#fff'
                }
              }
            }}
          />

          {/* Route views mapping */}
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
