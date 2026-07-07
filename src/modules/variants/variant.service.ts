import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/AppError";

interface CreateVariantInput {
  productId: number;
  sku: string;
  size: string;
  price: number;
  salePrice?: number;
  stock: number;
  weight?: number;
}

export class VariantService {
  // ➕ CREATE VARIANT
  static async createVariant(data: CreateVariantInput) {
    const product = await prisma.product.findUnique({
      where: { id: BigInt(data.productId) },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const existingSku = await prisma.productVariant.findUnique({
      where: { sku: data.sku },
    });

    if (existingSku) {
      throw new AppError("SKU already exists", 409);
    }

    const variant = await prisma.productVariant.create({
      data: {
        productId: BigInt(data.productId),
        sku: data.sku,
        size: data.size,
        price: data.price,
        salePrice: data.salePrice,
        stock: data.stock,
        weight: data.weight,
      },
    });

    return variant;
  }

  // 📦 GET VARIANTS BY PRODUCT
  static async getAllVariants() {
  return prisma.productVariant.findMany({
    include: {
      product: true,
    },
  });
}
  static async getVariantsByProduct(productId: number) {
    return prisma.productVariant.findMany({
      where: {
        productId: BigInt(productId),
      },
    });
  }

 // 🔄 UPDATE STOCK
static async updateStock(variantId: number, stock: number) {
  const variant = await prisma.productVariant.findUnique({
    where: { id: BigInt(variantId) },
  });

  if (!variant) {
    throw new AppError("Variant not found", 404);
  }

  const updatedVariant = await prisma.productVariant.update({
    where: {
      id: BigInt(variantId),
    },
    data: {
      stock,
    },
  });

  if (stock <= 10) {
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (admin) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: "Low Stock Alert",
          message: `${updatedVariant.sku} has only ${stock} items remaining.`,
          isRead: false,
        },
      });
    }
  }

  return updatedVariant;
}

  // 📉 DECREASE STOCK (used later in orders)
  static async decreaseStock(variantId: number, quantity: number) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: BigInt(variantId) },
    });

    if (!variant) {
      throw new AppError("Variant not found", 404);
    }

    if (variant.stock < quantity) {
      throw new AppError("Insufficient stock", 400);
    }

    return prisma.productVariant.update({
      where: { id: BigInt(variantId) },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }
}