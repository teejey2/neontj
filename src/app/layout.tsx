import type { Metadata } from 'next';
import { Orbitron, Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import ErrorBoundary from '@/components/ErrorBoundary';
import Counter from '@/components/Counter';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-heading',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://neontj.com'),
  title: 'NEONTJ | Custom LED Neon Signs | Fastest in New Orleans',
  description: 'Premium custom LED neon signs with free 2-day shipping and same-day local delivery in Orleans Parish. Not the cheapest — just the best.',
  openGraph: {
    title: 'NEONTJ | Custom LED Neon Signs',
    description: 'Premium custom LED neon signs with fast shipping',
    images: '/og-image.jpg',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${poppins.variable}`}>
      <body className="relative">
        <ErrorBoundary 
          fallback={<div className="p-8 text-center">An error occurred. Please refresh the page.</div>}
        >
          <Counter />
          <Header />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}