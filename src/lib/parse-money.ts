export function parseMoney(input: string | number | null | undefined): number {
  if (input == null || input === "") return 0;
  if (typeof input === "number") return Number.isFinite(input) ? input : 0;
  const n = Number(String(input).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
