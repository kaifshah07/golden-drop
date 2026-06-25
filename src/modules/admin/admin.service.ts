import { prisma } from "../../prisma/client";

export class AdminService {

  // Dashboard summary
  static async getDashboardStats() {

    const totalUsers =
      await prisma.user.count();

    const totalOrders =
      await prisma.order.count();

    const totalRevenue =
      await prisma.order.aggregate({
        _sum: {
          totalAmount: true
        }
      });

    const pendingOrders =
      await prisma.order.count({
        where: {
          orderStatus: "PENDING"
        }
      });

    return {
      totalUsers,
      totalOrders,
      totalRevenue:
        totalRevenue._sum.totalAmount || 0,
      pendingOrders
    };
  }


  // Get all orders
  static async getAllOrders() {

    return prisma.order.findMany({
      include: {
        user: true,
        items: true,
        address: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }


  // Get all users
  static async getAllUsers() {

    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}