import { describe, it, expect } from "vitest";
import { MONTH_OPTIONS, isValidMonthLabel } from "@/lib/month";

describe("month", () => {
  it("includes September 2026", () => {
    expect(MONTH_OPTIONS).toContain("September 2026");
    expect(MONTH_OPTIONS[0]).toBe("January 2025");
    expect(MONTH_OPTIONS.at(-1)).toBe("December 2026");
  });
  it("validates labels", () => {
    expect(isValidMonthLabel("September 2026")).toBe(true);
    expect(isValidMonthLabel("Sep 2026")).toBe(false);
  });
});
