// src/app/api/quote/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** ---------- Schemas ---------- */
const CustomerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().max(2000).optional(),
}).strict();

const DesignSchema = z.object({
  text: z.string().min(1).max(500),
  fontId: z.string().min(1),
  singleColor: z.string().min(1),
  multicolor: z.boolean(),
  perLetter: z.array(z.string()).default([]),
  sizeId: z.string().min(1),
  backStyle: z.string().min(1),
  backColor: z.string().min(1),
  price: z.number().optional(), // optional; client should NOT send
}).strict();

const QuoteSchema = z.object({
  customer: CustomerSchema,
  design: DesignSchema,
  meta: z.object({
    userAgent: z.string().optional(),
    referer: z.string().optional(),
  }).strict().default({}),
}).strict();

/** ---------- Utils ---------- */
function env(name: string, required = true) {
  const v = process.env[name];
  if (!v && required) throw new Error(`Missing required env var: ${name}`);
  return v ?? "";
}

const esc = (s: string) =>
  s.replaceAll("&", "&amp;")
   .replaceAll("<", "&lt;")
   .replaceAll(">", "&gt;")
   .replaceAll('"', "&quot;")
   .replaceAll("'", "&#39;");

/** ---------- GET: quick env check while EXPOSE_ERRORS=1 ---------- */
export async function GET() {
  if (process.env.EXPOSE_ERRORS !== "1") {
    return NextResponse.json({ ok: false, error: "Not available" }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    env: {
      region: process.env.AWS_REGION,
      from: process.env.SES_FROM,
      to: (process.env.SES_TO || "").split(",").map(s => s.trim()).filter(Boolean),
      hasKey: Boolean(process.env.AWS_ACCESS_KEY_ID),
      keyPrefix: (process.env.AWS_ACCESS_KEY_ID || "").slice(0, 4),
      dryRun: process.env.QUOTES_DRY_RUN,
      exposeErrors: process.env.EXPOSE_ERRORS,
    },
  });
}

/** ---------- POST ---------- */
export async function POST(req: Request) {
  try {
    const raw = await req.json().catch(() => { throw new Error("Invalid JSON"); });
    const data = QuoteSchema.parse(raw);

    // tiny guard: keep single-line length sane
    const textFlat = data.design.text.replace(/\n/g, "").trim();
    if (textFlat.length > 500) {
      return NextResponse.json({ ok: false, error: "Text too long" }, { status: 400 });
    }

    // dry run for local testing
    if (process.env.QUOTES_DRY_RUN === "1") {
      console.log("[QUOTE_DRY_RUN] Payload OK:", JSON.stringify(data));
      return NextResponse.json({ ok: true, dryRun: true });
    }

    // env
    const FROM = env("SES_FROM");
    const TO = env("SES_TO");
    const REGION = env("AWS_REGION");
    env("AWS_ACCESS_KEY_ID");
    env("AWS_SECRET_ACCESS_KEY");

    const toAddresses = TO.split(",").map(s => s.trim()).filter(Boolean);
    if (!toAddresses.length) throw new Error("SES_TO has no addresses");

    // ✅ let AWS SDK read IAM creds from environment (no extra deps)
    const ses = new SESClient({ region: REGION });

    const subject = `NeonTJ Quote — ${data.customer.name} — ${textFlat.slice(0, 60)}`;

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111">
        <h2 style="margin:0 0 8px 0">New Quote Request</h2>
        <p style="margin:0 0 4px 0"><strong>Name:</strong> ${esc(data.customer.name)}</p>
        <p style="margin:0 0 4px 0"><strong>Email:</strong> ${esc(data.customer.email)}</p>
        ${data.customer.phone ? `<p style="margin:0 0 4px 0"><strong>Phone:</strong> ${esc(data.customer.phone)}</p>` : ""}
        ${data.customer.message ? `<p style="margin:8px 0 8px 0"><strong>Message:</strong><br>${esc(data.customer.message!)}</p>` : ""}
        <hr style="margin:12px 0;border:0;border-top:1px solid #e5e7eb" />
        <h3 style="margin:8px 0">Design</h3>
        <p style="white-space:pre-wrap;margin:0 0 8px 0"><strong>Text:</strong> ${esc(data.design.text)}</p>
        <ul style="margin:0 0 8px 16px;padding:0">
          <li><strong>Font:</strong> ${esc(data.design.fontId)}</li>
          <li><strong>Color:</strong> ${esc(data.design.singleColor)} ${data.design.multicolor ? "(multicolored)" : ""}</li>
          <li><strong>Size:</strong> ${esc(data.design.sizeId)}</li>
          <li><strong>Backboard:</strong> ${esc(data.design.backStyle)} / ${esc(data.design.backColor)}</li>
          ${typeof data.design.price === "number" ? `<li><strong>Est. Price:</strong> $${data.design.price}</li>` : ""}
        </ul>
        ${data.meta?.referer ? `<p style="margin:8px 0 0 0;color:#6b7280">Referrer: ${esc(data.meta.referer!)}</p>` : ""}
        ${data.meta?.userAgent ? `<p style="margin:0;color:#6b7280">UA: ${esc(data.meta.userAgent!)}</p>` : ""}
      </div>
    `.trim();

    const text = [
      `New Quote Request`,
      `Name: ${data.customer.name}`,
      `Email: ${data.customer.email}`,
      data.customer.phone ? `Phone: ${data.customer.phone}` : ``,
      data.customer.message ? `Message: ${data.customer.message}` : ``,
      ``,
      `Design`,
      `Text: ${data.design.text}`,
      `Font: ${data.design.fontId}`,
      `Color: ${data.design.singleColor} ${data.design.multicolor ? "(multicolored)" : ""}`,
      `Size: ${data.design.sizeId}`,
      `Backboard: ${data.design.backStyle} / ${data.design.backColor}`,
      typeof data.design.price === "number" ? `Est. Price: $${data.design.price}` : ``,
      data.meta?.referer ? `Referrer: ${data.meta.referer}` : ``,
      data.meta?.userAgent ? `UA: ${data.meta.userAgent}` : ``,
    ].filter(Boolean).join("\n");

    await ses.send(new SendEmailCommand({
      Destination: { ToAddresses: toAddresses },
      Source: FROM, // e.g. "NeonTJ Quotes" <info@itsmeteejey.com>
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: { Html: { Data: html, Charset: "UTF-8" }, Text: { Data: text, Charset: "UTF-8" } },
      },
      ReplyToAddresses: [data.customer.email],
    }));

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { ok: false, error: "Invalid request", issues: err.issues },
        { status: 400 }
      );
    }

    const msg  = String(err?.message || err);
    const code = err?.Code || err?.code || err?.name;
    const meta = err?.$metadata ? { ...err.$metadata } : undefined;

    let hint = "";
    if (msg.includes("Missing required env var")) hint = "Check .env.local / Vercel env and restart.";
    else if (/Email address.*is not verified/i.test(msg)) hint = "Verify SES_FROM and each SES_TO (sandbox) or request production access.";
    else if (/MessageRejected/i.test(msg)) hint = "FROM must be verified; policy must allow sending.";
    else if (/SignatureDoesNotMatch|InvalidClientTokenId|UnrecognizedClient/i.test(msg)) hint = "Use IAM access keys (not SMTP). Check region and whitespace; sync system clock.";
    else if (/AccessDenied|not authorized to perform ses:SendEmail/i.test(msg)) hint = "IAM policy must include ses:SendEmail and ses:SendRawEmail.";

    console.error("QUOTE_ERROR:", { code, msg, meta }, hint ? `\nHINT: ${hint}` : "");

    if (process.env.EXPOSE_ERRORS === "1") {
      return NextResponse.json({ ok: false, error: "SES error", code, details: msg, meta, hint }, { status: 500 });
    }
    return NextResponse.json({ ok: false, error: "Failed to send quote" }, { status: 500 });
  }
}
