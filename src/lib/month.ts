const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
] as const;

export const MONTH_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let y = 2025; y <= 2026; y++) {
    for (const m of MONTHS) out.push(`${m} ${y}`);
  }
  return out;
})();

export function isValidMonthLabel(label: string): boolean {
  return MONTH_OPTIONS.includes(label);
}
