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

  static async getAllProducts(query: any) {

  const page = Number(query.page) || 1;

  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  const where: any = {
    status: true,
  };

  if (query.search) {
    where.name = {
      contains: query.search,
    };
  }

  if (query.categoryId) {
    where.categoryId = BigInt(query.categoryId);
  }

  if (query.minPrice || query.maxPrice) {
    where.variants = {
      some: {
        price: {
          gte: query.minPrice
            ? Number(query.minPrice)
            : undefined,

          lte: query.maxPrice
            ? Number(query.maxPrice)
            : undefined,
        },
      },
    };
  }

  let orderBy: any = {
    createdAt: "desc",
  };

  if (query.sort === "priceAsc") {
    orderBy = {
      variants: {
        _count: "asc",
      },
    };
  }

  if (query.sort === "priceDesc") {
    orderBy = {
      variants: {
        _count: "desc",
      },
    };
  }

  const total = await prisma.product.count({
    where,
  });

  const products = await prisma.product.findMany({

    where,

    skip,

    take: limit,

    orderBy,

    include: {

      category: true,

      variants: true,

    },

  });

  return {

    total,

    page,

    limit,

    totalPages: Math.ceil(total / limit),

    products,

  };

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