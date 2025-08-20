/* src/components/customizer/BackboardOptions.tsx */
"use client";

import React from "react";
import type {
  BackboardStyle,
  BackboardColor,
} from "@/components/customizer/Preview";

type Props = {
  backStyle: BackboardStyle;
  setBackStyle: (v: BackboardStyle) => void;
  backColor: BackboardColor;
  setBackColor: (v: BackboardColor) => void;
};

const BACK_STYLES: { id: BackboardStyle; label: string }[] = [
  { id: "cut-to-letter", label: "Cut to Letter" },
  { id: "rectangle", label: "Rectangle" },
  { id: "rounded", label: "Rounded Rectangle" },
  { id: "circle", label: "Circle" },
];

const BACK_COLORS: { id: BackboardColor; label: string; swatch: string }[] = [
  { id: "clear", label: "Clear", swatch: "rgba(255,255,255,0.06)" },
  { id: "black", label: "Black", swatch: "rgba(0,0,0,0.96)" },
  { id: "white", label: "White", swatch: "rgba(255,255,255,0.96)" },
  { id: "red",   label: "Red",   swatch: "rgba(180,16,32,0.92)" },
];

export default function BackboardOptions({
  backStyle,
  setBackStyle,
  backColor,
  setBackColor,
}: Props) {
  return (
    <section className="space-y-4">
      {/* Style */}
      <div>
        <label className="mb-1 block text-xs text-white/70">Backboard</label>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {BACK_STYLES.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setBackStyle(opt.id)}
              className={`rounded-xl border p-3 text-left transition ${
                backStyle === opt.id
                  ? "border-white/70 bg-white/10"
                  : "border-white/10 bg-black/50 hover:bg-white/5"
              }`}
            >
              <div className="mb-2 text-sm font-semibold text-white">
                {opt.label}
              </div>
              <div className="flex items-center justify-center">
                <div
                  className="h-10 w-16"
                  style={{
                    background:
                      opt.id === "cut-to-letter"
                        ? "transparent"
                        : BACK_COLORS.find((b) => b.id === backColor)?.swatch ??
                          "rgba(255,255,255,0.06)",
                    borderRadius:
                      opt.id === "rectangle"
                        ? 8
                        : opt.id === "rounded"
                        ? 16
                        : opt.id === "circle"
                        ? 9999
                        : 0,
                    border:
                      opt.id === "cut-to-letter"
                        ? "1px dashed rgba(255,255,255,0.3)"
                        : "1px solid rgba(255,255,255,0.12)",
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="mb-1 block text-xs text-white/70">
          Backboard Color
        </label>
        <div className="grid grid-cols-4 gap-2">
          {BACK_COLORS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setBackColor(opt.id)}
              className={`rounded-xl border p-3 text-left transition ${
                backColor === opt.id
                  ? "border-white/70 bg-white/10"
                  : "border-white/10 bg-black/50 hover:bg-white/5"
              }`}
            >
              <div className="mb-1 text-[11px] text-white/70">{opt.label}</div>
              <div
                className="h-6 w-full rounded"
                style={{ background: opt.swatch }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
