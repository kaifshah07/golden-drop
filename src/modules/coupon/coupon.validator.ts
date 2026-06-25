import { z } from "zod";

export const applyCouponSchema = z.object({
  body: z.object({
    code: z.string(),
    cartTotal: z.number(),
  }),
});