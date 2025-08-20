/* src/components/customizer/QuoteForm.tsx */
"use client";

import React, { useCallback, useMemo, useState } from "react";
import * as htmlToImage from "html-to-image";

export type DesignPayload = {
  text: string;
  fontId: string;
  multicolor: boolean;
  singleColor: string;
  perLetter: string[];
  sizeId: string;
  backStyle: string;
  backColor: string;
};

export default function QuoteForm({
  payload,
  mode,
}: {
  payload: DesignPayload;
  mode: "text" | "logo";
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");

  // quick client-side estimate (server/email will confirm final)
  const finalPrice = useMemo(() => {
    const txt = (payload.text ?? "").replace(/\s+/g, "");
    const base = 200 + txt.length * 5;
    return Math.max(205, Math.round(base / 5) * 5);
  }, [payload.text]);

  // return "" if valid; otherwise a human-readable error
  const validate = useCallback((): string => {
    if (!name.trim()) return "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return "Please enter a valid email.";
    return "";
  }, [name, email]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const v = validate();
      if (v) {
        setErrMsg(v);
        setOk(false);
        return;
      }

      setSending(true);
      setErrMsg("");
      setOk(null);

      // Optional preview capture
      let mockupDataUrl = "";
      try {
        const node = document.getElementById("sign-preview");
        if (node) {
          mockupDataUrl = await htmlToImage.toJpeg(node as HTMLElement, {
            quality: 0.8,
            canvasWidth: 480,
            pixelRatio: 1,
          });
        }
      } catch {
        // swallow capture errors quietly
      }

      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: { name, email, phone, message },
            design: payload,
            meta: {
              userAgent:
                typeof navigator !== "undefined" ? navigator.userAgent : "",
              page: typeof window !== "undefined" ? window.location.href : "",
              estimate: finalPrice,
              mockupDataUrl: mockupDataUrl || undefined,
              mode,
            },
            company: "", // honeypot
          }),
        });

        const data = await res.json().catch(() => ({} as any));
        if (!res.ok || !data?.ok) {
          const reason = data?.error ? ` (${data.error})` : "";
          throw new Error(
            `There was a problem sending your request${reason}. Please try again.`
          );
        }

        setOk(true);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } catch (err: any) {
        setOk(false);
        setErrMsg(err?.message || "Could not send your request.");
      } finally {
        setSending(false);
      }
    },
    // include name/email per eslint-hooks rule
    [validate, name, email, phone, message, payload, finalPrice, mode]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-white/80">
          Ready for a Quote?
        </h3>
        <div className="text-xs text-white/60">
          Estimated price: ${finalPrice}
        </div>
      </div>

      <div>
        <label htmlFor="q-name" className="mb-1 block text-xs text-white/70">
          Full name
        </label>
        <input
          id="q-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white placeholder-white/40"
          placeholder="You"
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="q-email" className="mb-1 block text-xs text-white/70">
          Email
        </label>
        <input
          id="q-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white placeholder-white/40"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="q-phone" className="mb-1 block text-xs text-white/70">
          Phone (optional)
        </label>
        <input
          id="q-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white placeholder-white/40"
          placeholder="(555) 555-5555"
          autoComplete="tel"
        />
      </div>

      <div>
        <label htmlFor="q-notes" className="mb-1 block text-xs text-white/70">
          Design notes (optional)
        </label>
        <textarea
          id="q-notes"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="h-28 w-full resize-none rounded-lg border border-white/10 bg-black/60 p-3 text-white placeholder-white/40"
          placeholder="Tell us where you’ll hang it, deadlines, special requests…"
        />
      </div>

      {errMsg && <p className="text-sm text-rose-300">{errMsg}</p>}
      {ok === true && (
        <p className="text-sm text-emerald-300">
          Got it — we’ll email you back shortly.
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-lg bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-[0_0_24px_rgba(155,92,255,.5)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? "Sending…" : "Request Quote"}
      </button>

      <p className="text-[11px] text-white/50">
        By submitting, you agree to be contacted about your quote. We never
        share your info.
      </p>
    </form>
  );
}
