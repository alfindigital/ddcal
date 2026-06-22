/**
 * Lightweight GA4 wrapper. Provider-agnostic call site (`track`) so swapping
 * analytics later touches only this file. No-ops entirely when VITE_GA_ID is
 * unset, so dev/preview never sends events and the snippet never loads.
 *
 * The gtag <script> is injected in __root.tsx head (guarded by the same id),
 * with Consent Mode defaulting analytics_storage to "denied" until granted —
 * keeps cookieless pings working without a blocking consent wall.
 */

export const GA_ID: string | undefined =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GA_ID) || undefined;

type GtagFn = (...args: unknown[]) => void;

interface WindowWithGtag extends Window {
  gtag?: GtagFn;
  dataLayer?: unknown[];
}

export type AnalyticsEvent =
  | "mode_switch"
  | "slider_use"
  | "slider_input"
  | "equity_input"
  | "equity_multiplier"
  | "result_view"
  | "copy_summary"
  | "download_image"
  | "native_share"
  | "share_whatsapp"
  | "share_telegram"
  | "share_x"
  | "embed_open"
  | "embed_copy"
  | "install_prompt_shown"
  | "install_accepted"
  | "install_dismissed"
  | "locale_toggle"
  | "theme_toggle"
  | "about_open"
  | "social_click"
  | "cta_telegram"
  | "compare_add"
  | "compare_remove"
  | "recovery_time_calc"
  | "landing_cta_click";

export function track(
  event: AnalyticsEvent,
  params?: Record<string, string | number | boolean>,
): void {
  if (!GA_ID || typeof window === "undefined") return;
  const w = window as WindowWithGtag;
  try {
    w.gtag?.("event", event, params ?? {});
  } catch {
    /* never let analytics break the app */
  }
}

/** Inline bootstrap that defines gtag() before the async script loads. */
export function gaBootstrapScript(id: string): string {
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag=gtag;",
    "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});",
    "gtag('js',new Date());",
    `gtag('config','${id}',{anonymize_ip:true});`,
  ].join("");
}
