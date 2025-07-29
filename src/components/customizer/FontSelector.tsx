import { motion } from 'framer-motion';

interface FontSelectorProps {
  fonts: {
    id: string;
    name: string;
    category: string;
  }[];
  selectedFont: string;
  onSelect: (font: string) => void;
}

export default function FontSelector({ 
  fonts, 
  selectedFont, 
  onSelect 
}: FontSelectorProps) {
  return (
    <div className="bg-bgBlack/50 border border-neonPurple/30 rounded-xl p-6">
      <h3 className="text-xl font-heading text-iceBlue mb-4">CHOOSE A FONT</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2">
        {fonts.map((font) => (
          <motion.button
            key={font.id}
            className={`p-3 rounded-lg border-2 text-center ${
              selectedFont === font.id
                ? 'border-neonPurple bg-neonPurple/10 shadow-neon'
                : 'border-gray-700 hover:border-iceBlue'
            }`}
            onClick={() => onSelect(font.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              className="font-heading mb-1 text-lg" 
              style={{ fontFamily: font.id }}
            >
              Aa
            </div>
            <div className="text-xs">{font.name}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}