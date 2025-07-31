'use client';

import { getPriceDetails } from '@/utils/pricing';
import { pricingTable } from '@/data/pricing';

interface SizeOption {
  size: string;
  dimensions: string;
  basePrice: number;
}

interface SizeSelectorProps {
  lineCount: number;
  selectedSize: string;
  onSelect: (size: string) => void;
}

export default function SizeSelector({
  lineCount,
  selectedSize,
  onSelect,
}: SizeSelectorProps) {
  const sizes: SizeOption[] =
    lineCount === 1 ? pricingTable.oneLine : pricingTable.twoLine;

  return (
    <div className="bg-bgBlack/50 border border-neonPurple/30 rounded-xl p-6">
      <h3 className="text-xl font-heading text-iceBlue mb-4">
        {lineCount === 1 ? 'ONE-LINE' : 'TWO-LINE'} PRICING
      </h3>

      <div className="max-h-[300px] overflow-y-auto pr-2">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-neonPurple/30">
              <th className="text-left py-2">Size</th>
              <th className="text-left py-2">Dimensions</th>
              <th className="text-right py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((opt) => {
              const finalPrice = getPriceDetails(opt.basePrice).finalPrice;
              return (
                <tr
                  key={opt.size}
                  className={`cursor-pointer border-b border-neonPurple/10 hover:bg-neonPurple/10 ${
                    selectedSize === opt.size ? 'bg-neonPurple/20' : ''
                  }`}
                  onClick={() => onSelect(opt.size)}
                >
                  <td className="py-2">{opt.size}</td>
                  <td className="py-2 text-sm text-iceBlue/80">
                    {opt.dimensions}
                  </td>
                  <td className="py-2 text-right font-mono">
                    ${finalPrice.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
