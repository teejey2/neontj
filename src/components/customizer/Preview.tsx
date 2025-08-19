/* src/components/customizer/Preview.tsx */
"use client";

import React, { useMemo } from "react";
import type { FontId } from "@/lib/fonts";

export type BackboardStyle = "cut-to-letter" | "rectangle" | "rounded" | "circle";
export type BackboardColor = "clear" | "black" | "white" | "red";

type Props = {
  id?: string;
  text: string;
  fontId: FontId | string;
  singleColor: string;
  multicolor: boolean;
  perLetter: string[];
  backStyle: BackboardStyle;
  backColor: BackboardColor;
  onSelectIndex?: (i: number) => void;
  activeIndex?: number | null;
};

const BACK_COLORS: Record<BackboardColor, string> = {
  clear: "rgba(255,255,255,0.04)",
  black: "rgba(0,0,0,0.96)",
  white: "rgba(255,255,255,0.96)",
  red:   "rgba(180,16,32,0.92)",
};

const neonStack = (hex: string) =>
  `0 0 1px ${hex}, 0 0 3px ${hex}, 0 0 6px ${hex}, 0 0 12px ${hex}`;

export default function Preview({
  id,
  text,
  fontId,
  singleColor,
  multicolor,
  perLetter,
  backStyle,
  backColor,
  onSelectIndex,
  activeIndex = null,
}: Props) {
  // fixed SVG canvas
  const vb = { w: 1000, h: 600 };

  const lines = useMemo(() => text.split("\n"), [text]);
  const flat = useMemo(() => text.replace(/\n/g, ""), [text]);
  const maxLineLen = useMemo(() => Math.max(1, ...lines.map((l) => l.length || 1)), [lines]);

  // centered content box
  const box = { x: (vb.w - 760) / 2, y: (vb.h - 380) / 2, w: 760, h: 380 };
  const fontPx = Math.max(40, Math.min(120, Math.floor(900 / maxLineLen)));
  const lineHeight = Math.round(fontPx * 1.12);

  // acrylic board geometry
  const board = (() => {
    if (backStyle === "cut-to-letter") return null;
    const fill = BACK_COLORS[backColor] || BACK_COLORS.clear;

    if (backStyle === "circle") {
      const r = 230;
      return (
        <circle
          cx={vb.w / 2}
          cy={vb.h / 2}
          r={r}
          fill={fill}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
      );
    }

    const w = 780;
    const h = 360;
    const rx = backStyle === "rounded" ? 22 : 8;
    return (
      <rect
        x={(vb.w - w) / 2}
        y={(vb.h - h) / 2}
        width={w}
        height={h}
        rx={rx}
        ry={rx}
        fill={fill}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
    );
  })();

  // per-letter render inside foreignObject (keeps click + color)
  let globalIndex = 0;
  const renderedLines = lines.map((ln, li) => {
    const chars = ln.split("").map((ch) => {
      const i = globalIndex++;
      const isSpace = ch === " ";
      const color = multicolor ? (perLetter[i] || singleColor) : singleColor;
      const active = activeIndex === i && !isSpace;

      return (
        <span
          key={i}
          onClick={() => !isSpace && onSelectIndex?.(i)}
          style={{
            color,
            textShadow: neonStack(color),
            outline: active ? `2px solid ${color}` : "none",
            borderRadius: active ? 6 : 0,
            boxShadow: active ? `0 0 8px ${color}` : "none",
            padding: active ? "0 2px" : undefined,
          }}
          className={isSpace ? "inline-block w-[0.45em]" : "cursor-pointer select-none"}
          aria-label={isSpace ? undefined : `Character ${ch}`}
        >
          {isSpace ? "\u00A0" : ch}
        </span>
      );
    });

    return (
      <div key={`line-${li}`} className="leading-tight">
        {chars}
      </div>
    );
  });

  return (
    <div id={id} className="w-full">
      <svg
        viewBox={`0 0 ${vb.w} ${vb.h}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full rounded-2xl border border-white/10"
      >
        {/* background wall */}
        <image
          href="/images/rooms/dark-wall.jpg"
          x="0"
          y="0"
          width={vb.w}
          height={vb.h}
          preserveAspectRatio="xMidYMid slice"
        />
        {/* subtle veil */}
        <rect x="0" y="0" width={vb.w} height={vb.h} fill="rgba(0,0,0,0.35)" />

        {/* acrylic */}
        {board}

        {/* text box (XHTML namespace not required to be explicitly set here) */}
        <foreignObject x={box.x} y={box.y} width={box.w} height={box.h}>
          <div
            className="flex h-full w-full items-center justify-center text-center"
            style={{
              fontFamily: `var(--font-${fontId}), var(--font-inter), system-ui, sans-serif`,
              fontSize: `${fontPx}px`,
              lineHeight: `${lineHeight}px`,
              WebkitTextStroke: "0.25px rgba(255,255,255,0.12)",
            }}
            data-font={fontId as string}
          >
            <div>{renderedLines}</div>
          </div>
        </foreignObject>

        {/* selected badge (bottom-left) */}
        {multicolor && activeIndex !== null && activeIndex >= 0 && activeIndex < flat.length && (
          <foreignObject x="16" y={vb.h - 32} width="260" height="24">
            <div className="rounded bg-black/70 px-2 py-0.5 text-[11px] text-white/90">
              Selected: letter {activeIndex + 1} ({flat[activeIndex]})
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
}
