import { useId } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Input } from "@/components/ui/input";

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
      {/* Header: label + numeric input */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <label
            htmlFor={inputId}
            className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Drawdown
          </label>
        </div>


        <div className="flex items-center gap-1.5 rounded-xl border border-input bg-muted/40 px-3 py-1.5 transition-all focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5">
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
            className="h-7 w-12 border-0 bg-transparent p-0 text-right font-display text-lg font-bold tabular tracking-tight shadow-none focus-visible:ring-0"
          />
          <span className="select-none text-[11px] font-bold uppercase tracking-tight text-muted-foreground">
            %
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <SliderPrimitive.Root
          aria-label="Persentase drawdown"
          min={1}
          max={99}
          step={1}
          value={[value]}
          onValueChange={(v) => onChange(v[0])}
          className="relative flex h-4 w-full touch-none select-none items-center"
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            className="block size-7 cursor-pointer rounded-full border-4 border-primary bg-background shadow-xl shadow-primary/25 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 active:scale-95"
          />
        </SliderPrimitive.Root>

        {/* Tick labels */}
        <div className="mt-3 flex justify-between">
          {ticks.map((t) => (
            <span key={t} className="text-[11px] font-bold tabular text-muted-foreground">
              {t}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
