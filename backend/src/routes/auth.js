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
import {
  loginLimiter,
  signupLimiter,
  verificationLimiter,
  resendVerificationLimiter,
} from "../middlewares/rateLimiter.js";
const router = express.Router();

router.post("/signup", signupLimiter, validateRequest(signupSchema), signup);
router.post("/login", loginLimiter, validateRequest(loginSchema), login);
router.post("/logout", logout);
router.post("/verify-email", verificationLimiter, verifyEmail);
router.post(
  "/resend-verification",
  resendVerificationLimiter,
  resendVerificationCode,
);
router.get("/me", authMiddleware, getCurrentAdmin);

export default router;
