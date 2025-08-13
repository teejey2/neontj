// 4) src/lib/fonts.ts
// ================================
import { Orbitron, Rajdhani, Audiowide } from "next/font/google";

export const orbitron = Orbitron({ subsets: ["latin"], weight: ["400","600","700"], variable: "--font-orbitron" });
export const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400","600","700"], variable: "--font-rajdhani" });
export const audiowide = Audiowide({ subsets: ["latin"], weight: "400", variable: "--font-audiowide" });

export const fontOptions = [
  { id: "orbitron", label: "Orbitron", className: orbitron.className },
  { id: "rajdhani", label: "Rajdhani", className: rajdhani.className },
  { id: "audiowide", label: "Audiowide", className: audiowide.className },
] as const;

export type FontId = typeof fontOptions[number]["id"];
export const fontClassFor = (id: FontId) => fontOptions.find(f => f.id === id)?.className ?? orbitron.className;
