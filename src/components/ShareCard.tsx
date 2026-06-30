import { forwardRef } from "react";
import { DrawdownChart } from "./DrawdownChart";
import { calcRecovery, formatPercent } from "@/lib/drawdown";
import { useT } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";

export const ShareCard = forwardRef<HTMLDivElement, { drawdown: number }>(function ShareCard(
  { drawdown },
  ref,
) {
  const recovery = calcRecovery(drawdown);
  const t = useT();
  const domain = SITE_URL.replace(/^https?:\/\//, "");
  return (
    <div
      ref={ref}
      style={{
        width: 640,
        fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif",
      }}
      className="bg-card text-foreground"
    >
      <div className="flex flex-col gap-4 p-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M4 6H6M18 6H20" />
                <path d="M12 4V16" />
                <path d="M12 16L8 12M12 16L16 12" />
                <path d="M4 20H20" />
              </svg>
            </div>
            <div className="font-display flex items-baseline gap-1">
              <span className="text-lg font-bold lowercase tracking-tight text-foreground">
                drawdown
              </span>
              <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                cal
              </span>
            </div>
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("share.subtitle")}
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 overflow-hidden rounded-xl border bg-primary-soft/50">
          <div className="flex flex-col gap-1 px-5 py-4">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t("label.drawdown")}
            </span>
            <span className="font-display tabular tracking-tight text-3xl font-bold text-foreground">
              -{formatPercent(drawdown)}%
            </span>
          </div>
          <div className="flex flex-col gap-1 border-l px-5 py-4">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t("share.recovery_short")}
            </span>
            <span className="font-display tabular tracking-tight text-3xl font-bold text-primary">
              +{formatPercent(recovery)}%
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-xl border bg-card p-3">
          <DrawdownChart active={drawdown} staticRender />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-[11px] text-muted-foreground">
            by <span className="font-medium text-foreground">@alfindigital</span>
          </span>
          <span className="text-[11px] text-muted-foreground">{domain}</span>
        </div>
      </div>
    </div>
  );
});
