import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();


router.post(
    "/create",
    PaymentController.createOrder
);


router.post(
    "/verify",
    PaymentController.verify
);


router.post(
    "/webhook",
    PaymentController.webhook
);


export default router;