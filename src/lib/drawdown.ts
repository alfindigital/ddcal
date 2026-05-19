export function calcRecovery(drawdownPct: number): number {
  if (drawdownPct <= 0) return 0;
  if (drawdownPct >= 100) return Infinity;
  return (drawdownPct / (100 - drawdownPct)) * 100;
}

export function calcDrawdownFromCapital(initial: number, current: number): number {
  if (initial <= 0) return 0;
  return ((initial - current) / initial) * 100;
}

const pctFmt = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const intFmt = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

export const formatPercent = (v: number) =>
  Number.isFinite(v) ? pctFmt.format(v) : "∞";

export const formatRupiah = (v: number) => `Rp${intFmt.format(v)}`;

export const parseRupiah = (s: string) => {
  const cleaned = s.replace(/[^\d]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
};

export const REFERENCE_BUCKETS = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 99];

// Smooth green -> amber -> red -> dark red gradient
function hexToRgb(h: string) {
  return [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
}
function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("")}`;
}
function lerp(a: string, b: string, t: number) {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

export function bucketColor(dd: number): string {
  if (dd <= 10) return lerp("#86efac", "#fbbf24", dd / 10);
  if (dd <= 30) return lerp("#fbbf24", "#f87171", (dd - 10) / 20);
  if (dd <= 60) return lerp("#f87171", "#b91c1c", (dd - 30) / 30);
  return lerp("#b91c1c", "#7f1d1d", Math.min((dd - 60) / 39, 1));
}
