import { Input } from "@/components/ui/input";
import { formatRupiah, parseRupiah, calcDrawdownFromCapital } from "@/lib/drawdown";
import { useEffect, useId, useState } from "react";

export function EquityTab({
  onDerivedDrawdown,
}: {
  onDerivedDrawdown: (d: number) => void;
}) {
  const [initial, setInitial] = useState(10_000_000);
  const [current, setCurrent] = useState(7_000_000);

  useEffect(() => {
    const dd = calcDrawdownFromCapital(initial, current);
    const clamped = Math.max(0, Math.min(99, dd));
    onDerivedDrawdown(Math.round(clamped));
  }, [initial, current, onDerivedDrawdown]);

  return (
    <div className="space-y-2.5">
      <Field label="Modal awal" value={initial} onChange={setInitial} />
      <Field label="Modal sekarang" value={current} onChange={setCurrent} />
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
        className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </label>
      <Input
        id={id}
        inputMode="numeric"
        value={formatRupiah(value)}
        onChange={(e) => onChange(parseRupiah(e.target.value))}
        className="h-8 w-32 text-right font-display font-semibold tabular sm:w-40"
      />
    </div>
  );
}
