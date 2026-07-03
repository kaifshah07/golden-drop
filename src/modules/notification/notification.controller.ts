import { Request, Response } from "express";
import { NotificationService } from "./notification.service";

export class NotificationController {
  static async getAll(req: any, res: Response) {
    try {
      const notifications =
        await NotificationService.getUserNotifications(
          Number(req.user.userId)
        );

      return res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async markRead(req: Request, res: Response) {
    try {
      const notification =
        await NotificationService.markAsRead(
          Number(req.params.id)
        );

      return res.status(200).json({
        success: true,
        data: notification,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await NotificationService.deleteNotification(
        Number(req.params.id)
      );

      return res.status(200).json({
        success: true,
        message: "Notification deleted",
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}