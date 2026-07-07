import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/AppError";
import { CouponService } from "../coupon/coupon.service";
import { sendEmail } from "../../utils/email";
import { orderPlacedTemplate } from "../../templates/orderPlaced";
import { orderDeliveredTemplate } from "../../templates/orderDelivered";

export class OrderService {

  // 🛒 CREATE ORDER (WITH COUPON SUPPORT)
  static async createOrder(userId: number, data?: any) {

    const couponCode = data?.couponCode;
    const addressId = data?.addressId;

    // 1. Get cart
   const cart = await prisma.cart.findFirst({
  where: {
    userId: BigInt(userId),
  },
  include: {
    items: {
      include: {
        productVariant: true,
      },
    },
  },
});

    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    if (!addressId) {
      throw new AppError("Address is required", 400);
    }

    // 2. Validate stock
    for (const item of cart.items) {
      if (item.productVariant.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for SKU ${item.productVariant.sku}`,
          400
        );
      }
    }

    // 3. Calculate subtotal
    let subtotal = 0;

    for (const item of cart.items) {
      const price = Number(
        item.productVariant.salePrice ??
        item.productVariant.price
      );

      subtotal += price * item.quantity;
    }

    // 4. Coupon logic
    let discount = 0;
    let finalTotal = subtotal;

    if (couponCode) {
      const couponResult =
        await CouponService.validateCoupon(
          couponCode,
          subtotal
        );

      discount = couponResult.discount;
      finalTotal = couponResult.finalTotal;
    }

    // 5. Shipping (can upgrade later)
    const shippingCharge = 0;

    const totalAmount = finalTotal + shippingCharge;

    // 6. Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        userId: BigInt(userId),
        addressId: BigInt(addressId),

        subtotal,
        discount,
        shippingCharge,
        totalAmount,

        paymentStatus: "PENDING",
        orderStatus: "PENDING",
      },
    });

    // 7. Create order items + decrease stock
    for (const item of cart.items) {
      const price = Number(
        item.productVariant.salePrice ??
        item.productVariant.price
      );

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          unitPrice: price,
          totalPrice: price * item.quantity,
        },
      });

      await prisma.productVariant.update({
        where: { id: item.productVariantId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // 8. Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    await prisma.notification.create({
  data: {
    userId: order.userId,
    title: "Order Placed",
    message: `Your order ${order.orderNumber} has been placed successfully.`,
  },
});

const customer = await prisma.user.findUnique({
    where:{
        id: order.userId
    }
});

if(customer){

    await sendEmail(

        customer.email,

        "Order Placed Successfully",

        orderPlacedTemplate(
            customer.name,
            order.orderNumber
        )

    );

}

    return order;
  }

  // 📦 GET USER ORDERS
  static async getUserOrders(userId: number) {
    return prisma.order.findMany({
      where: { userId: BigInt(userId) },
      include: {
        items: {
          include: {
            productVariant: true,
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
            productVariant: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return order;
  }

  // 🔄 UPDATE ORDER STATUS
  static async updateOrderStatus(orderId: number, status: any) {
    const order = await prisma.order.findUnique({
      where: {
        id: BigInt(orderId),
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const allowedTransitions: any = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["PROCESSING", "CANCELLED"],
      PROCESSING: ["SHIPPED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };

    if (!allowedTransitions[order.orderStatus]?.includes(status)) {
      throw new AppError(
        `Cannot move order from ${order.orderStatus} to ${status}`,
        400
      );
    }

    return prisma.order.update({
      where: {
        id: BigInt(orderId),
      },
      data: {
        orderStatus: status,
      },
    });
  }

  // ❌ CANCEL ORDER
  static async cancelOrder(orderId: number) {
    const order = await prisma.order.findUnique({
      where: {
        id: BigInt(orderId),
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (
      order.orderStatus === "SHIPPED" ||
      order.orderStatus === "DELIVERED"
    ) {
      throw new AppError("Order cannot be cancelled", 400);
    }
    if (status === "DELIVERED") {

    const customer = await prisma.user.findUnique({
        where:{
            id: order.userId
        }
    });

    if(customer){

        await sendEmail(

            customer.email,

            "Order Delivered",

            orderDeliveredTemplate(
                customer.name,
                order.orderNumber
            )

        );

    }
}

    return prisma.order.update({
      where: {
        id: BigInt(orderId),
      },
      data: {
        orderStatus: "CANCELLED",
      },
    });
  }
  static async getInvoice(orderId: number) {

  const order = await prisma.order.findUnique({

    where: {
      id: BigInt(orderId),
    },

    include: {

      user: true,

      address: true,

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

  if (!order) {
    throw new AppError("Order not found",404);
  }

  return order;


}

}