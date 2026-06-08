// Shared SEO/meta constants and helpers, so title/description stay
// consistent across root and per-route head() definitions.

export const SITE_URL = "https://drawdowncal.lovable.app";
export const SITE_NAME = "DrawdownCal";

export const DEFAULT_TITLE =
  "Kalkulator Drawdown & Recovery Trading | DrawdownCal";
export const DEFAULT_DESCRIPTION =
  "Hitung berapa persen profit yang dibutuhkan untuk pulih dari drawdown trading. Gunakan kalkulator drawdown & recovery ini dengan dua mode: persentase atau equity.";

export const OG_IMAGE = `${SITE_URL}/og.jpg`;
export const OG_IMAGE_FALLBACK = `${SITE_URL}/og-image-fallback.svg`;
export const OG_IMAGE_WIDTH = "1200";
export const OG_IMAGE_HEIGHT = "630";
export const OG_IMAGE_ALT =
  "DrawdownCal — Kalkulator Drawdown & Recovery Trading";

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
    { property: "og:locale", content: "id_ID" },
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
  if (opts.url) {
    tags.push({ property: "og:url", content: opts.url });
  }
  return tags;
}
