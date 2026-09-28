"use client";

import { useCallback, useEffect, useState } from "react";
import { SheetLoadError } from "@/components/SheetLoadError";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionTable } from "@/components/TransactionTable";
import type { TransactionRow } from "@/lib/types";

export function DataEntryClient() {
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoadError(false);
    setLoading(true);
    try {
      const [catRes, txRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/transactions?limit=30"),
      ]);
      if (!catRes.ok || !txRes.ok) {
        setLoadError(true);
        return;
      }
      const cats = (await catRes.json()) as string[];
      const txs = (await txRes.json()) as TransactionRow[];
      setSubCategories(Array.isArray(cats) ? cats : []);
      setRows(Array.isArray(txs) ? txs : []);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Data Entry
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Append transactions to your sheet and review recent rows
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {loadError ? <SheetLoadError /> : null}

      <div className="mb-6">
        <TransactionForm
          subCategories={subCategories}
          onSuccess={() => void load()}
        />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          Recent transactions
        </h2>
        {loading && rows.length === 0 && !loadError ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading transactions…
          </div>
        ) : (
          <TransactionTable rows={rows} />
        )}
      </div>
    </>
  );
}
