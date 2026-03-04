import { z } from "zod";

const shippingAddressSchema = z.object({
  line1: z.string().min(1, "כתובת נדרשת"),
  line2: z.string().optional(),
  city: z.string().min(1, "עיר נדרשת"),
  country: z.string().min(1).default("Israel"),
  postalCode: z.string().optional(),
});

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, "הזמנה חייבת לכלול לפחות פריט אחד"),
  shippingAddress: shippingAddressSchema,
  guestEmail: z.string().email("כתובת אימייל לא תקינה").optional(),
  discountCode: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending_payment",
    "payment_confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
  note: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
