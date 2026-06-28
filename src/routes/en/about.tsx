import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/AboutPage";
import { I18nProvider } from "@/lib/i18n";
import { SITE_URL, buildMeta, buildAlternateLinks } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";

export const Route = createFileRoute("/en/about")({
  head: () => ({
    meta: buildMeta({
      locale: "en",
      url: `${SITE_URL}/en/about`,
      title: "About Drawdown & Recovery: Formula, Table & FAQ | DrawdownCal",
      description:
        "Full explanation of drawdown vs recovery: formula, reference table 5%–99%, risk management tips, time-to-break-even estimate, and trader FAQ.",
    }),
    links: buildAlternateLinks("en", "/tentang", "/en/about"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd("en")) }],
  }),
  component: () => (
    <I18nProvider locale="en">
      <AboutPage />
    </I18nProvider>
  ),
});
