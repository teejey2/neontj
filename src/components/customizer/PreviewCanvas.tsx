import { motion } from 'framer-motion';

interface PreviewCanvasProps {
  config: {
    line1: string;
    line2: string;
    lineCount: number;
    font: string;
    color: string;
    size: string;
    backboardStyle: string;
    backboardColor: string;
  };
}

export default function PreviewCanvas({ config }: PreviewCanvasProps) {
  // Add glow effect based on color
  const textGlow = {
    filter: `drop-shadow(0 0 5px ${config.color}) 
             drop-shadow(0 0 15px ${config.color}80)`,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div 
        className="relative w-full max-w-lg aspect-square bg-black border-2 border-dashed border-neonPurple/30 rounded-lg flex items-center justify-center"
        style={{
          background: config.backboardColor === 'clear'
            ? 'transparent'
            : config.backboardColor === 'black'
            ? '#000'
            : config.backboardColor === 'white'
            ? '#F8F8F8'
            : 'linear-gradient(45deg, #00000D, #333)'
        }}
      >
        <div className="text-center p-8">
          {/* Line 1 */}
          <motion.div
            className="my-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="font-heading inline-block"
              style={{
                fontFamily: config.font,
                color: config.color,
                fontSize: '4rem',
                ...textGlow
              }}
            >
              {config.line1 || 'LINE 1'}
            </div>
          </motion.div>
          
          {/* Line 2 (only shown if 2 lines selected) */}
          {config.lineCount === 2 && (
            <motion.div
              className="my-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className="font-heading inline-block"
                style={{
                  fontFamily: config.font,
                  color: config.color,
                  fontSize: '4rem',
                  ...textGlow
                }}
              >
                {config.line2 || 'LINE 2'}
              </div>
            </motion.div>
          )}
        </div>

        {/* Size banner in bottom right */}
        <div className="absolute bottom-4 right-4 text-sm bg-bgBlack/80 px-3 py-1 rounded-full border border-neonPurple">
          {config.size}
        </div>
      </div>
    </div>
  );
}