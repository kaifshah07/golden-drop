import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/AppError";

export class CartService {
  // 🛒 ADD TO CART
  static async addToCart(userId: number, variantId: number, quantity: number) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: BigInt(variantId) },
    });

    if (!variant) {
      throw new AppError("Product variant not found", 404);
    }

    if (variant.stock < quantity) {
      throw new AppError("Insufficient stock", 400);
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: BigInt(userId) },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: BigInt(userId),
        },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId: BigInt(variantId),
      },
    });

    // 🔁 If item exists → update quantity
    if (existingItem) {
      const newQty = existingItem.quantity + quantity;

      if (variant.stock < newQty) {
        throw new AppError("Not enough stock for requested quantity", 400);
      }

      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    }

    // ➕ New cart item
    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId: BigInt(variantId),
        quantity,
      },
    });
  }

  // 📦 GET CART
  static async getCart(userId: number) {
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

    return cart;
  }

  // ❌ REMOVE ITEM
  static async removeItem(userId: number, itemId: number) {
    const item = await prisma.cartItem.findUnique({
      where: { id: BigInt(itemId) },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== BigInt(userId)) {
      throw new AppError("Item not found", 404);
    }

    return prisma.cartItem.delete({
      where: { id: BigInt(itemId) },
    });
  }

  // 🧹 CLEAR CART
  static async clearCart(userId: number) {
    const cart = await prisma.cart.findUnique({
      where: { userId: BigInt(userId) },
    });

    if (!cart) return true;

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return true;
  }
}