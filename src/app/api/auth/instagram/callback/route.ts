// src/app/api/auth/instagram/callback/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1) Parse the incoming URL & code
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // 2) Log it so you can see it in your terminal
  console.log('🟣 INSTAGRAM OAUTH CODE:', code);

  // 3) If there's no code, bail out
  if (!code) {
    console.log('⚠️ No code in query string!');
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  // 4) Exchange the code for a short-lived token…
  const tokenRes = await fetch(
    `https://graph.facebook.com/v17.0/oauth/access_token` +
      `?client_id=${process.env.INSTAGRAM_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI!)}` +
      `&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}` +
      `&code=${code}`
  );
  const { access_token: shortLivedToken } = await tokenRes.json();

  // 5) Exchange for a long-lived token…
  const longRes = await fetch(
    `https://graph.facebook.com/v17.0/oauth/access_token` +
      `?grant_type=fb_exchange_token` +
      `&client_id=${process.env.INSTAGRAM_CLIENT_ID}` +
      `&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}` +
      `&fb_exchange_token=${shortLivedToken}`
  );
  const { access_token: longLivedToken } = await longRes.json();

  // 6) (You’d normally save longLivedToken + IG ID here)
  return NextResponse.redirect('/');
}
