/* src/app/api/quote/route.ts */
import { NextResponse } from "next/server";
import { z } from "zod";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const EXPOSE_ERRORS = process.env.EXPOSE_ERRORS === "1";
const QUOTES_DRY_RUN = process.env.QUOTES_DRY_RUN === "1";

type Bucket = { count: number; resetAt: number };
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const buckets = new Map<string, Bucket>();
function rateCheck(ip: string) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (b.count >= RATE_LIMIT_MAX) return false;
  b.count += 1;
  return true;
}

const CustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  message: z.string().optional().default(""),
});

const DesignSchema = z.object({
  text: z.string().min(1),
  fontId: z.string().min(1),
  singleColor: z.string().min(1),
  multicolor: z.boolean(),
  perLetter: z.array(z.string()),
  sizeId: z.string().min(1),
  backStyle: z.string().min(1),
  backColor: z.string().min(1),
});

const MetaSchema = z.object({
  userAgent: z.string().optional(),
  page: z.string().optional(),
  estimate: z.number().optional().nullable(),
  mockupDataUrl: z.string().optional(),
}).partial();

const QuoteSchema = z.object({
  customer: CustomerSchema,
  design: DesignSchema,
  meta: MetaSchema.optional(),
  company: z.string().optional(),
});

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export async function POST(req: Request) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
    if (!rateCheck(ip)) return json({ ok: false, error: "rate_limited" }, 429);

    const raw = await req.json().catch(() => ({}));
    const parsed = QuoteSchema.safeParse(raw);
    if (!parsed.success) {
      return json({ ok: false, error: "invalid_request", details: EXPOSE_ERRORS ? parsed.error.flatten() : undefined }, 400);
    }
    const { customer, design, meta, company } = parsed.data;

    if (company && company.trim()) return json({ ok: true });

    const subjectText = design.text.replace(/\s+/g, " ").trim();
    const subject = `NeonTJ Quote: ${subjectText.slice(0, 50)}${subjectText.length > 50 ? "..." : ""}`;

    const textBody = [
      `New quote request from ${customer.name}`,
      ``,
      `Contact`,
      `- Email: ${customer.email}`,
      `- Phone: ${customer.phone || "Not provided"}`,
      ``,
      `Design`,
      `- Text:`, design.text,
      `- Font: ${design.fontId}`,
      `- Size: ${design.sizeId}`,
      `- Colors: ${design.multicolor ? `Multicolor: ${design.perLetter.join(", ")}` : `Single (${design.singleColor})`}`,
      `- Backboard: ${design.backStyle} (${design.backColor})`,
      ``,
      `Notes`,
      customer.message || "No additional notes",
      ``,
      `Meta`,
      `- Page: ${meta?.page || "Unknown"}`,
      `- Estimate: ${typeof meta?.estimate === "number" ? `$${meta.estimate}` : "Not calculated"}`,
    ].join("\n");

    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const colorRow = (hex: string, idx?: number) => `
      <tr>
        <td style="padding:4px 8px;font:13px/1.4 Inter,Arial,sans-serif;color:#EDEDED;">
          ${idx !== undefined ? `Letter ${idx + 1}` : "Color"}
        </td>
        <td style="padding:4px 8px;">
          <span style="display:inline-block;width:14px;height:14px;border:1px solid #999;background:${hex};vertical-align:middle;"></span>
          <span style="font:13px/1.4 Inter,Arial,sans-serif;color:#EDEDED;margin-left:8px;">${hex}</span>
        </td>
      </tr>`;

    const colorsSection = design.multicolor
      ? `<p style="margin:8px 0 4px;font-weight:600;color:#EDEDED;">Colors (per-letter)</p>
         <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#121212;border:1px solid #333;border-radius:8px;overflow:hidden;"><tbody>
           ${design.perLetter.map((c, i) => colorRow(c, i)).join("")}
         </tbody></table>`
      : `<p style="margin:8px 0 4px;font-weight:600;color:#EDEDED;">Color</p>
         <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#121212;border:1px solid #333;border-radius:8px;overflow:hidden;"><tbody>
           ${colorRow(design.singleColor)}
         </tbody></table>`;

    const mockupImg = meta?.mockupDataUrl
      ? `<div style="margin-top:12px;"><img src="${meta.mockupDataUrl}" alt="Mockup" style="max-width:480px;width:100%;border-radius:12px;border:1px solid #333;"/></div>`
      : "";

    const htmlBody = `
<!doctype html><html><body style="margin:0;padding:0;background:#0B0B0C;">
  <div style="max-width:640px;margin:0 auto;padding:20px;font:14px/1.6 Inter,Arial,sans-serif;color:#EDEDED;">
    <h2 style="margin:0 0 12px 0;font-size:20px;">New quote request from ${esc(customer.name)}</h2>
    <h3 style="margin:16px 0 6px 0;font-size:14px;color:#B7B7B7;">Contact</h3>
    <div style="background:#121212;border:1px solid #333;border-radius:10px;padding:10px;">
      <div>- Email: <a href="mailto:${esc(customer.email)}" style="color:#9AE6FF;">${esc(customer.email)}</a></div>
      <div>- Phone: ${esc(customer.phone || "Not provided")}</div>
    </div>
    <h3 style="margin:16px 0 6px 0;font-size:14px;color:#B7B7B7;">Design</h3>
    <div style="background:#121212;border:1px solid #333;border-radius:10px;padding:10px;">
      <div style="margin-bottom:8px;">- <strong>Text</strong>:</div>
      <pre style="white-space:pre-wrap;margin:0 0 8px 0;color:#EDEDED;">${esc(design.text)}</pre>
      <div>- Font: ${esc(design.fontId)}</div>
      <div>- Size: ${esc(design.sizeId)}</div>
      <div>- Backboard: ${esc(design.backStyle)} (${esc(design.backColor)})</div>
      ${colorsSection}
      ${mockupImg}
    </div>
    <h3 style="margin:16px 0 6px 0;font-size:14px;color:#B7B7B7;">Notes</h3>
    <div style="background:#121212;border:1px solid #333;border-radius:10px;padding:10px;">${esc(customer.message || "No additional notes")}</div>
    <h3 style="margin:16px 0 6px 0;font-size:14px;color:#B7B7B7;">Meta</h3>
    <div style="background:#121212;border:1px solid #333;border-radius:10px;padding:10px;">
      <div>- Page: ${esc(meta?.page || "Unknown")}</div>
      <div>- Estimate: ${typeof meta?.estimate === "number" ? `$${meta.estimate}` : "Not calculated"}</div>
    </div>
  </div>
</body></html>`.trim();

    const region = process.env.SES_REGION || process.env.AWS_REGION || "us-east-1";
    const from = (process.env.SES_FROM || "").trim();
    const toList = (process.env.SES_TO || "").split(",").map((s) => s.trim()).filter(Boolean);

    if (QUOTES_DRY_RUN) {
      console.log(`[DRY RUN] Email would be sent:`, { subject, to: toList });
      return json({ ok: true, dryRun: true });
    }

    if (!from || toList.length === 0) {
      return json({ ok: false, error: "ses_not_configured", details: EXPOSE_ERRORS ? { from, toCount: toList.length } : undefined }, 500);
    }

    const client = new SESClient({ region });
    const cmd = new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: toList },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: { Text: { Data: textBody, Charset: "UTF-8" }, Html: { Data: htmlBody, Charset: "UTF-8" } },
      },
      ReplyToAddresses: [customer.email],
    });
    await client.send(cmd);
    return json({ ok: true });
  } catch (err: any) {
    return json({ ok: false, error: "server_error", details: EXPOSE_ERRORS ? String(err?.message || err) : undefined }, 500);
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    env: process.env.NODE_ENV,
    quotes_dry_run: QUOTES_DRY_RUN,
    ses_region: process.env.SES_REGION || process.env.AWS_REGION || "unset",
    ses_from_set: Boolean(process.env.SES_FROM),
    ses_to_count: (process.env.SES_TO || "").split(",").filter(Boolean).length,
    expose_errors: EXPOSE_ERRORS,
  });
}
