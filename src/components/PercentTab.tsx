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
  // Map value (1..99) to track percentage (0..100)
  const pct = ((value - 1) / 98) * 100;

  return (
    <div className="space-y-2">
      {/* Header: label + numeric input */}
      <div className="flex items-end justify-between gap-3 mb-6">
        <div className="space-y-1.5">
          <label
            htmlFor={inputId}
            className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            Drawdown
          </label>
          <div className="h-1 w-8 rounded-full bg-primary" />
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

      {/* Slider with tooltip + notches */}
      <div className="relative py-4">
        {/* Floating tooltip */}
        <div
          className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 transition-[left] duration-75"
          style={{ left: `${pct}%` }}
        >
          <div className="rounded bg-foreground px-2 py-1 text-[11px] font-bold leading-none text-background shadow-lg">
            {value.toFixed(1)}%
          </div>
          <div className="mx-auto -mt-1 h-2 w-2 rotate-45 bg-foreground shadow-lg" />
        </div>

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

          {/* Tick notches overlay (non-interactive) */}
          <div className="pointer-events-none absolute inset-x-0 flex justify-between px-1">
            {ticks.map((t) => {
              const tickPct = ((t - 1) / 98) * 100;
              const isActive = tickPct <= pct;
              return (
                <div
                  key={t}
                  className={`h-1.5 w-0.5 rounded-full ${
                    isActive ? "bg-background/40" : "bg-foreground/15"
                  }`}
                />
              );
            })}
          </div>

          <SliderPrimitive.Thumb
            className="relative block h-7 w-7 cursor-pointer rounded-full border-[3.5px] border-primary bg-background shadow-xl shadow-primary/25 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 active:scale-95"
          >
            <span className="absolute inset-1.5 rounded-full bg-primary/10" />
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>

        {/* Tick labels */}
        <div className="mt-5 flex justify-between">
          {ticks.map((t) => (
            <div key={t} className="flex flex-col items-center gap-1.5">
              <div className="h-2 w-[1.5px] rounded-full bg-border" />
              <span className="text-[11px] font-bold tabular text-muted-foreground">
                {t}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
