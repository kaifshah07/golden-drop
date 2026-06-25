import { prisma } from "../../config/prisma";

export class CheckoutService {
  static async createCheckout(userId: number, addressId: number) {
    // 1. Get cart
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
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

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // 2. Validate address
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new Error("Invalid address");
    }

    // 3. Calculate totals
    let subtotal = 0;

    const orderItems = cart.items.map((item: any) => {
      const price = Number(item.productVariant.salePrice || item.productVariant.price);
      const total = price * item.quantity;

      subtotal += total;

      return {
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        unitPrice: price,
        totalPrice: total,
      };
    });

    const shippingCharge = subtotal > 500 ? 0 : 50;
    const discount = 0;
    const totalAmount = subtotal + shippingCharge - discount;

    // 4. Create order number
    const orderNumber = `ORD-${Date.now()}`;

    // 5. Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId,

        subtotal,
        shippingCharge,
        discount,
        totalAmount,

        paymentStatus: "PENDING",
        orderStatus: "PENDING",

        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // 6. Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  }
}