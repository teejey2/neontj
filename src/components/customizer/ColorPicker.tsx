'use client';
import React, { useState, useRef, ChangeEvent, useLayoutEffect } from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

export default function ColorPicker({
  selectedColor,
  onSelect,
}: ColorPickerProps) {
  const colors = [
    { name: 'Purple', value: '#B800FF' },
    { name: 'Ice Blue', value: '#00FFFF' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Pink', value: '#FF00FF' },
    { name: 'Green', value: '#00FF00' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Orange', value: '#FF8000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Custom', value: 'custom' },
  ];

  const [customColor, setCustomColor] = useState(
    selectedColor.startsWith('#') ? selectedColor : '#B800FF'
  );
  const [showPicker, setShowPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonSize, setButtonSize] = useState(32);

  // recalc button size on mount & resize
  const calculateButtonSize = () => {
    if (!containerRef.current) return 32;
    const width = containerRef.current.clientWidth;
    // limit: up to 32px, but not wider than container / colors.length
    return Math.min(32, Math.floor((width - (colors.length - 1) * 8) / colors.length));
  };
  useLayoutEffect(() => {
    const onResize = () => setButtonSize(calculateButtonSize());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleColorSelect = (value: string) => {
    if (value === 'custom') {
      setShowPicker(true);
      if (!colors.some(c => c.value === selectedColor)) {
        onSelect(customColor);
      }
    } else {
      setShowPicker(false);
      onSelect(value);
    }
  };

  const handleCustomColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onSelect(newColor);
  };

  return (
    <div
      className="bg-bgBlack/50 border border-neonPurple/30 rounded-xl p-4 max-w-[360px] mx-auto"
      ref={containerRef}
    >
      <h3 className="text-base font-heading text-iceBlue mb-2 text-center">
        SELECT COLOR
      </h3>
      <p className="text-xs mb-3 text-center">Choose your neon color</p>

      {/* horizontal, scrollable row */}
      <div className="flex space-x-2 overflow-x-auto py-1 px-1">
        {colors.map(color => {
          const isSelected =
            selectedColor === color.value ||
            (color.value === 'custom' && selectedColor === customColor);
          return (
            <button
              key={color.value}
              onClick={() => handleColorSelect(color.value)}
              title={color.name}
              aria-label={color.name}
              className={`
                flex-shrink-0
                rounded
                border
                relative
                overflow-hidden
                transition-all
                duration-300
                ${isSelected
                  ? 'border-neonPurple shadow-[0_0_4px_1px_rgba(255,0,255,0.7)]'
                  : 'border-gray-600 hover:border-iceBlue'}
              `}
              style={{
                width: `${buttonSize}px`,
                height: `${buttonSize}px`,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    color.value === 'custom'
                      ? 'linear-gradient(45deg, #B800FF, #FF00FF, #FFCC00)'
                      : color.value,
                }}
              />
              {isSelected && (
                <svg
                  className="relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    width: `${buttonSize * 0.4}px`,
                    height: `${buttonSize * 0.4}px`,
                    margin: 'auto',
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {showPicker && (
        <div className="mt-3 flex flex-col items-center">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-full h-8 cursor-pointer max-w-[200px]"
            aria-label="Custom color picker"
          />
          <div className="mt-1 flex items-center">
            <div
              className="w-5 h-5 border border-white mr-1"
              style={{ backgroundColor: customColor }}
            />
            <span className="text-xs">{customColor.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
