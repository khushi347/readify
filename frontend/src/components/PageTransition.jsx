import React from 'react';
import { motion } from 'framer-motion';
import './PageTransition.css';

const PageTransition = ({ children }) => {
  return (
    <div className="page-transition-container">
      {/* Cinematic page sweep overlay */}
      <motion.div
        className="page-sweep-overlay"
        initial={{ skewX: -10, x: '100%' }}
        animate={{ 
          x: '-100%',
          skewX: [ -10, 5, 0, -5, -10 ],
          transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } 
        }}
        exit={{ 
          x: '100%',
          skewX: [ -10, -5, 0, 5, -10 ],
          transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } 
        }}
      >
        <div className="page-sweep-shadow" />
      </motion.div>

      {/* Main Content Animation */}
      <motion.div
        className="page-content-wrapper"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.25, duration: 0.6, ease: 'easeOut' } }}
        exit={{ opacity: 0, x: -20, transition: { duration: 0.4, ease: 'easeIn' } }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PageTransition;
