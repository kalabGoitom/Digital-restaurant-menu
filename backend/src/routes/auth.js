import express from "express";
import { signup, login, getUser } from "../controllers/auth.js";
import { loginSchema, signupSchema } from "../validators/authValidator.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/login", validateRequest(loginSchema), login);
router.get("/user", getUser);

export default router;
