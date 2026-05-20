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
    <div className="w-full overflow-x-auto">
      <ResponsiveContainer width="100%" height={240} minWidth={280}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
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
            width={42}
          />
          <ReferenceLine x={activeLabel} stroke="#4f46e5" strokeDasharray="3 3" />
          <Bar dataKey="recovery" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {data.map((d) => (
              <Cell
                key={d.label}
                fill={d.color}
                stroke={d.label === activeLabel ? "#1e1b4b" : "transparent"}
                strokeWidth={d.label === activeLabel ? 2 : 0}
              />
            ))}
          </Bar>

      </ResponsiveContainer>
    </div>
  );
}
