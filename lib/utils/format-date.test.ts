import { describe, it, expect } from "vitest";
import { formatDate } from "./format-date";

describe("formatDate", () => {
  const testDate = new Date("2025-03-15T12:00:00Z");

  it("formats date in Hebrew locale", () => {
    const result = formatDate(testDate, "he-IL");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });

  it("formats date in English locale", () => {
    const result = formatDate(testDate, "en-US");
    expect(result).toContain("Mar");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });

  it("handles string input", () => {
    const result = formatDate("2025-01-01", "en-US");
    expect(result).toContain("2025");
  });

  it("handles numeric timestamp", () => {
    const result = formatDate(testDate.getTime(), "en-US");
    expect(result).toContain("2025");
  });

  it("returns empty string for invalid date", () => {
    expect(formatDate("invalid", "en-US")).toBe("");
  });

  it("defaults to Hebrew locale", () => {
    const result = formatDate(testDate);
    expect(result).toBeTruthy();
  });
});
