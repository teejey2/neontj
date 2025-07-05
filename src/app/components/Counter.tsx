'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Counter() {
  const [count, setCount] = useState(1218);
  
  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem('neonSignCount') || '1218');
    setCount(savedCount);
    
    const interval = setInterval(() => {
      setCount(prev => {
        const newCount = prev + 2;
        localStorage.setItem('neonSignCount', newCount.toString());
        return newCount;
      });
    }, 1000 * 60 * 60 * 48);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="fixed top-4 right-4 z-50 bg-bgBlack/80 backdrop-blur-sm px-4 py-2 rounded-full border border-neonPurple shadow-neon"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2">
        <motion.span 
          className="text-neonPurple font-heading text-xl font-bold"
          key={count}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {count.toLocaleString()}+
        </motion.span>
        <span className="text-sm">signs lit</span>
      </div>
    </motion.div>
  );
}