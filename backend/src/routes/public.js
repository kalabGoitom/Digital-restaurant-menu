import express from "express";
import getMenus from "../controllers/public.js";

const router = express.Router();

router.get("/", getMenus);

export default router;
