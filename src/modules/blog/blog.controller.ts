import { Request, Response } from "express";
import { BlogService } from "./blog.service";

export class BlogController {

  static async create(req: any, res: Response) {
    try {
      const blog = await BlogService.createBlog(req.body);

      return res.json({
        success: true,
        message: "Blog created",
        data: blog,
      });

    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async getAll(req: any, res: Response) {
    try {
      const blogs = await BlogService.getAllBlogs();

      return res.json({
        success: true,
        data: blogs,
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async getBySlug(req: any, res: Response) {
    try {
      const blog = await BlogService.getBySlug(req.params.slug);

      return res.json({
        success: true,
        data: blog,
      });

    } catch (err: any) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async delete(req: any, res: Response) {
    try {
      await BlogService.deleteBlog(Number(req.params.id));

      return res.json({
        success: true,
        message: "Blog deleted",
      });

    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}