import { Router } from "express";
import { ShippingController } from "./shipping.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/admin.middleware";

const router = Router();

router.post(
  "/:id/create",
  authenticate,
  adminOnly,
  ShippingController.createShipment
);

export default router;