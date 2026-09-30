import express from "express";

import {
  getPublicRestaurant,
  getPublicDailyMenu,
} from "../controllers/publicRestaurantController.js";

const router = express.Router();

router.get("/:slug", getPublicRestaurant);
router.get("/:slug/menu", getPublicDailyMenu);

export default router;
