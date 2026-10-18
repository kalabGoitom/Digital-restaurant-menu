import express from "express";
import {
  platformAdminSignup,
  platformAdminLogin,
  verifyPlatformAdminEmail,
  resendPlatformAdminVerificationCode,
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  getRestaurantInvitation,
  resendRestaurantInvitation,
  revokeRestaurantInvitation,
  updateRestaurant,
  deactivateRestaurant,
  reactivateRestaurant,
  getCurrentPlatformAdmin,
  getPlatformDashboardStats,
} from "../controllers/platformAdminController.js";
import protectPlatformAdmin from "../middlewares/platformAdminMiddleware.js";
import {
  platformAdminSignupSchema,
  loginSchema,
} from "../validators/authValidator.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createRestaurantSchema,
  restaurantIdSchema,
  updateRestaurantSchema,
} from "../validators/restaurantValidator.js";
import validateParams from "../middlewares/validateParams.js";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(platformAdminSignupSchema),
  platformAdminSignup,
);
router.post("/login", validateRequest(loginSchema), platformAdminLogin);
router.post("/verify-email", verifyPlatformAdminEmail);
router.post("/resend-verification", resendPlatformAdminVerificationCode);

router.post(
  "/restaurants",
  protectPlatformAdmin,
  validateRequest(createRestaurantSchema),
  createRestaurant,
);

router.get("/restaurants", protectPlatformAdmin, getAllRestaurants);
router.get(
  "/restaurants/:id",
  protectPlatformAdmin,
  validateParams(restaurantIdSchema),
  getRestaurantById,
);

router.get(
  "/restaurants/:id/invitation",
  protectPlatformAdmin,
  validateParams(restaurantIdSchema),
  getRestaurantInvitation,
);

router.post(
  "/restaurants/:id/invitation/resend",
  protectPlatformAdmin,
  validateParams(restaurantIdSchema),
  resendRestaurantInvitation,
);

router.post(
  "/restaurants/:id/invitation/revoke",
  protectPlatformAdmin,
  validateParams(restaurantIdSchema),
  revokeRestaurantInvitation,
);

router.patch(
  "/restaurants/:id",
  protectPlatformAdmin,
  validateParams(restaurantIdSchema),
  validateRequest(updateRestaurantSchema),
  updateRestaurant,
);

router.post(
  "/restaurants/:id/deactivate",
  protectPlatformAdmin,
  validateParams(restaurantIdSchema),
  deactivateRestaurant,
);

router.post(
  "/restaurants/:id/reactivate",
  protectPlatformAdmin,
  validateParams(restaurantIdSchema),
  reactivateRestaurant,
);

router.get("/me", protectPlatformAdmin, getCurrentPlatformAdmin);

router.get("/dashboard/stats", protectPlatformAdmin, getPlatformDashboardStats);

export default router;
