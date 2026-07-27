export function calcRecovery(drawdownPct: number): number {
  if (drawdownPct <= 0) return 0;
  if (drawdownPct >= 100) return Infinity;
  return (drawdownPct / (100 - drawdownPct)) * 100;
}

export function calcDrawdownFromCapital(initial: number, current: number): number {
  if (initial <= 0) return 0;
  return ((initial - current) / initial) * 100;
}

/** Signed capital change as a percentage of starting capital. Positive = profit. */
export function calcCapitalChangePct(initial: number, current: number): number {
  if (initial <= 0) return 0;
  return ((current - initial) / initial) * 100;
}

export function isInProfit(initial: number, current: number): boolean {
  return initial > 0 && current > initial;
}

/** Clamp drawdown to the interactive range used by the UI (0–99, 1 decimal). */
export function clampDrawdown(dd: number): number {
  const c = Math.max(0, Math.min(99, dd));
  return Math.round(c * 10) / 10;
}

/**
 * Number of equal periods (e.g. months) to recover a given drawdown, assuming a
 * constant per-period return. Returns Infinity when recovery is impossible.
 */
export function monthsToRecover(recoveryPct: number, perPeriodReturnPct: number): number {
  if (recoveryPct <= 0) return 0;
  if (!Number.isFinite(recoveryPct)) return Infinity;
  if (perPeriodReturnPct <= 0) return Infinity;
  const growth = 1 + recoveryPct / 100;
  const rate = 1 + perPeriodReturnPct / 100;
  return Math.log(growth) / Math.log(rate);
}

const pctFmt = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

// Rupiah grouping stays Indonesian (10.000.000) — equity inputs are IDR.
const intFmt = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
const pctIntFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const formatPercent = (v: number) => (Number.isFinite(v) ? pctFmt.format(v) : "∞");

// Drops the trailing ".0" for whole numbers (e.g. "30" not "30.0"), keeps one
// decimal otherwise. Used where integer inputs shouldn't show fake precision.
export const formatPercentSmart = (v: number) => {
  if (!Number.isFinite(v)) return "∞";
  return Number.isInteger(v) ? pctIntFmt.format(v) : pctFmt.format(v);
};

export const formatRupiah = (v: number) => `Rp${intFmt.format(v)}`;

export const parseRupiah = (s: string) => {
  const cleaned = s.replace(/[^\d]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
};

export const REFERENCE_BUCKETS = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 99];

// Indigo -> violet -> magenta gradient (escalating severity)
function hexToRgb(h: string) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("")}`;
}
function lerp(a: string, b: string, t: number) {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

export function bucketColor(dd: number, isDark = false): string {
  if (isDark) {
    // Dark mode: brighter, more saturated reds to stay visible on dark bg
    if (dd <= 20) return lerp("#fca5a5", "#f87171", dd / 20);
    if (dd <= 50) return lerp("#f87171", "#ef4444", (dd - 20) / 30);
    if (dd <= 80) return lerp("#ef4444", "#dc2626", (dd - 50) / 30);
    return lerp("#dc2626", "#b91c1c", Math.min((dd - 80) / 19, 1));
  }
  // Light mode: light rose -> red -> deep crimson
  if (dd <= 20) return lerp("#fecaca", "#f87171", dd / 20);
  if (dd <= 50) return lerp("#f87171", "#dc2626", (dd - 20) / 30);
  if (dd <= 80) return lerp("#dc2626", "#991b1b", (dd - 50) / 30);
  return lerp("#991b1b", "#450a0a", Math.min((dd - 80) / 19, 1));
}
