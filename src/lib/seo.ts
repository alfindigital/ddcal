// Shared SEO/meta constants and helpers. English-only.
import { calcRecovery, formatPercent } from "@/lib/drawdown";

export const SITE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
  "https://ddcal.lotmetrik.my.id"
).replace(/\/$/, "");

export const SITE_NAME = "DrawdownCal";
export const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, "");

export const DEFAULT_TITLE = "Drawdown & Recovery Calculator for Traders | DrawdownCal";
export const DEFAULT_DESCRIPTION =
  "Calculate how much profit you need to recover from a trading drawdown. Two modes: percentage or equity. Free, no signup.";

export const OG_IMAGE = `${SITE_URL}/og.jpg`;
export const OG_IMAGE_FALLBACK = `${SITE_URL}/og-image-fallback.svg`;
export const OG_IMAGE_WIDTH = "1536";
export const OG_IMAGE_HEIGHT = "1024";
export const OG_IMAGE_ALT = "DrawdownCal - Drawdown & Recovery Calculator for Traders";

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
}): MetaTag[] {
  const title = opts.title ?? DEFAULT_TITLE;
  const description = opts.description ?? DEFAULT_DESCRIPTION;
  const image = opts.image ?? OG_IMAGE;
  const tags: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: opts.ogType ?? "website" },
    { property: "og:locale", content: "en_US" },
    { property: "og:image", content: image },
    { property: "og:image:width", content: OG_IMAGE_WIDTH },
    { property: "og:image:height", content: OG_IMAGE_HEIGHT },
    { property: "og:image:alt", content: OG_IMAGE_ALT },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: OG_IMAGE_ALT },
  ];
  if (opts.url) tags.push({ property: "og:url", content: opts.url });
  return tags;
}

export function landingMeta(dd: number): { title: string; description: string } {
  const rec = formatPercent(calcRecovery(dd));
  return {
    title: `${dd}% Drawdown Needs +${rec}% Recovery | DrawdownCal`,
    description: `If your capital drops ${dd}%, you need ${rec}% profit to break even. See the formula, reference table, and full drawdown calculator.`,
  };
}

/** Canonical link for a single-locale page. */
export function canonical(path: string) {
  return [{ rel: "canonical", href: `${SITE_URL}${path}` }];
}
