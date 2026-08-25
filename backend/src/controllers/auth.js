import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utilities/generateToken.js";
import { loginSchema, signupSchema } from "../validators/authValidator.js";

const signup = async (req, res) => {
  try {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { name, email, password } = result.data;

    const userExists = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (userExists)
      return res.status(400).json({
        msg: `User with ${email} already exists.`,
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
      msg: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email, password } = result.data;

    const user = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (!user)
      return res.status(404).json({
        msg: `user with ${email} doesn't exist.`,
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({
        msg: "Invalid credentials",
      });

    const token = generateToken(user.id, res);

    res.status(200).json({
      msg: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

const getUser = async (req, res) => {};

export { signup, login, getUser };
