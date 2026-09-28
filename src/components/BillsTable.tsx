import type { BillRow } from "@/lib/types";

type BillsTableProps = {
  rows: BillRow[];
};

function formatCad(value: number) {
  return value.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
}

export function BillsTable({ rows }: BillsTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        No bills found for this month.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 text-right">Due Day</th>
              <th className="px-4 py-3 text-right">Budget</th>
              <th className="px-4 py-3 text-right">Paid</th>
              <th className="px-4 py-3 text-right">Left</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.name} className="hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-4 py-2.5 font-medium text-slate-900">
                  {row.name}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-slate-700">
                  {row.dueDay || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-slate-700">
                  {formatCad(row.budget)}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-slate-700">
                  {formatCad(row.paid)}
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-2.5 text-right font-medium tabular-nums ${
                    row.left > 0 ? "text-violet-700" : "text-slate-900"
                  }`}
                >
                  {formatCad(row.left)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
