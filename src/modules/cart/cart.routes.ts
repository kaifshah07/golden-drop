import { Router } from "express";
import { CartController } from "./cart.controller";

import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// 🛒 CART ROUTES (ALL AUTH REQUIRED)
router.post("/", authenticate, CartController.addToCart);

router.get("/", authenticate, CartController.getCart);

router.delete("/:itemId", authenticate, CartController.removeItem);

router.delete("/", authenticate, CartController.clearCart);

export default router;