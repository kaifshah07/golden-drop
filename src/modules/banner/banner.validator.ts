import { z } from "zod";

export const createBannerSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    image: z.string().url(),
    status: z.boolean().optional(),
  }),
});

export const updateBannerSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    image: z.string().url().optional(),
    status: z.boolean().optional(),
  }),
});