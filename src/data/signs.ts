export interface SignImage {
  id: number;
  src: string;
  alt: string;
  category?: string;
}

// This is only used in the gallery component
export const galleryImages: SignImage[] = [
  { id: 1, src: "/images/gallery/gallery1.jpg", alt: "Custom Neon Bar Sign" },
  { id: 2, src: "/images/gallery/gallery2.jpg", alt: "Personalized Name Neon" },
  { id: 3, src: "/images/gallery/gallery3.jpg", alt: "LED Business Sign" },
  { id: 4, src: "/images/gallery/gallery4.jpg", alt: "Home Decor Neon" },
  { id: 5, src: "/images/gallery/gallery5.jpg", alt: "Wedding Neon Art" },
  { id: 6, src: "/images/gallery/gallery6.jpg", alt: "Music Themed Sign" },
  { id: 7, src: "/images/gallery/gallery7.jpg", alt: "Sports Team Neon" },
  { id: 8, src: "/images/gallery/gallery8.jpg", alt: "Quotation Sign" },
  { id: 9, src: "/images/gallery/gallery9.jpg", alt: "Logo Design" },
  { id: 10, src: "/images/gallery/gallery10.jpg", alt: "Custom Shape" },
  { id: 11, src: "/images/gallery/gallery11.jpg", alt: "Special Event Sign" },
  { id: 12, src: "/images/gallery/gallery12.jpg", alt: "Large Wall Piece" },
];