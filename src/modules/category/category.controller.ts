import { Request, Response } from "express";
import { CategoryService } from "./category.service";

export class CategoryController {
  // CREATE CATEGORY
  static async create(req: Request, res: Response) {
    try {
      const category = await CategoryService.createCategory(req.body);

      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // GET ALL CATEGORIES
  static async getAll(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getCategories();

      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // GET CATEGORY BY ID
  static async getById(req: Request, res: Response) {
    try {
      const category = await CategoryService.getCategory(
        Number(req.params.id)
      );

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // UPDATE CATEGORY
  static async update(req: Request, res: Response) {
    try {
      const category = await CategoryService.updateCategory(
        Number(req.params.id),
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // DELETE CATEGORY
  static async delete(req: Request, res: Response) {
    try {
      await CategoryService.deleteCategory(Number(req.params.id));

      return res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }
}