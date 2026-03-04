import { describe, it, expect } from "vitest";
import { t } from "./locale";

describe("t (locale helper)", () => {
  it("returns Hebrew string for he locale", () => {
    expect(t({ he: "שלום", en: "Hello" }, "he")).toBe("שלום");
  });

  it("returns English string for en locale", () => {
    expect(t({ he: "שלום", en: "Hello" }, "en")).toBe("Hello");
  });

  it("falls back to Hebrew when English is missing", () => {
    expect(t({ he: "שלום" } as { he: string; en: string }, "en")).toBe("שלום");
  });

  it("returns empty string for null/undefined", () => {
    expect(t(null, "he")).toBe("");
    expect(t(undefined, "he")).toBe("");
  });

  it("returns empty string for empty object", () => {
    expect(t({} as { he: string; en: string }, "he")).toBe("");
  });
});
