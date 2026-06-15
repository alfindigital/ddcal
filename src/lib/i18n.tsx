import { useSyncExternalStore } from "react";

export type Locale = "id" | "en";

const LS_KEY = "dd-locale";

type Dict = Record<string, string>;

const ID: Dict = {
  "tab.percent": "Persentase",
  "tab.equity": "Equity",
  "label.drawdown": "Drawdown",
  "label.recovery_needed": "Profit dibutuhkan",
  "label.loss": "Loss",
  "label.recovery": "Recovery",
  "label.initial_capital": "Modal awal",
  "label.current_capital": "Modal sekarang",
  "label.reset": "Reset",
  "label.compare": "Bandingkan",
  "label.compare_with": "Bandingkan dengan",
  "label.history": "Riwayat",
  "label.link": "Link",
  "label.copy": "Salin",
  "label.download": "Unduh",
  "label.share": "Bagikan",
  "label.scenario": "Skenario",
  "label.recovery_short": "Pulih",
  "label.locale": "Bahasa",
  "toast.copied": "Disalin",
  "toast.copy_failed": "Gagal menyalin",
  "toast.link_copied": "Link disalin",
  "toast.link_failed": "Gagal menyalin link",
  "toast.download_failed": "Gagal mengunduh",
  "warning.extreme":
    "Recovery sangat sulit di zona ini. Pertimbangkan risk management ulang dan hindari revenge trading.",
  "embed.cta": "Hitung sendiri",
  "compare.preset.mild": "Ringan",
  "compare.preset.moderate": "Sedang",
  "compare.preset.severe": "Berat",
  "compare.preset.extreme": "Ekstrem",
  "compare.helper": "Pilih skenario untuk dibandingkan.",
};

const EN: Dict = {
  "tab.percent": "Percentage",
  "tab.equity": "Equity",
  "label.drawdown": "Drawdown",
  "label.recovery_needed": "Profit needed",
  "label.loss": "Loss",
  "label.recovery": "Recovery",
  "label.initial_capital": "Starting capital",
  "label.current_capital": "Current capital",
  "label.reset": "Reset",
  "label.compare": "Compare",
  "label.compare_with": "Compare with",
  "label.history": "History",
  "label.link": "Link",
  "label.copy": "Copy",
  "label.download": "Download",
  "label.share": "Share",
  "label.scenario": "Scenario",
  "label.recovery_short": "Recovery",
  "label.locale": "Language",
  "toast.copied": "Copied",
  "toast.copy_failed": "Failed to copy",
  "toast.link_copied": "Link copied",
  "toast.link_failed": "Failed to copy link",
  "toast.download_failed": "Download failed",
  "warning.extreme":
    "Recovery is extremely hard at this level. Reassess risk management and avoid revenge trading.",
  "embed.cta": "Try it yourself",
  "compare.preset.mild": "Mild",
  "compare.preset.moderate": "Moderate",
  "compare.preset.severe": "Severe",
  "compare.preset.extreme": "Extreme",
  "compare.helper": "Pick a scenario to compare.",
};

const DICTS: Record<Locale, Dict> = { id: ID, en: EN };

let current: Locale = "id";
const listeners = new Set<() => void>();

function detectInitial(): Locale {
  if (typeof window === "undefined") return "id";
  try {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("lang");
    if (q === "en" || q === "id") return q;
    const ls = window.localStorage.getItem(LS_KEY);
    if (ls === "en" || ls === "id") return ls;
    const nav = navigator.language?.toLowerCase() ?? "";
    if (nav.startsWith("id")) return "id";
    return nav.startsWith("en") ? "en" : "id";
  } catch {
    return "id";
  }
}

let initialized = false;
function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  current = detectInitial();
}

export function getLocale(): Locale {
  ensureInit();
  return current;
}

export function setLocale(next: Locale) {
  ensureInit();
  if (current === next) return;
  current = next;
  try {
    window.localStorage.setItem(LS_KEY, next);
    document.documentElement.lang = next;
  } catch {
    /* noop */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useLocale(): Locale {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => "id" as Locale,
  );
}

export function useT() {
  const loc = useLocale();
  const dict = DICTS[loc];
  return (key: keyof typeof ID): string => dict[key] ?? ID[key] ?? String(key);
}

export function t(key: keyof typeof ID, loc?: Locale): string {
  const l = loc ?? getLocale();
  return DICTS[l][key] ?? ID[key] ?? String(key);
}
