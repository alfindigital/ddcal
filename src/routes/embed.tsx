import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect } from "react";
import { calcRecovery, formatPercent } from "@/lib/drawdown";
import { I18nProvider, useT, type Locale } from "@/lib/i18n";
import { SITE_URL, SITE_DOMAIN } from "@/lib/seo";

const searchSchema = z.object({
  dd: fallback(z.number().min(1).max(99), 30).optional(),
  lang: fallback(z.enum(["id", "en"]), "id").optional(),
  transparent: fallback(z.coerce.boolean(), false).optional(),
});

export const Route = createFileRoute("/embed")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [{ title: "DrawdownCal - Embed" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: EmbedRoute,
});

function EmbedRoute() {
  const { lang } = Route.useSearch();
  return (
    <I18nProvider locale={(lang ?? "id") as Locale}>
      <EmbedWidget />
    </I18nProvider>
  );
}

function EmbedWidget() {
  const search = Route.useSearch();
  const dd = search.dd ?? 30;
  const lang = search.lang ?? "id";
  const transparent = search.transparent ?? false;
  const t = useT();
  const recovery = calcRecovery(dd);

  // Post height to parent for iframe auto-resize.
  useEffect(() => {
    const send = () => {
      const h = document.documentElement.scrollHeight;
      window.parent?.postMessage({ type: "drawdowncal:height", height: h }, "*");
    };
    send();
    const ro = new ResizeObserver(send);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  const max = Math.max(dd, recovery, 1);
  const ddW = (dd / max) * 100;
  const recW = (recovery / max) * 100;

  const url = `${SITE_URL}/?dd=${Math.round(dd)}&lang=${lang}`;

  return (
    <div
      className={transparent ? "p-3" : "min-h-screen bg-background p-3 text-foreground"}
      style={transparent ? { background: "transparent" } : undefined}
    >
      <div className="overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-card)]">
        <div className="grid grid-cols-2">
          <Cell label={t("label.drawdown")}>
            <span className="text-foreground">-{formatPercent(dd)}%</span>
          </Cell>
          <Cell label={t("label.recovery_needed")} emphasis>
            <span className="text-primary">+{formatPercent(recovery)}%</span>
          </Cell>
        </div>
        <div className="space-y-1 border-t bg-card/40 px-3 py-2">
          <Bar label={t("label.loss")} width={ddW} tone="muted" />
          <Bar label={t("label.recovery")} width={recW} tone="primary" />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block border-t bg-primary/5 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-primary hover:bg-primary/10"
        >
          {t("share.line_try")} · {SITE_DOMAIN}
        </a>
      </div>
    </div>
  );
}

function Cell({
  label,
  children,
  emphasis,
}: {
  label: string;
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 px-3 py-3 [&+&]:border-l">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={`font-display tabular text-2xl font-bold tracking-tight ${
          emphasis ? "text-primary" : "text-foreground"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

function Bar({ label, width, tone }: { label: string; width: number; tone: "muted" | "primary" }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${
            tone === "primary" ? "bg-primary" : "bg-foreground/60"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
