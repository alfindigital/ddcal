import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL } from "@/lib/seo";
import { REFERENCE_BUCKETS } from "@/lib/drawdown";

interface Entry {
  id: string; // path on the ID site, e.g. "/" or "/drawdown/50"
  en: string; // matching path on the EN site, e.g. "/en" or "/en/drawdown/50"
  priority: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);

        const entries: Entry[] = [
          { id: "/", en: "/en", priority: "1.0" },
          { id: "/tentang", en: "/en/about", priority: "0.9" },
          { id: "/drawdown", en: "/en/drawdown", priority: "0.8" },
          ...REFERENCE_BUCKETS.map((b) => ({
            id: `/drawdown/${b}`,
            en: `/en/drawdown/${b}`,
            priority: "0.6",
          })),
        ];

        // Each locale path is its own <url>, cross-linked with hreflang alternates.
        const urlFor = (self: string, idPath: string, enPath: string, priority: string) =>
          [
            `  <url>`,
            `    <loc>${SITE_URL}${self}</loc>`,
            `    <lastmod>${today}</lastmod>`,
            `    <priority>${priority}</priority>`,
            `    <xhtml:link rel="alternate" hreflang="id" href="${SITE_URL}${idPath}"/>`,
            `    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${enPath}"/>`,
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${idPath}"/>`,
            `  </url>`,
          ].join("\n");

        const urls = entries.flatMap((e) => [
          urlFor(e.id, e.id, e.en, e.priority),
          urlFor(e.en, e.id, e.en, e.priority),
        ]);

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
