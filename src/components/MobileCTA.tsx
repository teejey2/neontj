"use client";
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

export default function MobileCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 380);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-bgBlack border-t border-neonPurple z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <div className="container mx-auto px-4 py-3 flex justify-center">
            <Link href="/custom-sign" className="w-full">
              <button className="neon-button w-full py-3 text-center">
                Design Your Sign Now
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}