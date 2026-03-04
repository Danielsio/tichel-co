import { describe, it, expect } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles special characters", () => {
    expect(slugify("Silk & Satin Collection!")).toBe("silk-satin-collection");
  });

  it("trims whitespace", () => {
    expect(slugify("  Navy Tichel  ")).toBe("navy-tichel");
  });

  it("handles multiple spaces", () => {
    expect(slugify("a   b")).toBe("a-b");
  });
});
