// 5) src/lib/pricing.ts
// ================================
export type SizeId = "mini" | "xs" | "sm" | "md" | "lg" | "xl";
export type BackboardStyle = "cut-to-letter" | "rectangle" | "fine-cut" | "no-backboard";
export type BackboardColor = "clear" | "white" | "black" | "mirror";

export const SIZE_CATALOG: Record<SizeId, { label: string; widthIn: number; heightIn: number }> = {
  mini: { label: "Mini", widthIn: 16.5, heightIn: 8 },
  xs:   { label: "Extra Small", widthIn: 20, heightIn: 9.5 },
  sm:   { label: "Small", widthIn: 24, heightIn: 11 },
  md:   { label: "Medium", widthIn: 30, heightIn: 13 },
  lg:   { label: "Large", widthIn: 36, heightIn: 16 },
  xl:   { label: "XL", widthIn: 42, heightIn: 18 },
};

const RATE_PER_INCH = 5.1;   // tune as needed
const MATERIAL_FEE = 24;     // PSU + clear acrylic + wiring
const MULTICOLOR_FEE = 20;   // handling for per-letter colors

export function estimatePrice({
  text,
  size,
  multicolor,
  backboardStyle,
  backboardColor,
}: {
  text: string;
  size: SizeId;
  multicolor: boolean;
  backboardStyle: BackboardStyle;
  backboardColor: BackboardColor;
}) {
  const clean = text.replace(/\n/g, "").trim();
  const charCount = Math.max(clean.length, 1);
  const dims = SIZE_CATALOG[size];
  const approxLedInches = dims.widthIn * 1.2 + charCount * 1.5; // proxy
  let base = approxLedInches * RATE_PER_INCH + MATERIAL_FEE;

  const styleMultiplier: Record<BackboardStyle, number> = {
    "cut-to-letter": 1.1,
    rectangle: 1.15,
    "fine-cut": 1.2,
    "no-backboard": 0.95,
  };
  base *= styleMultiplier[backboardStyle];

  const colorAdders: Record<BackboardColor, number> = { clear: 0, white: 10, black: 12, mirror: 25 };
  base += colorAdders[backboardColor];

  if (multicolor) base += MULTICOLOR_FEE;

  const finalPrice = Math.max(169, Math.round(base));
  return { finalPrice };
}