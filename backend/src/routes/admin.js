import express from "express";
import {
  getMenus,
  editMenu,
  deleteMenu,
  getDailyMenu,
  updateDailyMenu,
} from "../controllers/admin.js";

const router = express.Router();

router.post("/menu-items", getMenus);
router.route("/menu-items/:id").patch(editMenu).delete(deleteMenu);
router.route("/daily-menu").post(getDailyMenu).put(updateDailyMenu);

export default router;
