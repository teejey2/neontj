// 0) tailwind.config.js
// ================================
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          mint: "#B2FFF2",
          pink: "#FF6AD5",
          ice: "#7DF9FF",
          white: "#FFFFFF",
          yellow: "#FFE66D",
          orange: "#FFB254",
          purple: "#C084FC",
          blue: "#60A5FA",
          green: "#86EFAC",
          red: "#FCA5A5",
        },
      },
      boxShadow: {
        glow: "0 0 24px rgba(255,255,255,0.25)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "Arial"],
      },
    },
  },
  plugins: [],
};