import { z } from "zod";

const localeMapSchema = z.object({
  he: z.string().min(1, "Hebrew text is required"),
  en: z.string().optional().default(""),
});

export const createProductSchema = z.object({
  title: localeMapSchema,
  description: localeMapSchema,
  priceCents: z.number().int().positive("Price must be positive"),
  comparePriceCents: z.number().int().positive().optional(),
  collectionIds: z.array(z.string()).default([]),
  skuBase: z.string().max(50).optional(),
  isFeatured: z.boolean().default(false),
});

export const updateProductSchema = createProductSchema.partial();

export const createVariantSchema = z.object({
  productId: z.string().min(1),
  sku: z.string().min(1, "SKU is required").max(100),
  color: z.string().max(100).optional(),
  size: z.string().max(50).optional(),
  fabric: z.string().max(100).optional(),
  stockQty: z.number().int().min(0).default(0),
  imageUrls: z.array(z.string().url()).default([]),
});

export const createCollectionSchema = z.object({
  title: localeMapSchema,
  description: localeMapSchema,
  imageUrl: z.string().url().optional(),
  displayOrder: z.number().int().default(0),
});

export const updateCollectionSchema = createCollectionSchema.partial();

export const productFilterSchema = z.object({
  collectionId: z.string().optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().positive().optional(),
  color: z.string().optional(),
  fabric: z.string().optional(),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(24),
  sort: z.enum(["newest", "price_asc", "price_desc", "featured"]).default("newest"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
