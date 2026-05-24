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
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

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

export function DrawdownChart({
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

  const nearestBucket = REFERENCE_BUCKETS.reduce((p, c) =>
    Math.abs(c - active) < Math.abs(p - active) ? c : p,
  );
  const activeLabel = `${nearestBucket}%`;

  const containerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(220);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      // Proportional: ~55% of width, clamped so Y-axis & tooltip never crop.
      const h = Math.round(Math.max(200, Math.min(360, w * 0.55)));
      setChartHeight(h);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const currentIdx = REFERENCE_BUCKETS.indexOf(nearestBucket);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onActiveChange) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const idx = Math.max(1, currentIdx);
      if (idx > 1) {
        onActiveChange(REFERENCE_BUCKETS[idx - 1], 0);
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const idx = Math.max(0, currentIdx);
      if (idx >= 1 && idx < REFERENCE_BUCKETS.length - 1) {
        onActiveChange(REFERENCE_BUCKETS[idx + 1], 0);
      } else if (idx === 1 && currentIdx === -1) {
        onActiveChange(REFERENCE_BUCKETS[2], 1);
      } else if (currentIdx < REFERENCE_BUCKETS.length - 1) {
        onActiveChange(REFERENCE_BUCKETS[currentIdx + 1], 0);
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActiveChange(nearestBucket, 0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      tabIndex={0}
      role="group"
      aria-label="Diagram drawdown"
      onKeyDown={handleKeyDown}
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
            onClick={(state: any) => {
              const label = state?.activeLabel;
              if (!label) return;
              const dd = Number(String(label).replace("%", ""));
              if (!Number.isFinite(dd)) return;
              onActiveChange?.(dd, 0);
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
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              content={<CustomTooltip />}
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
