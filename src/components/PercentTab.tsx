import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export function PercentTab({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const ticks = [1, 25, 50, 75, 99];
  const inputId = useId();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={inputId}
          className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Drawdown
        </label>
        <div className="flex items-center gap-1">
          <Input
            id={inputId}
            type="number"
            min={1}
            max={99}
            value={value}
            onChange={(e) => {
              const n = Math.max(1, Math.min(99, Number(e.target.value) || 0));
              onChange(n);
            }}
            className="h-8 w-16 text-right font-display font-bold tabular tracking-tight"
          />
          <span className="text-[11px] text-muted-foreground">%</span>
        </div>
      </div>

      <Slider
        aria-label="Persentase drawdown"
        min={1}
        max={99}
        step={1}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
      />

      <div className="flex justify-between text-[11px] tabular text-muted-foreground">
        {ticks.map((t) => (
          <span key={t}>{t}%</span>
        ))}
      </div>
    </div>
  );
}
