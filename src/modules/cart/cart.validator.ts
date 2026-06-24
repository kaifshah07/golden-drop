import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    variantId: z.coerce.number(),
    quantity: z.coerce.number().int().positive(),
  }),
});