import { z } from "zod";

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    content: z.string().min(10),
    featuredImage: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});