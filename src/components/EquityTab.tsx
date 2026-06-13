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

  return (
    <div className="space-y-2">
      <Field label="Modal awal" value={initial} onChange={onInitialChange} />
      <Field label="Modal sekarang" value={current} onChange={onCurrentChange} />
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
          // Cap at 1e12 to prevent overflow / unreadable values.
          onChange(Math.min(n, 1_000_000_000_000));
        }}
        className="h-7 w-32 text-right font-display text-sm font-bold tabular tracking-tight sm:w-40"
      />
    </div>
  );
}
