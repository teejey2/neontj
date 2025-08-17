// 6) src/components/customizer/ColorSwatch.tsx
// ================================
"use client";
import React from "react";

const COLORS = [
  { id: "mint", hex: "#B2FFF2" },
  { id: "pink", hex: "#FF6AD5" },
  { id: "iceblue", hex: "#7DF9FF" },
  { id: "white", hex: "#FFFFFF" },
  { id: "yellow", hex: "#FFE66D" },
  { id: "orange", hex: "#FFB254" },
  { id: "purple", hex: "#C084FC" },
  { id: "blue", hex: "#60A5FA" },
  { id: "green", hex: "#86EFAC" },
  { id: "red", hex: "#FCA5A5" },
] as const;

export function ColorSwatch({ selected, onSelect }: { selected: string; onSelect: (hex: string) => void }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {COLORS.map((c) => (
        <button
          key={c.id}
          aria-label={c.id}
          onClick={() => onSelect(c.hex)}
          className={`h-8 w-8 rounded-full border ${selected === c.hex ? "ring-2 ring-violet-400" : "border-white/20"}`}
          style={{ background: c.hex }}
        />
      ))}
    </div>
  );
}