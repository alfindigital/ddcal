import { formatPercent, calcRecovery } from "@/lib/drawdown";
import { AnimatedNumber } from "./AnimatedValue";
import { AlertTriangle } from "lucide-react";

export function ResultCard({
  drawdown,
  animationDuration,
  smoothEnabled,
}: {
  drawdown: number;
  animationDuration?: number;
  smoothEnabled?: boolean;
}) {
  const recovery = calcRecovery(drawdown);
  const extreme = drawdown >= 90;

  // Mini-bar: normalize drawdown vs recovery on the same width scale.
  // Use log-ish scaling so 100% vs 900% still both render readable.
  const max = Math.max(drawdown, recovery, 1);
  const ddWidth = (drawdown / max) * 100;
  const recWidth = (recovery / max) * 100;

  return (
    <div className="overflow-hidden rounded-2xl border bg-primary-soft/50 shadow-[var(--shadow-card)]">
      <div className="grid grid-cols-2">
        <Cell label="Drawdown">
          <AnimatedNumber
            value={drawdown}
            duration={animationDuration}
            enabled={smoothEnabled}
            format={(n) => `-${formatPercent(n)}%`}
          />
        </Cell>
        <Cell label="Profit dibutuhkan" emphasis>
          <AnimatedNumber
            value={recovery}
            duration={animationDuration}
            enabled={smoothEnabled}
            format={(n) => `+${formatPercent(n)}%`}
          />
        </Cell>
      </div>

      {/* Mini comparison bar */}
      <div className="space-y-1 border-t bg-card/40 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="w-16 shrink-0 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            Loss
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground/60 transition-[width] duration-300 ease-out"
              style={{ width: `${ddWidth}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 shrink-0 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recovery
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${recWidth}%` }}
            />
          </div>
        </div>
      </div>

      {extreme && (
        <div className="flex items-start gap-2 border-t bg-destructive/5 px-3 py-2 text-[11px] text-destructive sm:px-4">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Recovery sangat sulit di zona ini. Pertimbangkan risk management
            ulang dan hindari revenge trading.
          </span>
        </div>
      )}
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
    <div className="flex flex-col gap-1 px-3 py-3 sm:px-4 sm:py-4 [&+&]:border-l">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={`font-display tabular tracking-tight text-2xl font-bold sm:text-3xl ${
          emphasis ? "text-primary" : "text-foreground"
        }`}
      >
        {children}
      </span>
    </div>
  );
}
