import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isAllowedEmail } from "@/lib/allowlist";

describe("isAllowedEmail", () => {
  const prev = process.env.ALLOWED_EMAIL;
  beforeEach(() => { process.env.ALLOWED_EMAIL = "rajan@example.com"; });
  afterEach(() => { process.env.ALLOWED_EMAIL = prev; });

  it("allows exact match case-insensitive", () => {
    expect(isAllowedEmail("Rajan@Example.com")).toBe(true);
  });
  it("denies others", () => {
    expect(isAllowedEmail("other@example.com")).toBe(false);
    expect(isAllowedEmail(null)).toBe(false);
  });
});
