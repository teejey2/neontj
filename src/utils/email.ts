// utils/email.ts
import nodemailer from 'nodemailer';

type QuoteData = {
  line1: string;
  line2?: string;
  font: string;
  lineCount: number;
  size: string;
  color: string;
  backboardStyle: string;
  backboardColor: string;
  price: number;
  email: string;
};

export async function sendQuoteEmail(data: QuoteData) {
  console.log('Sending quote email with:', data);

  const transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2 style="color: #B800FF;">New Custom Neon Sign Quote Request</h2>
      <p><strong>Email to contact:</strong> ${data.email}</p>
      <p><strong>Line 1:</strong> ${data.line1}</p>
      ${data.line2 ? `<p><strong>Line 2:</strong> ${data.line2}</p>` : ''}
      <p><strong>Font:</strong> ${data.font}</p>
      <p><strong>Line Count:</strong> ${data.lineCount}</p>
      <p><strong>Size:</strong> ${data.size}</p>
      <p><strong>Color:</strong> ${data.color}</p>
      <p><strong>Backboard Style:</strong> ${data.backboardStyle}</p>
      <p><strong>Backboard Color:</strong> ${data.backboardColor}</p>
      <p><strong>Total Quote Price:</strong> $${data.price.toFixed(2)}</p>
    </div>
  `;

  const mailOptions = {
    from: `"NEONTJ Quotes" <info@itsmeteejey.com>`,
    to: 'info@itsmeteejey.com', // You can CC/BCC here too
    subject: `New Neon Sign Quote - ${new Date().toLocaleDateString()}`,
    html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.response);
    return true;
  } catch (err) {
    console.error('Email sending error:', err);
    return false;
  }
}
