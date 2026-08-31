import express from "express";
import {
  signup,
  login,
  verifyEmail,
  resendVerificationCode,
  getCurrentAdmin,
  logout,
} from "../controllers/auth.js";
import { loginSchema, signupSchema } from "../validators/authValidator.js";
import validateRequest from "../middlewares/validateRequest.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationCode);
router.get("/me", authMiddleware, getCurrentAdmin);

export default router;
