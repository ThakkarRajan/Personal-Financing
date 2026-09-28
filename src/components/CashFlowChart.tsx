"use client";

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
import type { CashFlowPoint } from "@/lib/types";

const BAR_COLORS: Record<string, string> = {
  Income: "#16A34A",
  Expenses: "#EA580C",
  Bills: "#7C3AED",
  Savings: "#0D9488",
};

type CashFlowChartProps = {
  data: CashFlowPoint[];
};

function formatCad(value: number) {
  return value.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200/60 sm:p-6">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Cash Flow</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: "#CBD5E1" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) =>
                v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`
              }
            />
            <Tooltip
              formatter={(value) => [
                typeof value === "number" ? formatCad(value) : String(value ?? ""),
                "Amount",
              ]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                fontSize: 13,
              }}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {data.map((entry) => (
                <Cell
                  key={entry.label}
                  fill={BAR_COLORS[entry.label] ?? "#64748B"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
