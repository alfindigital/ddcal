import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  REFERENCE_BUCKETS,
  bucketColor,
  calcRecovery,
} from "@/lib/drawdown";
import { useMemo } from "react";

const Y_TICKS = [2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 4000, 10000];

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

  // Snap active to closest bucket for highlight
  const nearestBucket = REFERENCE_BUCKETS.reduce((p, c) =>
    Math.abs(c - active) < Math.abs(p - active) ? c : p,
  );
  const activeLabel = `${nearestBucket}%`;

  return (
    <div className="h-[260px] w-full sm:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="hsl(var(--muted-foreground) / 0.15)" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={(props) => {
              const { x, y, payload } = props;
              const isActive = payload.value === activeLabel;
              return (
                <text
                  x={x}
                  y={y + 12}
                  textAnchor="middle"
                  fill={isActive ? "var(--primary)" : "var(--muted-foreground)"}
                  fontSize={12}
                  fontWeight={isActive ? 700 : 400}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <YAxis
            scale="log"
            domain={[2, 10000]}
            ticks={Y_TICKS}
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <ReferenceLine
            x={activeLabel}
            stroke="var(--primary)"
            strokeDasharray="4 4"
          />
          <Bar dataKey="recovery" radius={[6, 6, 0, 0]} isAnimationActive={false}>
            {data.map((d) => (
              <Cell
                key={d.label}
                fill={d.color}
                stroke={d.label === activeLabel ? "#111" : "transparent"}
                strokeWidth={d.label === activeLabel ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
