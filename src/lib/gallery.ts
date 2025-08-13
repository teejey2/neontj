// src/lib/gallery.ts

interface SignImage {
  id: number;
  src: string;
  alt: string;
}

export interface EnhancedSignImage extends SignImage {
  blurDataURL: string;
}

// Use images present in public/images/gallery (update names if you add more)
const galleryImages: SignImage[] = [
  { id: 1, src: "/images/gallery/gallery1.jpg", alt: "Custom Neon Bar Sign" },
  { id: 2, src: "/images/gallery/gallery2.jpg", alt: "Personalized Name Neon" },
  { id: 3, src: "/images/gallery/gallery3.jpg", alt: "LED Restaurant Sign" },
  { id: 4, src: "/images/gallery/gallery4.jpg", alt: "Home Decor Neon" },
  { id: 5, src: "/images/gallery/gallery5.jpg", alt: "Wedding Neon Art" },
  { id: 6, src: "/images/gallery/gallery6.jpg", alt: "Music Themed Sign" },
  { id: 7, src: "/images/gallery/gallery7.jpg", alt: "Sports Team Neon" },
  { id: 8, src: "/images/gallery/gallery8.jpg", alt: "Inspirational Quote Sign" },
  { id: 9, src: "/images/gallery/gallery9.jpg", alt: "Business Logo Design" },
  { id: 10, src: "/images/gallery/gallery10.jpg", alt: "Custom Shape Neon" },
  { id: 11, src: "/images/gallery/gallery11.jpg", alt: "Special Event Sign" },
];

export function generateBlurDataURL(color: string = "#0D0D0D"): string {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1">
      <rect width="1" height="1" fill="${color}" opacity="0.2"/>
    </svg>`
  ).toString("base64")}`;
}

export async function fetchGalleryImages(): Promise<EnhancedSignImage[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        galleryImages.map((img) => ({
          ...img,
          blurDataURL: generateBlurDataURL(),
        }))
      );
    }, 300);
  });
}
