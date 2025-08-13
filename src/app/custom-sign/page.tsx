"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Preview } from "@/components/customizer/Preview";
import { OptionsPanel } from "@/components/customizer/OptionsPanel";
import { QuoteForm } from "@/components/customizer/QuoteForm";
import type { FontId } from "@/lib/fonts";
import type { SizeId, BackboardStyle, BackboardColor } from "@/lib/pricing";

export default function CustomSignPage() {
  const [text, setText] = useState<string>("Your\nText");
  const [fontId, setFontId] = useState<FontId>("orbitron");
  const [multicolor, setMulticolor] = useState(false);
  const [singleColor, setSingleColor] = useState<string>("#B2FFF2");
  const [sizeId, setSizeId] = useState<SizeId>("mini");
  const [backStyle, setBackStyle] = useState<BackboardStyle>("cut-to-letter");
  const [backColor, setBackColor] = useState<BackboardColor>("clear");

  // Derived state
  const flat = useMemo(() => text.replace(/\n/g, ""), [text]);
  const [perLetter, setPerLetter] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Extend per-letter colors to match text length
  useEffect(() => {
    if (perLetter.length !== flat.length) {
      setPerLetter((prev) => {
        const next = prev.slice(0, flat.length);
        while (next.length < flat.length) next.push(singleColor);
        return next;
      });
    }
  }, [flat.length, singleColor]);

  const payload = {
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
    <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-12">
      {/* Left: Sign Preview */}
      <div className="md:col-span-7">
        <Preview
          text={text}
          fontId={fontId}
          singleColor={singleColor}
          multicolor={multicolor}
          perLetter={perLetter}
          onSelectIndex={(i) => setActiveIndex(i)}
        />
      </div>

      {/* Right: Options and Quote Form */}
      <div className="md:col-span-5">
        <div className="sticky top-6 space-y-6">
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
    </main>
  );
}
