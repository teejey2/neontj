"use client";

import React, { useMemo } from "react";
import { fontOptions, type FontId } from "@/lib/fonts";
import { ColorSwatch } from "./ColorSwatch";
import {
  SIZE_CATALOG,
  type SizeId,
  estimatePrice,
  type BackboardStyle,
  type BackboardColor,
} from "@/lib/pricing";
import { BackboardOptions } from "./BackboardOptions";

export type PanelProps = {
  text: string;
  setText: (v: string) => void;
  fontId: FontId;
  setFontId: (v: FontId) => void;
  multicolor: boolean;
  setMulticolor: (v: boolean) => void;
  singleColor: string;
  setSingleColor: (hex: string) => void;
  activeIndex: number | null;
  setActiveIndex: (i: number | null) => void;
  perLetter: string[];
  setPerLetter: (arr: string[]) => void;
  sizeId: SizeId;
  setSizeId: (v: SizeId) => void;
  backStyle: BackboardStyle;
  setBackStyle: (v: BackboardStyle) => void;
  backColor: BackboardColor;
  setBackColor: (v: BackboardColor) => void;
};

/** Guard size to avoid crashes if an unknown key slips in */
function getSafeSize(size: SizeId): SizeId {
  const keys = Object.keys(SIZE_CATALOG) as SizeId[];
  return (size && size in SIZE_CATALOG ? size : (keys[0] ?? ("m" as SizeId))) as SizeId;
}

export function OptionsPanel(props: PanelProps) {
  const safeSize = getSafeSize(props.sizeId);

  // Memoized so typing doesn’t recompute price on every keystroke more than needed
  const price = useMemo(
    () =>
      estimatePrice({
        text: props.text,
        size: safeSize,
        multicolor: props.multicolor,
        backboardStyle: props.backStyle,
        backboardColor: props.backColor,
      }),
    [props.text, safeSize, props.multicolor, props.backStyle, props.backColor]
  );

  return (
    <div className="space-y-6">
      {/* STEP 1 */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow">
        <h3 className="mb-2 text-sm font-semibold tracking-wide text-white/80">1 ENTER YOUR TEXT</h3>
        <textarea
          value={props.text}
          onChange={(e) => props.setText(e.target.value)}
          placeholder={"ENTER TEXT HERE\nPress Enter/Return for a new line"}
          className="h-28 w-full resize-none rounded-lg border border-white/10 bg-black/60 p-3 text-white placeholder-white/40 focus:outline-none"
          aria-label="Enter sign text"
        />
        <div className="mt-2 text-xs text-white/50">Max 3 lines recommended for best readability.</div>
      </section>

      {/* STEP 2 */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow">
        <h3 className="mb-2 text-sm font-semibold tracking-wide text-white/80">2 CHOOSE FONT</h3>
        <div className="relative">
          <select
            value={props.fontId}
            onChange={(e) => props.setFontId(e.target.value as FontId)}
            className="w-full appearance-none rounded-lg border border-white/10 bg-black/60 p-3 pr-10 text-white"
            aria-label="Choose font"
          >
            {fontOptions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white">▾</div>
        </div>
        <p className="mt-2 text-xs text-white/70">
          Click &quot;Choose Font&quot; to pick your style.
        </p>
      </section>

      {/* STEP 3 */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-white/80">3 CHOOSE COLOR</h3>
          <label className="flex items-center gap-2 text-xs text-white/70">
            <span>Multicolored</span>
            <input
              type="checkbox"
              checked={props.multicolor}
              onChange={(e) => props.setMulticolor(e.target.checked)}
              className="h-5 w-10 cursor-pointer appearance-none rounded-full bg-white/20 outline-none transition-colors checked:bg-violet-500"
              aria-label="Toggle multicolored"
            />
          </label>
        </div>

        <ColorSwatch
          selected={props.singleColor}
          onSelect={(hex) => {
            if (props.multicolor && props.activeIndex !== null) {
              const next = [...props.perLetter];
              next[props.activeIndex] = hex;
              props.setPerLetter(next);
            } else {
              props.setSingleColor(hex);
            }
          }}
        />

        {props.multicolor && (
          <div className="mt-2 text-xs text-white/60">
            Click a letter in the preview, then pick a color to set that letter.
          </div>
        )}
        <p className="mt-2 text-xs text-white/70">
          Use &quot;Multicolor&quot; to color letters individually.
        </p>
      </section>

      {/* STEP 4 */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-white/80">4 CHOOSE SIZE</h3>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(SIZE_CATALOG) as SizeId[]).map((id) => {
            const s = SIZE_CATALOG[id];
            const isActive = safeSize === id;
            return (
              <button
                key={id}
                onClick={() => props.setSizeId(id)}
                className={`rounded-xl border p-3 text-left ${
                  isActive ? "border-violet-400 bg-violet-500/10" : "border-white/10 bg-black/50"
                }`}
                aria-pressed={isActive}
                type="button"
              >
                <div className="text-sm font-semibold text-white">{s.label}</div>
                <div className="text-xs text-white/60">Length: {s.widthIn}&quot;</div>
                <div className="text-xs text-white/60">Height: {s.heightIn}&quot;</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* STEP 5 — BACKBOARD */}
      <BackboardOptions
        backStyle={props.backStyle}
        setBackStyle={props.setBackStyle}
        backColor={props.backColor}
        setBackColor={props.setBackColor}
      />

      {/* PRICE SUMMARY */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 p-4">
        <div className="mb-1 text-sm font-semibold tracking-wide text-white/80">Estimated Price</div>
        <div className="text-2xl font-bold text-white">${price.finalPrice}</div>
        <div className="mt-1 text-xs text-white/60">Final price confirmed after design review.</div>
      </section>
    </div>
  );
}
