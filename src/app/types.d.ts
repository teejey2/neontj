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

// Remove the duplicate declaration for galleryImages