import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppNav } from "@/components/AppNav";
import { CashFlowChart } from "@/components/CashFlowChart";
import { HighestExpenses } from "@/components/HighestExpenses";
import { KpiCard } from "@/components/KpiCard";
import { MonthPicker } from "@/components/MonthPicker";
import { SheetLoadError } from "@/components/SheetLoadError";
import { fetchDashboardSnapshot } from "@/lib/sheets";
import type { DashboardSnapshot } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatCad(value: number) {
  return value.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
}

const EMPTY: DashboardSnapshot = {
  month: "September 2026",
  balance: 0,
  income: 0,
  expenses: 0,
  billsLeft: 0,
  cashFlow: [],
  highestExpenses: [],
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  let snapshot: DashboardSnapshot = EMPTY;
  let loadError = false;

  if (session.accessToken) {
    try {
      snapshot = await fetchDashboardSnapshot(session.accessToken);
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
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Live view from your Budget Planner sheet
            </p>
          </div>
          <MonthPicker currentMonth={snapshot.month} />
        </div>

        {loadError ? <SheetLoadError /> : null}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Balance"
            subtitle="Net for month"
            value={formatCad(snapshot.balance)}
            headerColor="#0D9488"
          />
          <KpiCard
            title="Income"
            subtitle="Total in"
            value={formatCad(snapshot.income)}
            headerColor="#16A34A"
          />
          <KpiCard
            title="Expenses"
            subtitle="Total out"
            value={formatCad(snapshot.expenses)}
            headerColor="#EA580C"
          />
          <KpiCard
            title="Bills Left"
            subtitle="Still owing"
            value={formatCad(snapshot.billsLeft)}
            headerColor="#7C3AED"
          />
        </div>

        <div className="mb-6">
          <CashFlowChart data={snapshot.cashFlow} />
        </div>

        <HighestExpenses data={snapshot.highestExpenses} />
      </main>
    </div>
  );
}
