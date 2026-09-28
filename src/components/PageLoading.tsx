import { AppNav } from "@/components/AppNav";

export function PageLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="min-h-full bg-[#F1F5F9]">
      <AppNav />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500 shadow-sm">
          {label}
        </div>
      </main>
    </div>
  );
}
