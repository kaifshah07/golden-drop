import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/AppError";

export class OrderService {
  // 🛒 CREATE ORDER (FROM CART)
  static async createOrder(userId: number) {
    const cart = await prisma.cart.findUnique({
      where: { userId: BigInt(userId) },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    // 🔥 STEP 1: Validate stock
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for SKU ${item.variant.sku}`,
          400
        );
      }
    }

    // 💰 STEP 2: Calculate total
    let totalAmount = 0;

    for (const item of cart.items) {
      const price =
        Number(item.variant.salePrice ?? item.variant.price);

      totalAmount += price * item.quantity;
    }

    // 📦 STEP 3: Create order
    const order = await prisma.order.create({
      data: {
        userId: BigInt(userId),
        totalAmount,
        status: "PENDING",
      },
    });

    // 📦 STEP 4: Create order items
    for (const item of cart.items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: Number(item.variant.salePrice ?? item.variant.price),
        },
      });

      // 📉 STEP 5: Decrease stock
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // 🧹 STEP 6: Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  }

  // 📦 GET USER ORDERS
  static async getUserOrders(userId: number) {
    return prisma.order.findMany({
      where: { userId: BigInt(userId) },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // 🔍 GET SINGLE ORDER
  static async getOrderById(userId: number, orderId: number) {
    const order = await prisma.order.findFirst({
      where: {
        id: BigInt(orderId),
        userId: BigInt(userId),
      },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return order;
  }
}