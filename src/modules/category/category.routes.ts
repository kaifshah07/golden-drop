import { Router } from "express";
import { CategoryController } from "./category.controller";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validator";

import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";

const router = Router();

/**
 * PUBLIC ROUTES
 */

// Get all categories
router.get("/", CategoryController.getAll);

// Get category by ID
router.get("/:id", CategoryController.getById);

/**
 * ADMIN ROUTES
 */

// Create category
router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  validate(createCategorySchema),
  CategoryController.create
);

// Update category
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  validate(updateCategorySchema),
  CategoryController.update
);

// Delete category
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  CategoryController.delete
);

export default router;