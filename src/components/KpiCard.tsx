type KpiCardProps = {
  title: string;
  subtitle?: string;
  value: string;
  headerColor: string;
};

export function KpiCard({ title, subtitle, value, headerColor }: KpiCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/60">
      <div
        className="px-4 py-3"
        style={{ backgroundColor: headerColor }}
      >
        <h3 className="text-sm font-bold uppercase tracking-wide text-white">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs font-medium text-white/80">{subtitle}</p>
        ) : null}
      </div>
      <div className="px-4 py-5">
        <p className="text-2xl font-bold tabular-nums tracking-tight text-slate-900 sm:text-3xl">
          {value}
        </p>
      </div>
    </div>
  );
}
