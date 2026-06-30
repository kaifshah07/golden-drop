import { z } from "zod";

export const createPaymentSchema = z.object({
  body: z.object({
    orderId: z
      .string()
      .min(1, "Order ID is required"),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z
      .string()
      .min(1, "Razorpay Order ID is required"),

    razorpay_payment_id: z
      .string()
      .min(1, "Razorpay Payment ID is required"),

    razorpay_signature: z
      .string()
      .min(1, "Signature is required"),
  }),
});

export const refundPaymentSchema = z.object({
  body: z.object({
    orderId: z
      .string()
      .min(1, "Order ID is required"),
  }),
});