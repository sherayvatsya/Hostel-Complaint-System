import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', onClick, hoverEffect = true, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={hoverEffect ? { y: -5, boxShadow: '0 12px 40px 0 rgba(99, 102, 241, 0.15)' } : {}}
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 transition-shadow duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
