"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { MONTH_OPTIONS } from "@/lib/month";

type MonthPickerProps = {
  currentMonth: string;
};

export function MonthPicker({ currentMonth }: MonthPickerProps) {
  const router = useRouter();
  const [value, setValue] = useState(currentMonth);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(currentMonth);
  }, [currentMonth]);

  async function handleChange(next: string) {
    setError(null);
    setValue(next);
    try {
      const res = await fetch("/api/month", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: next }),
      });
      if (!res.ok) {
        setValue(currentMonth);
        setError(
          res.status === 401
            ? "Could not load sheet — try signing in again"
            : "Could not update month",
        );
        return;
      }
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setValue(currentMonth);
      setError("Could not update month");
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="month-picker" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Month
      </label>
      <select
        id="month-picker"
        value={MONTH_OPTIONS.includes(value) ? value : currentMonth}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 disabled:opacity-60"
      >
        {!MONTH_OPTIONS.includes(currentMonth) && currentMonth ? (
          <option value={currentMonth}>{currentMonth}</option>
        ) : null}
        {MONTH_OPTIONS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
