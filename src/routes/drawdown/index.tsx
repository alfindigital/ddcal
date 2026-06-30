import { createFileRoute } from "@tanstack/react-router";
import { DrawdownHub } from "@/components/DrawdownHub";
import { SITE_URL, buildMeta, canonical } from "@/lib/seo";

export const Route = createFileRoute("/drawdown/")({
  head: () => ({
    meta: buildMeta({
      title: "All Drawdown & Recovery Levels | DrawdownCal",
      description:
        "Full list of drawdown levels from 5% to 99% and the recovery percentage needed to break even. Click any level for details.",
      url: `${SITE_URL}/drawdown`,
    }),
    links: canonical("/drawdown"),
  }),
  component: DrawdownHub,
});
