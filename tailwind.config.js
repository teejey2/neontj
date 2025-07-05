/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgBlack: "#0D0D0D",
        neonPurple: "#B800FF",
        iceBlue: "#00FFFF",
        ledWhite: "#F8F8F8"
      },
      fontFamily: {
        heading: ["Orbitron", "sans-serif"],
        sans: ["Poppins", "sans-serif"]
      },
      boxShadow: {
        neon: "0 0 8px rgba(184,0,255,0.7), 0 0 16px rgba(0,255,255,0.5)",
      },
      dropShadow: {
        neon: [
          "0 0 8px rgba(184,0,255,0.7)",
          "0 0 16px rgba(0,255,255,0.5)"
        ],
      }
    },
  },
  plugins: [],
}