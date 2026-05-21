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

// Indigo -> violet -> magenta gradient (escalating severity)
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
  // Light rose -> red -> deep crimson (escalating severity)
  if (dd <= 20) return lerp("#fecaca", "#f87171", dd / 20);
  if (dd <= 50) return lerp("#f87171", "#dc2626", (dd - 20) / 30);
  if (dd <= 80) return lerp("#dc2626", "#991b1b", (dd - 50) / 30);
  return lerp("#991b1b", "#450a0a", Math.min((dd - 80) / 19, 1));
}
