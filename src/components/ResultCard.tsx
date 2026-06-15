import { formatPercent, calcRecovery } from "@/lib/drawdown";
import { AnimatedNumber } from "./AnimatedValue";
import { AlertTriangle } from "lucide-react";
import { useT } from "@/lib/i18n";

export function ResultCard({
  drawdown,
  animationDuration,
  smoothEnabled,
}: {
  drawdown: number;
  animationDuration?: number;
  smoothEnabled?: boolean;
}) {
  const t = useT();
  const recovery = calcRecovery(drawdown);
  const extreme = drawdown >= 90;

  return (
    <div className="overflow-hidden rounded-2xl border bg-primary-soft/50 shadow-[var(--shadow-card)]">
      <div className="grid grid-cols-2">
        <Cell label={t("label.drawdown")}>
          <AnimatedNumber
            value={drawdown}
            duration={animationDuration}
            enabled={smoothEnabled}
            format={(n) => `-${formatPercent(n)}%`}
          />
        </Cell>
        <Cell label={t("label.recovery_needed")} emphasis>
          <AnimatedNumber
            value={recovery}
            duration={animationDuration}
            enabled={smoothEnabled}
            format={(n) => `+${formatPercent(n)}%`}
          />
        </Cell>
      </div>

      {extreme && (
        <div className="flex items-start gap-2 border-t bg-destructive/5 px-3 py-2 text-[11px] text-destructive sm:px-4">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{t("warning.extreme")}</span>
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
