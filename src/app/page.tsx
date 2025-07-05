'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Hero from './components/Hero';
import Counter from './components/Counter';

const galleryImages = [
  { id: 1, src: '/images/gallery/gallery1.jpg', alt: 'Neon Sign Example 1' },
  { id: 2, src: '/images/gallery/gallery2.jpg', alt: 'Neon Sign Example 2' },
];

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="min-h-screen">
      <Counter />
      <Hero setShowModal={setShowModal} />

      <section className="bg-gradient-to-r from-neonPurple/20 to-iceBlue/20 py-8">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <StatItem value="2-Day" label="FAST SHIPPING" />
          <StatItem value="FREE" label="ORLEANS DELIVERY" />
          <StatItem value="100%" label="SATISFACTION" />
          <StatItem value="1,218+" label="SIGNS LIT" neon />
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-heading mb-4">
            <span className="neon-text">Recent</span> Creations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <GalleryItem key={image.id} src={image.src} alt={image.alt} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-bgBlack to-neonPurple/10">
        <div className="container mx-auto px-4 text-center">
          <button 
            className="neon-button px-8 py-4 text-xl"
            onClick={() => setShowModal(true)}
          >
            Design Your Sign Now
          </button>
        </div>
      </section>
    </main>
  );
}

function StatItem({ value, label, neon = false }: { value: string, label: string, neon?: boolean }) {
  return (
    <div className="p-4">
      <h3 className={`text-3xl md:text-4xl font-heading ${neon ? 'neon-text' : 'text-iceBlue'}`}>
        {value}
      </h3>
      <p className="text-sm uppercase tracking-widest">{label}</p>
    </div>
  );
}

function GalleryItem({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div 
      className="aspect-square bg-bgBlack border border-neonPurple/30 rounded-lg overflow-hidden neon-glow"
      whileHover={{ scale: 1.02 }}
    >
      <Image
        src={src}
        alt={alt}
        width={600}
        height={600}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}