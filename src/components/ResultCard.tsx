import { formatPercent, calcRecovery } from "@/lib/drawdown";
import { AnimatedNumber } from "./AnimatedValue";

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
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-xl border bg-primary-soft/50">
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
