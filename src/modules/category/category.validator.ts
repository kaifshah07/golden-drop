import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Category name is required"),

    slug: z
      .string()
      .min(2)
      .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),

    description: z.string().optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),

    slug: z
      .string()
      .regex(/^[a-z0-9-]+$/)
      .optional(),

    description: z.string().optional(),
  }),
});