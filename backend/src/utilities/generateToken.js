import jwt from "jsonwebtoken";

const generateToken = (
  id,
  res,
  type = "restaurant_admin",
  restaurantId = null,
) => {
  const token = jwt.sign(
    {
      id,
      type,
      ...(restaurantId && { restaurantId }),
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  const cookieName = type === "platform_admin" ? "platformToken" : "jwt";

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return token;
};

export default generateToken;
