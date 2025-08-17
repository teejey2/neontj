/* src/components/customizer/Preview.tsx */
"use client";

import React, { useMemo } from "react";
import type { FontId } from "@/lib/fonts";

type Props = {
  id?: string;                // <— allow passing an id for capture
  text: string;
  fontId: FontId;
  singleColor: string;
  multicolor: boolean;
  perLetter: string[];
  onSelectIndex?: (i: number) => void;
};

export function Preview({
  id,
  text,
  fontId,
  singleColor,
  multicolor,
  perLetter,
  onSelectIndex,
}: Props) {
  const flat = useMemo(() => text.replace(/\n/g, ""), [text]);
  const lines = useMemo(() => text.split("\n"), [text]);

  const renderChar = (ch: string, i: number) => {
    if (ch === "\n") return null;
    const color = multicolor ? (perLetter[i] || singleColor) : singleColor;
    const isSpace = ch === " ";
    return (
      <span
        key={i}
        onClick={() => onSelectIndex?.(i)}
        style={{ color }}
        className={isSpace ? "inline-block w-2" : "cursor-pointer select-none"}
        aria-label={`Character ${ch}`}
      >
        {isSpace ? "\u00A0" : ch}
      </span>
    );
  };

  let charIndex = 0;
  const renderLines = lines.map((ln, li) => {
    const chars = ln.split("").map((c) => renderChar(c, charIndex++));
    return (
      <div key={`line-${li}`} className="leading-tight">
        {chars}
      </div>
    );
  });

  return (
    <section
      id={id}
      className="relative w-full rounded-2xl border border-white/10 bg-[url('/images/rooms/dark-wall.jpg')] bg-cover bg-center p-4 md:p-6"
      aria-label="Sign preview"
    >
      <div className="absolute inset-0 rounded-2xl bg-black/40 pointer-events-none" />

      {multicolor && (
        <div className="absolute left-4 top-4 z-20 rounded-md bg-black/55 px-3 py-1 text-xs text-white">
          Click a letter, then pick a color →
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-[280px] w-full max-w-2xl items-center justify-center p-6">
        <div
          className="text-center font-heading text-4xl md:text-6xl lg:text-7xl drop-shadow-[0_0_12px_rgba(155,92,255,0.7)]"
          data-font={fontId}
        >
          {renderLines}
        </div>
      </div>
    </section>
  );
}

export default Preview;
