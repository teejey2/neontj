/* src/app/submit-logo/page.tsx */
"use client";

import React from "react";
import QuoteForm, { type DesignPayload } from "@/components/customizer/QuoteForm";
import type { FontId } from "@/lib/fonts";
import { normalizeFontId } from "@/lib/fonts";

export default function SubmitLogoPage() {
  // use a valid masked FontId (we no longer use literal "orbitron")
  const defaultFont: FontId = normalizeFontId("n1");

  const payload: DesignPayload = {
    text: "LOGO",
    fontId: defaultFont,
    multicolor: false,
    singleColor: "#B2FFF2",
    perLetter: [],
    sizeId: "mini",
    backStyle: "cut-to-letter",
    backColor: "clear",
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-2xl font-semibold">Submit Your Logo</h1>
      <p className="mb-6 text-white/70">
        Upload your logo file on the next step after you request a quote. We’ll
        reply with a proof and final pricing.
      </p>

      <QuoteForm payload={payload} mode="logo" />
    </main>
  );
}
