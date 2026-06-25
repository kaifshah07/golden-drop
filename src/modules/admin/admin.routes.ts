import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/admin.middleware";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  adminOnly,
  AdminController.dashboard
);

router.get(
  "/orders",
  authenticate,
  adminOnly,
  AdminController.orders
);

router.get(
  "/users",
  authenticate,
  adminOnly,
  AdminController.users
);

export default router;