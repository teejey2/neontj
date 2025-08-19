/* src/app/custom-sign/page.tsx */
"use client";

import React, { useMemo, useState } from "react";
import Preview, {
  type BackboardStyle,
  type BackboardColor,
} from "@/components/customizer/Preview";
import OptionsPanel from "@/components/customizer/OptionsPanel";
import QuoteForm from "@/components/customizer/QuoteForm";
import { SIZE_CATALOG, type SizeId } from "@/lib/pricing";
import type { FontId } from "@/lib/fonts";
import { normalizeFontId } from "@/lib/fonts";

export default function CustomSignPage() {
  // text
  const [text, setText] = useState<string>("Your\nText");

  // fonts (masked ids)
  const [fontId, setFontId] = useState<FontId>(normalizeFontId("n1"));

  // colors
  const [multicolor, setMulticolor] = useState<boolean>(false);
  const [singleColor, setSingleColor] = useState<string>("#B2FFF2");
  const [perLetter, setPerLetter] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // size
  const [sizeId, setSizeId] = useState<SizeId>("mini");

  // backboard
  const [backStyle, setBackStyle] = useState<BackboardStyle>("cut-to-letter");
  const [backColor, setBackColor] = useState<BackboardColor>("clear");

  // keep per-letter array length in sync with text
  const flat = useMemo(() => text.replace(/\n/g, ""), [text]);
  React.useEffect(() => {
    if (multicolor) {
      setPerLetter((prev) => {
        if (prev.length !== flat.length) {
          return Array.from({ length: flat.length }, () => singleColor);
        }
        return prev;
      });
      if (activeIndex !== null && activeIndex >= flat.length) {
        setActiveIndex(flat.length ? flat.length - 1 : null);
      }
    } else {
      if (perLetter.length) setPerLetter([]);
      setActiveIndex(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flat.length, multicolor]);

  // quick estimate (server/email still confirms final)
  const estimate = (() => {
    const s = SIZE_CATALOG[sizeId];
    if (!s) return 0;
    const chars = Math.max(flat.length, 1);
    return Math.round((s.widthIn * 1.2 + chars * 1.5) * 1.8 + 25);
  })();

  return (
    <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-12">
      {/* LEFT: sticky preview */}
      <div className="md:col-span-5">
        <div className="sticky top-16 z-30 px-4">
          <Preview
            id="sign-preview"
            text={text}
            fontId={fontId}
            singleColor={singleColor}
            multicolor={multicolor}
            perLetter={perLetter}
            backStyle={backStyle}
            backColor={backColor}
            activeIndex={activeIndex ?? null}
            onSelectIndex={(i) => setActiveIndex(i)}
          />
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Estimated Price</span>
              <span className="font-semibold">${estimate}</span>
            </div>
            <p className="mt-1 text-xs text-white/50">
              Final price confirmed after design review.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: options + form */}
      <div className="md:col-span-7">
        <OptionsPanel
          text={text}
          setText={setText}
          fontId={fontId}
          setFontId={(v: string) => setFontId(v as FontId)}
          multicolor={multicolor}
          setMulticolor={setMulticolor}
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

        {/* Quote form — expects { payload, mode } */}
        <div className="mt-6">
          <QuoteForm
            payload={{
              text,
              fontId,
              sizeId,
              multicolor,
              perLetter,
              singleColor,
              backStyle,
              backColor,
            }}
            mode="text"
          />
        </div>
      </div>
    </main>
  );
}
