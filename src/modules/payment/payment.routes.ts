import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";

import {
  createPaymentSchema,
  verifyPaymentSchema,
  refundPaymentSchema,
} from "./payment.validation";

const router = Router();

router.post(
  "/create",
  authenticate,
  validate(createPaymentSchema),
  PaymentController.createOrder
);

router.post(
  "/verify",
  authenticate,
  validate(verifyPaymentSchema),
  PaymentController.verify
);

router.post(
  "/refund",
  authenticate,
  validate(refundPaymentSchema),
  PaymentController.refund
);

router.post(
  "/webhook",
  PaymentController.webhook
);


export default router;