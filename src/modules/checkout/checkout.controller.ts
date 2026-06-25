import { Request, Response } from "express";
import { CheckoutService } from "./checkout.service";

export class CheckoutController {
  static async create(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const { addressId } = req.body;

      const order = await CheckoutService.createCheckout(userId, addressId);

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}