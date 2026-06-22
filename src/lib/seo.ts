// Shared SEO/meta constants and helpers, so title/description stay
// consistent across root and per-route head() definitions.
//
// SITE_URL is env-driven (VITE_SITE_URL) so moving to a custom domain is a
// one-variable change. Default is the production custom domain.

import type { Locale } from "@/lib/i18n";
import { calcRecovery, formatPercent } from "@/lib/drawdown";

export const SITE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
  "https://drawdowncal.alfindigital.com"
).replace(/\/$/, "");

export const SITE_NAME = "DrawdownCal";
export const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, "");

// Locale-specific defaults. `/` serves ID, `/en` serves EN.
export const META: Record<Locale, { title: string; description: string }> = {
  id: {
    title: "Kalkulator Drawdown & Recovery Trading | DrawdownCal",
    description:
      "Hitung berapa persen profit yang dibutuhkan untuk balik modal setelah drawdown trading. Dua mode: persentase atau equity. Gratis, tanpa daftar.",
  },
  en: {
    title: "Drawdown & Recovery Calculator for Traders | DrawdownCal",
    description:
      "Calculate how much profit you need to recover from a trading drawdown. Two modes: percentage or equity. Free, no signup.",
  },
};

export const DEFAULT_TITLE = META.id.title;
export const DEFAULT_DESCRIPTION = META.id.description;

export const OG_IMAGE = `${SITE_URL}/og.jpg`;
export const OG_IMAGE_FALLBACK = `${SITE_URL}/og-image-fallback.svg`;
// Must match the real public/og.jpg pixel dimensions (validated in CI).
export const OG_IMAGE_WIDTH = "1536";
export const OG_IMAGE_HEIGHT = "1024";
export const OG_IMAGE_ALT: Record<Locale, string> = {
  id: "DrawdownCal - Kalkulator Drawdown & Recovery Trading",
  en: "DrawdownCal - Drawdown & Recovery Calculator for Traders",
};

const OG_LOCALE: Record<Locale, string> = { id: "id_ID", en: "en_US" };

type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { charSet: string };

export function buildMeta(opts: {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  ogType?: string;
  locale?: Locale;
}): MetaTag[] {
  const locale = opts.locale ?? "id";
  const title = opts.title ?? META[locale].title;
  const description = opts.description ?? META[locale].description;
  const image = opts.image ?? OG_IMAGE;
  const alt = OG_IMAGE_ALT[locale];
  const tags: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: opts.ogType ?? "website" },
    { property: "og:locale", content: OG_LOCALE[locale] },
    {
      property: "og:locale:alternate",
      content: OG_LOCALE[locale === "id" ? "en" : "id"],
    },
    { property: "og:image", content: image },
    { property: "og:image:width", content: OG_IMAGE_WIDTH },
    { property: "og:image:height", content: OG_IMAGE_HEIGHT },
    { property: "og:image:alt", content: alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: alt },
  ];
  if (opts.url) {
    tags.push({ property: "og:url", content: opts.url });
  }
  return tags;
}

/** Per-bucket landing page title/description. */
export function landingMeta(locale: Locale, dd: number): { title: string; description: string } {
  const rec = formatPercent(calcRecovery(dd));
  if (locale === "id") {
    return {
      title: `Drawdown ${dd}% Butuh Recovery +${rec}% | DrawdownCal`,
      description: `Kalau modal turun ${dd}%, kamu butuh profit ${rec}% untuk balik modal. Lihat rumus, tabel referensi, dan kalkulator drawdown lengkap.`,
    };
  }
  return {
    title: `${dd}% Drawdown Needs +${rec}% Recovery | DrawdownCal`,
    description: `If your capital drops ${dd}%, you need ${rec}% profit to break even. See the formula, reference table, and full drawdown calculator.`,
  };
}

/**
 * hreflang + canonical link set for a page that exists in both locales.
 * `idPath` / `enPath` are absolute paths (e.g. "/" and "/en").
 */
export function buildAlternateLinks(locale: Locale, idPath: string, enPath: string) {
  const self = locale === "id" ? idPath : enPath;
  return [
    { rel: "canonical", href: `${SITE_URL}${self}` },
    { rel: "alternate", hrefLang: "id", href: `${SITE_URL}${idPath}` },
    { rel: "alternate", hrefLang: "en", href: `${SITE_URL}${enPath}` },
    { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}${idPath}` },
  ];
}
