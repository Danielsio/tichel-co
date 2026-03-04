import { z } from "zod";

export const createCustomRequestSchema = z.object({
  contactEmail: z.string().email("כתובת אימייל לא תקינה"),
  type: z.enum(["tichel", "scarf", "headwrap", "accessory", "other"], {
    error: "סוג הפריט נדרש",
  }),
  description: z.string().min(10, "תיאור חייב להכיל לפחות 10 תווים").max(2000),
  budgetRange: z.enum(["under_200", "200_500", "500_900", "above_900"]).optional(),
  referenceImages: z.array(z.string().url()).max(5).default([]),
});

export const updateCustomRequestSchema = z.object({
  status: z
    .enum([
      "submitted",
      "under_review",
      "quote_sent",
      "quote_accepted",
      "in_production",
      "shipped",
      "completed",
      "cancelled",
    ])
    .optional(),
  assignedTo: z.string().optional(),
  quotePriceCents: z.number().int().positive().optional(),
});

export type CreateCustomRequestInput = z.infer<typeof createCustomRequestSchema>;
export type UpdateCustomRequestInput = z.infer<typeof updateCustomRequestSchema>;
