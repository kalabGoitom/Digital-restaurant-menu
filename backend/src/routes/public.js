import express from "express";
import getTodaysMenu from "../controllers/todayMenu.js";

const router = express.Router();

router.get("/today", getTodaysMenu);

export default router;
