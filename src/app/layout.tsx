import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import Counter from '@/app/components/Counter';

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-heading',
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'NEONTJ | Custom LED Neon Signs | Fastest in New Orleans',
  description: 'Premium custom LED neon signs with free 2-day shipping and same-day local delivery in Orleans Parish. Not the cheapest — just the best.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <body className="relative">
        <Counter />
        {children}
      </body>
    </html>
  );
}