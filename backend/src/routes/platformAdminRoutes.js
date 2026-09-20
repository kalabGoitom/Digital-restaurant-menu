import express from "express";
import {
  platformAdminSignup,
  platformAdminLogin,
  verifyPlatformAdminEmail,
  resendPlatformAdminVerificationCode,
  createRestaurant,
} from "../controllers/platformAdminController.js";
import protectPlatformAdmin from "../middlewares/platformAdminMiddleware.js";
import {
  platformAdminSignupSchema,
  loginSchema,
} from "../validators/authValidator.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(platformAdminSignupSchema),
  platformAdminSignup,
);
router.post("/login", validateRequest(loginSchema), platformAdminLogin);
router.post("/verify-email", verifyPlatformAdminEmail);
router.post("/resend-verification", resendPlatformAdminVerificationCode);

router.post("/restaurants", protectPlatformAdmin, createRestaurant);

export default router;
