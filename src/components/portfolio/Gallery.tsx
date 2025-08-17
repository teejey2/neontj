'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedSignImage {
  id: number;
  src: string;
  alt: string;
  blurDataURL: string;
}

interface GalleryProps {
  initialImages: EnhancedSignImage[];
}

export default function Gallery({ initialImages }: GalleryProps) {
  const [images] = useState<EnhancedSignImage[]>(initialImages);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const loadMoreImages = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 12, images.length));
      setIsLoading(false);
    }, 800);
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": images.slice(0, visibleCount).map((image, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": image.alt,
        "image": image.src,
        "description": `Custom neon sign - ${image.alt}`
      }
    }))
  };

  return (
    <main className="py-12 px-4 bg-bgBlack">
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-6xl font-heading mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="neon-text">Our</span> Portfolio
          </motion.h1>
          <motion.p
            className="text-xl text-neon-ice max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Browse our collection of custom neon signs created for clients worldwide
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.slice(0, visibleCount).map((image) => (
            <motion.div
              key={image.id}
              className="relative group bg-bgBlack/50 border border-neon-purple/30 rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredId(image.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 
                         (max-width: 1024px) 50vw, 
                         33vw"
                  placeholder="blur"
                  blurDataURL={image.blurDataURL}
                  priority={image.id < 5}
                />
                
                <AnimatePresence>
                  {hoveredId === image.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h3 className="text-white text-lg font-bold">
                        {image.alt}
                      </h3>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < images.length && (
          <div className="mt-12 text-center">
            <motion.button
              className="neon-button px-8 py-4 text-xl min-w-[200px]"
              onClick={loadMoreImages}
              disabled={isLoading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-current" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </div>
              ) : 'Load More'}
            </motion.button>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-6">
            <h2 className="text-3xl font-heading neon-text mb-4">
              Ready to Create Your Own?
            </h2>
            <p className="text-xl text-neon-ice max-w-2xl mx-auto">
              Design a custom neon sign that perfectly matches your style
            </p>
          </div>
          
          <Link href="/custom-sign">
            <motion.button
              className="neon-button px-8 py-4 text-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Design Your Custom Sign
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}