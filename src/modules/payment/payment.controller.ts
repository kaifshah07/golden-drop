import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {
  /**
   * ===========================================
   * CREATE PAYMENT ORDER
   * ===========================================
   */
  static async createOrder(
    req: Request,
    res: Response
  ) {
    try {
      const { orderId } = req.body;

      const paymentOrder =
        await PaymentService.createPaymentOrder(
          BigInt(orderId)
        );

      return res.status(201).json({
        success: true,
        message: "Payment order created successfully",
        data: paymentOrder,
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * ===========================================
   * VERIFY PAYMENT
   * ===========================================
   */
  static async verify(
    req: Request,
    res: Response
  ) {
    try {
      const result =
        await PaymentService.verifyPayment(req.body);

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: result,
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * ===========================================
   * RAZORPAY WEBHOOK
   * ===========================================
   */
  static async webhook(
    req: Request,
    res: Response
  ) {
    try {
      const signature = req.headers[
        "x-razorpay-signature"
      ] as string;

      await PaymentService.handleWebhook(
        req.body,
        signature
      );

      return res.status(200).json({
        success: true,
        message: "Webhook processed successfully",
      });
    } catch (err: any) {
      return res.status(err.statusCode || 400).json({
        success: false,
        message: err.message,
      });
    }
  }

  /**
   * ===========================================
   * REFUND PAYMENT
   * ===========================================
   */
  static async refund(
    req: Request,
    res: Response
  ) {
    try {
      const { orderId } = req.body;

      const refund =
        await PaymentService.refundPayment(
          BigInt(orderId)
        );

      return res.status(200).json({
        success: true,
        message: "Refund processed successfully",
        data: refund,
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }
}