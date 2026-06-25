import { Router } from "express";
import { OrderController } from "./order.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { updateOrderStatusSchema } from "./order.validator";

// ⚠️ FIX: import authorize middleware
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

// 🛒 PLACE ORDER
router.post("/", authenticate, OrderController.createOrder);

// 📦 USER ORDERS
router.get("/", authenticate, OrderController.getUserOrders);

// 🔍 SINGLE ORDER
router.get("/:id", authenticate, OrderController.getOrderById);

// 🔄 UPDATE ORDER STATUS (ADMIN ONLY)
router.patch(
  "/:id/status",
  authenticate,
  authorize(["ADMIN"]),
  validate(updateOrderStatusSchema),
  OrderController.updateStatus
);

// ❌ CANCEL ORDER (USER OR ADMIN depending on your logic)
router.patch(
  "/:id/cancel",
  authenticate,
  OrderController.cancel
);

export default router;