import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utilities/generateToken.js";

const signup = async (req, res) => {
  try {
  const { name, email, password } = req.body;

    const userExists = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (userExists)
      return res.status(400).json({
        message: `User with ${email} already exists.`,
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.admin.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: "admin",
      },
    });

    const token = generateToken(user.id, res);

    res.status(200).json({
      token: token,
      message: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (!user)
      return res.status(404).json({
        message: `user with ${email} doesn't exist.`,
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({
        message: "Invalid credentials",
      });

    const token = generateToken(user.id, res);

    res.status(200).json({
      message: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {};

export { signup, login, getUser };
