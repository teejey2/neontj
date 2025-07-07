'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Hero from './components/Hero';
import Counter from './components/Counter';

const galleryImages = [
  { id: 1, src: '/images/gallery/gallery1.jpg', alt: 'Custom Neon Bar Sign' },
  { id: 2, src: '/images/gallery/gallery2.jpg', alt: 'Personalized Name Neon' },
  { id: 3, src: '/images/gallery/gallery3.jpg', alt: 'LED Business Sign' },
  { id: 4, src: '/images/gallery/gallery4.jpg', alt: 'Home Decor Neon' },
  { id: 5, src: '/images/gallery/gallery5.jpg', alt: 'Wedding Neon Art' },
  { id: 6, src: '/images/gallery/gallery6.jpg', alt: 'Music Themed Sign' },
  { id: 7, src: '/images/gallery/gallery7.jpg', alt: 'Sports Team Neon' },
  { id: 8, src: '/images/gallery/gallery8.jpg', alt: 'Quotation Sign' },
  { id: 9, src: '/images/gallery/gallery9.jpg', alt: 'Logo Design' },
  { id: 10, src: '/images/gallery/gallery10.jpg', alt: 'Custom Shape' },
  { id: 11, src: '/images/gallery/gallery11.jpg', alt: 'Special Event Sign' },
  { id: 12, src: '/images/gallery/gallery12.jpg', alt: 'Large Wall Piece' },
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
          <StatItem value="MADE" label="IN THE US" />
          <StatItem value="100%" label="SATISFACTION" />
          <StatItem value="1,218+" label="SIGNS LIT" neon />
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-heading mb-4">
            <span className="neon-text">Recent</span> Creations
          </h2>
          
          {/* Updated gallery grid with more columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
      className="relative aspect-square bg-bgBlack border border-neonPurple/30 rounded-lg overflow-hidden neon-glow"
      whileHover={{ scale: 1.05 }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover hover:scale-110 transition-transform duration-300"
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
      />
    </motion.div>
  );
}