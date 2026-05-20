import { formatPercent, calcRecovery } from "@/lib/drawdown";

export function ResultCard({ drawdown }: { drawdown: number }) {
  const recovery = calcRecovery(drawdown);
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-xl border bg-primary-soft/50">
      <Cell label="Drawdown" value={`-${formatPercent(drawdown)}%`} />
      <Cell
        label="Butuh pulih"
        value={`+${formatPercent(recovery)}%`}
        emphasis
      />
    </div>
  );
}

function Cell({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2.5 sm:px-4 sm:py-3 [&+&]:border-l">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={`font-display tabular text-lg font-bold sm:text-xl ${
          emphasis ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
