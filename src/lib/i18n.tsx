import { useSyncExternalStore } from "react";

export type Locale = "id" | "en";

const LS_KEY = "dd-locale";

type Dict = Record<string, string>;

const ID = {
  "tab.percent": "Persentase",
  "tab.equity": "Equity",
  "label.drawdown": "Drawdown",
  "label.recovery_needed": "Profit dibutuhkan",
  "label.loss": "Loss",
  "label.recovery": "Recovery",
  "label.initial_capital": "Modal awal",
  "label.current_capital": "Modal sekarang",
  "label.reset": "Reset",
  "label.history": "Riwayat",
  "label.link": "Link",
  "label.copy": "Salin",
  "label.download": "Unduh",
  "label.share": "Bagikan",
  "label.locale": "Bahasa",
  "label.close": "Tutup",
  "label.delete": "Hapus",
  "label.delete_all": "Hapus semua",
  "label.confirm_delete": "Klik lagi untuk konfirmasi",
  "label.import": "Impor",
  "label.export": "Ekspor",
  "label.about": "Tentang",
  "toast.copied": "Disalin",
  "toast.copy_failed": "Gagal menyalin",
  "toast.link_copied": "Link disalin",
  "toast.link_failed": "Gagal menyalin link",
  "toast.download_failed": "Gagal mengunduh",
  "toast.export_failed": "Gagal mengekspor",
  "toast.invalid_file": "File tidak valid",
  "toast.no_valid_history": "File tidak berisi riwayat valid",
  "toast.storage_full": "Gagal menyimpan (storage penuh)",
  "toast.imported": "{n} riwayat diimpor",
  "warning.extreme":
    "Recovery sangat sulit di zona ini. Pertimbangkan risk management ulang dan hindari revenge trading.",
  "history.title": "Riwayat Kalkulasi",
  "history.empty": "Belum ada riwayat kalkulasi",
  "history.mode.percent": "%",
  "history.mode.equity": "E",
  "install.title": "Install DrawdownCal",
  "install.desc": "Akses cepat dari home screen, offline-ready.",
  "install.ios": "Tap Share → Add to Home Screen",
  "install.cta": "Install",
  "share.summary_title": "DrawdownCal",
  "share.line_drawdown": "Drawdown",
  "share.line_equity_remaining": "Equity tersisa",
  "share.line_from": "dari",
  "share.line_recovery": "Pemulihan dibutuhkan",
  "share.line_ratio": "Rasio pemulihan/kerugian",
  "share.line_try": "Hitung sendiri",
  "about.title": "Tentang Drawdown",
  "about.desc": "itu seberapa dalam modal turun dari puncaknya sebelum balik naik.",
  "about.formula": "Rumus",
  "about.explain":
    "Saat modal turun, basis hitungnya ikut mengecil. Itu sebabnya persen buat balik modal selalu lebih besar dari penurunannya.",
  "about.reference": "Tabel Referensi",
  "about.tips": "Tips Risk Management",
  "about.tip1": "Drawdown vs recovery itu eksponensial, bukan linear",
  "about.tip2": "−10% butuh +11%, −50% butuh +100%, −90% butuh +900%",
  "about.tip3": "Cut loss kecil jauh lebih sehat daripada nahan floating loss",
  "about.tip4": "Profit konsisten lahir dari loss yang dikecilin",
  "chart.aria": "Diagram drawdown",
  "chart.recovery_label": "Butuh pulih",
  "share.subtitle": "Kalkulator Pemulihan",
  "share.recovery_short": "Butuh pulih",
  "theme.toggle": "Ganti tema",
  "seo.h1": "Kalkulator Drawdown & Recovery Trading",
} as const;

const EN: Record<keyof typeof ID, string> = {
  "tab.percent": "Percentage",
  "tab.equity": "Equity",
  "label.drawdown": "Drawdown",
  "label.recovery_needed": "Profit needed",
  "label.loss": "Loss",
  "label.recovery": "Recovery",
  "label.initial_capital": "Starting capital",
  "label.current_capital": "Current capital",
  "label.reset": "Reset",
  "label.history": "History",
  "label.link": "Link",
  "label.copy": "Copy",
  "label.download": "Download",
  "label.share": "Share",
  "label.locale": "Language",
  "label.close": "Close",
  "label.delete": "Delete",
  "label.delete_all": "Delete all",
  "label.confirm_delete": "Click again to confirm",
  "label.import": "Import",
  "label.export": "Export",
  "label.about": "About",
  "toast.copied": "Copied",
  "toast.copy_failed": "Failed to copy",
  "toast.link_copied": "Link copied",
  "toast.link_failed": "Failed to copy link",
  "toast.download_failed": "Download failed",
  "toast.export_failed": "Export failed",
  "toast.invalid_file": "Invalid file",
  "toast.no_valid_history": "File contains no valid history",
  "toast.storage_full": "Failed to save (storage full)",
  "toast.imported": "{n} entries imported",
  "warning.extreme":
    "Recovery is extremely hard at this level. Reassess risk management and avoid revenge trading.",
  "history.title": "Calculation History",
  "history.empty": "No calculation history yet",
  "history.mode.percent": "%",
  "history.mode.equity": "E",
  "install.title": "Install DrawdownCal",
  "install.desc": "Quick access from home screen, offline-ready.",
  "install.ios": "Tap Share → Add to Home Screen",
  "install.cta": "Install",
  "share.summary_title": "DrawdownCal",
  "share.line_drawdown": "Drawdown",
  "share.line_equity_remaining": "Equity remaining",
  "share.line_from": "of",
  "share.line_recovery": "Recovery needed",
  "share.line_ratio": "Recovery/loss ratio",
  "share.line_try": "Try it yourself",
  "about.title": "About Drawdown",
  "about.desc": "is how deep your capital drops from its peak before recovering.",
  "about.formula": "Formula",
  "about.explain":
    "When capital drops, the base of calculation shrinks too. That's why the percentage needed to recover is always larger than the drawdown itself.",
  "about.reference": "Reference Table",
  "about.tips": "Risk Management Tips",
  "about.tip1": "Drawdown vs recovery is exponential, not linear",
  "about.tip2": "−10% needs +11%, −50% needs +100%, −90% needs +900%",
  "about.tip3": "Small cut losses are far healthier than holding floating losses",
  "about.tip4": "Consistent profit comes from minimizing losses",
  "chart.aria": "Drawdown chart",
  "chart.recovery_label": "Recovery needed",
  "share.subtitle": "Recovery Calculator",
  "share.recovery_short": "Recovery needed",
  "theme.toggle": "Toggle theme",
  "seo.h1": "Trading Drawdown & Recovery Calculator",
};

const DICTS: Record<Locale, Dict> = { id: ID as unknown as Dict, en: EN as unknown as Dict };

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

export type TKey = keyof typeof ID;

export function useT() {
  const loc = useLocale();
  const dict = DICTS[loc];
  return (key: TKey, vars?: Record<string, string | number>): string => {
    let s = dict[key] ?? (ID as unknown as Dict)[key] ?? String(key);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replace(`{${k}}`, String(v));
      }
    }
    return s;
  };
}

export function t(key: TKey, loc?: Locale): string {
  const l = loc ?? getLocale();
  return DICTS[l][key] ?? (ID as unknown as Dict)[key] ?? String(key);
}
