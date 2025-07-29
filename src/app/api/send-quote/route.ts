import { NextRequest, NextResponse } from 'next/server';
import { sendQuoteEmail } from '@/utils/email';
import { z } from 'zod';

// Zod schema to validate incoming quote data
const QuoteSchema = z.object({
  line1: z.string().min(1).max(50),
  line2: z.string().max(50).optional(),
  font: z.string().min(1),
  lineCount: z.number().int().min(1).max(2),
  size: z.string().min(1),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, { message: "Color must be a valid hex code like #FF00FF" }),
  backboardStyle: z.string().min(1),
  backboardColor: z.string().min(1),
  price: z.number().positive(),
  email: z.string().email()
});

export async function POST(request: NextRequest) {
  try {
    const quoteData = await request.json();
    console.log('Incoming Quote Request:', quoteData);

    // Validate with Zod
    const validation = QuoteSchema.safeParse(quoteData);
    if (!validation.success) {
      console.error('Validation Error:', validation.error.flatten());
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Try to send email
    try {
      const success = await sendQuoteEmail(validation.data);

      if (success) {
        return NextResponse.json({ success: true }, { status: 200 });
      } else {
        return NextResponse.json(
          { error: 'Failed to send quote email' },
          { status: 500 }
        );
      }
    } catch (emailErr) {
      console.error('sendQuoteEmail Error:', emailErr);
      return NextResponse.json(
        { error: 'Email service failed', details: emailErr },
        { status: 500 }
      );
    }

  } catch (err) {
    console.error('API POST Error:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err },
      { status: 500 }
    );
  }
}
