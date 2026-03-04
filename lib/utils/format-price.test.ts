import { describe, it, expect } from "vitest";
import { formatPrice } from "./format-price";

describe("formatPrice", () => {
  it("formats cents to ILS by default", () => {
    expect(formatPrice(1999)).toContain("19.99");
  });

  it("handles zero", () => {
    expect(formatPrice(0)).toContain("0.00");
  });

  it("formats large values", () => {
    expect(formatPrice(99900)).toContain("999.00");
  });

  it("supports USD override", () => {
    const result = formatPrice(5000, "USD", "en-US");
    expect(result).toBe("$50.00");
  });
});
