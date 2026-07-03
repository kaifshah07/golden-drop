import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { generateInvoice } from "../../utils/invoice";

export class OrderController {
  // 🛒 CREATE ORDER
  static async createOrder(req: Request, res: Response) {
  try {
    const userId = Number((req as any).user.userId);

    const order = await OrderService.createOrder(
      userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

  // 📦 GET USER ORDERS
  static async getUserOrders(req: Request, res: Response) {
    try {
      const userId = Number((req as any).user.userId);

      const orders = await OrderService.getUserOrders(userId);

      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  // 🔍 GET ORDER BY ID
  static async getOrderById(req: Request, res: Response) {
    try {
      const userId = Number((req as any).user.userId);
      const orderId = Number(req.params.id);

      const order = await OrderService.getOrderById(userId, orderId);

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  // 🔄 UPDATE ORDER STATUS
  static async updateStatus(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.id);
      const { status } = req.body;

      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        status
      );

      return res.status(200).json({
        success: true,
        message: "Order status updated",
        data: updatedOrder,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  // ❌ CANCEL ORDER
  static async cancel(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.id);

      const order = await OrderService.cancelOrder(orderId);

      return res.status(200).json({
        success: true,
        message: "Order cancelled",
        data: order,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
  static async invoice(
  req: Request,
  res: Response
) {

  const order =
    await OrderService.getInvoice(
      Number(req.params.id)
    );

  const pdf =
    generateInvoice(order);

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order.orderNumber}.pdf`
  );

  pdf.pipe(res);

  pdf.end();

}
}