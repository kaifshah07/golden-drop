import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ProductService } from "./product.service";
import { sendResponse } from "../../utils/apiResponse";

export class ProductController {
  static createProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  });

  static getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductService.getAllProducts();

    res.status(200).json({
      success: true,
      data: products,
    });
  });

  static getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.getProductById(
      Number(req.params.id)
    );

    res.status(200).json({
      success: true,
      data: product,
    });
    sendResponse(res, {
    data: product,
    });
  });
}
