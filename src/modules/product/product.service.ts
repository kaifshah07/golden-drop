import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/AppError";

interface CreateProductInput {
  categoryId: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  benefits?: string;
  featuredImage?: string;
}

export class ProductService {
  static async createProduct(data: CreateProductInput) {
    const category = await prisma.category.findUnique({
      where: {
        id: BigInt(data.categoryId),
      },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingProduct) {
      throw new AppError("Product slug already exists", 409);
    }

    return prisma.product.create({
      data: {
        categoryId: BigInt(data.categoryId),

        name: data.name,
        slug: data.slug,

        shortDescription: data.shortDescription,
        description: data.description,
        benefits: data.benefits,
        featuredImage: data.featuredImage,
      },
    });
  }

  static async getAllProducts() {
    return prisma.product.findMany({
      include: {
        category: true,
        variants: true,
      },
    });
  }

  static async getProductById(id: number) {
    const product = await prisma.product.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }
}