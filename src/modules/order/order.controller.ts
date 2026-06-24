import { Request, Response } from "express";
import { OrderService } from "./order.service";

export class OrderController {
  // 🛒 CREATE ORDER
  static async createOrder(req: Request, res: Response) {
    const userId = Number(req.user!.userId);

    const order = await OrderService.createOrder(userId);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  }

  // 📦 GET USER ORDERS
  static async getUserOrders(req: Request, res: Response) {
    const userId = Number(req.user!.userId);

    const orders = await OrderService.getUserOrders(userId);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  }

  // 🔍 GET ORDER BY ID
  static async getOrderById(req: Request, res: Response) {
    const userId = Number(req.user!.userId);
    const orderId = Number(req.params.id);

    const order = await OrderService.getOrderById(userId, orderId);

    return res.status(200).json({
      success: true,
      data: order,
    });
  }
}