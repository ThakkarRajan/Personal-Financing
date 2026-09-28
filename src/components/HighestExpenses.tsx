"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ExpenseRank } from "@/lib/types";

type HighestExpensesProps = {
  data: ExpenseRank[];
};

function formatCad(value: number) {
  return value.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
}

export function HighestExpenses({ data }: HighestExpensesProps) {
  const chartData = [...data].reverse();

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200/60 sm:p-6">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Highest Expenses</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[240px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-2 pr-3 font-semibold">Category</th>
                <th className="pb-2 text-right font-semibold">Actual</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-slate-500">
                    No expense data
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={row.category}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-2.5 pr-3 font-medium text-slate-800">
                      {row.category}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-700">
                      {formatCad(row.actual)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="h-72 w-full min-h-[16rem]">
          {data.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-slate-500">
              No chart data
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`
                  }
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={100}
                  tick={{ fill: "#475569", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [
                    typeof value === "number" ? formatCad(value) : String(value ?? ""),
                    "Actual",
                  ]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E2E8F0",
                    fontSize: 13,
                  }}
                />
                <Bar
                  dataKey="actual"
                  fill="#EA580C"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
