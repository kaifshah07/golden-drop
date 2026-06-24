import { Request, Response } from "express";
import { VariantService } from "./variant.service";

export class VariantController {
  // ➕ CREATE VARIANT
  static async createVariant(req: Request, res: Response) {
    const variant = await VariantService.createVariant(req.body);

    return res.status(201).json({
      success: true,
      message: "Variant created successfully",
      data: variant,
    });
  }

  // 📦 GET VARIANTS BY PRODUCT
  static async getByProduct(req: Request, res: Response) {
    const productId = Number(req.params.productId);

    const variants = await VariantService.getVariantsByProduct(productId);

    return res.status(200).json({
      success: true,
      data: variants,
    });
  }

  // 🔄 UPDATE STOCK
  static async updateStock(req: Request, res: Response) {
    const { variantId, stock } = req.body;

    const updated = await VariantService.updateStock(
      Number(variantId),
      stock
    );

    return res.status(200).json({
      success: true,
      message: "Stock updated",
      data: updated,
    });
  }
}