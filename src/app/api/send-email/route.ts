// src/app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { z } from 'zod';

// we’ll initialize this only once at runtime
let sesClient: SESClient | null = null;

// your Zod validation schema
const EmailSchema = z.object({
  line1: z.string().min(1).max(50),
  line2: z.string().max(50).optional(),
  lineCount: z.number().int().min(1).max(2),
  font: z.string().min(1),
  size: z.string().min(1),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  backboardStyle: z.string().min(1),
  backboardColor: z.string().min(1),
  price: z.number().positive(),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  // 1️⃣ Only now do we check for AWS env vars (won’t throw at build time)
  const region      = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretKey   = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretKey) {
    console.error('AWS credentials not configured');
    return NextResponse.json(
      { error: 'AWS credentials not configured' },
      { status: 500 }
    );
  }

  // 2️⃣ Lazy-init SES client
  if (!sesClient) {
    sesClient = new SESClient({
      region,
      credentials: { accessKeyId, secretAccessKey: secretKey },
    });
  }

  try {
    // 3️⃣ Parse & validate incoming JSON
    const data = await request.json();
    const validation = EmailSchema.safeParse(data);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error },
        { status: 400 }
      );
    }
    const validData = validation.data;

    // 4️⃣ Build HTML email body
    const htmlContent = `
      <h1>New Custom Sign Quote Request</h1>
      <h2>Design Details</h2>
      <p><strong>Line 1:</strong> ${validData.line1}</p>
      <p><strong>Line 2:</strong> ${validData.line2 || 'N/A'}</p>
      <p><strong>Line Count:</strong> ${validData.lineCount}</p>
      <p><strong>Font:</strong> ${validData.font}</p>
      <p><strong>Size:</strong> ${validData.size}</p>
      <p><strong>Color:</strong> ${validData.color}</p>
      <p><strong>Backboard Style:</strong> ${validData.backboardStyle}</p>
      <p><strong>Backboard Color:</strong> ${validData.backboardColor}</p>
      <p><strong>Estimated Price:</strong> $${validData.price.toFixed(2)}</p>
      <p><strong>Customer Email:</strong> ${validData.email}</p>
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
    `;

    // 5️⃣ Prepare & send SES command
    const params = {
      Source: 'info@itsmeteejey.com',
      Destination: { ToAddresses: ['internetmoneyiri@gmail.com'] },
      Message: {
        Subject: {
          Data: `New Neon Sign Quote - ${new Date().toLocaleDateString()}`,
        },
        Body: {
          Html: { Data: htmlContent },
        },
      },
    };
    await sesClient.send(new SendEmailCommand(params));

    // 6️⃣ Return success
    return NextResponse.json(
      { success: true, message: 'Quote request submitted successfully' },
      { status: 200 }
    );

  } catch (err: any) {
    console.error('SES Error:', err);
    const errorMessage =
      err.name === 'InvalidParameterValue'
        ? 'Invalid email address'
        : err.name === 'AccessDeniedException'
        ? 'AWS access denied – check permissions'
        : 'Failed to send email';
    return NextResponse.json(
      { error: errorMessage, details: err.message, code: err.name },
      { status: 500 }
    );
  }
}
