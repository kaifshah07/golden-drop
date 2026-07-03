import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/AppError";

interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
}

export class CategoryService {
  // CREATE
  static async createCategory(data: CreateCategoryInput) {
    const exists = await prisma.category.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (exists) {
      throw new AppError("Category already exists", 409);
    }

    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
      },
    });
  }

  // GET ALL
  static async getCategories() {
    return prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // GET ONE
  static async getCategory(id: number) {
    const category = await prisma.category.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;
  }

  // UPDATE
  static async updateCategory(id: number, data: Partial<CreateCategoryInput>) {
    await this.getCategory(id);

    return prisma.category.update({
      where: {
        id: BigInt(id),
      },
      data,
    });
  }

  // DELETE
  static async deleteCategory(id: number) {
    await this.getCategory(id);

    return prisma.category.delete({
      where: {
        id: BigInt(id),
      },
    });
  }
}