'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { name: 'Custom Neon Bar Sign', image: '/assets/portfolio/bar.jpg' },
  { name: 'Personalized Name Neon', image: '/assets/portfolio/name.jpg' },
  { name: 'LED Business Sign', image: '/assets/portfolio/business.jpg' },
  { name: 'Home Decor Neon', image: '/assets/portfolio/home.jpg' },
  { name: 'Wedding Neon Art', image: '/assets/portfolio/wedding.jpg' },
  { name: 'Music Themed Sign', image: '/assets/portfolio/music.jpg' },
  { name: 'Sports Team Neon', image: '/assets/portfolio/sports.jpg' },
  { name: 'Quotation Sign', image: '/assets/portfolio/quote.jpg' },
  { name: 'Logo Design', image: '/assets/portfolio/logo.jpg' },
  { name: 'Custom Shape', image: '/assets/portfolio/shape.jpg' },
  { name: 'Special Event Sign', image: '/assets/portfolio/event.jpg' },
  { name: 'Large Wall Piece', image: '/assets/portfolio/large.jpg' },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-bgBlack text-white px-6 py-12">
      <h1 className="text-4xl font-heading text-center text-iceBlue mb-10">Neon Sign Portfolio</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group relative rounded-xl overflow-hidden border border-neonPurple/50 hover:shadow-neon transition-all duration-300"
          >
            <Image
              src={category.image}
              alt={category.name}
              width={500}
              height={300}
              className="object-cover w-full h-60 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-lg font-bold text-white text-center px-4">{category.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
