import { REFERENCE_BUCKETS, bucketColor, calcRecovery, formatPercent } from "@/lib/drawdown";
import { useSpringValue } from "@/components/AnimatedValue";
import { useT } from "@/lib/i18n";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

/* Log Y-scale shared with the axis ticks. */
const Y_MIN = 2;
const Y_MAX = 10000;
const Y_TICKS = [2, 10, 50, 200, 1000, 10000];
const LOG_MIN = Math.log(Y_MIN);
const LOG_SPAN = Math.log(Y_MAX) - LOG_MIN;

/** Fraction (0..1, from the bottom) of a recovery value on the log scale. */
function yFrac(v: number): number {
  const c = Math.min(Math.max(v, Y_MIN), Y_MAX);
  return (Math.log(c) - LOG_MIN) / LOG_SPAN;
}

const BARS = REFERENCE_BUCKETS.map((dd) => ({
  dd,
  label: `${dd}%`,
  recovery: Math.max(calcRecovery(dd), 1),
}));

function nearestBucketIndex(v: number): number {
  let best = 0;
  let bestDist = Math.abs(REFERENCE_BUCKETS[0] - v);
  for (let i = 1; i < REFERENCE_BUCKETS.length; i++) {
    const d = Math.abs(REFERENCE_BUCKETS[i] - v);
    if (d < bestDist) {
      best = i;
      bestDist = d;
    }
  }
  return best;
}

function DrawdownChartImpl({
  active,
  onActiveChange,
  smoothEnabled,
  animationDuration,
  staticRender = false,
}: {
  active: number;
  onActiveChange?: (dd: number, velocity?: number) => void;
  smoothEnabled?: boolean;
  animationDuration?: number;
  /** Skips observers/interactivity — used for off-screen share-card snapshots. */
  staticRender?: boolean;
}) {
  const t = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(240);
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const activeIdx = useMemo(() => nearestBucketIndex(active), [active]);
  const interactive = !staticRender && !!onActiveChange;

  // Responsive height (aspect-driven), same envelope as before.
  useEffect(() => {
    if (staticRender) return;
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    const compute = () => {
      const w = el.clientWidth;
      setChartHeight(Math.round(Math.max(220, Math.min(360, w * 0.6))));
    };
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        compute();
      });
    };
    compute();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [staticRender]);

  // React to theme toggles so bar colors update.
  useEffect(() => {
    if (staticRender || typeof document === "undefined") return;
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();
    const mo = new MutationObserver(update);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, [staticRender]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onActiveChange) return;
      if (e.key === "ArrowLeft" && activeIdx > 0) {
        e.preventDefault();
        onActiveChange(REFERENCE_BUCKETS[activeIdx - 1], 0);
      } else if (e.key === "ArrowRight" && activeIdx < REFERENCE_BUCKETS.length - 1) {
        e.preventDefault();
        onActiveChange(REFERENCE_BUCKETS[activeIdx + 1], 0);
      } else if (e.key === "Home") {
        e.preventDefault();
        onActiveChange(REFERENCE_BUCKETS[0], 0);
      } else if (e.key === "End") {
        e.preventDefault();
        onActiveChange(REFERENCE_BUCKETS[REFERENCE_BUCKETS.length - 1], 0);
      }
    },
    [onActiveChange, activeIdx],
  );

  const tipIdx = hoverIdx ?? activeIdx;
  const n = BARS.length;
  const activeDd = REFERENCE_BUCKETS[activeIdx];
  const activeRec = formatPercent(calcRecovery(activeDd));

  return (
    <div className="space-y-1.5">
      <div
        ref={containerRef}
        className="relative w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{ height: chartHeight }}
        tabIndex={interactive ? 0 : -1}
        role={interactive ? "slider" : undefined}
        aria-label={interactive ? t("chart.aria") : undefined}
        aria-valuemin={interactive ? REFERENCE_BUCKETS[0] : undefined}
        aria-valuemax={interactive ? REFERENCE_BUCKETS[REFERENCE_BUCKETS.length - 1] : undefined}
        aria-valuenow={interactive ? activeDd : undefined}
        aria-valuetext={
          interactive ? t("aria.slider_value", { dd: activeDd, rec: activeRec }) : undefined
        }
        onKeyDown={interactive ? handleKeyDown : undefined}
      >
        {/* Y axis + grid */}
        <div className="pointer-events-none absolute inset-0 left-0 bottom-6">
          {Y_TICKS.map((tk) => (
            <div
              key={tk}
              className="absolute left-0 right-0 flex items-center"
              style={{ bottom: `${yFrac(tk) * 100}%` }}
            >
              <span className="w-9 shrink-0 pr-1 text-right text-[9px] leading-none text-muted-foreground tabular">
                {tk}%
              </span>
              <span className="h-px flex-1 bg-border/70" />
            </div>
          ))}
        </div>

        {/* Bars — pointer targets only; keyboard/SR live on the container slider. */}
        <div
          className="absolute bottom-0 left-9 right-1 top-2 flex items-stretch gap-[2px]"
          aria-hidden
        >
          {BARS.map((b, i) => {
            const isActive = i === activeIdx;
            const color = bucketColor(b.dd, isDark);
            return (
              <button
                key={b.label}
                type="button"
                tabIndex={-1}
                disabled={!interactive}
                onPointerEnter={interactive ? () => setHoverIdx(i) : undefined}
                onPointerLeave={interactive ? () => setHoverIdx(null) : undefined}
                onClick={
                  interactive
                    ? (e) => {
                        e.stopPropagation();
                        onActiveChange?.(b.dd, 1);
                      }
                    : undefined
                }
                className="group relative flex flex-1 flex-col justify-end pb-6 disabled:cursor-default"
                style={{ cursor: interactive ? "pointer" : "default" }}
              >
                <span
                  className="w-full rounded-t transition-[height,filter] duration-150 ease-out"
                  style={{
                    height: `${yFrac(b.recovery) * 100}%`,
                    backgroundColor: color,
                    opacity: isActive ? 1 : 0.55,
                    outline: isActive ? "1.5px solid var(--foreground)" : "none",
                    outlineOffset: "-1.5px",
                  }}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 text-center text-[9px] leading-6 tabular ${
                    isActive ? "font-bold text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {b.dd}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active indicator */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-2 bottom-6"
          style={{
            left: `calc(2.25rem + (100% - 2.25rem - 0.25rem) * ${(activeIdx + 0.5) / n})`,
            width: 0,
            borderLeft: "1.5px dashed var(--primary)",
            transform: "translateX(-0.75px)",
            transition: "left 140ms ease-out",
            opacity: 0.9,
          }}
        />

        {/* Tooltip */}
        {!staticRender && (
          <ChartTooltip
            idx={tipIdx}
            n={n}
            duration={animationDuration ?? 350}
            enabled={smoothEnabled ?? true}
          />
        )}
      </div>
    </div>
  );
}

function ChartTooltip({
  idx,
  n,
  duration,
  enabled,
}: {
  idx: number;
  n: number;
  duration: number;
  enabled: boolean;
}) {
  const t = useT();
  const b = BARS[idx];
  const animRec = useSpringValue(b.recovery, duration, enabled);
  const leftPct = ((idx + 0.5) / n) * 100;
  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 rounded-lg border bg-background px-2.5 py-1.5 shadow-lg"
      style={{
        left: `calc(2.25rem + (100% - 2.25rem - 0.25rem) * ${leftPct / 100})`,
        top: 0,
        transition: "left 140ms ease-out",
      }}
    >
      <div className="whitespace-nowrap text-[11px] font-medium text-foreground">
        {t("label.drawdown")} {b.dd}%
      </div>
      <div className="whitespace-nowrap text-[11px] text-muted-foreground">
        {t("chart.recovery_label")}{" "}
        <span className="font-semibold text-primary">+{formatPercent(animRec)}%</span>
      </div>
    </div>
  );
}

export const DrawdownChart = memo(DrawdownChartImpl, (prev, next) => {
  return (
    nearestBucketIndex(prev.active) === nearestBucketIndex(next.active) &&
    prev.onActiveChange === next.onActiveChange &&
    prev.smoothEnabled === next.smoothEnabled &&
    prev.animationDuration === next.animationDuration &&
    prev.staticRender === next.staticRender
  );
});
