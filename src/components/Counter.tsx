'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Counter() {
  const [count, setCount] = useState(1218);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const savedCount = localStorage.getItem('neonSignCount');
    const initialCount = savedCount ? parseInt(savedCount, 10) : 1218;
    setCount(initialCount);
    
    // Only show after 2 seconds delay
    const timer = setTimeout(() => setIsVisible(true), 2000);
    
    const interval = setInterval(() => {
      setCount(prev => {
        const newCount = prev + 1;
        localStorage.setItem('neonSignCount', newCount.toString());
        return newCount;
      });
    }, 1000 * 60 * 60 * 24); // Daily update

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-50 bg-bgBlack/80 backdrop-blur-sm px-3 py-1 rounded-full border border-neonPurple shadow-neon flex items-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      whileHover={{ scale: 1.05 }}
    > 
      <div className="flex items-center gap-1">
        <motion.span
          className="text-neonPurple font-heading text-sm font-bold"
          key={count}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        > 
          {count.toLocaleString()}+
        </motion.span>
        <span className="text-xs text-iceBlue/80">signs lit</span>
      </div>
    </motion.div>
  );
}