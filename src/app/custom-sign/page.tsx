/* src/app/custom-sign/page.tsx */
"use client";

import React, { useMemo, useState } from "react";
import Preview, {
  type BackboardStyle,
  type BackboardColor,
} from "@/components/customizer/Preview";
import OptionsPanel from "@/components/customizer/OptionsPanel";
import QuoteForm, { type DesignPayload } from "@/components/customizer/QuoteForm";
import type { FontId } from "@/lib/fonts";
import { normalizeFontId } from "@/lib/fonts";
import type { SizeId } from "@/lib/pricing";

/** Build a per-letter color array sized to the current text (no newlines). */
function makePerLetterArray(text: string, color: string): string[] {
  const clean = text.replace(/\n/g, "");
  return Array.from({ length: clean.length }, () => color);
}

export default function CustomSignPage() {
  // ----- DESIGN STATE -----
  const [text, setText] = useState<string>("Your\nText");
  const [fontId, setFontId] = useState<FontId>(normalizeFontId("n1"));

  const [multicolor, setMulticolor] = useState<boolean>(false);
  const [singleColor, setSingleColor] = useState<string>("#B2FFF2");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [sizeId, setSizeId] = useState<SizeId>("mini" as SizeId);

  const [backStyle, setBackStyle] = useState<BackboardStyle>("cut-to-letter");
  const [backColor, setBackColor] = useState<BackboardColor>("clear");

  // keep per-letter colors aligned to text length
  const perLetter = useMemo(() => makePerLetterArray(text, singleColor), [text, singleColor]);

  // simple estimate (placeholder — server email still includes estimate)
  const estimate = useMemo(() => {
    const clean = text.replace(/\s+/g, "");
    const base = 200 + clean.length * 5;
    return Math.max(205, Math.round(base / 5) * 5);
  }, [text]);

  const payload: DesignPayload = useMemo(
    () => ({
      text,
      fontId,
      multicolor,
      singleColor,
      perLetter,
      sizeId,
      backStyle,
      backColor,
    }),
    [text, fontId, multicolor, singleColor, perLetter, sizeId, backStyle, backColor]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-white md:mb-8">
        Design Your Custom Neon
      </h1>

      {/* MOBILE: fixed preview bar at top (doesn't scroll away) */}
      <div className="md:hidden fixed inset-x-0 top-16 z-30 border-b border-white/10 bg-bgBlack/90">
        <div className="px-3 py-2">
          <Preview
            id="sign-preview"
            text={text}
            fontId={fontId}
            singleColor={singleColor}
            multicolor={multicolor}
            perLetter={perLetter}
            backStyle={backStyle}
            backColor={backColor}
            activeIndex={activeIndex}
            onSelectIndex={(i) => setActiveIndex(i)}
          />
        </div>
      </div>
      {/* Spacer so content isn’t hidden behind the fixed preview on mobile.
          Aspect ~1000x600 → about 60% height of width. */}
      <div className="md:hidden" aria-hidden>
        <div className="pb-[60%]" />
      </div>

      {/* DESKTOP/TABLET GRID: preview left (sticky), options right (scroll) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* LEFT: STICKY PREVIEW (only md+) */}
        <div className="relative hidden md:col-span-5 md:block">
          {/* Make the preview stick inside this column */}
          <div className="sticky top-24">
            <Preview
              id="sign-preview-desktop"
              text={text}
              fontId={fontId}
              singleColor={singleColor}
              multicolor={multicolor}
              perLetter={perLetter}
              backStyle={backStyle}
              backColor={backColor}
              activeIndex={activeIndex}
              onSelectIndex={(i) => setActiveIndex(i)}
            />
          </div>
        </div>

        {/* RIGHT: OPTIONS + QUOTE FORM */}
        <div className="md:col-span-7 space-y-6">
          <OptionsPanel
            /* text */
            text={text}
            setText={(v) => {
              setText(v);
              // keep active index safe when text changes
              setActiveIndex((idx) => {
                const len = v.replace(/\n/g, "").length;
                return idx !== null && idx >= len ? len - 1 : idx;
              });
            }}
            /* font (OptionsPanel expects (v: string) => void) */
            fontId={fontId}
            setFontId={(v: string) => setFontId(normalizeFontId(v))}
            /* color */
            multicolor={multicolor}
            setMulticolor={(v: boolean) => {
              setMulticolor(v);
              if (!v) setActiveIndex(null);
            }}
            singleColor={singleColor}
            setSingleColor={(c: string) => setSingleColor(c)}
            perLetter={perLetter}
            setPerLetter={(_arr: string[]) => {
              // If you later want OptionsPanel to push a per-letter array, wire it here.
              // For now we derive perLetter from (text, singleColor) to avoid drift.
            }}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            /* size (expects SizeId) */
            sizeId={sizeId}
            setSizeId={(v: SizeId) => setSizeId(v)}
            /* backboard */
            backStyle={backStyle}
            setBackStyle={setBackStyle}
            backColor={backColor}
            setBackColor={setBackColor}
          />

          <QuoteForm payload={payload} mode="text" />

          <div className="text-xs text-white/50">
            Estimated price: ${estimate} — final quote will confirm dimensions and exact pricing.
          </div>
        </div>
      </div>
    </main>
  );
}
