import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppNav } from "@/components/AppNav";
import { BillsTable } from "@/components/BillsTable";
import { KpiCard } from "@/components/KpiCard";
import { SheetLoadError } from "@/components/SheetLoadError";
import { fetchBills, type BillsSnapshot } from "@/lib/sheets";

export const dynamic = "force-dynamic";

function formatCad(value: number) {
  return value.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
}

const EMPTY: BillsSnapshot = {
  monthLabel: "",
  rows: [],
  totalLeft: 0,
};

export default async function BillsPage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  let data: BillsSnapshot = EMPTY;
  let loadError = false;

  if (session.accessToken) {
    try {
      data = await fetchBills(session.accessToken);
    } catch {
      loadError = true;
    }
  } else {
    loadError = true;
  }

  return (
    <div className="min-h-full bg-[#F1F5F9]">
      <AppNav />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Bills & Savings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {data.monthLabel
                ? `Showing ${data.monthLabel}`
                : "Live view from your Budget Planner sheet"}
            </p>
          </div>
          <div className="w-full sm:w-64">
            <KpiCard
              title="Bills Left"
              subtitle="Still owing"
              value={formatCad(data.totalLeft)}
              headerColor="#7C3AED"
            />
          </div>
        </div>

        {loadError ? <SheetLoadError /> : null}

        <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          Edits stay in Google Sheet for v1 — this page is read-only.
        </div>

        <BillsTable rows={data.rows} />
      </main>
    </div>
  );
}
