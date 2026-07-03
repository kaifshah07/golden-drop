import { Router } from "express";
import { BannerController } from "./banner.controller";
import {
  createBannerSchema,
  updateBannerSchema,
} from "./banner.validator";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get("/", BannerController.getAll);

router.get("/:id", BannerController.getById);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  validate(createBannerSchema),
  BannerController.create
);

router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  validate(updateBannerSchema),
  BannerController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  BannerController.delete
);

export default router;