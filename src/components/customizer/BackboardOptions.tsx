// 7) src/components/customizer/BackboardOptions.tsx
// ================================
"use client";
import React from "react";
import type { BackboardStyle, BackboardColor } from "@/lib/pricing";

export function BackboardOptions({
  backStyle,
  setBackStyle,
  backColor,
  setBackColor,
}: {
  backStyle: BackboardStyle;
  setBackStyle: (v: BackboardStyle) => void;
  backColor: BackboardColor;
  setBackColor: (v: BackboardColor) => void;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow">
      <h3 className="mb-3 text-sm font-semibold tracking-wide text-white/80">5 BACKBOARD</h3>
      <div className="grid grid-cols-2 gap-3">
        {([
          { id: "cut-to-letter", label: "Cut to Letter" },
          { id: "rectangle", label: "Rectangle" },
          { id: "fine-cut", label: "Fine Cut" },
          { id: "no-backboard", label: "No Backboard" },
        ] as const).map((opt) => (
          <button
            key={opt.id}
            onClick={() => setBackStyle(opt.id)}
            className={`rounded-xl border p-3 text-left ${backStyle === opt.id ? "border-violet-400 bg-violet-500/10" : "border-white/10 bg-black/50"}`}
          >
            <div className="text-sm font-semibold text-white">{opt.label}</div>
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {([
          { id: "clear", label: "Clear" },
          { id: "white", label: "White" },
          { id: "black", label: "Black" },
          { id: "mirror", label: "Mirror" },
        ] as const).map((opt) => (
          <button
            key={opt.id}
            onClick={() => setBackColor(opt.id)}
            className={`rounded-xl border p-3 text-center ${backColor === opt.id ? "border-violet-400 bg-violet-500/10" : "border-white/10 bg-black/50"}`}
          >
            <div className="text-sm font-semibold text-white">{opt.label}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
