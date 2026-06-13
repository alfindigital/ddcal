import { formatPercent, calcRecovery } from "@/lib/drawdown";
import { AnimatedNumber } from "./AnimatedValue";

export function ResultCard({
  drawdown,
  animationDuration,
  smoothEnabled,
  mode,
  equityInitial,
  equityCurrent,
}: {
  drawdown: number;
  animationDuration?: number;
  smoothEnabled?: boolean;
  mode?: "persen" | "equity";
  equityInitial?: number;
  equityCurrent?: number;
}) {
  const recovery = calcRecovery(drawdown);

  const showEquity =
    mode === "equity" &&
    typeof equityInitial === "number" &&
    typeof equityCurrent === "number" &&
    equityInitial > 0;

  const lossNominal = showEquity ? Math.max(0, equityInitial! - equityCurrent!) : 0;
  const targetProfit =
    showEquity && Number.isFinite(recovery)
      ? Math.round((equityCurrent! * recovery) / 100)
      : 0;

  return (
    <div className="overflow-hidden rounded-xl border bg-primary-soft/50">
      <div className="grid grid-cols-2">
        <Cell label="Drawdown">
          <AnimatedNumber
            value={drawdown}
            duration={animationDuration}
            enabled={smoothEnabled}
            format={(n) => `-${formatPercent(n)}%`}
          />
        </Cell>
        <Cell label="Butuh pulih" emphasis>
          <AnimatedNumber
            value={recovery}
            duration={animationDuration}
            enabled={smoothEnabled}
            format={(n) => `+${formatPercent(n)}%`}
          />
        </Cell>
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
    <div className="flex flex-col gap-0.5 px-3 py-2.5 sm:px-4 sm:py-3 [&+&]:border-l">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={`font-display tabular tracking-tight text-lg font-bold sm:text-xl ${
          emphasis ? "text-primary" : "text-foreground"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

function NominalCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "loss" | "gain";
}) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2 sm:px-4 [&+&]:border-l">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={`font-display tabular tracking-tight text-sm font-bold sm:text-base ${
          tone === "loss"
            ? "text-red-600 dark:text-red-400"
            : "text-primary"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
