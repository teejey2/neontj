// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    // Light but meaningful security headers for a small site
    const securityHeaders = [
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      // Basic CSP that plays nice with Next/Tailwind/Framer for now
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self';",
          "img-src 'self' data: https:;",
          "style-src 'self' 'unsafe-inline';",
          "script-src 'self' 'unsafe-inline';",
          "font-src 'self' https: data:;",
          "connect-src 'self' https:;",
          "frame-src 'self' https://www.google.com https://www.recaptcha.net;",
        ].join(" ")
      },
    ];
    return [
      { source: "/:path*", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
