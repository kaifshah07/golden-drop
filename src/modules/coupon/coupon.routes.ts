import { Router } from "express";
import { CouponController } from "./coupon.controller";
import { validate } from "../../middleware/validate.middleware";
import { applyCouponSchema } from "./coupon.validator";

const router = Router();

router.post(
  "/apply",
  validate(applyCouponSchema),
  CouponController.apply
);

export default router;