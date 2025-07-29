import { SignImage } from '@/data/signs';

// Extend the SignImage type with blurDataURL
export interface EnhancedSignImage extends SignImage {
  blurDataURL: string;
}

// Generate placeholder image (1x1 pixel)
function generateBlurDataURL(color: string = "#0D0D0D"): string {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1">
       <rect width="1" height="1" fill="${color}"/>
     </svg>`
  ).toString('base64')}`;
}

// Fetch gallery images with blur placeholders
export async function fetchGalleryImages(): Promise<EnhancedSignImage[]> {
  // Import gallery images directly (no need for duplicate data)
  const { galleryImages } = await import('@/data/signs');
  
  return galleryImages.map(img => ({
    ...img,
    blurDataURL: generateBlurDataURL()
  }));
}