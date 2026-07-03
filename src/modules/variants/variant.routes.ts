import { Router } from "express";
import { VariantController } from "./variant.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";

const router = Router();

router.get("/", VariantController.getAll);
// 📦 GET VARIANTS (PUBLIC)
router.get("/product/:productId", VariantController.getByProduct);

// 🔐 ADMIN ONLY
router.post(
  "/",  
  authenticate,
  authorize(["ADMIN"]),
  VariantController.createVariant
);

router.patch(
  "/stock",
  authenticate,
  authorize(["ADMIN"]),
  VariantController.updateStock
);

export default router;