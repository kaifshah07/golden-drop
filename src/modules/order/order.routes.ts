import { Router } from "express";
import { OrderController } from "./order.controller";

import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// 🛒 PLACE ORDER
router.post("/", authenticate, OrderController.createOrder);

// 📦 USER ORDERS
router.get("/", authenticate, OrderController.getUserOrders);

// 🔍 SINGLE ORDER
router.get("/:id", authenticate, OrderController.getOrderById);

export default router;