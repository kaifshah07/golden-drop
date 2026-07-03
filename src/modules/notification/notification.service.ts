import { prisma } from "../../prisma/client";

export class NotificationService {
  static async createNotification(
    userId: number,
    title: string,
    message: string
  ) {
    return prisma.notification.create({
      data: {
        userId: BigInt(userId),
        title,
        message,
      },
    });
  }

  static async getUserNotifications(userId: number) {
    return prisma.notification.findMany({
      where: {
        userId: BigInt(userId),
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async markAsRead(id: number) {
    return prisma.notification.update({
      where: {
        id: BigInt(id),
      },

      data: {
        isRead: true,
      },
    });
  }

  static async deleteNotification(id: number) {
    return prisma.notification.delete({
      where: {
        id: BigInt(id),
      },
    });
  }
}