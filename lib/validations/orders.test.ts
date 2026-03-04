import { describe, it, expect } from "vitest";
import { createOrderSchema, updateOrderStatusSchema } from "./orders";

describe("createOrderSchema", () => {
  it("passes with valid order data", () => {
    const result = createOrderSchema.safeParse({
      items: [{ variantId: "variant-abc-123", quantity: 2 }],
      shippingAddress: {
        line1: "רחוב הרצל 10",
        city: "תל אביב",
        country: "Israel",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty items array", () => {
    const result = createOrderSchema.safeParse({
      items: [],
      shippingAddress: {
        line1: "רחוב הרצל 10",
        city: "תל אביב",
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts Israeli address without postal code", () => {
    const result = createOrderSchema.safeParse({
      items: [{ variantId: "variant-abc-123", quantity: 1 }],
      shippingAddress: {
        line1: "רחוב דיזנגוף 50",
        city: "תל אביב",
        country: "Israel",
      },
    });
    expect(result.success).toBe(true);
  });

  it("accepts guest checkout with email", () => {
    const result = createOrderSchema.safeParse({
      items: [{ variantId: "variant-abc-123", quantity: 1 }],
      shippingAddress: {
        line1: "רחוב הרצל 10",
        city: "תל אביב",
        country: "Israel",
      },
      guestEmail: "guest@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid guest email", () => {
    const result = createOrderSchema.safeParse({
      items: [{ variantId: "variant-abc-123", quantity: 1 }],
      shippingAddress: {
        line1: "כתובת",
        city: "עיר",
      },
      guestEmail: "not-an-email",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateOrderStatusSchema", () => {
  it("accepts valid status", () => {
    const result = updateOrderStatusSchema.safeParse({
      status: "shipped",
      note: "Tracking: IL1234567890",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = updateOrderStatusSchema.safeParse({
      status: "invalid_status",
    });
    expect(result.success).toBe(false);
  });
});
