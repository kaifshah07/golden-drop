import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {
  // 💰 CREATE PAYMENT ORDER
  static async createOrder(req: Request, res: Response) {
    const { orderId, amount } = req.body;

    const paymentOrder = await PaymentService.createPaymentOrder(
      Number(orderId),
      amount
    );

    return res.status(201).json({
      success: true,
      data: paymentOrder,
    });
  }

  // 🔐 VERIFY PAYMENT
  static async verifyPayment(req: Request, res: Response) {
    const result = await PaymentService.verifyPayment(req.body);

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: result,
    });
  }
}