import { createFileRoute, notFound } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";
import { SITE_URL, buildMeta, canonical, landingMeta } from "@/lib/seo";
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
    const m = landingMeta(dd);
    return {
      meta: buildMeta({
        title: m.title,
        description: m.description,
        url: `${SITE_URL}/drawdown/${dd}`,
      }),
      links: canonical(`/drawdown/${dd}`),
      scripts: [{ type: "application/ld+json", children: JSON.stringify(softwareJsonLd()) }],
    };
  },
  component: Landing,
});

function Landing() {
  const { dd } = Route.useLoaderData();
  return <LandingPage dd={dd} />;
}
