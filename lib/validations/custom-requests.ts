import { z } from "zod";

export const createCustomRequestSchema = z.object({
  name: z.string().min(1).max(200),
  contactEmail: z.string().email("כתובת אימייל לא תקינה"),
  type: z.enum(["tichel", "scarf", "head-wrap", "other"], {
    error: "סוג הפריט נדרש",
  }),
  description: z.string().min(10, "תיאור חייב להכיל לפחות 10 תווים").max(2000),
  budgetRange: z.enum(["under-100", "100-200", "200-400", "400-plus"]).optional(),
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
