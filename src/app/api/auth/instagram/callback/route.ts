// src/app/api/auth/instagram/callback/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  // — EXCHANGE THE CODE FOR A SHORT-LIVED TOKEN —
  const tokenRes = await fetch(
    `https://graph.facebook.com/v17.0/oauth/access_token` +
    `?client_id=${process.env.INSTAGRAM_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI!)}` +
    `&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}` +
    `&code=${code}`
  );
  const { access_token: shortLivedToken } = await tokenRes.json();

  // — EXCHANGE FOR A LONG-LIVED TOKEN —
  const longRes = await fetch(
    `https://graph.facebook.com/v17.0/oauth/access_token` +
    `?grant_type=fb_exchange_token` +
    `&client_id=${process.env.INSTAGRAM_CLIENT_ID}` +
    `&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}` +
    `&fb_exchange_token=${shortLivedToken}`
  );
  const { access_token: longLivedToken } = await longRes.json();

  // (You’d save longLivedToken + IG ID to your database or env)
  return NextResponse.redirect('/');
}
