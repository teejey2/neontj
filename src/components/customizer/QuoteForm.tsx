// src/components/customizer/QuoteForm.tsx
"use client";

import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type ReCAPTCHA from "react-google-recaptcha";
import type { ReCAPTCHAProps } from "react-google-recaptcha";
import {
  estimatePrice,
  SIZE_CATALOG,
  type SizeId,
  type BackboardStyle,
  type BackboardColor,
} from "@/lib/pricing";
import type { FontId } from "@/lib/fonts";
import * as htmlToImage from "html-to-image"; // NEW: capture preview jpg

// ---- Types ----
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

// ---- Helpers ----
function getSafeSize(size: SizeId): SizeId {
  const keys = Object.keys(SIZE_CATALOG) as SizeId[];
  return (size && size in SIZE_CATALOG ? size : keys[0] ?? "mini") as SizeId;
}

// Only enable captcha if a *public* site key exists.
const hasRecaptcha =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_RECAPTCHA_KEY &&
  process.env.NEXT_PUBLIC_RECAPTCHA_KEY.length > 0;

// Lazy-load reCAPTCHA on the client with proper ref typing
const Recaptcha = hasRecaptcha
  ? (dynamic<ReCAPTCHAProps & React.RefAttributes<ReCAPTCHA>>(
      () => import("react-google-recaptcha"),
      { ssr: false }
    ) as React.ComponentType<ReCAPTCHAProps & React.RefAttributes<ReCAPTCHA>>)
  : null;

// ---- Component ----
export default function QuoteForm({ payload }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot

  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success

  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const finalPrice = useMemo(() => {
    const safeSize = getSafeSize(payload.sizeId);
    const price = estimatePrice({
      text: payload.text,
      size: safeSize,
      multicolor: payload.multicolor,
      backboardStyle: payload.backStyle,
      backboardColor: payload.backColor,
    });
    return typeof price === "number" ? price : (price as any)?.finalPrice ?? 0;
  }, [payload]);

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setCompany("");
    setErrMsg("");
    setStatus("idle");
    setRecaptchaToken("");
    setSuccessMessage("");
    if (hasRecaptcha && recaptchaRef.current) {
      try {
        recaptchaRef.current.reset();
      } catch {
        /* no-op */
      }
    }
  }, []);

  // Reset form after success
  useEffect(() => {
    if (status === "ok") {
      const timer = setTimeout(() => {
        resetForm();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, resetForm]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus("sending");
      setErrMsg("");
      setSuccessMessage(""); // Reset success message

      try {
        if (!name.trim() || !email.trim()) {
          throw new Error("Please enter your name and a valid email.");
        }

        // Get a captcha token *only* if a site key is present
        let token = recaptchaToken;
        if (hasRecaptcha && recaptchaRef.current?.executeAsync) {
          try {
            token = (await recaptchaRef.current.executeAsync()) || "";
            setRecaptchaToken(token);
          } catch {
            token = "";
          }
        }

        // NEW: try to capture a small JPG of the preview for email
        let mockupDataUrl = "";
        try {
          const node = document.getElementById("sign-preview");
          if (node) {
            // Render at ~480px wide to keep email light
            mockupDataUrl = await htmlToImage.toJpeg(node as HTMLElement, {
              quality: 0.8,
              canvasWidth: 480,
              pixelRatio: 1,
            });
          }
        } catch {
          // non-fatal if capture fails
        }

        const safeSize = getSafeSize(payload.sizeId);
        const body = {
          customer: {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            message: message.trim(),
          },
          design: {
            ...payload,
            sizeId: safeSize,
          },
          meta: {
            recaptchaToken: token || undefined,
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
            page: typeof window !== "undefined" ? window.location.href : "",
            estimate: finalPrice,
            mockupDataUrl: mockupDataUrl || undefined, // NEW
          },
          company: company || "", // honeypot
        };

        console.log("Submitting quote:", body);

        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const reason = data?.error ? ` (${data.error})` : "";
          throw new Error(`There was a problem sending your request${reason}. Please try again.`);
        }

        // SUCCESS HANDLING
        setStatus("ok");
        setSuccessMessage("Your quote request has been sent! We'll email you shortly.");
      } catch (err: any) {
        setStatus("err");
        setErrMsg(err?.message || "Submission failed. Please try again.");
        console.error("Quote submission error:", err);
      } finally {
        if (hasRecaptcha && recaptchaRef.current?.reset) {
          try {
            recaptchaRef.current.reset();
          } catch {
            /* no-op */
          }
        }
      }
    },
    [company, email, finalPrice, message, name, payload, phone, recaptchaToken]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 neon-card p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-heading neon-text">Get a Free Quote</h3>
        <span className="text-sm text-white/70" aria-live="polite" aria-atomic="true">
          Est. Price: <strong className="text-neon-purple">${finalPrice.toLocaleString()}</strong>
        </span>
      </div>

      <div className="grid gap-1">
        <label htmlFor="q_name" className="text-sm text-white/80">
          Name
        </label>
        <input
          id="q_name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-bgBlack/70 px-3 py-2 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple"
          placeholder="Full name"
          autoComplete="name"
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="q_email" className="text-sm text-white/80">
          Email
        </label>
        <input
          id="q_email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-bgBlack/70 px-3 py-2 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple"
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="q_phone" className="text-sm text-white/80">
          Phone (optional)
        </label>
        <input
          id="q_phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-bgBlack/70 px-3 py-2 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple"
          placeholder="(555) 555-5555"
          autoComplete="tel"
          inputMode="tel"
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="q_message" className="text-sm text-white/80">
          Notes / details
        </label>
        <textarea
          id="q_message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-y rounded-lg border border-white/10 bg-bgBlack/70 px-3 py-2 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple"
          placeholder="Tell us where you'll hang it, deadlines, special requests..."
        />
      </div>

      {/* Honeypot (hidden field) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="q_company">Company</label>
        <input
          id="q_company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {/* Invisible reCAPTCHA (optional) */}
      {hasRecaptcha && Recaptcha ? (
        <Recaptcha
          ref={recaptchaRef}
          size="invisible"
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY!}
          onChange={(t: string | null) => setRecaptchaToken(t || "")}
        />
      ) : null}

      <div className="pt-2">
        <button
          type="submit"
          className={`neon-button w-full justify-center text-base font-medium transition-all ${
            status === "sending" ? "opacity-75 cursor-not-allowed" : ""
          }`}
          disabled={status === "sending"}
          aria-busy={status === "sending"}
        >
          {status === "sending" ? (
            <span className="flex items-center justify-center gap-2">
              <svg 
                className="animate-spin h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Request Quote"
          )}
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {status === "ok" && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-500 rounded-lg">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-green-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-green-300 font-medium">Success!</p>
              <p className="text-green-200 text-sm mt-1">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {status === "err" && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded-lg">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-red-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-300 font-medium">Error</p>
              <p className="text-red-200 text-sm mt-1">{errMsg}</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-white/50">
        By submitting, you agree to be contacted about your quote. We never share your info.
      </p>
      
    </form>
  );
}
