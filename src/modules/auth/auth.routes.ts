import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

// 🟢 REGISTER
router.post("/register", AuthController.register);

// 🟡 LOGIN
router.post("/login", AuthController.login);

// 🔵 REFRESH TOKEN
router.post("/refresh", AuthController.refresh);

// 🔴 LOGOUT
router.post("/logout", AuthController.logout);

router.post("/forgot-password", AuthController.forgotPassword);

router.post("/reset-password", AuthController.resetPassword);



export default router;