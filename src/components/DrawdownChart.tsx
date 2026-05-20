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

const Y_TICKS = [2, 10, 50, 200, 1000, 10000];

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

  return (
    <div className="h-[220px] w-full sm:h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 6, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid stroke="var(--muted)" vertical={false} />
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
                  y={y + 10}
                  textAnchor="middle"
                  fill={isActive ? "var(--primary)" : "var(--muted-foreground)"}
                  fontSize={10}
                  fontWeight={isActive ? 700 : 500}
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
            tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <ReferenceLine
            x={activeLabel}
            stroke="var(--primary)"
            strokeDasharray="3 3"
          />
          <Bar dataKey="recovery" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {data.map((d) => (
              <Cell
                key={d.label}
                fill={d.color}
                fillOpacity={d.label === activeLabel ? 1 : 0.55}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
