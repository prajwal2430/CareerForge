import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', variant = 'default', hover = true, ...props }) => {
  const baseClass = variant === 'accent' ? 'glass-card-accent' : 'glass-card';
  const hoverClass = hover ? '' : 'no-hover';
  
  return (
    <motion.div 
      className={`${baseClass} ${hoverClass} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
