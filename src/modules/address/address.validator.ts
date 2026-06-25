import { z } from "zod";

export const createAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    mobile: z.string().min(10).max(15),

    addressLine1: z.string().min(3),
    addressLine2: z.string().optional(),

    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(4).max(10),
    country: z.string().default("India"),

    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    mobile: z.string().min(10).max(15).optional(),

    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),

    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    country: z.string().optional(),

    isDefault: z.boolean().optional(),
  }),
});