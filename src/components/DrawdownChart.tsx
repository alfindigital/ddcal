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
import { useEffect, useMemo, useRef, useState } from "react";

const Y_TICKS = [2, 10, 50, 200, 1000, 10000];
const BUCKET_WIDTH = 72; // px per bucket on the scrollable canvas
const Y_AXIS_WIDTH = 42;

export function DrawdownChart({ active }: { active: number }) {
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const [centeredIdx, setCenteredIdx] = useState(
    REFERENCE_BUCKETS.indexOf(nearestBucket),
  );

  // Auto-scroll active bucket into view when the slider moves
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = REFERENCE_BUCKETS.indexOf(nearestBucket);
    if (idx < 0) return;
    const target =
      Y_AXIS_WIDTH + idx * BUCKET_WIDTH + BUCKET_WIDTH / 2 - el.clientWidth / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [nearestBucket]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const centerX = el.scrollLeft + el.clientWidth / 2 - Y_AXIS_WIDTH;
    const idx = Math.round(centerX / BUCKET_WIDTH - 0.5);
    const clamped = Math.max(0, Math.min(REFERENCE_BUCKETS.length - 1, idx));
    if (clamped !== centeredIdx) setCenteredIdx(clamped);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const dd = Number(label?.replace("%", ""));
    const recovery = calcRecovery(dd);
    return (
      <div className="rounded-lg border bg-background px-3 py-2 shadow-lg">
        <div className="text-xs font-medium text-foreground">Drawdown {label}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Butuh pulih{" "}
          <span className="font-semibold text-primary">
            +{formatPercent(recovery)}%
          </span>
        </div>
      </div>
    );
  };

  const canvasWidth = Y_AXIS_WIDTH + REFERENCE_BUCKETS.length * BUCKET_WIDTH;

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:thin]"
      >
        <div
          className="relative"
          style={{ width: canvasWidth, height: 240 }}
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
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
                width={Y_AXIS_WIDTH}
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
                isAnimationActive={true}
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
                      }}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Invisible snap targets aligned with each bucket */}
          <div
            className="pointer-events-none absolute inset-y-0 flex"
            style={{ left: Y_AXIS_WIDTH, right: 0 }}
            aria-hidden
          >
            {REFERENCE_BUCKETS.map((b) => (
              <div
                key={b}
                className="snap-center snap-always"
                style={{ width: BUCKET_WIDTH, flex: "0 0 auto" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Position markers */}
      <div className="mt-2 flex items-center justify-center gap-1.5">
        {REFERENCE_BUCKETS.map((b, i) => {
          const isCenter = i === centeredIdx;
          const isActive = b === nearestBucket;
          return (
            <span
              key={b}
              className="rounded-full transition-all duration-300"
              style={{
                width: isCenter ? 18 : 6,
                height: 6,
                background: isActive
                  ? "hsl(var(--primary, 0 70% 45%))"
                  : isCenter
                    ? "#6b7280"
                    : "rgba(107,114,128,0.3)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
