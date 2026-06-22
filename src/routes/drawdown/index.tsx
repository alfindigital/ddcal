import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { DrawdownHub } from "@/components/DrawdownHub";
import { SITE_URL, buildMeta, buildAlternateLinks } from "@/lib/seo";

export const Route = createFileRoute("/drawdown/")({
  head: () => ({
    meta: buildMeta({
      locale: "id",
      title: "Semua Level Drawdown & Recovery | DrawdownCal",
      description:
        "Daftar lengkap level drawdown 5% sampai 99% dan berapa persen recovery yang dibutuhkan untuk balik modal. Klik untuk detail tiap level.",
      url: `${SITE_URL}/drawdown`,
    }),
    links: buildAlternateLinks("id", "/drawdown", "/en/drawdown"),
  }),
  component: () => (
    <I18nProvider locale="id">
      <DrawdownHub locale="id" />
    </I18nProvider>
  ),
});
