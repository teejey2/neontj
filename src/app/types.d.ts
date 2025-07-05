declare module '@/app/components/Hero' {
  import { ReactNode } from 'react';
  interface HeroProps {
    setShowModal: (show: boolean) => void;
  }
  const Hero: (props: HeroProps) => ReactNode;
  export default Hero;
}

declare module '@/app/components/Counter' {
  import { ReactNode } from 'react';
  const Counter: () => ReactNode;
  export default Counter;
}

declare module '@/data/signs' {
  interface SignImage {
    id: number;
    src: string;
    alt: string;
    category?: string;
  }
  export const signImages: SignImage[];
  export const galleryImages: SignImage[];
}