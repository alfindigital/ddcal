import { createContext, useContext, type ReactNode } from "react";

export type Locale = "id" | "en";

type Dict = Record<string, string>;

const ID = {
  // Tabs & core labels
  "tab.percent": "Persentase",
  "tab.equity": "Equity",
  "label.drawdown": "Drawdown",
  "label.recovery_needed": "Profit dibutuhkan",
  "label.loss": "Loss",
  "label.recovery": "Recovery",
  "label.initial_capital": "Modal awal",
  "label.current_capital": "Modal sekarang",
  "label.reset": "Reset",
  "label.copy": "Salin",
  "label.copy_link": "Salin link",
  "label.download": "Unduh",
  "label.share": "Bagikan",
  "label.locale": "Bahasa",
  "label.close": "Tutup",
  "label.about": "Tentang",
  "label.difficulty": "Tingkat",
  "nav.home": "Kalkulator",
  "nav.about": "Tentang",

  // Accessibility
  "aria.slider": "Persentase drawdown",
  "aria.slider_value": "Drawdown {dd} persen, butuh recovery {rec} persen",
  "slider.hint": "Geser atau ketik nilai drawdown",
  "chart.hint": "Ketuk batang untuk memilih nilai",

  // Toasts
  "toast.copied": "Disalin",
  "toast.copy_failed": "Gagal menyalin",
  "toast.link_copied": "Link disalin",
  "toast.link_failed": "Gagal menyalin link",
  "toast.download_failed": "Gagal mengunduh",

  // Warnings & takeaways
  "warning.extreme":
    "Recovery sangat sulit di zona ini. Pertimbangkan risk management ulang dan hindari revenge trading.",
  "takeaway.easy": "Masih terkendali. Jaga disiplin cut loss biar tetap di zona ini.",
  "takeaway.medium": "Mulai berat, recovery sudah lebih besar dari loss-nya.",
  "takeaway.hard":
    "Loss harus dibalas profit yang jauh lebih besar. Pertimbangkan kurangi ukuran posisi.",
  "takeaway.very_hard": "Zona bahaya. Butuh hampir dobel modal sisa cuma buat balik.",
  "takeaway.extreme": "Hampir mustahil tanpa risiko ekstra. Hindari revenge trading.",
  "profit.banner": "Kamu lagi profit +{n}% dari modal awal 🎉",

  // Install prompt
  "install.title": "Install DrawdownCal",
  "install.desc": "Akses cepat dari home screen, offline-ready.",
  "install.ios": "Tap Share → Add to Home Screen",
  "install.cta": "Install",

  // Share
  "share.summary_title": "DrawdownCal",
  "share.line_drawdown": "Drawdown",
  "share.line_equity_remaining": "Equity tersisa",
  "share.line_from": "dari",
  "share.line_recovery": "Pemulihan dibutuhkan",
  "share.line_ratio": "Rasio pemulihan/kerugian",
  "share.line_try": "Hitung sendiri",
  "share.subtitle": "Kalkulator Pemulihan",
  "share.recovery_short": "Butuh pulih",
  "share.whatsapp": "WhatsApp",
  "share.telegram": "Telegram",
  "share.native": "Bagikan",

  // About dialog
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

  // Chart
  "chart.aria": "Diagram drawdown",
  "chart.recovery_label": "Butuh pulih",
  "theme.toggle": "Ganti tema",

  // Content / SEO body
  "seo.h1": "Kalkulator Drawdown & Recovery Trading",
  "content.lead": "Rugi 50%? Kamu butuh profit 100% cuma buat balik modal.",
  "content.sub":
    "Drawdown dan recovery itu nggak simetris. Makin dalam loss-nya, makin gede profit yang dibutuhkan buat balik ke titik awal. Kalkulator ini nunjukin angka pastinya.",
  "content.how_heading": "Kenapa recovery lebih besar dari loss?",
  "content.formula_heading": "Rumus",
  "faq.heading": "Pertanyaan umum",
  "faq.q1": "Apa itu drawdown dalam trading?",
  "faq.a1":
    "Drawdown adalah persentase penurunan modal dari titik tertinggi (peak) ke titik terendah (trough) sebelum naik kembali. Ini menunjukkan seberapa besar kerugian portofolio dari nilai tertingginya.",
  "faq.q2": "Bagaimana cara menghitung recovery dari drawdown?",
  "faq.a2":
    "Rumusnya: Recovery % = Drawdown ÷ (100 − Drawdown) × 100. Contoh: drawdown 50% membutuhkan recovery 100% untuk kembali ke modal awal.",
  "faq.q3": "Berapa persen profit untuk pulih dari kerugian 50%?",
  "faq.a3":
    "Kalau modal turun 50%, kamu butuh kenaikan 100% dari modal yang tersisa untuk balik ke modal awal. Karena recovery dihitung dari basis modal yang lebih kecil, bukan dari modal awal.",
  disclaimer: "Alat edukasi, bukan saran finansial. Trading mengandung risiko.",
  privacy:
    "100% privat. Semua hitungan jalan di browser kamu, tidak ada data yang dikirim ke server.",

  // Equity helpers
  "equity.simulate": "Simulasi turun lagi",

  // Time to recover
  "time.title": "Estimasi waktu balik modal",
  "time.input": "Profit rata-rata / bulan",
  "time.hint": "Dengan profit segini, balik modal kira-kira:",
  "time.impossible": "Butuh profit positif dulu",
  "time.month": "bulan",
  "time.year": "tahun",

  // Compare
  "compare.toggle": "Bandingkan",
  "compare.title": "Bandingkan skenario",
  "compare.add": "Tambah",
  "compare.remove": "Hapus",
  "compare.hint": "Tambah beberapa drawdown buat lihat seberapa beda recovery-nya.",

  // Embed
  "embed.label": "Embed",
  "embed.title": "Embed widget",
  "embed.desc": "Tempel kalkulator ini di website atau blog-mu.",
  "embed.copy": "Salin kode",
  "embed.copied": "Kode embed disalin",
  "embed.preview": "Pratinjau",
  "embed.transparent": "Background transparan",

  // CTA
  "cta.title": "Trader? Jangan trading buta.",
  "cta.body": "Insight risk management & psikologi trading tiap minggu di Telegram.",
  "cta.button": "Gabung Telegram",

  // Difficulty levels
  "diff.easy": "Mudah",
  "diff.medium": "Sedang",
  "diff.hard": "Sulit",
  "diff.very_hard": "Sangat Sulit",
  "diff.extreme": "Hampir Mustahil",

  // Landing pages
  "landing.intro":
    "Kalau modalmu turun {dd}%, kamu butuh profit {rec}% untuk balik ke titik awal. Ini karena recovery dihitung dari modal sisa yang lebih kecil.",
  "landing.cta": "Buka kalkulator lengkap",
  "landing.related": "Drawdown lainnya",
  "landing.back": "Semua level drawdown",
  "landing.h1": "Drawdown {dd}% butuh recovery berapa persen?",
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
  "label.copy": "Copy",
  "label.copy_link": "Copy link",
  "label.download": "Download",
  "label.share": "Share",
  "label.locale": "Language",
  "label.close": "Close",
  "label.about": "About",
  "label.difficulty": "Difficulty",
  "nav.home": "Calculator",
  "nav.about": "About",

  "aria.slider": "Drawdown percentage",
  "aria.slider_value": "Drawdown {dd} percent, needs {rec} percent recovery",
  "slider.hint": "Drag or type the drawdown value",
  "chart.hint": "Tap a bar to select a value",

  "toast.copied": "Copied",
  "toast.copy_failed": "Failed to copy",
  "toast.link_copied": "Link copied",
  "toast.link_failed": "Failed to copy link",
  "toast.download_failed": "Download failed",

  "warning.extreme":
    "Recovery is extremely hard at this level. Reassess risk management and avoid revenge trading.",
  "takeaway.easy": "Still manageable. Keep cutting losses to stay in this zone.",
  "takeaway.medium": "Getting heavy, recovery now costs more than the loss itself.",
  "takeaway.hard": "You need a far bigger gain than the loss. Consider cutting position size.",
  "takeaway.very_hard": "Danger zone. You need to nearly double what's left just to break even.",
  "takeaway.extreme": "Near-impossible without extra risk. Avoid revenge trading.",
  "profit.banner": "You're up +{n}% from your starting capital 🎉",

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
  "share.subtitle": "Recovery Calculator",
  "share.recovery_short": "Recovery needed",
  "share.whatsapp": "WhatsApp",
  "share.telegram": "Telegram",
  "share.native": "Share",

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
  "theme.toggle": "Toggle theme",

  "seo.h1": "Trading Drawdown & Recovery Calculator",
  "content.lead": "Down 50%? You need +100% profit just to break even.",
  "content.sub":
    "Drawdown and recovery aren't symmetric. The deeper the loss, the bigger the gain you need to get back to even. This calculator shows the exact numbers.",
  "content.how_heading": "Why is recovery bigger than the loss?",
  "content.formula_heading": "Formula",
  "faq.heading": "FAQ",
  "faq.q1": "What is drawdown in trading?",
  "faq.a1":
    "Drawdown is the percentage drop in capital from a peak to a trough before recovering. It shows how far a portfolio has fallen from its highest value.",
  "faq.q2": "How do you calculate recovery from a drawdown?",
  "faq.a2":
    "Formula: Recovery % = Drawdown ÷ (100 − Drawdown) × 100. Example: a 50% drawdown needs 100% recovery to get back to the starting capital.",
  "faq.q3": "How much profit is needed to recover from a 50% loss?",
  "faq.a3":
    "If capital drops 50%, you need a 100% gain on the remaining capital to get back to even, because recovery is calculated from the smaller remaining base, not the original capital.",
  disclaimer: "Educational tool — not financial advice.",
  privacy: "Runs locally in your browser. No data leaves your device.",

  "equity.simulate": "Simulate further drop",

  "time.title": "Time to break even",
  "time.input": "Average profit / month",
  "time.hint": "At this monthly profit, breaking even takes about:",
  "time.impossible": "Needs positive profit first",
  "time.month": "months",
  "time.year": "years",

  "compare.toggle": "Compare",
  "compare.title": "Compare scenarios",
  "compare.add": "Add",
  "compare.remove": "Remove",
  "compare.hint": "Add a few drawdowns to see how different the recovery is.",

  "embed.label": "Embed",
  "embed.title": "Embed widget",
  "embed.desc": "Drop this calculator on your website or blog.",
  "embed.copy": "Copy code",
  "embed.copied": "Embed code copied",
  "embed.preview": "Preview",
  "embed.transparent": "Transparent background",

  "cta.title": "Trader? Don't fly blind.",
  "cta.body": "Weekly risk management & trading psychology insights on Telegram.",
  "cta.button": "Join Telegram",

  "diff.easy": "Easy",
  "diff.medium": "Medium",
  "diff.hard": "Hard",
  "diff.very_hard": "Very Hard",
  "diff.extreme": "Near Impossible",

  "landing.intro":
    "If your capital drops {dd}%, you need {rec}% profit to get back to even. That's because recovery is calculated from the smaller remaining capital.",
  "landing.cta": "Open the full calculator",
  "landing.related": "Other drawdowns",
  "landing.back": "All drawdown levels",
  "landing.h1": "What recovery does a {dd}% drawdown need?",
};

const DICTS: Record<Locale, Dict> = {
  id: ID as unknown as Dict,
  en: EN as unknown as Dict,
};

export type TKey = keyof typeof ID;

function interpolate(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s;
  let out = s;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replace(`{${k}}`, String(v));
  }
  return out;
}

// Locale is route-driven: `/` → id, `/en` → en. Provided via context so SSR
// renders the correct language without any client round-trip.
const LocaleContext = createContext<Locale>("id");

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  // App is English-only — locale switching is disabled.
  return "en";
}

export function useT() {
  const loc = useLocale();
  const dict = DICTS[loc];
  return (key: TKey, vars?: Record<string, string | number>): string => {
    const s = dict[key] ?? (ID as unknown as Dict)[key] ?? String(key);
    return interpolate(s, vars);
  };
}

/** Non-hook lookup for use outside React render (rare). */
export function t(key: TKey, loc: Locale = "id", vars?: Record<string, string | number>): string {
  const s = DICTS[loc][key] ?? (ID as unknown as Dict)[key] ?? String(key);
  return interpolate(s, vars);
}
