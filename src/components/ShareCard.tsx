import { forwardRef } from "react";
import { DrawdownChart } from "./DrawdownChart";
import { calcRecovery, formatPercent } from "@/lib/drawdown";

export const ShareCard = forwardRef<HTMLDivElement, { drawdown: number }>(
  function ShareCard({ drawdown }, ref) {
    const recovery = calcRecovery(drawdown);
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
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <rect x="10.5" y="6" width="3" height="9" rx="0.5" fill="currentColor" stroke="none" />
                  <path d="M12 4v2" />
                  <path d="M12 15v3" />
                  <path d="M18 8v10" />
                  <path d="M15 15l3 3 3-3" />
                </svg>
              </div>
              <div className="font-display text-xl font-bold tracking-tight">
                Drawdown<span className="text-primary">CAL</span>
              </div>
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Kalkulator Pemulihan
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-2 overflow-hidden rounded-xl border bg-primary-soft/50">
            <div className="flex flex-col gap-1 px-5 py-4">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Drawdown
              </span>
              <span className="font-display tabular tracking-tight text-3xl font-bold text-foreground">
                -{formatPercent(drawdown)}%
              </span>
            </div>
            <div className="flex flex-col gap-1 border-l px-5 py-4">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Butuh pulih
              </span>
              <span className="font-display tabular tracking-tight text-3xl font-bold text-primary">
                +{formatPercent(recovery)}%
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl border bg-card p-3">
            <DrawdownChart active={drawdown} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-[11px] text-muted-foreground">
              drawdowncal.lovable.app
            </span>
            <span className="text-[11px] text-muted-foreground">
              by <span className="font-medium text-foreground">@alfindigital</span>
            </span>
          </div>
        </div>
      </div>
    );
  },
);
