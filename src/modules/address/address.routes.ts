import { Router } from "express";
import { AddressController } from "./address.controller";
import { validate } from "../../middleware/validate.middleware";
import {
  createAddressSchema,
  updateAddressSchema,
} from "./address.validator";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createAddressSchema),
  AddressController.create
);

router.get("/", authenticate, AddressController.getAll);

router.put(
  "/:id",
  authenticate,
  validate(updateAddressSchema),
  AddressController.update
);

router.delete("/:id", authenticate, AddressController.delete);

export default router;