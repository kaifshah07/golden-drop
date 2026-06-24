import { Request, Response } from "express";
import { CartService } from "./cart.service";

export class CartController {
  // ➕ ADD TO CART
  static async addToCart(req: Request, res: Response) {
    const userId = Number(req.user!.userId);
    const { variantId, quantity } = req.body;

    const item = await CartService.addToCart(
      userId,
      Number(variantId),
      quantity
    );

    return res.status(201).json({
      success: true,
      message: "Added to cart",
      data: item,
    });
  }

  // 📦 GET CART
  static async getCart(req: Request, res: Response) {
    const userId = Number(req.user!.userId);

    const cart = await CartService.getCart(userId);

    return res.status(200).json({
      success: true,
      data: cart,
    });
  }

  // ❌ REMOVE ITEM
  static async removeItem(req: Request, res: Response) {
    const userId = Number(req.user!.userId);
    const itemId = Number(req.params.itemId);

    const result = await CartService.removeItem(userId, itemId);

    return res.status(200).json({
      success: true,
      message: "Item removed",
      data: result,
    });
  }

  // 🧹 CLEAR CART
  static async clearCart(req: Request, res: Response) {
    const userId = Number(req.user!.userId);

    await CartService.clearCart(userId);

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  }
}