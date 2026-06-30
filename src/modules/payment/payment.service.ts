import crypto from "crypto";
import { prisma } from "../../prisma/client";
import { razorpay } from "../../config/razorpay";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";

export class PaymentService {

  /**
   * ======================================================
   * CREATE PAYMENT ORDER
   * ======================================================
   */
  static async createPaymentOrder(orderId: bigint) {

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.paymentStatus === "PAID") {
      throw new AppError(
        "Payment already completed",
        400
      );
    }

    const existingPayment =
      await prisma.payment.findUnique({
        where: {
          orderId,
        },
      });

    // Reuse existing pending Razorpay order
    if (
      existingPayment &&
      existingPayment.paymentStatus === "PENDING" &&
      existingPayment.transactionId
    ) {
      return {
        id: existingPayment.transactionId,
        amount: Number(existingPayment.amount) * 100,
        currency: "INR",
        receipt: order.orderNumber,
      };
    }

    const razorpayOrder =
      await razorpay.orders.create({
        amount: Math.round(
          Number(order.totalAmount) * 100
        ),
        currency: "INR",
        receipt: order.orderNumber,
      });

    if (existingPayment) {

      await prisma.payment.update({
        where: {
          id: existingPayment.id,
        },
        data: {
          transactionId: razorpayOrder.id,
          paymentStatus: "PENDING",
          amount: order.totalAmount,
        },
      });

    } else {

      await prisma.payment.create({
        data: {
          orderId: order.id,
          paymentGateway: "RAZORPAY",
          transactionId: razorpayOrder.id,
          amount: order.totalAmount,
          paymentStatus: "PENDING",
        },
      });

    }

    return razorpayOrder;
  }

    /**
   * ======================================================
   * VERIFY PAYMENT
   * ======================================================
   */
  static async verifyPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = data;

    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_SECRET)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new AppError(
        "Invalid payment signature",
        400
      );
    }

    const payment = await prisma.payment.findFirst({
      where: {
        transactionId: razorpay_order_id,
      },
    });

    if (!payment) {
      throw new AppError(
        "Payment record not found",
        404
      );
    }

    // Already verified
    if (payment.paymentStatus === "PAID") {
      return payment;
    }

    const updatedPayment =
      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          paymentId: razorpay_payment_id,
          paymentStatus: "PAID",
        },
      });

    await prisma.order.update({
      where: {
        id: payment.orderId,
      },
      data: {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
      },
    });

    return updatedPayment;
  }

    /**
   * ======================================================
   * HANDLE RAZORPAY WEBHOOK
   * ======================================================
   */
  static async handleWebhook(
    payload: Buffer,
    signature: string
  ) {

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        env.RAZORPAY_WEBHOOK_SECRET
      )
      .update(payload)
      .digest("hex");

    if (expectedSignature !== signature) {
      throw new AppError(
        "Invalid webhook signature",
        400
      );
    }

    const body = JSON.parse(payload.toString());

    switch (body.event) {

      case "payment.captured": {

        const entity =
          body.payload.payment.entity;

        const payment =
          await prisma.payment.findFirst({
            where: {
              transactionId: entity.order_id,
            },
          });

        if (!payment) return true;

        await prisma.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            paymentId: entity.id,
            paymentStatus: "PAID",
          },
        });

        await prisma.order.update({
          where: {
            id: payment.orderId,
          },
          data: {
            paymentStatus: "PAID",
            orderStatus: "CONFIRMED",
          },
        });

        break;
      }

      case "payment.failed": {

        const entity =
          body.payload.payment.entity;

        const payment =
          await prisma.payment.findFirst({
            where: {
              transactionId: entity.order_id,
            },
          });

        if (!payment) return true;

        await prisma.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            paymentStatus: "FAILED",
          },
        });

        await prisma.order.update({
          where: {
            id: payment.orderId,
          },
          data: {
            paymentStatus: "FAILED",
          },
        });

        break;
      }

      default:
        break;
    }

    return true;
  } 
    /**
   * ======================================================
   * REFUND PAYMENT
   * ======================================================
   */
  static async refundPayment(orderId: bigint) {

    const payment = await prisma.payment.findUnique({
      where: {
        orderId,
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new AppError(
        "Payment not found",
        404
      );
    }

    if (payment.paymentStatus !== "PAID") {
      throw new AppError(
        "Only paid payments can be refunded",
        400
      );
    }

    if (!payment.paymentId) {
      throw new AppError(
        "Razorpay payment id not found",
        400
      );
    }

    const refund = await razorpay.payments.refund(
      payment.paymentId,
      {
        amount: Math.round(
          Number(payment.amount) * 100
        ),
      }
    );

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        paymentStatus: "REFUNDED",
      },
    });

    await prisma.order.update({
      where: {
        id: payment.orderId,
      },
      data: {
        paymentStatus: "REFUNDED",
        orderStatus: "CANCELLED",
      },
    });

    return refund;
  }

}
