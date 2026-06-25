import { Request, Response } from "express";
import { CouponService } from "./coupon.service";

export class CouponController {

  static async apply(req: any, res: Response) {
    try {
      const { code, cartTotal } = req.body;

      const result = await CouponService.validateCoupon(
        code,
        cartTotal
      );

      return res.json({
        success: true,
        message: "Coupon applied successfully",
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