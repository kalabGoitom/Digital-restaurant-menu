import express from "express";
import {
  getMenus,
  editMenu,
  deleteMenu,
  getDailyMenu,
  updateDailyMenu,
} from "../controllers/admin.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/menu-items", getMenus);
router.route("/menu-items/:id").patch(editMenu).delete(deleteMenu);
router.route("/daily-menu").post(getDailyMenu).put(updateDailyMenu);

export default router;
