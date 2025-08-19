/* src/components/customizer/OptionsPanel.tsx */
"use client";

import React from "react";
import type { SizeId } from "@/lib/pricing";
import { SIZE_CATALOG } from "@/lib/pricing";
import { FONTS } from "@/lib/fonts";
import type { BackboardStyle, BackboardColor } from "@/components/customizer/Preview";

const BACK_STYLES: { id: BackboardStyle; label: string }[] = [
  { id: "cut-to-letter", label: "Cut to Letter" },
  { id: "rectangle", label: "Rectangle" },
  { id: "rounded", label: "Rounded Rectangle" },
  { id: "circle", label: "Circle" },
];

const BACK_COLORS: { id: BackboardColor; label: string; fill: string }[] = [
  { id: "clear", label: "Clear", fill: "rgba(255,255,255,0.04)" },
  { id: "black", label: "Black", fill: "rgba(0,0,0,0.96)" },
  { id: "white", label: "White", fill: "rgba(255,255,255,0.96)" },
  { id: "red",   label: "Red",   fill: "rgba(180,16,32,0.92)" },
];

const PALETTE = [
  "#FF4BD1", "#9B5CFF", "#3FD5FF", "#B2FFF2",
  "#00FF8A", "#FFD400", "#FF7A00", "#FF2E2E",
];

type Props = {
  text: string; setText: (v: string) => void;
  fontId: string; setFontId: (v: string) => void;
  multicolor: boolean; setMulticolor: (v: boolean) => void;
  singleColor: string; setSingleColor: (v: string) => void;
  activeIndex: number | null; setActiveIndex: (v: number | null) => void;
  perLetter: string[]; setPerLetter: (v: string[]) => void;
  sizeId: SizeId; setSizeId: (v: SizeId) => void;
  backStyle: BackboardStyle; setBackStyle: (v: BackboardStyle) => void;
  backColor: BackboardColor; setBackColor: (v: BackboardColor) => void;
};

export default function OptionsPanel(p: Props) {
  const {
    text, setText,
    fontId, setFontId,
    multicolor, setMulticolor,
    singleColor, setSingleColor,
    activeIndex, setActiveIndex,
    perLetter, setPerLetter,
    sizeId, setSizeId,
    backStyle, setBackStyle,
    backColor, setBackColor,
  } = p;

  const flat = text.replace(/\n/g, "");
  const syncPerLetter = (seed: string) => Array.from({ length: flat.length }, () => seed);

  const applyBaseToAll = (hex: string) => setPerLetter(syncPerLetter(hex));

  const setLetterColor = (hex: string) => {
    if (activeIndex === null || activeIndex < 0 || activeIndex >= flat.length) return;
    const next = perLetter.slice();
    if (next.length !== flat.length) {
      next.length = 0; next.push(...syncPerLetter(singleColor));
    }
    next[activeIndex] = hex;
    setPerLetter(next);
  };

  const handleToggleMulticolor = (on: boolean) => {
    setMulticolor(on);
    if (on) setPerLetter(syncPerLetter(singleColor));
    else setActiveIndex(null);
  };

  const handleBaseColorPick = (hex: string) => {
    setSingleColor(hex);
    if (multicolor) {
      if (activeIndex === null) applyBaseToAll(hex);
      else setLetterColor(hex);
    }
  };

  const goPrev = () => {
    if (!flat.length) return;
    const i = activeIndex === null ? 0 : Math.max(0, activeIndex - 1);
    setActiveIndex(i);
  };

  const goNext = () => {
    if (!flat.length) return;
    const i = activeIndex === null ? 0 : Math.min(flat.length - 1, activeIndex + 1);
    setActiveIndex(i);
  };

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-4">
      {/* TEXT */}
      <div>
        <label className="mb-1 block text-xs text-white/70" htmlFor="opt-text">Your Text</label>
        <textarea
          id="opt-text"
          className="h-24 w-full resize-y rounded-lg border border-white/10 bg-black/60 p-3 text-white placeholder-white/40"
          value={text}
          onChange={(e) => {
            const v = e.target.value;
            setText(v);
            if (multicolor) {
              const len = v.replace(/\n/g, "").length;
              setPerLetter(Array.from({ length: len }, () => singleColor));
            }
          }}
          placeholder={"Your\nText"}
        />
        <p className="mt-1 text-[11px] text-white/50">Use ↵ (Enter) for a new line.</p>
      </div>

      {/* FONTS */}
      <div>
        <label className="mb-1 block text-xs text-white/70">Font</label>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFontId(f.id)}
              className={`rounded-lg border p-3 text-center transition
                ${fontId === f.id ? "border-white/70 bg-white/10" : "border-white/10 bg-black/40 hover:bg-white/5"}`}
              style={{ fontFamily: `var(--font-${f.id}), var(--font-inter), system-ui, sans-serif` }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SIZE */}
      <div>
        <label className="mb-1 block text-xs text-white/70">Size</label>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {(Object.keys(SIZE_CATALOG) as SizeId[]).map((id) => {
            const s = SIZE_CATALOG[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSizeId(id)}
                className={`rounded-lg border p-3 text-left transition
                  ${sizeId === id ? "border-white/70 bg-white/10" : "border-white/10 bg-black/40 hover:bg-white/5"}`}
              >
                <div className="text-sm">{s.label}</div>
                <div className="text-[11px] text-white/60">{s.widthIn}" × {s.heightIn}"</div>
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-[11px] text-white/50">Note: backboards can add ~1–1.6" to final length/height.</p>
      </div>

      {/* BACKBOARD */}
      <div>
        <label className="mb-1 block text-xs text-white/70">Backboard</label>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {BACK_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setBackStyle(s.id)}
              className={`rounded-lg border p-2 transition
                ${p.backStyle === s.id ? "border-white/70 bg-white/10" : "border-white/10 bg-black/40 hover:bg-white/5"}`}
            >
              <div className="mb-2 text-center text-[11px] text-white/70">{s.label}</div>
              <div className="flex items-center justify-center">
                <div
                  className="h-10 w-16"
                  style={{
                    background: s.id === "cut-to-letter"
                      ? "transparent"
                      : BACK_COLORS.find((b) => b.id === p.backColor)?.fill || "rgba(255,255,255,0.04)",
                    borderRadius:
                      s.id === "rectangle" ? 8 :
                      s.id === "rounded"   ? 16 :
                      s.id === "circle"    ? "9999px" : 0,
                    border: s.id === "cut-to-letter" ? "1px dashed rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.12)",
                  }}
                />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs text-white/70">Backboard Color</label>
          <div className="grid grid-cols-4 gap-2">
            {BACK_COLORS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBackColor(b.id)}
                className={`rounded-lg border p-2 transition
                  ${backColor === b.id ? "border-white/70 bg-white/10" : "border-white/10 bg-black/40 hover:bg-white/5"}`}
              >
                <div className="mb-1 text-center text-[11px] text-white/70">{b.label}</div>
                <div className="h-6 w-full rounded" style={{ background: b.fill }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COLORS */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-xs text-white/70">Color Mode</label>
          <label className="flex items-center gap-2 text-xs text-white/70">
            <input type="checkbox" checked={multicolor} onChange={(e) => handleToggleMulticolor(e.target.checked)} />
            Multicolored
          </label>
        </div>

        {/* Base color */}
        <div className="rounded-lg border border-white/10 bg-black/40 p-3">
          <div className="mb-2 text-xs text-white/70">Base Color</div>
          <div className="flex flex-wrap items-center gap-2">
            {PALETTE.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => handleBaseColorPick(hex)}
                className="h-8 w-8 rounded-md border border-white/10"
                style={{ background: hex, boxShadow: `0 0 10px ${hex}` }}
                aria-label={`Base color ${hex}`}
              />
            ))}
            <input
              type="color"
              value={singleColor}
              onChange={(e) => handleBaseColorPick(e.target.value)}
              className="h-8 w-10 cursor-pointer rounded-md border border-white/10 bg-black/60 p-0"
              aria-label="Pick base color"
            />
            {multicolor && (
              <button
                type="button"
                onClick={() => applyBaseToAll(singleColor)}
                className="ml-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
              >
                Apply to all letters
              </button>
            )}
          </div>
        </div>

        {/* Per-letter */}
        {multicolor && (
          <div className="mt-3 rounded-lg border border-white/10 bg-black/40 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs text-white/70">
                Selected letter:{" "}
                {activeIndex !== null && activeIndex >= 0 && activeIndex < flat.length
                  ? `${activeIndex + 1} (“${flat[activeIndex]}”)`
                  : "None"}
              </div>
              <div className="flex gap-2">
                <button onClick={goPrev} className="rounded border border-white/10 bg-white/10 px-2 py-1 text-xs hover:bg-white/20">◀ Prev</button>
                <button onClick={goNext} className="rounded border border-white/10 bg-white/10 px-2 py-1 text-xs hover:bg-white/20">Next ▶</button>
                <button onClick={() => setActiveIndex(null)} className="rounded border border-white/10 bg-white/10 px-2 py-1 text-xs hover:bg-white/20">Clear</button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {PALETTE.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setLetterColor(hex)}
                  className="h-8 w-8 rounded-md border border-white/10"
                  style={{ background: hex, boxShadow: `0 0 10px ${hex}` }}
                  aria-label={`Set letter color ${hex}`}
                />
              ))}
              <input
                type="color"
                onChange={(e) => setLetterColor(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded-md border border-white/10 bg-black/60 p-0"
                aria-label="Pick letter color"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
