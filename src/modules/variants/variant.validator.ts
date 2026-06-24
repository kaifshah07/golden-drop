import { z } from "zod";

export const createVariantSchema = z.object({
  body: z.object({
    productId: z.coerce.number(),

    sku: z.string().min(3),

    size: z.string().min(1),

    price: z.coerce.number().positive(),

    salePrice: z.coerce.number().optional(),

    stock: z.coerce.number().int().nonnegative(),

    weight: z.coerce.number().optional(),
  }),
});