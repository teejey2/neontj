/* src/components/customizer/QuoteForm.tsx */
"use client";
import React, { useState } from "react";
import { estimatePrice, type SizeId, type BackboardStyle, type BackboardColor } from "@/lib/pricing";
import type { FontId } from "@/lib/fonts";

export type DesignPayload = {
  text: string;
  fontId: FontId;
  singleColor: string;
  multicolor: boolean;
  perLetter: string[];
  sizeId: SizeId;
  backStyle: BackboardStyle;
  backColor: BackboardColor;
};

type Props = {
  payload: DesignPayload;
  mode?: "text" | "logo";
};

export function QuoteForm({ payload }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  const price = estimatePrice({
    text: payload.text,
    size: payload.sizeId,
    multicolor: payload.multicolor,
    backboardStyle: payload.backStyle,
    backboardColor: payload.backColor,
  }).finalPrice;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, email, phone, message },
          design: { ...payload }, // exactly the schema
          meta: {
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
            referer: typeof window !== "undefined" ? window.location.href : "",
          },
        }),
      });

      const json = await res.json().catch(() => ({} as any));
      if (!res.ok || !json?.ok) {
        console.error("Quote submit failed — server:", res.status, json);
        throw new Error(json?.error || `HTTP ${res.status}`);
      }

      setStatus("ok");
      setName(""); setEmail(""); setPhone(""); setMessage("");
    } catch (err: any) {
      console.error("Quote submit failed:", err?.message || err);
      setErrMsg(err?.message || "Failed to send quote");
      setStatus("err");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow">
      <h3 className="mb-2 text-sm font-semibold tracking-wide text-white/80">Ready for a Quote?</h3>

      <div className="grid gap-2">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white placeholder-white/40 focus:outline-none"
          required
        />
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white placeholder-white/40 focus:outline-none"
          required
        />
        <input
          type="tel"
          placeholder="(optional) phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white placeholder-white/40 focus:outline-none"
        />
        <textarea
          placeholder="Design notes (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[96px] w-full resize-y rounded-lg border border-white/10 bg-black/60 p-3 text-white placeholder-white/40 focus:outline-none"
        />
      </div>

      <div className="mt-3 text-sm text-white/70">
        Estimated price: <span className="font-semibold">${price.toFixed(2)}</span>
      </div>

      <button
        disabled={status === "sending"}
        className="mt-3 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 font-semibold text-white shadow-lg disabled:opacity-60"
      >
        {status === "sending"
          ? "Sending..."
          : status === "ok"
          ? "Sent! We'll reply within 24 hours"
          : status === "err"
          ? "Try Again"
          : "GET QUOTE"}
      </button>

      {errMsg && <p className="mt-2 text-sm text-red-400">{errMsg}</p>}
    </form>
  );
}
