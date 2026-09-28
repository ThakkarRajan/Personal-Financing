"use client";

import type { TransactionRow } from "@/lib/types";

type TransactionTableProps = {
  rows: TransactionRow[];
};

function formatCad(value: number) {
  return value.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
}

export function TransactionTable({ rows }: TransactionTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        No recent transactions.
      </div>
    );
  }

  // Show newest first
  const display = [...rows].reverse();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Sub-Category</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Check</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {display.map((row) => (
              <tr key={row.row} className="hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-4 py-2.5 text-slate-900">
                  {row.date}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">
                  {row.category}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">
                  {row.subCategory}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-right font-medium text-slate-900">
                  {formatCad(row.amount)}
                </td>
                <td className="max-w-[14rem] truncate px-4 py-2.5 text-slate-600">
                  {row.comment}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">
                  {row.check}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
