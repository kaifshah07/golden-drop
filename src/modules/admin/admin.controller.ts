import { Request, Response } from "express";
import { AdminService } from "./admin.service";

export class AdminController {

  static async dashboard(req: any, res: Response) {
    try {
      const data =
        await AdminService.getDashboardStats();

      return res.json({
        success: true,
        data,
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }


  static async orders(req: any, res: Response) {
    try {
      const orders =
        await AdminService.getAllOrders();

      return res.json({
        success: true,
        data: orders,
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }


  static async users(req: any, res: Response) {
    try {
      const users =
        await AdminService.getAllUsers();

      return res.json({
        success: true,
        data: users,
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}