/* src/lib/pricing.ts */

export type SizeId =
  | "mini"
  | "xs"
  | "small"
  | "medium"
  | "large"
  | "xl"
  | "xxl"
  | "supersized";

export type BackboardStyle = "cut-to-letter" | "rectangle" | "rounded" | "circle";
export type BackboardColor = "clear" | "black" | "white" | "smoke" | "ice";

/** Use the style you showed: each size shows Length × Height. Tune values as needed. */
export const SIZE_CATALOG: Record<
  SizeId,
  { label: string; widthIn: number; heightIn: number }
> = {
  mini:       { label: "Mini",        widthIn: 16.5, heightIn: 8 },
  xs:         { label: "Extra Small", widthIn: 20,   heightIn: 10 },
  small:      { label: "Small",       widthIn: 24,   heightIn: 12 },
  medium:     { label: "Medium",      widthIn: 30,   heightIn: 14 },
  large:      { label: "Large",       widthIn: 38,   heightIn: 18 },
  xl:         { label: "X Large",     widthIn: 48,   heightIn: 22 },
  xxl:        { label: "XX Large",    widthIn: 64,   heightIn: 30 },
  supersized: { label: "Supersized",  widthIn: 85,   heightIn: 38 },
};

/** pricing proxy — we’ll refine once you approve the size grid */
const RATE_PER_INCH = 5.8;
const MATERIAL_FEE = 35;

export function estimatePrice({
  text, size, backboardStyle,
}: {
  text: string;
  size: SizeId;
  backboardStyle: BackboardStyle;
}) {
  const clean = (text || "").replace(/\s/g, "");
  const charCount = Math.max(clean.length, 1);
  const dims = SIZE_CATALOG[size];
  const approxLedInches = dims.widthIn * 1.08 + charCount * 1.25;

  let base = approxLedInches * RATE_PER_INCH + MATERIAL_FEE;

  const styleMultiplier: Record<BackboardStyle, number> = {
    "cut-to-letter": 1.0,
    rectangle: 1.05,
    rounded: 1.08,
    circle: 1.1,
  };
  base *= styleMultiplier[backboardStyle];

  return Math.max(205, Math.round(base / 5) * 5);
}
