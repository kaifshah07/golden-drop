import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// 👤 GET USER PROFILE (protected route)
router.get("/profile", authenticate, (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});
export default router;