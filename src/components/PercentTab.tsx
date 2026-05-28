import * as SliderPrimitive from "@radix-ui/react-slider";

export function PercentTab({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const ticks = [1, 25, 50, 75, 99];

  return (
    <div>
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
