// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgBlack: "#0b0b0f", // used by bg-bgBlack
        neon: {
          purple: "#9b5cff",
          pink: "#ff4bd1",
          blue: "#3fd5ff",
          ice: "#b7e9ff", // optional alias for iceBlue
        },
      },
      fontFamily: {
        // Inter will be provided by next/font with a CSS variable
        heading: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        // soft neon outer glow used as shadow-glow
        glow: "0 0 12px rgba(155,92,255,0.45), 0 0 30px rgba(63,213,255,0.25)",
      },
      dropShadow: {
        neon: "0 0 8px rgba(155,92,255,0.65)",
      },
    },
  },
  plugins: [],
};
