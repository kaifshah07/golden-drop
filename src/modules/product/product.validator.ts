import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    slug: z.string(),
    categoryId: z.coerce.number(),
    description: z.string().optional(),
    featuredImage: z.string().optional(),
  }),
});