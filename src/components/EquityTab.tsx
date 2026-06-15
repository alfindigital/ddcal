import { Input } from "@/components/ui/input";
import { formatRupiah, parseRupiah, calcDrawdownFromCapital } from "@/lib/drawdown";
import { useEffect, useId } from "react";

export function EquityTab({
  initial,
  current,
  onInitialChange,
  onCurrentChange,
  onDerivedDrawdown,
}: {
  initial: number;
  current: number;
  onInitialChange: (n: number) => void;
  onCurrentChange: (n: number) => void;
  onDerivedDrawdown: (d: number) => void;
}) {
  useEffect(() => {
    const dd = calcDrawdownFromCapital(initial, current);
    const clamped = Math.max(0, Math.min(99, dd));
    onDerivedDrawdown(Math.round(clamped));
  }, [initial, current, onDerivedDrawdown]);

  const quickActions: { label: string; apply: () => number }[] = [
    { label: "×0.9", apply: () => Math.round(initial * 0.9) },
    { label: "×0.7", apply: () => Math.round(initial * 0.7) },
    { label: "×0.5", apply: () => Math.round(initial * 0.5) },
    { label: "Reset", apply: () => initial },
  ];

  return (
    <div className="space-y-2">
      <Field label="Modal awal" value={initial} onChange={onInitialChange} />
      <Field label="Modal sekarang" value={current} onChange={onCurrentChange} />
      <div className="flex flex-wrap justify-end gap-1.5 pt-1">
        {quickActions.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => onCurrentChange(q.apply())}
            className="rounded-md border border-input bg-background px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-3">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        {label}
      </label>
      <Input
        id={id}
        inputMode="numeric"
        value={formatRupiah(value)}
        onChange={(e) => {
          const n = parseRupiah(e.target.value);
          onChange(Math.min(n, 1_000_000_000_000));
        }}
        className="h-7 w-32 text-right font-display text-sm font-bold tabular tracking-tight sm:w-40"
      />
    </div>
  );
}
