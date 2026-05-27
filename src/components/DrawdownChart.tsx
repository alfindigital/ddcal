import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
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

const Y_TICKS = [2, 10, 50, 200, 1000, 10000];

const TooltipCtx = createContext({ duration: 350, enabled: true });

function TooltipContent({ dd, recovery }: { dd: number; recovery: number }) {
  const { duration, enabled } = useContext(TooltipCtx);
  const animDd = useSpringValue(dd, duration, enabled);
  const animRec = useSpringValue(recovery, duration, enabled);
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-lg">
      <div className="text-xs font-medium text-foreground">
        Drawdown <span>{animDd.toFixed(0)}%</span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Butuh pulih{" "}
        <span className="font-semibold text-primary">
          +{formatPercent(animRec)}%
        </span>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const dd = Number(label?.replace("%", ""));
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
  // Defer rapid updates (e.g. slider drag) so chart re-renders coalesce.
  const deferredActive = useDeferredValue(active);

  const data = useMemo(
    () =>
      REFERENCE_BUCKETS.map((dd) => ({
        dd,
        label: `${dd}%`,
        recovery: Math.max(calcRecovery(dd), 1),
        color: bucketColor(dd),
      })),
    [],
  );

  const nearestBucket = useMemo(
    () =>
      REFERENCE_BUCKETS.reduce((p, c) =>
        Math.abs(c - deferredActive) < Math.abs(p - deferredActive) ? c : p,
      ),
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
      const h = Math.round(Math.max(200, Math.min(360, w * 0.55)));
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

  /* Posisi tooltip pinned */
  const pinnedIndex = pinnedLabel ? data.findIndex((d) => d.label === pinnedLabel) : -1;
  const pinnedPos = useMemo(() => {
    if (pinnedIndex < 1 || chartWidth <= 0) return null;
    const n = data.length;
    const plotWidth = Math.max(0, chartWidth - 36 - 8); // YAxis(36) + right margin(8)
    const bandWidth = plotWidth / n;
    const xCenter = 36 + pinnedIndex * bandWidth + bandWidth / 2;
    const leftPct = (xCenter / chartWidth) * 100;
    return { leftPct, dd: REFERENCE_BUCKETS[pinnedIndex] };
  }, [pinnedIndex, chartWidth, data.length]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      tabIndex={0}
      role="group"
      aria-label="Diagram drawdown"
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
            onClick={(state: any, e: React.MouseEvent) => {
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
            <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              interval={0}
            />
            <YAxis
              scale="log"
              domain={[2, 10000]}
              ticks={Y_TICKS}
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: "#6b7280", fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              wrapperStyle={{ display: "none" }}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              content={() => null}
            />

            <ReferenceLine
              x={activeLabel}
              stroke="#b91c1c"
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
            />
            <Bar
              dataKey="recovery"
              radius={[4, 4, 0, 0]}
              isAnimationActive={smoothEnabled ?? true}
              animationDuration={550}
              animationEasing="ease-out"
            >
              {data.map((d) => {
                const isActive = d.label === activeLabel;
                return (
                  <Cell
                    key={d.label}
                    fill={d.color}
                    stroke={isActive ? "#450a0a" : "transparent"}
                    strokeWidth={isActive ? 2 : 1}
                    fillOpacity={isActive ? 1 : 0.55}
                    style={{
                      transition:
                        "fill-opacity 350ms ease-out, stroke-width 350ms ease-out",
                      cursor: "pointer",
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



      </TooltipCtx.Provider>
    </div>
  );
}

export const DrawdownChart = memo(DrawdownChartImpl, (prev, next) => {
  // Re-render only when the nearest bucket or visual props actually change.
  const bucket = (v: number) =>
    REFERENCE_BUCKETS.reduce((p, c) =>
      Math.abs(c - v) < Math.abs(p - v) ? c : p,
    );
  return (
    bucket(prev.active) === bucket(next.active) &&
    prev.onActiveChange === next.onActiveChange &&
    prev.smoothEnabled === next.smoothEnabled &&
    prev.animationDuration === next.animationDuration
  );
});


