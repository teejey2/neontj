/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    FORM_ENDPOINT: process.env.NEXT_PUBLIC_FORM_ENDPOINT,
  },
}
