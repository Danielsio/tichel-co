import { describe, it, expect } from "vitest";
import {
  createProductSchema,
  createVariantSchema,
  createCollectionSchema,
  productFilterSchema,
} from "./products";

describe("createProductSchema", () => {
  it("passes with valid product data", () => {
    const result = createProductSchema.safeParse({
      title: { he: "מטפחת משי", en: "Silk Tichel" },
      description: { he: "מטפחת יוקרתית", en: "Luxury tichel" },
      priceCents: 8500,
      isFeatured: true,
    });
    expect(result.success).toBe(true);
  });

  it("requires Hebrew title", () => {
    const result = createProductSchema.safeParse({
      title: { he: "", en: "Silk Tichel" },
      description: { he: "תיאור" },
      priceCents: 8500,
    });
    expect(result.success).toBe(false);
  });

  it("allows English to be omitted (defaults to empty string)", () => {
    const result = createProductSchema.safeParse({
      title: { he: "מטפחת משי" },
      description: { he: "תיאור" },
      priceCents: 8500,
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-positive price", () => {
    const result = createProductSchema.safeParse({
      title: { he: "מטפחת" },
      description: { he: "תיאור" },
      priceCents: -100,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero price", () => {
    const result = createProductSchema.safeParse({
      title: { he: "מטפחת" },
      description: { he: "תיאור" },
      priceCents: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe("createVariantSchema", () => {
  it("passes with valid variant data", () => {
    const result = createVariantSchema.safeParse({
      productId: "abc123",
      sku: "SILK-IVORY-001",
      color: "ivory",
      fabric: "silk",
      stockQty: 10,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty SKU", () => {
    const result = createVariantSchema.safeParse({
      productId: "abc123",
      sku: "",
      stockQty: 5,
    });
    expect(result.success).toBe(false);
  });
});

describe("createCollectionSchema", () => {
  it("passes with valid collection data", () => {
    const result = createCollectionSchema.safeParse({
      title: { he: "קולקציית משי", en: "Silk Collection" },
      description: { he: "תיאור", en: "Description" },
    });
    expect(result.success).toBe(true);
  });
});

describe("productFilterSchema", () => {
  it("passes with default values", () => {
    const result = productFilterSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(24);
      expect(result.data.sort).toBe("newest");
    }
  });

  it("accepts valid filter params", () => {
    const result = productFilterSchema.safeParse({
      color: "ivory",
      fabric: "silk",
      minPrice: 5000,
      maxPrice: 20000,
      inStock: true,
      page: 2,
      limit: 12,
      sort: "price_asc",
    });
    expect(result.success).toBe(true);
  });
});
