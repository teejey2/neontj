/* src/lib/fonts.ts */
import localFont from "next/font/local";

/** Masked IDs so real family names aren’t exposed */
export type FontId =
  | "n1" | "n2" | "n3" | "n4" | "n5" | "n6" | "n7" | "n8"
  | "n9" | "n10" | "n11" | "n12" | "n13" | "n14" | "n15" | "n16";

/* Top-level consts (required by Next) — paths are relative to THIS file (src/lib) */
const n1  = localFont({  src: "../fonts/Orbitron-Regular.ttf",            variable: "--font-n1",  display: "swap" });
const n2  = localFont({  src: "../fonts/Monoton-Regular.ttf",             variable: "--font-n2",  display: "swap" });
const n3  = localFont({  src: "../fonts/Pacifico-Regular.ttf",            variable: "--font-n3",  display: "swap" });
const n4  = localFont({  src: "../fonts/Rajdhani-Regular.ttf",            variable: "--font-n4",  display: "swap" });
const n5  = localFont({  src: "../fonts/AdventPro-Regular.ttf",           variable: "--font-n5",  display: "swap" });
const n6  = localFont({  src: "../fonts/Astloch-Regular.ttf",             variable: "--font-n6",  display: "swap" });
const n7  = localFont({  src: "../fonts/Atma-Regular.ttf",                variable: "--font-n7",  display: "swap" });
const n8  = localFont({  src: "../fonts/Beon.otf",                        variable: "--font-n8",  display: "swap" });
const n9  = localFont({  src: "../fonts/Borel-Regular.ttf",               variable: "--font-n9",  display: "swap" });
const n10 = localFont({  src: "../fonts/Capriola-Regular.ttf",            variable: "--font-n10", display: "swap" });
const n11 = localFont({  src: "../fonts/Charmonman-Regular.ttf",          variable: "--font-n11", display: "swap" });
const n12 = localFont({  src: "../fonts/Gaegu-Regular.ttf",               variable: "--font-n12", display: "swap" });
const n13 = localFont({  src: "../fonts/Grandstander-Regular.ttf",        variable: "--font-n13", display: "swap" });
const n14 = localFont({  src: "../fonts/HachiMaruPop-Regular.ttf",        variable: "--font-n14", display: "swap" });
const n15 = localFont({  src: "../fonts/MonomaniacOne-Regular.ttf",       variable: "--font-n15", display: "swap" });
const n16 = localFont({  src: "../fonts/NightLightOutline.ttf",   variable: "--font-n16", display: "swap" });

/** Attach all CSS variables to <html> */
export const fontVarsClass = [
  n1.variable, n2.variable, n3.variable, n4.variable, n5.variable, n6.variable,
  n7.variable, n8.variable, n9.variable, n10.variable, n11.variable, n12.variable,
  n13.variable, n14.variable, n15.variable, n16.variable,
].join(" ");

/** Masked labels for the picker (no real family names) */
export const FONTS: { id: FontId; label: string }[] = [
  { id: "n1",  label: "Neon Tech" },        // Orbitron
  { id: "n2",  label: "Retro Tube" },       // Monoton
  { id: "n3",  label: "Script Glow A" },    // Pacifico
  { id: "n4",  label: "Condensed Glow" },   // Rajdhani
  { id: "n5",  label: "Clean Sans A" },     // Advent Pro
  { id: "n6",  label: "Quirky Thin" },      // Astloch
  { id: "n7",  label: "Rounded Fun" },      // Atma
  { id: "n8",  label: "Classic Neon" },     // Beon
  { id: "n9",  label: "Casual Hand" },      // Borel
  { id: "n10", label: "Simple Sans" },      // Capriola
  { id: "n11", label: "Brush Script" },     // Charmonman
  { id: "n12", label: "Playful Print" },    // Gaegu
  { id: "n13", label: "Pop Thick" },        // Grandstander
  { id: "n14", label: "Cute Script" },      // HachiMaruPop
  { id: "n15", label: "Mono Line" },        // Monomaniac One
  { id: "n16", label: "Outline Neon" },     // Night Light Outline
];

/** Helper: CSS var for inline style usage */
export function cssVarForFont(id: string) {
  return `var(--font-${id})`;
}

/** Optional: legacy id support */
const LEGACY_TO_MASKED: Record<string, FontId> = {
  orbitron: "n1", monoton: "n2", pacifico: "n3", rajdhani: "n4",
  adventpro: "n5", astloch: "n6", atma: "n7", beon: "n8",
  borel: "n9", capriola: "n10", charmonman: "n11", gaegu: "n12",
  grandstander: "n13", hachikaku: "n14", monomaniac: "n15", nightlight: "n16",
};
export function normalizeFontId(id: string | undefined): FontId {
  if (!id) return "n1";
  return (LEGACY_TO_MASKED[id] as FontId) || (id as FontId);
}
