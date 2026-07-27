import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL } from "@/lib/seo";
import { REFERENCE_BUCKETS } from "@/lib/drawdown";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: { path: string; priority: string }[] = [
          { path: "/", priority: "1.0" },
          { path: "/about", priority: "0.9" },
          { path: "/drawdown", priority: "0.8" },
          ...REFERENCE_BUCKETS.map((b) => ({
            path: `/drawdown/${b}`,
            priority: "0.6",
          })),
        ];

        // No <lastmod>: this is a static tool with no page-specific change
        // timestamps, and a generation-time date would be misleading.
        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${SITE_URL}${e.path}</loc>`,
            `    <priority>${e.priority}</priority>`,
            `  </url>`,
          ].join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
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
