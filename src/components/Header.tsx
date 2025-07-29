'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'SHOP ALL', path: '/shop' },
    { label: 'CUSTOM NEON SIGN', path: '/custom-sign' },
    { label: 'SUBMIT LOGO', path: '/submit-logo' },
    { label: 'PORTFOLIO', path: '/portfolio' },
  ];

  return (
    <header className="bg-bgBlack border-b border-neonPurple/20 py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <motion.h1
          className="text-3xl font-heading neon-text mb-4 md:mb-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/">NEONTJ</Link>
        </motion.h1>

        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className={`hover:text-neonPurple transition-colors px-2 py-1 rounded ${
                pathname === item.path ||
                (item.path === '/custom-sign' && pathname.startsWith('/custom-sign'))
                  ? 'bg-neonPurple text-bgBlack'
                  : 'hover:bg-bgBlack/50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}