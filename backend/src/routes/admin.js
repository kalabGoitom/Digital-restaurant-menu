import express from "express";
import {
  createMenu,
  getAllMenu,
  editMenu,
  deleteMenu,
} from "../controllers/admin.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { menuSchema, updateMenuSchema } from "../validators/menuValidator.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/menu-items",getAllMenu);
router.post("/menu-items", validateRequest(menuSchema), createMenu)
router.patch("/menu-items/:id", validateRequest(updateMenuSchema), editMenu)
router.delete("/menu-items/:id",deleteMenu);


export default router;
