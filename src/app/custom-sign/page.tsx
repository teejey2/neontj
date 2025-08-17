"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Preview } from "@/components/customizer/Preview";
import { OptionsPanel } from "@/components/customizer/OptionsPanel";
import QuoteForm, { type DesignPayload } from "@/components/customizer/QuoteForm";
import type { FontId } from "@/lib/fonts";
import type { SizeId, BackboardStyle, BackboardColor } from "@/lib/pricing";

export default function CustomSignPage() {
  // ===== Builder state =====
  const [text, setText] = useState<string>("Your\nText");
  const [fontId, setFontId] = useState<FontId>("orbitron");
  const [multicolor, setMulticolor] = useState(false);
  const [singleColor, setSingleColor] = useState<string>("#B2FFF2");
  const [sizeId, setSizeId] = useState<SizeId>("mini");
  const [backStyle, setBackStyle] = useState<BackboardStyle>("cut-to-letter");
  const [backColor, setBackColor] = useState<BackboardColor>("clear");

  // per-letter colors
  const flat = useMemo(() => text.replace(/\n/g, ""), [text]);
  const [perLetter, setPerLetter] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (perLetter.length !== flat.length) {
      setPerLetter((prev) => {
        const next = prev.slice(0, flat.length);
        while (next.length < flat.length) next.push(singleColor);
        return next;
      });
    }
  }, [flat.length, singleColor, perLetter.length]);

  const payload: DesignPayload = {
    text,
    fontId,
    multicolor,
    singleColor,
    perLetter,
    sizeId,
    backStyle,
    backColor,
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      {/* ========== MOBILE (sm) — fixed preview at top, spacer below ========== */}
      <div className="md:hidden">
        {/* Fixed preview bar */}
        <div className="fixed inset-x-0 top-16 z-30 px-4">
          <div className="mx-auto max-w-7xl">
            <Preview
              id="sign-preview"  // only exists on mobile right now
              text={text}
              fontId={fontId}
              singleColor={singleColor}
              multicolor={multicolor}
              perLetter={perLetter}
              onSelectIndex={(i) => setActiveIndex(i)}
            />
          </div>
        </div>
        {/* Spacer so content doesn’t sit under the fixed preview (adjust height to taste) */}
        <div className="h-[360px]" />
        {/* Options + Quote below */}
        <div className="space-y-6">
          <OptionsPanel
            text={text}
            setText={setText}
            fontId={fontId}
            setFontId={setFontId}
            multicolor={multicolor}
            setMulticolor={(v) => {
              setMulticolor(v);
              if (!v) setActiveIndex(null);
            }}
            singleColor={singleColor}
            setSingleColor={setSingleColor}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            perLetter={perLetter}
            setPerLetter={setPerLetter}
            sizeId={sizeId}
            setSizeId={setSizeId}
            backStyle={backStyle}
            setBackStyle={setBackStyle}
            backColor={backColor}
            setBackColor={setBackColor}
          />
          <QuoteForm payload={payload} mode="text" />
        </div>
      </div>

      {/* ========== DESKTOP/TABLET (md+) — sticky left preview, scroll right options ========== */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-8">
        {/* Left: sticky preview */}
        <div className="md:col-span-7">
          <div className="sticky top-24 self-start">
            <Preview
              id="sign-preview"  // only exists on desktop/tablet here
              text={text}
              fontId={fontId}
              singleColor={singleColor}
              multicolor={multicolor}
              perLetter={perLetter}
              onSelectIndex={(i) => setActiveIndex(i)}
            />
          </div>
        </div>

        {/* Right: scrollable options + form */}
        <div className="md:col-span-5">
          <div className="space-y-6">
            <OptionsPanel
              text={text}
              setText={setText}
              fontId={fontId}
              setFontId={setFontId}
              multicolor={multicolor}
              setMulticolor={(v) => {
                setMulticolor(v);
                if (!v) setActiveIndex(null);
              }}
              singleColor={singleColor}
              setSingleColor={setSingleColor}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              perLetter={perLetter}
              setPerLetter={setPerLetter}
              sizeId={sizeId}
              setSizeId={setSizeId}
              backStyle={backStyle}
              setBackStyle={setBackStyle}
              backColor={backColor}
              setBackColor={setBackColor}
            />
            <QuoteForm payload={payload} mode="text" />
          </div>
        </div>
      </div>
    </main>
  );
}
