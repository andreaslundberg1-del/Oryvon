"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransitionOverlayProps {
  activeYear: number;
}

export default function TransitionOverlay({ activeYear }: TransitionOverlayProps) {
  const [prevYear, setPrevYear] = useState(activeYear);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (activeYear !== prevYear) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPrevYear(activeYear);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeYear, prevYear]);

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          key={`overlay-${activeYear}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
        >
          {/* Flash Effect */}
          <motion.div 
            key="flash"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 2, 0], opacity: [0, 0.5, 0] }}
            className="absolute inset-0 bg-white"
          />
          
          {/* Glitch Scanlines during transition */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.1)_50%)] bg-[length:100%_4px] animate-pulse" />
          
          {/* Year Change Text */}
          <motion.div
            key="year-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-white text-9xl font-black italic tracking-tighter"
          >
            {activeYear}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
