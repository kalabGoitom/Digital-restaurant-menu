import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }
    if (!token)
      return res.status(401).json({ msg: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.admin.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) return res.status(404).json({ msg: "user not found" });
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export default authMiddleware;
