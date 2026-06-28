import { formatPercent, formatPercentSmart, calcRecovery } from "@/lib/drawdown";
import { takeawayKey } from "@/lib/reference-table";
import { AnimatedNumber } from "./AnimatedValue";
import { AlertTriangle, Lightbulb } from "lucide-react";
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
  const severe = drawdown >= 60;
  const tkey = takeawayKey(drawdown);

  return (
    <div className="overflow-hidden rounded-2xl border bg-primary-soft/50 shadow-[var(--shadow-card)]">
      <div className="grid grid-cols-2">
        <Cell label={t("label.drawdown")}>
          <AnimatedNumber
            value={drawdown}
            duration={animationDuration}
            enabled={smoothEnabled}
            format={(n) => `-${formatPercentSmart(n)}%`}
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

      <div
        className={`flex items-start gap-2 border-t px-3 py-2 text-[11px] sm:px-4 ${
          severe ? "bg-destructive/5 text-destructive" : "text-muted-foreground"
        }`}
      >
        {severe ? (
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        ) : (
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        )}
        <span>{t(tkey)}</span>
      </div>
    </div>
  );
}

function CompareBar({
  label,
  width,
  value,
  tone,
}: {
  label: string;
  width: number;
  value: string;
  tone: "muted" | "primary";
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${
            tone === "primary" ? "bg-primary" : "bg-foreground/50"
          }`}
          style={{ width: `${Math.max(2, Math.min(100, width))}%` }}
        />
      </div>
      <span
        className={`w-16 shrink-0 text-right text-[11px] font-bold tabular ${
          tone === "primary" ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </span>
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
