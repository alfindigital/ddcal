// English-only dictionary. Locale switching has been removed; the provider
// remains as a no-op so existing call sites keep working.

import type { ReactNode } from "react";

export type Locale = "en";

const DICT = {
  // Tabs & core labels
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
  "label.close": "Close",
  "label.about": "About",
  "label.difficulty": "Difficulty",
  "nav.home": "Calculator",
  "nav.about": "About",

  "aria.slider": "Drawdown percentage",
  "aria.slider_value": "Drawdown {dd} percent, needs {rec} percent recovery",

  "toast.copied": "Copied",
  "toast.copy_failed": "Failed to copy",
  "toast.download_failed": "Download failed",

  "warning.extreme": "Recovery is extremely hard at this level. Reassess risk management.",
  "takeaway.easy": "Still manageable. Keep cutting losses to stay in this zone.",
  "takeaway.medium": "Getting heavy: recovery now costs more than the loss.",
  "takeaway.hard": "You need a far bigger gain than the loss. Cut position size.",
  "takeaway.very_hard": "Danger zone: needs nearly 2x to break even.",
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

  "about.title": "About Drawdown",
  "about.desc": "is how deep your capital drops from its peak before recovering.",
  "about.formula": "Formula",
  "about.explain":
    "When capital drops, the base of calculation shrinks too. That's why the percentage needed to recover is always larger than the drawdown itself.",
  "about.reference": "Reference Table",
  "about.tips": "Risk Management Tips",
  "about.tip1": "Drawdown vs recovery is exponential, not linear.",
  "about.tip2": "−10% needs +11%, −50% needs +100%, −90% needs +900%.",
  "about.tip3": "Small cut losses are far healthier than holding floating losses.",
  "about.tip4": "Consistent profit comes from minimizing losses.",

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
  disclaimer: "Educational tool - not financial advice.",
  privacy: "Runs locally in your browser. No data leaves your device.",

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

  "cta.title": "Trader? Don't fly blind.",
  "cta.body": "Weekly risk management & trading psychology insights on Telegram.",
  "cta.button": "Join Telegram",

  "diff.easy": "Easy",
  "diff.medium": "Medium",
  "diff.hard": "Hard",
  "diff.very_hard": "Very Hard",
  "diff.extreme": "Near Impossible",

  "landing.intro":
    "If your capital drops {dd}%, you need {rec}% profit to get back to even. Recovery is calculated from the smaller remaining capital.",
  "landing.cta": "Open the full calculator",
  "landing.related": "Other drawdowns",
  "landing.back": "All drawdown levels",
  "landing.h1": "What recovery does a {dd}% drawdown need?",
} as const;

export type TKey = keyof typeof DICT;

function interpolate(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s;
  let out = s;
  for (const [k, v] of Object.entries(vars)) out = out.replace(`{${k}}`, String(v));
  return out;
}

// No-op provider kept for backwards compatibility with existing call sites.
export function I18nProvider({ children }: { locale?: Locale; children: ReactNode }) {
  return <>{children}</>;
}

export function useLocale(): Locale {
  return "en";
}

export function useT() {
  return (key: TKey, vars?: Record<string, string | number>): string =>
    interpolate(DICT[key] ?? String(key), vars);
}

/** Non-hook lookup for use outside React render. */
export function t(key: TKey, _loc?: Locale, vars?: Record<string, string | number>): string {
  return interpolate(DICT[key] ?? String(key), vars);
}
