// src/app/custom-sign/page.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CustomSignSelection() {
  return (
    <div className="min-h-screen bg-bgBlack text-ledWhite flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-4xl w-full"
      >
        <h1 className="text-4xl md:text-6xl font-heading text-center mb-8 neon-text">
          Design Your Neon Sign
        </h1>
        <p className="text-center text-xl text-iceBlue mb-12">
          SELECT SIGN TYPE
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/custom-sign/text">
            <motion.div
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="bg-bgBlack/50 border border-neonPurple/30 rounded-xl p-8 flex flex-col items-center cursor-pointer"
            >
              <h2 className="text-2xl font-heading text-iceBlue mb-4">Text Only</h2>
              <p className="text-center mb-6">
                Create a custom sign with your text. Choose font, color, and size.
                Order directly with live preview.
              </p>
              <div className="mt-auto">
                <button className="neon-button px-6 py-3">Create Text Sign</button>
              </div>
            </motion.div>
          </Link>

          <Link href="/custom-sign/logo">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-bgBlack/50 border border-neonPurple/30 rounded-xl p-8 flex flex-col items-center cursor-pointer"
            >
              <h2 className="text-2xl font-heading text-iceBlue mb-4">Logo/Image Upload</h2>
              <p className="text-center mb-6">
                Upload your logo or design. We'll create a custom quote and contact you.
              </p>
              <div className="mt-auto">
                <button className="neon-button px-6 py-3">Upload Design</button>
              </div>
            </motion.div>
          </Link>
        </div>

        <p className="text-center mt-12 text-iceBlue">
          ** All signs include a remote dimmer!
        </p>
      </motion.div>
    </div>
  );
}