import crypto from "crypto";
import { prisma } from "../../prisma/client";
import { razorpay } from "../../config/razorpay";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";
import { sendEmail } from "../../utils/email";
import { paymentSuccessTemplate } from "../../templates/paymentSuccess";

export class PaymentService {

/**
 * ======================================================
 * CREATE PAYMENT ORDER
 * ======================================================
 */
static async createPaymentOrder(orderId: bigint) {

  try {

    console.log("======================================");
    console.log("PAYMENT ORDER API START");
    console.log("Received Order ID:", orderId.toString());

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    console.log("Fetched Order:");
    console.log(order);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    console.log("Checking existing payment...");

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

    console.log("Existing Payment:");
    console.log(existingPayment);

    // Reuse existing pending payment
    if (
      existingPayment &&
      existingPayment.paymentStatus === "PENDING" &&
      existingPayment.transactionId
    ) {

      console.log("Using existing Razorpay Order");

      return {
        id: existingPayment.transactionId,
        amount: Number(existingPayment.amount) * 100,
        currency: "INR",
        receipt: order.orderNumber,
      };
    }

    console.log("Creating Razorpay Order...");

    let razorpayOrder;

    try {

      razorpayOrder =
        await razorpay.orders.create({
          amount: Math.round(
            Number(order.totalAmount) * 100
          ),
          currency: "INR",
          receipt: order.orderNumber,
        });

      console.log("Razorpay Order Created Successfully");
      console.log(razorpayOrder);

    } catch (error) {

      console.error("======================================");
      console.error("RAZORPAY ERROR");
      console.error(error);
      console.error("======================================");

      throw error;
    }

    if (existingPayment) {

      console.log("Updating existing payment...");

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

      const customer =
        await prisma.user.findUnique({
          where: {
            id: order.userId,
          },
        });

      if (customer) {

        await sendEmail(
          customer.email,
          "Payment Successful",
          paymentSuccessTemplate(
            customer.name,
            order.orderNumber
          )
        );

      }

    } else {

      console.log("Creating payment record...");

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

    console.log("Payment Order API Completed Successfully");
    console.log("======================================");

    return razorpayOrder;

  } catch (error) {

    console.error("======================================");
    console.error("PAYMENT SERVICE ERROR");
    console.error(error);
    console.error("======================================");

    throw error;
  }
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

    const order = await prisma.order.findUnique({
  where: {
    id: payment.orderId,
  },
});

if (order) {
  await prisma.notification.create({
    data: {
      userId: order.userId,
      title: "Payment Successful",
      message: `Payment received for Order ${order.orderNumber}.`,
    },
  });
}

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
