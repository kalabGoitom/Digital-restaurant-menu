import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utilities/generateToken.js";
import {
  generateVerificationCode,
  hashVerificationCode,
  compareVerificationCode,
} from "../utilities/verificationCode.js";

import { sendVerificationEmail } from "../utilities/sendEmail.js";

import {
  verifyEmailSchema,
  resendVerificationSchema,
} from "../validators/authValidator.js";

const signup = async (req, res) => {
  try {
    const { name, email, password, inviteCode } = req.body;

    const adminExists = await prisma.admin.findFirst();

    if (adminExists) {
      return res.status(403).json({
        message: "Admin account already exists.",
      });
    }

    if (inviteCode !== process.env.ADMIN_INVITE_CODE) {
      return res.status(403).json({
        message: "Invalid invite code.",
      });
    }

    const userExists = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (userExists)
      return res.status(400).json({
        message: `User with ${email} already exists.`,
      });

    const verificationCode = generateVerificationCode();

    const verificationCodeHash = await hashVerificationCode(verificationCode);

    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "Admin",
        emailVerified: false,
        verificationCodeHash,
        verificationCodeExpiry,
      },
    });

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({
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

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

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
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const result = verifyEmailSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email, code } = result.data;

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return res.status(404).json({
        message: "Admin account not found.",
      });
    }

    if (admin.emailVerified) {
      return res.status(400).json({
        message: "Email is already verified.",
      });
    }

    if (!admin.verificationCodeHash || !admin.verificationCodeExpiry) {
      return res.status(400).json({
        message: "No verification code found. Please request a new code.",
      });
    }

    if (new Date() > admin.verificationCodeExpiry) {
      return res.status(400).json({
        message: "Verification code has expired.",
      });
    }

    const isCodeValid = await compareVerificationCode(
      code,
      admin.verificationCodeHash,
    );

    if (!isCodeValid) {
      return res.status(400).json({
        message: "Invalid verification code.",
      });
    }

    const verifiedAdmin = await prisma.admin.update({
      where: {
        id: admin.id,
      },
      data: {
        emailVerified: true,
        verificationCodeHash: null,
        verificationCodeExpiry: null,
      },
    });

    return res.status(200).json({
      message: "Email verified successfully.",
      admin: {
        id: verifiedAdmin.id,
        name: verifiedAdmin.name,
        email: verifiedAdmin.email,
        emailVerified: verifiedAdmin.emailVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const resendVerificationCode = async (req, res) => {
  try {
    const result = resendVerificationSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email } = result.data;

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return res.status(404).json({
        message: "Admin account not found.",
      });
    }

    if (admin.emailVerified) {
      return res.status(400).json({
        message: "Email is already verified.",
      });
    }

    const verificationCode = generateVerificationCode();

    const verificationCodeHash = await hashVerificationCode(verificationCode);

    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.admin.update({
      where: {
        id: admin.id,
      },
      data: {
        verificationCodeHash,
        verificationCodeExpiry,
      },
    });

    await sendVerificationEmail(email, verificationCode);

    return res.status(200).json({
      message: "A new verification code has been sent.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getCurrentAdmin = async (req, res) => {
  try {
    res.status(200).json({
      admin: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    message: "Logged out successfully.",
  });
};

export {
  signup,
  login,
  logout,
  verifyEmail,
  resendVerificationCode,
  getCurrentAdmin,
};
