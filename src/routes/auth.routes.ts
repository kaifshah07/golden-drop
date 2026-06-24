import express from "express";
import { validate } from "../middleware/validation.middleware";
import { registerSchema } from "../validators/auth.validator";

const router = express.Router();

router.post("/register", validate(registerSchema), (req, res) => {
  res.json({
    success: true,
    message: "User registered successfully",
    data: req.body,
  });
});

export default router;