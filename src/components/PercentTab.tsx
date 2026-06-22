import * as SliderPrimitive from "@radix-ui/react-slider";
import { useEffect, useRef, useState } from "react";
import { calcRecovery, formatPercent } from "@/lib/drawdown";
import { useT } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const MILESTONES = [25, 50, 75, 90];
const clampDd = (n: number) => Math.max(1, Math.min(99, n));

export function PercentTab({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const t = useT();
  const ticks = [1, 25, 50, 75, 99];
  const prevRef = useRef(value);
  // Local text state for the numeric input so typing decimals doesn't fight the
  // controlled value / cause caret jumps.
  const [text, setText] = useState(String(value));
  useEffect(() => {
    setText((prev) => (Number(prev) === value ? prev : String(value)));
  }, [value]);

  const handleSlider = (n: number) => {
    const prev = prevRef.current;
    if (n !== prev) {
      const lo = Math.min(prev, n);
      const hi = Math.max(prev, n);
      if (
        MILESTONES.some((m) => lo < m && hi >= m) &&
        typeof navigator !== "undefined" &&
        "vibrate" in navigator
      ) {
        try {
          navigator.vibrate(8);
        } catch {
          /* noop */
        }
      }
      prevRef.current = n;
    }
    onChange(n);
  };

  const commitText = (raw: string) => {
    const n = parseFloat(raw.replace(",", "."));
    if (Number.isFinite(n)) {
      const c = clampDd(Math.round(n * 10) / 10);
      prevRef.current = c;
      onChange(c);
      track("slider_input");
    }
    setText(String(clampDd(Number.isFinite(n) ? Math.round(n * 10) / 10 : value)));
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <SliderPrimitive.Root
          aria-label={t("aria.slider")}
          aria-valuetext={t("aria.slider_value", {
            dd: value,
            rec: formatPercent(calcRecovery(value)),
          })}
          min={1}
          max={99}
          step={1}
          value={[Math.round(value)]}
          onValueChange={(v) => handleSlider(v[0])}
          className="relative flex h-4 flex-1 touch-none select-none items-center"
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block size-7 cursor-pointer rounded-full border-4 border-primary bg-background shadow-xl shadow-primary/25 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 active:scale-95" />
        </SliderPrimitive.Root>

        <div className="relative shrink-0">
          <input
            type="text"
            inputMode="decimal"
            aria-label={t("aria.slider")}
            value={text}
            onChange={(e) => setText(e.target.value.replace(/[^\d.,]/g, ""))}
            onBlur={(e) => commitText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            className="h-9 w-16 rounded-md border bg-background pr-5 text-right font-display text-base font-bold tabular tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
            %
          </span>
        </div>
      </div>

      <div className="mt-3 flex justify-between">
        {ticks.map((tk) => (
          <button
            key={tk}
            type="button"
            onClick={() => {
              prevRef.current = tk;
              onChange(tk);
            }}
            className="text-[11px] font-bold tabular text-muted-foreground transition-colors hover:text-primary"
          >
            {tk}%
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] text-muted-foreground">{t("slider.hint")}</p>
    </div>
  );
}
