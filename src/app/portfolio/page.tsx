import Gallery from '@/components/portfolio/Gallery';
import { fetchGalleryImages } from '@/lib/gallery';
import { Metadata } from 'next';
import LoadingSpinner from '@/components/LoadingSpinner'; // Fixed import
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Portfolio | NEONTJ Custom Neon Signs',
  description: 'Browse our collection of custom LED neon signs created for bars, restaurants, weddings, and home decor',
  openGraph: {
    title: 'Portfolio | NEONTJ Custom Neon Signs',
    description: 'See our stunning collection of custom LED neon signs',
    images: '/images/portfolio/og-image.jpg',
  },
};

async function PortfolioContent() {
  const images = await fetchGalleryImages();
  return <Gallery initialImages={images} />;
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PortfolioContent />
    </Suspense>
  );
}