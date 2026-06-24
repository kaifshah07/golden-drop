import crypto from "crypto";
import { razorpay } from "../../config/razorpay";
import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/AppError";

export class PaymentService {
  // 💰 CREATE PAYMENT ORDER
  static async createPaymentOrder(orderId: number, amount: number) {
    const order = await prisma.order.findUnique({
      where: { id: BigInt(orderId) },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `order_${orderId}`,
    });

    return razorpayOrder;
  }

  // 🔐 VERIFY PAYMENT
  static async verifyPayment(data: {
    orderId: number;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const body = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== data.razorpay_signature) {
      throw new AppError("Invalid payment signature", 400);
    }

    // 💳 Update order as PAID
    const updatedOrder = await prisma.order.update({
      where: { id: BigInt(data.orderId) },
      data: {
        status: "PAID",
      },
    });

    return updatedOrder;
  }
}