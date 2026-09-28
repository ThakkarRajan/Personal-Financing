import { describe, it, expect } from "vitest";
import { parseMoney } from "@/lib/parse-money";

describe("parseMoney", () => {
  it("parses currency strings", () => {
    expect(parseMoney("$1,234.50")).toBe(1234.5);
    expect(parseMoney("884.85")).toBe(884.85);
  });
  it("returns 0 for empty", () => {
    expect(parseMoney(null)).toBe(0);
    expect(parseMoney("")).toBe(0);
  });
});
