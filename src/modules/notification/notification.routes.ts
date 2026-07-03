import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  NotificationController.getAll
);

router.patch(
  "/:id/read",
  authenticate,
  NotificationController.markRead
);

router.delete(
  "/:id",
  authenticate,
  NotificationController.delete
);

export default router;