import { describe, it, expect } from "vitest";
import {
  createCustomRequestSchema,
  updateCustomRequestSchema,
} from "./custom-requests";

describe("createCustomRequestSchema", () => {
  it("passes with valid request data", () => {
    const result = createCustomRequestSchema.safeParse({
      contactEmail: "miriam@example.com",
      type: "tichel",
      description: "אני מחפשת מטפחת משי בצבע שנהב עם עיטורי זהב",
      budgetRange: "200_500",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = createCustomRequestSchema.safeParse({
      contactEmail: "not-an-email",
      type: "scarf",
      description: "תיאור ארוך מספיק כדי לעבור ולידציה",
    });
    expect(result.success).toBe(false);
  });

  it("rejects too-short description", () => {
    const result = createCustomRequestSchema.safeParse({
      contactEmail: "miriam@example.com",
      type: "tichel",
      description: "קצר",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid type", () => {
    const result = createCustomRequestSchema.safeParse({
      contactEmail: "miriam@example.com",
      type: "invalid_type",
      description: "תיאור ארוך מספיק כדי לעבור ולידציה",
    });
    expect(result.success).toBe(false);
  });

  it("limits reference images to 5", () => {
    const result = createCustomRequestSchema.safeParse({
      contactEmail: "miriam@example.com",
      type: "tichel",
      description: "תיאור ארוך מספיק כדי לעבור ולידציה",
      referenceImages: Array(6).fill("https://example.com/img.jpg"),
    });
    expect(result.success).toBe(false);
  });
});

describe("updateCustomRequestSchema", () => {
  it("accepts valid status update", () => {
    const result = updateCustomRequestSchema.safeParse({
      status: "quote_sent",
      quotePriceCents: 45000,
    });
    expect(result.success).toBe(true);
  });

  it("accepts assignment", () => {
    const result = updateCustomRequestSchema.safeParse({
      assignedTo: "admin-user-id",
    });
    expect(result.success).toBe(true);
  });
});
