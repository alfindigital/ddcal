import { createFileRoute, notFound } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { LandingPage } from "@/components/LandingPage";
import { SITE_URL, buildMeta, buildAlternateLinks, landingMeta } from "@/lib/seo";
import { softwareJsonLd } from "@/lib/jsonld";
import { REFERENCE_BUCKETS } from "@/lib/drawdown";

export const Route = createFileRoute("/drawdown/$dd")({
  loader: ({ params }) => {
    const dd = Number(params.dd);
    if (!REFERENCE_BUCKETS.includes(dd)) throw notFound();
    return { dd };
  },
  head: ({ params }) => {
    const dd = Number(params.dd);
    const m = landingMeta("id", dd);
    return {
      meta: buildMeta({
        locale: "id",
        title: m.title,
        description: m.description,
        url: `${SITE_URL}/drawdown/${dd}`,
      }),
      links: buildAlternateLinks("id", `/drawdown/${dd}`, `/en/drawdown/${dd}`),
      scripts: [{ type: "application/ld+json", children: JSON.stringify(softwareJsonLd("id")) }],
    };
  },
  component: LandingId,
});

function LandingId() {
  const { dd } = Route.useLoaderData();
  return (
    <I18nProvider locale="id">
      <LandingPage dd={dd} locale="id" />
    </I18nProvider>
  );
}
