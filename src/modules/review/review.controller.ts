import { Request, Response } from "express";
import { ReviewService } from "./review.service";

export class ReviewController {

  static async create(req: any, res: Response) {
    try {
      const userId = req.user.id;

      const review = await ReviewService.addReview(
        userId,
        req.body
      );

      return res.json({
        success: true,
        message: "Review added",
        data: review,
      });

    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async getByProduct(req: any, res: Response) {
    try {
      const productId = Number(req.params.productId);

      const reviews =
        await ReviewService.getProductReviews(productId);

      return res.json({
        success: true,
        data: reviews,
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async delete(req: any, res: Response) {
    try {
      const reviewId = Number(req.params.id);
      const userId = req.user.id;

      const result =
        await ReviewService.deleteReview(reviewId, userId);

      return res.json({
        success: true,
        message: "Review deleted",
        data: result,
      });

    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}