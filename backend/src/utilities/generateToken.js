import jwt from "jsonwebtoken";

const generateToken = (id, res) => {
  const token = jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return token;
};

export default generateToken;
