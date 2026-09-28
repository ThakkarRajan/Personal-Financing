"use client";

import { useEffect, useState, type FormEvent } from "react";

const CATEGORY_OPTIONS = ["Expenses", "Income", "Bills", "Savings"] as const;

type TransactionFormProps = {
  subCategories: string[];
  onSuccess?: () => void;
};

function todayIsoLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function TransactionForm({
  subCategories,
  onSuccess,
}: TransactionFormProps) {
  const [date, setDate] = useState(todayIsoLocal);
  const [category, setCategory] =
    useState<(typeof CATEGORY_OPTIONS)[number]>("Expenses");
  const [subCategory, setSubCategory] = useState(subCategories[0] ?? "");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (subCategories.length === 0) {
      setSubCategory("");
      return;
    }
    setSubCategory((prev) =>
      prev && subCategories.includes(prev) ? prev : subCategories[0],
    );
  }, [subCategories]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);

    const amountNum = Number(amount);
    if (!date) {
      setError("Date is required");
      return;
    }
    if (!subCategory) {
      setError("Sub-category is required");
      return;
    }
    if (!Number.isFinite(amountNum)) {
      setError("Enter a valid amount");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          category,
          subCategory,
          amount: amountNum,
          comment,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        if (res.status === 401) {
          setError("Could not load sheet — try signing in again");
        } else {
          setError(data?.error ?? "Could not save transaction");
        }
        return;
      }
      setOk("Transaction saved");
      setAmount("");
      setComment("");
      onSuccess?.();
    } catch {
      setError("Could not save transaction");
    } finally {
      setPending(false);
    }
  }

  const fieldClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 disabled:opacity-60";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-bold text-slate-900">Add transaction</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="tx-date"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Date
          </label>
          <input
            id="tx-date"
            type="date"
            value={date}
            disabled={pending}
            onChange={(e) => setDate(e.target.value)}
            className={fieldClass}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="tx-category"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Category
          </label>
          <select
            id="tx-category"
            value={category}
            disabled={pending}
            onChange={(e) =>
              setCategory(e.target.value as (typeof CATEGORY_OPTIONS)[number])
            }
            className={fieldClass}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="tx-sub"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Sub-Category
          </label>
          <select
            id="tx-sub"
            value={subCategory}
            disabled={pending || subCategories.length === 0}
            onChange={(e) => setSubCategory(e.target.value)}
            className={fieldClass}
            required
          >
            {subCategories.length === 0 ? (
              <option value="">No categories loaded</option>
            ) : (
              subCategories.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="tx-amount"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Amount
          </label>
          <input
            id="tx-amount"
            type="number"
            step="0.01"
            inputMode="decimal"
            value={amount}
            disabled={pending}
            onChange={(e) => setAmount(e.target.value)}
            className={fieldClass}
            placeholder="0.00"
            required
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label
            htmlFor="tx-comment"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Comment
          </label>
          <input
            id="tx-comment"
            type="text"
            value={comment}
            disabled={pending}
            onChange={(e) => setComment(e.target.value)}
            className={fieldClass}
            placeholder="Optional note"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Add transaction"}
        </button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {ok ? <p className="text-sm text-green-700">{ok}</p> : null}
      </div>
    </form>
  );
}
