import { NextRequest, NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { z } from 'zod';

// Validate environment variables
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  console.error('AWS credentials are missing');
  throw new Error('AWS credentials not configured');
}

const sesClient = new SESClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

// Validation schema
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
  try {
    const data = await request.json();
    
    // Validate input
    const validation = EmailSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error },
        { status: 400 }
      );
    }

    const validData = validation.data;
    
    // Create email content
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

    const params = {
      Source: 'info@itsmeteejey.com',
      Destination: { ToAddresses: ['internetmoneyiri@gmail.com'] },
      Message: {
        Subject: { 
          Data: `New Neon Sign Quote - ${new Date().toLocaleDateString()}`
        },
        Body: {
          Html: { 
            Data: htmlContent
          }
        }
      }
    };

    const command = new SendEmailCommand(params);
    await sesClient.send(command);

    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully'
    });

  } catch (error: any) {
    console.error('SES Error:', error);
    
    let errorMessage = 'Failed to send email';
    if (error.name === 'InvalidParameterValue') {
      errorMessage = 'Invalid email address';
    } else if (error.name === 'AccessDeniedException') {
      errorMessage = 'AWS access denied - check permissions';
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
        code: error.name
      },
      { status: 500 }
    );
  }
}