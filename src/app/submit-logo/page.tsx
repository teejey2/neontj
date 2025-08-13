import React from "react";
import { QuoteForm, type DesignPayload } from "@/components/customizer/QuoteForm";
import type { FontId } from "@/lib/fonts";

export default function SubmitLogoPage() {
  const defaultFont: FontId = "orbitron";

  const payload: DesignPayload = {
    text: "LOGO",
    fontId: defaultFont,
    singleColor: "#B2FFF2",
    multicolor: false,
    perLetter: [],
    sizeId: "mini",
    backStyle: "rectangle",
    backColor: "clear",
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-white">Submit Your Logo</h1>
      <p className="mb-6 text-white/70">
        Upload your logo in the quote form notes — we’ll review vector quality and send a final price.
      </p>
      <QuoteForm payload={payload} mode="logo" />
    </main>
  );
}
