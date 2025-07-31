// src/app/custom-sign/text/page.tsx
'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import PreviewCanvas from '@/components/customizer/PreviewCanvas';
import FontSelector from '@/components/customizer/FontSelector';
import ColorPicker from '@/components/customizer/ColorPicker';
import BackboardOptions from '@/components/customizer/BackboardOptions';
import { getPriceDetails } from '@/utils/pricing';
import { pricingTable } from '@/data/pricing';

interface Font {
  id: string;
  name: string;
  category: string;
}

interface SignConfig {
  line1: string;
  line2: string;
  font: string;
  lineCount: number;
  size: string;
  color: string;
  backboardStyle: string;
  backboardColor: string;
  price: number;
}

const fonts: Font[] = [
  { id: 'Orbitron', name: 'Orbitron', category: 'Modern' },
  { id: 'Rajdhani', name: 'Rajdhani', category: 'Tech' },
  { id: 'Monoton', name: 'Monoton', category: 'Classic' },
  { id: 'Audiowide', name: 'Audiowide', category: 'Retro' },
  { id: 'Press Start 2P', name: 'Press Start 2P', category: 'Arcade' },
];

export default function CustomSignPage() {
  const [signConfig, setSignConfig] = useState<SignConfig>({
    line1: 'HELLO',
    line2: 'WORLD',
    font: 'Orbitron',
    lineCount: 1,
    size: '18"x24"',
    color: '#B800FF',
    backboardStyle: 'rectangle',
    backboardColor: 'clear',
    price: getPriceDetails(169).finalPrice
  });

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const sizes = signConfig.lineCount === 1 ? pricingTable.oneLine : pricingTable.twoLine;
    const selectedSize = sizes.find(s => s.size === signConfig.size);
    if (selectedSize) {
      const priceDetails = getPriceDetails(selectedSize.basePrice);
      setSignConfig(prev => ({
        ...prev,
        price: priceDetails.finalPrice
      }));
    }
  }, [signConfig.size, signConfig.lineCount]);

  const updateConfig = useCallback((key: keyof SignConfig, value: any) => {
    setSignConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleGetQuote = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    const quoteData = {
      ...signConfig,
      email,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/send-quote', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      });

      if (response.ok) {
        alert('Your quote request has been sent! We will email you shortly.');
        setEmail('');
      } else {
        alert('Failed to send quote. Please try again.');
      }
    } catch (error) {
      console.error('Error', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgBlack text-ledWhite">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-6xl font-heading mb-4 neon-text">
            Design Your Custom Sign
          </h2>
          <p className="text-xl text-iceBlue">
            Create and preview your custom neon sign in real-time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Panel */}
          <div className="lg:col-span-2 bg-bgBlack/50 border border-neonPurple/30 rounded-xl p-6">
            <PreviewCanvas config={signConfig}/>
            {/* Total Price Only */}
            <div className="mt-6 p-4 bg-bgBlack/70 border border-neonPurple/30 rounded-lg text-center">
              <div className="text-2xl font-heading neon-text">
                Estimated Price: ${signConfig.price.toFixed(2)}
              </div>
              <p className="text-sm text-iceBlue mt-2">
                Final price confirmed after design review
              </p>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="space-y-8">
            {/* Text Input */}
            <div className="bg-bgBlack/50 border border-neonPurple/30 rounded-xl p-6">
              <h3 className="text-xl font-heading text-iceBlue mb-4">
                YOUR TEXT
              </h3>

              {/* Line 1 */}
              <input
                type="text"
                value={signConfig.line1}
                onChange={(e) => updateConfig('line1', e.target.value.toUpperCase())}
                className="w-full bg-bgBlack border border-neonPurple rounded-lg px-4 py-3 text-xl text-center font-heading focus:outline-none focus:ring-2 focus:ring-iceBlue mb-4"
                placeholder="Line 1"
                maxLength={20}
              />

              {/* Line 2 (only shown if 2 lines selected) */}
              {signConfig.lineCount === 2 && (
                <input
                  type="text"
                  value={signConfig.line2}
                  onChange={(e) => updateConfig('line2', e.target.value.toUpperCase())}
                  className="w-full bg-bgBlack border border-neonPurple rounded-lg px-4 py-3 text-xl text-center font-heading focus:outline-none focus:ring-2 focus:ring-iceBlue"
                  placeholder="Line 2"
                  maxLength={20}
                />
              )}

              <div className="flex justify-center mt-4 space-x-2">
                {[1, 2].map((lines) => (
                  <button
                    key={lines}
                    className={`px-4 py-2 rounded-full ${
                      signConfig.lineCount === lines
                        ? 'bg-neonPurple text-bgBlack'
                        : 'bg-bgBlack border border-neonPurple'
                    }`}
                    onClick={() => updateConfig('lineCount', lines)}
                  >
                    {lines} Line{lines > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="bg-bgBlack/50 border border-neonPurple/30 rounded-xl p-6">
              <h3 className="text-xl font-heading text-iceBlue mb-4">
                SELECT SIZE
              </h3>

              <div className="flex flex-wrap gap-2">
                {signConfig.lineCount === 1
                  ? pricingTable.oneLine.map((size) => (
                      <button
                        key={size.size}
                        className={`px-4 py-2 rounded-full ${
                          signConfig.size === size.size
                            ? 'bg-neonPurple text-bgBlack shadow-neon'
                            : 'bg-bgBlack border border-neonPurple hover:border-iceBlue'
                        }`}
                        onClick={() => updateConfig('size', size.size)}
                      > 
                        {size.size}
                      </button>
                    ))
                  : pricingTable.twoLine.map((size) => (
                      <button
                        key={size.size}
                        className={`px-4 py-2 rounded-full ${
                          signConfig.size === size.size
                            ? 'bg-neonPurple text-bgBlack shadow-neon'
                            : 'bg-bgBlack border border-neonPurple hover:border-iceBlue'
                        }`}
                        onClick={() => updateConfig('size', size.size)}
                      > 
                        {size.size}
                      </button>
                    ))}
              </div>
            </div>

            <FontSelector
              fonts={fonts}
              selectedFont={signConfig.font}
              onSelect={(font) => updateConfig('font', font)}
            />

            <ColorPicker
              selectedColor={signConfig.color}
              onSelect={(color) => updateConfig('color', color)}
            />

            <BackboardOptions
              selectedStyle={signConfig.backboardStyle}
              selectedColor={signConfig.backboardColor}
              onStyleSelect={(style) => updateConfig('backboardStyle', style)}
              onColorSelect={(color) => updateConfig('backboardColor', color)}
            />

            <div className="bg-gradient-to-r from-neonPurple/30 to-iceBlue/20 rounded-xl p-6 text-center">
              <div className="text-2xl font-heading mb-4">
                Ready for a Quote? <span className="neon-text">${signConfig.price.toFixed(2)}</span>
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bgBlack border border-neonPurple rounded-lg px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-iceBlue"
                  placeholder="your@email.com"
                  required
                />
                <p className="text-xs text-iceBlue mt-1">Where should we send your quote?</p>
              </div>

              <button
                className={`neon-button w-full py-4 text-xl ${!email || isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={handleGetQuote}
                disabled={!email || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-current" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </div>
                ) : 'Get Quote'}
              </button>
              <p className="mt-4 text-sm text-iceBlue">
                We&apos;ll email you within 24 hours to finalize your design
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}