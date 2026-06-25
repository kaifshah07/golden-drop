import { Router } from "express";
import { ReviewController } from "./review.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createReviewSchema } from "./review.validator";

const router = Router();

// Add review
router.post(
  "/",
  authenticate,
  validate(createReviewSchema),
  ReviewController.create
);

// Get product reviews
router.get(
  "/product/:productId",
  ReviewController.getByProduct
);

// Delete review
router.delete(
  "/:id",
  authenticate,
  ReviewController.delete
);

export default router;