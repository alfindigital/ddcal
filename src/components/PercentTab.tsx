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
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Drawdown
        </label>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={1}
            max={99}
            value={value}
            onChange={(e) => {
              const n = Math.max(1, Math.min(99, Number(e.target.value) || 0));
              onChange(n);
            }}
            className="h-8 w-16 text-right font-display font-semibold tabular"
          />

          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </div>

      <Slider
        min={1}
        max={99}
        step={1}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
      />

      <div className="flex justify-between text-[10px] tabular text-muted-foreground">
        {ticks.map((t) => (
          <span key={t}>{t}%</span>
        ))}
      </div>
    </div>
  );
}
