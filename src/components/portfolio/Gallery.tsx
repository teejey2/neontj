'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { EnhancedSignImage } from '@/lib/gallery';

export default function Gallery({ initialImages }: { initialImages: EnhancedSignImage[] }) {
  const [loading, setLoading] = useState(false);
  const [visibleImages, setVisibleImages] = useState(12);
  const [images] = useState<EnhancedSignImage[]>(initialImages);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleImages(prev => Math.min(prev + 12, images.length));
      setLoading(false);
    }, 800);
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": images.slice(0, visibleImages).map((image, index) => ({
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
    <main className="py-20">
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-heading mb-4">
            <span className="neon-text">Our</span> Portfolio
          </h1>
          <p className="text-xl text-iceBlue max-w-2xl mx-auto">
            Browse through our collection of custom neon signs created for clients worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.slice(0, visibleImages).map((image) => (
            <div 
              key={image.id} 
              className="bg-bgBlack/50 border border-neonPurple/30 rounded-xl overflow-hidden transition-all hover:shadow-neon group"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={image.blurDataURL}
                />
              </div>
              <div className="p-4">
                <p className="text-ledWhite font-medium group-hover:text-iceBlue transition-colors">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {visibleImages < images.length && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="neon-button px-8 py-4 text-xl min-w-[200px]"
              aria-label="Load more portfolio items"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-current" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </div>
              ) : 'Load More'}
            </button>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/custom-sign">
            <button 
              className="neon-button px-8 py-4 text-xl"
              aria-label="Create your custom neon sign"
            >
              Create Your Custom Sign
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}