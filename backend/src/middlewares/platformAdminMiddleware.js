import jwt from "jsonwebtoken";

const protectPlatformAdmin = (req, res, next) => {
  try {
    const token = req.cookies.platformToken;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Platform admin login required.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "platform_admin") {
      return res.status(403).json({
        message: "Platform admin access required.",
      });
    }

    req.platformAdmin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired platform admin token.",
    });
  }
};

export default protectPlatformAdmin;
