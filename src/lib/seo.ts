// Shared SEO/meta constants and helpers, so title/description stay
// consistent across root and per-route head() definitions.

export const SITE_URL = "https://drawdowncal.lovable.app";
export const SITE_NAME = "DrawdownCal";

export const DEFAULT_TITLE = "DrawdownCal: Kalkulator Drawdown & Recovery";
export const DEFAULT_DESCRIPTION =
  "Hitung berapa profit yang dibutuhkan buat balik modal setelah loss. Dua mode: persentase atau equity.";

export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

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
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
  if (opts.url) {
    tags.push({ property: "og:url", content: opts.url });
  }
  return tags;
}
