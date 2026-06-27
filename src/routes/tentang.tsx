import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/AboutPage";
import { I18nProvider } from "@/lib/i18n";
import { SITE_URL, buildMeta, buildAlternateLinks } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: buildMeta({
      locale: "id",
      url: `${SITE_URL}/tentang`,
      title: "Tentang Drawdown & Recovery — Rumus, Tabel & FAQ | DrawdownCal",
      description:
        "Penjelasan lengkap drawdown vs recovery: rumus, tabel referensi 5%–99%, tips risk management, estimasi waktu balik modal, dan FAQ trader.",
    }),
    links: buildAlternateLinks("id", "/tentang", "/en/about"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd("id")) }],
  }),
  component: () => (
    <I18nProvider locale="id">
      <AboutPage />
    </I18nProvider>
  ),
});
