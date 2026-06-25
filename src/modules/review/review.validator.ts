import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    productId: z.number(),
    rating: z.number().min(1).max(5),
    review: z.string().optional(),
  }),
});