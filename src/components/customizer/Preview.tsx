// 8) src/components/customizer/Preview.tsx
// ================================
"use client";
import React, { useMemo } from "react";
import { fontClassFor, type FontId } from "@/lib/fonts";

export type PreviewProps = {
  text: string;
  fontId: FontId;
  singleColor: string;
  multicolor: boolean;
  perLetter: string[];
  onSelectIndex: (i: number) => void;
};

const NeonDefs = () => (
  <defs>
    <filter id="neonGlow" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="2" result="soft" />
      <feMerge>
        <feMergeNode in="soft" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

export function Preview({ text, fontId, singleColor, multicolor, perLetter, onSelectIndex }: PreviewProps) {
  const lines = useMemo(() => text.split("\n"), [text]);
  const flat = useMemo(() => text.replace(/\n/g, ""), [text]);

  let cursor = 0;
  const lineMaps = lines.map((line) => {
    const start = cursor;
    cursor += line.length;
    return { start, end: cursor, line };
  });

  return (
    <div className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl bg-[url('/assets/room-light.jpg')] bg-cover bg-center shadow-2xl">
      <svg viewBox="0 0 1600 1000" className="absolute inset-0">
        <NeonDefs />
        {lineMaps.map((m, li) => (
          <text key={li} x={200} y={280 + li * 190} fontSize={150} className={`${fontClassFor(fontId)}`} style={{ filter: "url(#neonGlow)" }}>
            {m.line.split("").map((ch, i) => {
              const flatIndex = m.start + i;
              const fill = multicolor ? perLetter[flatIndex] || singleColor : singleColor;
              return (
                <tspan key={flatIndex} fill={fill} onClick={() => multicolor && onSelectIndex(flatIndex)} style={{ cursor: multicolor ? "pointer" : "default", userSelect: "none" }}>
                  {ch || " "}
                </tspan>
              );
            })}
          </text>
        ))}
      </svg>
      {multicolor && (
        <div className="absolute left-4 top-4 rounded-md bg-black/55 px-3 py-1 text-xs text-white">Click a letter, then pick a color →</div>
      )}
    </div>
  );
}
