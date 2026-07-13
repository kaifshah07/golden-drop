import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

export class CartService {

  // ==============================
  // ADD TO CART
  // ==============================
  static async addToCart(
    userId: number,
    variantId: number,
    quantity: number
  ) {

    const variant =
      await prisma.productVariant.findUnique({

        where: {
          id: BigInt(variantId),
        },

      });

    if (!variant) {
      throw new AppError(
        "Product variant not found",
        404
      );
    }

    if (variant.stock < quantity) {
      throw new AppError(
        "Insufficient stock",
        400
      );
    }

    let cart =
      await prisma.cart.findFirst({

        where: {
          userId: BigInt(userId),
        },

      });

    if (!cart) {

      cart =
        await prisma.cart.create({

          data: {
            userId: BigInt(userId),
          },

        });

    }

    const existingItem =
      await prisma.cartItem.findFirst({

        where: {

          cartId: cart.id,

          productVariantId:
            BigInt(variantId),

        },

      });

    if (existingItem) {

      const newQuantity =
        existingItem.quantity + quantity;

      if (newQuantity > variant.stock) {

        throw new AppError(
          "Not enough stock",
          400
        );

      }

      return prisma.cartItem.update({

        where: {
          id: existingItem.id,
        },

        data: {
          quantity: newQuantity,
        },

      });

    }

    return prisma.cartItem.create({

      data: {

        cartId: cart.id,

        productVariantId:
          BigInt(variantId),

        quantity,

      },

    });

  }

  // ==============================
  // GET CART
  // ==============================
  static async getCart(userId: number) {

    return prisma.cart.findFirst({

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

  }

  // ==============================
  // REMOVE ITEM
  // ==============================
  static async removeItem(
    userId: number,
    itemId: number
  ) {

    const item =
      await prisma.cartItem.findUnique({

        where: {
          id: BigInt(itemId),
        },

        include: {
          cart: true,
        },

      });

    if (
      !item ||
      item.cart.userId !== BigInt(userId)
    ) {

      throw new AppError(
        "Item not found",
        404
      );

    }

    return prisma.cartItem.delete({

      where: {
        id: BigInt(itemId),
      },

    });

  }

  // ==============================
  // CLEAR CART
  // ==============================
  static async clearCart(userId: number) {

    const cart =
      await prisma.cart.findFirst({

        where: {
          userId: BigInt(userId),
        },

      });

    if (!cart) {
      return true;
    }

    await prisma.cartItem.deleteMany({

      where: {
        cartId: cart.id,
      },

    });

    return true;

  }

}