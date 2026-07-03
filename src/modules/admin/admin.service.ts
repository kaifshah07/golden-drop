import { prisma } from "../../prisma/client";

export class AdminService {
  static async getDashboard() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      totalCoupons,
      totalBlogs,
      pendingOrders,
      deliveredOrders,
      paidOrders,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.product.count(),

      prisma.order.count(),

      prisma.category.count(),

      prisma.coupon.count(),

      prisma.blog.count(),

      prisma.order.count({
        where: {
          orderStatus: "PENDING",
        },
      }),

      prisma.order.count({
        where: {
          orderStatus: "DELIVERED",
        },
      }),

      prisma.payment.count({
        where: {
          paymentStatus: "PAID",
        },
      }),

      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          paymentStatus: "PAID",
        },
      }),
    ]);

    return {
      totalUsers,

      totalProducts,

      totalOrders,

      totalCategories,

      totalCoupons,

      totalBlogs,

      pendingOrders,

      deliveredOrders,

      paidOrders,

      totalRevenue:
        totalRevenue._sum.amount || 0,
    };
  }
  static async getRecentOrders() {
  return prisma.order.findMany({
    take: 10,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      payment: true,

      items: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
}

static async getLowStockProducts() {
  return prisma.productVariant.findMany({
    where: {
      stock: {
        lte: 10,
      },
    },

    orderBy: {
      stock: "asc",
    },

    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          featuredImage: true,
        },
      },
    },
  });
}
static async getTopSellingProducts() {
  const topProducts = await prisma.orderItem.groupBy({
    by: ["productVariantId"],

    _sum: {
      quantity: true,
      totalPrice: true,
    },

    _count: {
      orderId: true,
    },

    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },

    take: 10,
  });

  const result = await Promise.all(
    topProducts.map(async (item) => {
      const variant = await prisma.productVariant.findUnique({
        where: {
          id: item.productVariantId,
        },

        include: {
          product: true,
        },
      });

      return {
        variantId: item.productVariantId,
        product: variant?.product,
        sku: variant?.sku,
        size: variant?.size,
        quantitySold: item._sum.quantity || 0,
        revenue: item._sum.totalPrice || 0,
        totalOrders: item._count.orderId,
      };
    })
  );

  return result;
}

static async getMonthlySales() {
  const currentYear = new Date().getFullYear();

  const monthlySales = await prisma.payment.groupBy({
    by: ["createdAt"],

    where: {
      paymentStatus: "PAID",
      createdAt: {
        gte: new Date(`${currentYear}-01-01`),
        lt: new Date(`${currentYear + 1}-01-01`),
      },
    },

    _sum: {
      amount: true,
    },
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const result = months.map((month, index) => ({
    month,
    revenue: 0,
  }));

  monthlySales.forEach((sale) => {
    const monthIndex = new Date(sale.createdAt).getMonth();

    result[monthIndex].revenue = Number(
      sale._sum.amount || 0
    );
  });

  return result;
}

static async getAllUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });
}

static async getUserById(userId: number) {
  return prisma.user.findUnique({
    where: {
      id: BigInt(userId),
    },

    include: {
      addresses: true,
      orders: true,
      reviews: true,
    },
  });
}

static async deleteUser(userId: number) {
  return prisma.user.delete({
    where: {
      id: BigInt(userId),
    },
  });
}

static async changeUserRole(
  userId: number,
  role: "CUSTOMER" | "ADMIN" | "SELLER"
) {
  return prisma.user.update({
    where: {
      id: BigInt(userId),
    },

    data: {
      role,
    },
  });
}

static async getAllOrders() {
  return prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      user: true,
      address: true,
      payment: true,

      items: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
}
static async getOrder(orderId: number) {
  return prisma.order.findUnique({
    where: {
      id: BigInt(orderId),
    },

    include: {
      user: true,
      address: true,
      payment: true,

      items: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
}

static async updateOrderStatus(
  orderId: number,
  status: any
) {
  return prisma.order.update({
    where: {
      id: BigInt(orderId),
    },

    data: {
      orderStatus: status,
    },
  });
}

static async updatePaymentStatus(
  orderId: number,
  status: any
) {
  await prisma.payment.update({
    where: {
      orderId: BigInt(orderId),
    },

    data: {
      paymentStatus: status,
    },
  });

  return prisma.order.update({
    where: {
      id: BigInt(orderId),
    },

    data: {
      paymentStatus: status,
    },
  });
}

static async getSalesReport() {
  return prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      payment: true,
    },
  });
}

static async getCustomerReport() {
  return prisma.user.findMany({
    include: {
      orders: true,
      addresses: true,
      reviews: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

static async getProductReport() {
  return prisma.product.findMany({
    include: {
      category: true,
      variants: true,
      reviews: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}


}