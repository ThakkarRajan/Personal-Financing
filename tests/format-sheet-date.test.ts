import { describe, it, expect } from "vitest";
import { formatSheetDate } from "@/lib/sheets";

describe("formatSheetDate", () => {
  it("formats YYYY-MM-DD as dd-MMM-yy", () => {
    expect(formatSheetDate("2026-09-28")).toBe("28-Sep-26");
    expect(formatSheetDate("2026-01-05")).toBe("05-Jan-26");
  });
});
