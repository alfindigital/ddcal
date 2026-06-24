import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { DrawdownHub } from "@/components/DrawdownHub";
import { SITE_URL, buildMeta, buildAlternateLinks } from "@/lib/seo";

export const Route = createFileRoute("/en/drawdown/")({
  head: () => ({
    meta: buildMeta({
      locale: "en",
      title: "All Drawdown & Recovery Levels | DrawdownCal",
      description:
        "Full list of drawdown levels from 5% to 99% and the recovery percentage needed to break even. Click any level for details.",
      url: `${SITE_URL}/en/drawdown`,
    }),
    links: buildAlternateLinks("en", "/drawdown", "/en/drawdown"),
  }),
  component: () => (
    <I18nProvider locale="en">
      <DrawdownHub locale="en" />
    </I18nProvider>
  ),
});
