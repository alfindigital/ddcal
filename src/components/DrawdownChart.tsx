import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  REFERENCE_BUCKETS,
  bucketColor,
  calcRecovery,
  formatPercent,
} from "@/lib/drawdown";
import { useSpringValue } from "@/components/AnimatedValue";
import { useT } from "@/lib/i18n";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ------------------------------------------------------------------ */
/* Skeleton overlay                                                   */
/* ------------------------------------------------------------------ */
const SKELETON_HEIGHTS = [12, 18, 28, 42, 55, 65, 80, 90, 100, 100, 100, 100];

function ChartSkeleton() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-card/80 backdrop-blur-[1px] animate-in fade-in duration-150">
      <div className="relative flex-1">
        {/* Y-axis label stubs */}
        <div className="absolute left-0 top-0 bottom-6 w-9 flex flex-col justify-between py-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-5 rounded bg-muted animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
        {/* Bars */}
        <div className="absolute inset-0 left-9 right-1 flex items-end justify-around gap-[2px] px-1 pb-6 pt-2">
          {SKELETON_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="w-full rounded-t bg-muted/70 animate-pulse"
              style={{ height: `${h}%`, animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
        {/* X-axis label stubs */}
        <div className="absolute bottom-1 left-9 right-1 flex justify-around px-1">
          {SKELETON_HEIGHTS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-3 rounded bg-muted animate-pulse"
              style={{ animationDelay: `${i * 50 + 100}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const Y_TICKS = [2, 10, 50, 200, 1000, 10000];

// Precomputed once — bucket geometry never changes. Colors resolved per-render.
const CHART_DATA_BASE = REFERENCE_BUCKETS.map((dd) => ({
  dd,
  label: `${dd}%`,
  recovery: Math.max(calcRecovery(dd), 1),
}));

// Memoize nearestBucket on a quantized key so rapid slider values that map
// to the same bucket reuse the previous result (no recompute, stable ref).
const NEAREST_CACHE = new Map<number, number>();
function nearestBucketCached(v: number): number {
  // Quantize to integer — sub-integer inputs cannot change the nearest bucket.
  const key = Math.round(v);
  const hit = NEAREST_CACHE.get(key);
  if (hit !== undefined) return hit;
  let best = REFERENCE_BUCKETS[0];
  let bestDist = Math.abs(best - v);
  for (let i = 1; i < REFERENCE_BUCKETS.length; i++) {
    const c = REFERENCE_BUCKETS[i];
    const d = Math.abs(c - v);
    if (d < bestDist) {
      best = c;
      bestDist = d;
    }
  }
  // Cap to avoid unbounded growth (range is 0–100, so this rarely triggers).
  if (NEAREST_CACHE.size > 256) NEAREST_CACHE.clear();
  NEAREST_CACHE.set(key, best);
  return best;
}

const TooltipCtx = createContext({ duration: 350, enabled: true });

function TooltipContent({ dd, recovery }: { dd: number; recovery: number }) {
  const { duration, enabled } = useContext(TooltipCtx);
  const animDd = useSpringValue(dd, duration, enabled);
  const animRec = useSpringValue(recovery, duration, enabled);
  const t = useT();
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-lg">
      <div className="text-xs font-medium text-foreground">
        {t("label.drawdown")} <span>{animDd.toFixed(0)}%</span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        {t("chart.recovery_label")}{" "}
        <span className="font-semibold text-primary">
          +{formatPercent(animRec)}%
        </span>
      </div>
    </div>
  );
}

type TooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<unknown>;
  label?: string | number;
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  const dd = Number(String(label ?? "").replace("%", ""));
  const recovery = calcRecovery(dd);
  return <TooltipContent dd={dd} recovery={recovery} />;
};

function DrawdownChartImpl({
  active,
  onActiveChange,
  smoothEnabled,
  animationDuration,
}: {
  active: number;
  onActiveChange?: (dd: number, velocity?: number) => void;
  smoothEnabled?: boolean;
  animationDuration?: number;
}) {
  const t = useT();
  // Defer rapid updates (e.g. slider drag) so chart re-renders coalesce.
  const deferredActive = useDeferredValue(active);

  // Detect dark mode reactively so chart colors update on theme toggle.
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const mo = new MutationObserver(update);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  const data = useMemo(
    () =>
      CHART_DATA_BASE.map((d) => ({
        dd: d.dd,
        label: d.label,
        recovery: d.recovery,
        color: bucketColor(d.dd, isDark),
      })),
    [isDark],
  );

  const nearestBucket = useMemo(
    () => nearestBucketCached(deferredActive),
    [deferredActive],
  );
  const activeLabel = `${nearestBucket}%`;

  const containerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(220);
  const [chartWidth, setChartWidth] = useState(0);
  const [pinnedLabel, setPinnedLabel] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    const compute = () => {
      const w = el.clientWidth;
      setChartWidth(w);
      const h = Math.round(Math.max(240, Math.min(400, w * 0.65)));
      setChartHeight(h);
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
  }, []);

  /* Hilangkan tooltip pinned saat klik di luar chart */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setPinnedLabel(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentIdx = REFERENCE_BUCKETS.indexOf(nearestBucket);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onActiveChange) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentIdx > 0) {
          onActiveChange(REFERENCE_BUCKETS[currentIdx - 1], 0);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (currentIdx >= 0 && currentIdx < REFERENCE_BUCKETS.length - 1) {
          onActiveChange(REFERENCE_BUCKETS[currentIdx + 1], 0);
        }
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActiveChange(nearestBucket, 1);
      }
    },
    [onActiveChange, currentIdx, nearestBucket],
  );

  /* Posisi indikator (sliding) untuk bucket aktif & tooltip pinned */
  const bandGeom = useMemo(() => {
    if (chartWidth <= 0) return null;
    const n = data.length;
    const plotWidth = Math.max(0, chartWidth - 36 - 8);
    return { bandWidth: plotWidth / n, plotLeft: 36 };
  }, [chartWidth, data.length]);

  const posForIndex = useCallback(
    (i: number) => {
      if (!bandGeom || chartWidth <= 0) return null;
      const xCenter = bandGeom.plotLeft + i * bandGeom.bandWidth + bandGeom.bandWidth / 2;
      return (xCenter / chartWidth) * 100;
    },
    [bandGeom, chartWidth],
  );

  const activeLeftPct = useMemo(() => posForIndex(currentIdx), [posForIndex, currentIdx]);
  const pinnedIndex = pinnedLabel ? data.findIndex((d) => d.label === pinnedLabel) : -1;
  const pinnedPos = useMemo(() => {
    if (pinnedIndex < 1) return null;
    const leftPct = posForIndex(pinnedIndex);
    if (leftPct == null) return null;
    return { leftPct, dd: REFERENCE_BUCKETS[pinnedIndex] };
  }, [pinnedIndex, posForIndex]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      tabIndex={0}
      role="group"
      aria-label={t("chart.aria")}
      onKeyDown={handleKeyDown}
      onClick={() => setPinnedLabel(null)}
    >
      <TooltipCtx.Provider
        value={{
          duration: animationDuration ?? 350,
          enabled: smoothEnabled ?? true,
        }}
      >
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
            onClick={(state: { activeLabel?: string | number } | null, e: React.MouseEvent) => {
              const label = state?.activeLabel;
              if (label) {
                const dd = Number(String(label).replace("%", ""));
                if (Number.isFinite(dd)) {
                  e.stopPropagation();
                  setPinnedLabel(label);
                  onActiveChange?.(dd, 1);
                }
              }
              // Jika tidak ada activeLabel, event bubble ke container onClick → tooltip hilang
            }}
          >
            <CartesianGrid
              stroke="var(--border)"
              strokeOpacity={0.7}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              interval={0}
            />
            <YAxis
              scale="log"
              domain={[2, 10000]}
              ticks={Y_TICKS}
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              wrapperStyle={{ display: "none" }}
              cursor={{ fill: "var(--muted)", fillOpacity: 0.5 }}
              content={() => null}
            />


            {/* Sliding indikator dirender sebagai overlay HTML di luar SVG */}
            <Bar
              dataKey="recovery"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              {data.map((d) => {
                const isActive = d.label === activeLabel;
                return (
                  <Cell
                    key={d.label}
                    fill={d.color}
                    stroke={isActive ? "var(--foreground)" : "transparent"}
                    strokeWidth={isActive ? 1.5 : 1}
                    fillOpacity={isActive ? 1 : 0.6}
                    style={{
                      transition:
                        "fill-opacity 120ms ease-out, stroke-width 120ms ease-out, stroke 120ms ease-out",
                      cursor: "pointer",
                      willChange: "fill-opacity, stroke-width",
                    }}

                    onClick={(e: React.MouseEvent<SVGElement>) => {
                      e.stopPropagation();
                      setPinnedLabel(d.label);
                      onActiveChange?.(d.dd, 1);
                    }}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {activeLeftPct != null && (
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              left: `${activeLeftPct}%`,
              top: 4,
              bottom: 18,
              width: 0,
              borderLeft: "1.5px dashed var(--primary)",
              transform: "translateX(-0.75px)",
              transition:
                "left 120ms ease-out, opacity 120ms ease-out",
              opacity: 0.95,
            }}
          />

        )}
        </TooltipCtx.Provider>
    </div>
  );
}

export const DrawdownChart = memo(DrawdownChartImpl, (prev, next) => {
  // Re-render only when the nearest bucket or visual props actually change.
  return (
    nearestBucketCached(prev.active) === nearestBucketCached(next.active) &&
    prev.onActiveChange === next.onActiveChange &&
    prev.smoothEnabled === next.smoothEnabled &&
    prev.animationDuration === next.animationDuration
  );
});


