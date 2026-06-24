import { createFileRoute, notFound } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { LandingPage } from "@/components/LandingPage";
import { SITE_URL, buildMeta, buildAlternateLinks, landingMeta } from "@/lib/seo";
import { softwareJsonLd } from "@/lib/jsonld";
import { REFERENCE_BUCKETS } from "@/lib/drawdown";

export const Route = createFileRoute("/en/drawdown/$dd")({
  loader: ({ params }) => {
    const dd = Number(params.dd);
    if (!REFERENCE_BUCKETS.includes(dd)) throw notFound();
    return { dd };
  },
  head: ({ params }) => {
    const dd = Number(params.dd);
    const m = landingMeta("en", dd);
    return {
      meta: buildMeta({
        locale: "en",
        title: m.title,
        description: m.description,
        url: `${SITE_URL}/en/drawdown/${dd}`,
      }),
      links: buildAlternateLinks("en", `/drawdown/${dd}`, `/en/drawdown/${dd}`),
      scripts: [{ type: "application/ld+json", children: JSON.stringify(softwareJsonLd("en")) }],
    };
  },
  component: LandingEn,
});

function LandingEn() {
  const { dd } = Route.useLoaderData();
  return (
    <I18nProvider locale="en">
      <LandingPage dd={dd} locale="en" />
    </I18nProvider>
  );
}
