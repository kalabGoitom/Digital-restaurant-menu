import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }
    if (!token)
      return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "restaurant_admin") {
      return res.status(403).json({
        message: "Restaurant admin access required.",
      });
    }

    const user = await prisma.admin.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) return res.status(404).json({ message: "user not found" });

    if (!user.emailVerified) {
      return res.status(403).json({
        message:
          "Please verify your email before accessing the admin dashboard.",
      });
    }

    req.user = user;
    req.restaurantId = user.restaurantId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
