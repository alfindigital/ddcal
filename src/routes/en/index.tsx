import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { HomePage } from "@/components/HomePage";
import { I18nProvider } from "@/lib/i18n";
import { SITE_URL, buildMeta, buildAlternateLinks } from "@/lib/seo";
import { faqJsonLd, softwareJsonLd } from "@/lib/jsonld";

const DEFAULT_DD = 30;
const DEFAULT_AWAL = 10_000_000;
const DEFAULT_SISA = 7_000_000;

const searchSchema = z.object({
  dd: fallback(z.number().int().min(1).max(99), DEFAULT_DD).optional(),
  mode: fallback(z.enum(["pct", "eq"]), "pct").optional(),
  awal: fallback(z.number().int().min(0).max(1_000_000_000_000), DEFAULT_AWAL).optional(),
  sisa: fallback(z.number().int().min(0).max(1_000_000_000_000), DEFAULT_SISA).optional(),
});

export const Route = createFileRoute("/en/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: buildMeta({ locale: "en", url: `${SITE_URL}/en` }),
    links: buildAlternateLinks("en", "/", "/en"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(faqJsonLd("en")) },
      { type: "application/ld+json", children: JSON.stringify(softwareJsonLd("en")) },
    ],
  }),
  component: HomeEn,
});

function HomeEn() {
  const s = Route.useSearch();
  return (
    <I18nProvider locale="en">
      <HomePage
        initial={{
          dd: s.dd ?? DEFAULT_DD,
          mode: s.mode ?? "pct",
          awal: s.awal ?? DEFAULT_AWAL,
          sisa: s.sisa ?? DEFAULT_SISA,
        }}
      />
    </I18nProvider>
  );
}
