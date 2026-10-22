import express from "express";
import {
  createMenu,
  getAllMenu,
  editMenu,
  deleteMenu,
} from "../controllers/menu.js";

import {
  createDailyMenu,
  addToDailyMenuItem,
  removeFromDailyMenu,
  getDailyMenu,
  getUpcomingDailyMenus,
  getPastDailyMenus,
} from "../controllers/dailyMenu.js";
import authMiddleware from "../middlewares/authMiddleware.js";

import { menuSchema, updateMenuSchema } from "../validators/menuValidator.js";

import {
  dailyMenuItemSchema,
  dailyMenuSchema,
} from "../validators/dailyMenuValidator.js";

import validateRequest from "../middlewares/validateRequest.js";
import validateQuery from "../middlewares/validateQuery.js";

import {
  getRestaurantSettings,
  updateRestaurantSettings,
} from "../controllers/restaurantSettings.js";

import restaurantSettingsSchema from "../validators/restaurantSettingsValidator.js";

const router = express.Router();

router.use(authMiddleware);

// Menu routes
router.get("/menu-items", getAllMenu);
router.post("/menu-items", validateRequest(menuSchema), createMenu);
router.patch("/menu-items/:id", validateRequest(updateMenuSchema), editMenu);
router.delete("/menu-items/:id", deleteMenu);

// daily menu routes

router.post("/daily-menu", validateRequest(dailyMenuSchema), createDailyMenu);
router.post(
  "/daily-menu/items",
  validateRequest(dailyMenuItemSchema),
  addToDailyMenuItem,
);
router.delete("/daily-menu/items/:id", removeFromDailyMenu);

router.get("/daily-menu", validateQuery(dailyMenuSchema), getDailyMenu);
router.get("/daily-menu/upcoming", getUpcomingDailyMenus);
router.get("/daily-menu/past", getPastDailyMenus);

// Restaurant settings routes
router.get("/settings", getRestaurantSettings);

router.patch(
  "/settings",
  validateRequest(restaurantSettingsSchema),
  updateRestaurantSettings,
);

export default router;
