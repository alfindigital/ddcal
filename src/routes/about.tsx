import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/AboutPage";
import { SITE_URL, buildMeta, canonical } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: buildMeta({
      url: `${SITE_URL}/about`,
      title: "About Drawdown & Recovery: Formula, Table, Tips & FAQ | DrawdownCal",
      description:
        "Complete guide to trading drawdown vs recovery: formula, reference table 5%–99%, risk management tips, time-to-break-even estimator, and FAQ.",
    }),
    links: canonical("/about"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd()) }],
  }),
  component: AboutPage,
});
