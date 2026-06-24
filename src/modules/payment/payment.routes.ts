import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// 💰 CREATE PAYMENT
router.post("/create", authenticate, PaymentController.createOrder);

// 🔐 VERIFY PAYMENT
router.post("/verify", PaymentController.verifyPayment);

export default router;