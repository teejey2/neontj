'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface SignImage {
  id: number;
  src: string;
  alt: string;
}

interface HeroProps {
  setShowModal: (show: boolean) => void;
}

const demoSigns: SignImage[] = [
  { id: 1, src: '/images/signs/sign1.jpg', alt: 'Custom Neon Sign' },
  { id: 2, src: '/images/signs/sign2.jpg', alt: 'LED Neon Art' },
  { id: 3, src: '/images/signs/sign3.jpg', alt: 'Personalized Neon' },
];

export default function Hero({ setShowModal }: HeroProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1">
        {demoSigns.map((sign) => (
          <motion.div
            key={sign.id}
            className="relative bg-bgBlack overflow-hidden"
            initial={{ scale: 1 }}
            animate={{ 
              scale: hoveredId === sign.id ? 1.05 : 1,
              zIndex: hoveredId === sign.id ? 10 : 1
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            onHoverStart={() => setHoveredId(sign.id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            <Image
              src={sign.src}
              alt={sign.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 20vw"
              priority={sign.id <= 3}
            />
          </motion.div>
        ))}
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-bgBlack/60 z-20">
        <motion.h1 
          className="text-5xl md:text-7xl font-heading mb-6 text-center neon-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          NEON<span className="text-iceBlue">TJ</span>
        </motion.h1>
        
        <motion.button
          className="neon-button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
        >
          Get Your Custom Quote — FAST
        </motion.button>
      </div>
    </section>
  );
}