import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/AppError";

export class BlogService {

  // CREATE BLOG
  static async createBlog(data: any) {
    return prisma.blog.create({
      data,
    });
  }

  // GET ALL BLOGS
  static async getAllBlogs() {
    return prisma.blog.findMany({
      where: { status: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // GET BLOG BY SLUG
  static async getBySlug(slug: string) {
    const blog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog) {
      throw new AppError("Blog not found", 404);
    }

    return blog;
  }

  // DELETE BLOG
  static async deleteBlog(id: number) {
    return prisma.blog.delete({
      where: { id: BigInt(id) },
    });
  }
}