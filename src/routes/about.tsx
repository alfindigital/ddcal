import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/AboutPage";
import { SITE_URL, buildMeta, canonical } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: buildMeta({
      url: `${SITE_URL}/about`,
      title: "Trading Drawdown & Recovery Guide | DrawdownCal",
      description:
        "Complete guide to trading drawdown vs recovery: the formula, a reference table from 5% to 99%, risk management tips, and FAQ.",
    }),
    links: canonical("/about"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd()) }],
  }),
  component: AboutPage,
});
