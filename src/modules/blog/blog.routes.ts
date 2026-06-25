import { Router } from "express";
import { BlogController } from "./blog.controller";
import { validate } from "../../middleware/validate.middleware";
import { createBlogSchema } from "./blog.validator";
import { authenticate } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/admin.middleware";

const router = Router();

// Public
router.get("/", BlogController.getAll);
router.get("/:slug", BlogController.getBySlug);

// Admin only
router.post(
  "/",
  authenticate,
  adminOnly,
  validate(createBlogSchema),
  BlogController.create
);

router.delete(
  "/:id",
  authenticate,
  adminOnly,
  BlogController.delete
);

export default router;