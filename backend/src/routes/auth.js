import express from "express";
import {
  signup,
  login,
  verifyEmail,
  resendVerificationCode,
} from "../controllers/auth.js";
import { loginSchema, signupSchema } from "../validators/authValidator.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/login", validateRequest(loginSchema), login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationCode);

export default router;
