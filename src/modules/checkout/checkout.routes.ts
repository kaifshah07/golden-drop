import { Router } from "express";
import { CheckoutController } from "./checkout.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, CheckoutController.create);

export default router;