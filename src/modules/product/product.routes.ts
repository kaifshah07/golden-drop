import { Router } from "express";
import { ProductController } from "./product.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";

import { validate } from "../../middleware/validate.middleware";
import { createProductSchema } from "./product.validator";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

// PUBLIC ROUTES

router.get("/", ProductController.getAllProducts);

router.get("/:id", ProductController.getProductById);

// ADMIN ONLY

router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  upload.single("image"),
  ProductController.createProduct
);


export default router;