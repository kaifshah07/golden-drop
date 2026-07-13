import { prisma } from "../../config/prisma";

export class SearchService {
  static async search(query: string) {
    const keyword = query.trim();

    const [products, categories, blogs] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: keyword,
              },
            },
            {
              shortDescription: {
                contains: keyword,
              },
            },
            {
              description: {
                contains: keyword,
              },
            },
          ],
        },
        include: {
          category: true,
          variants: true,
        },
      }),

      prisma.category.findMany({
        where: {
          OR: [
            {
              name: {
                contains: keyword,
              },
            },
            {
              description: {
                contains: keyword,
              },
            },
          ],
        },
      }),

      prisma.blog.findMany({
        where: {
          OR: [
            {
              title: {
                contains: keyword,
              },
            },
            {
              content: {
                contains: keyword,
              },
            },
          ],
        },
      }),
    ]);

    return {
      products,
      categories,
      blogs,
    };
  }
}