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

import { hashInvitationValue } from "../utilities/generateInvitation.js";

const signup = async (req, res) => {
  try {
    const { name, email, password, inviteCode, token } = req.body;

    // verfiy with zod
    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    if (!name || !password) {
      return res.status(400).json({
        message: "Name and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingAdmin = await prisma.admin.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "This email is already registered as a restaurant admin.",
      });
    }

    if (!token) {
      return res.status(400).json({
        message: "Invitation token is required.",
      });
    }

    const tokenHash = hashInvitationValue(token);

    const invitation = await prisma.restaurantInvitation.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!invitation) {
      return res.status(404).json({
        message: "Invalid invitation.",
      });
    }

    if (invitation.status !== "PENDING") {
      return res.status(400).json({
        message: "This invitation is no longer valid.",
      });
    }

    if (invitation.expiresAt < new Date()) {
      return res.status(400).json({
        message: "This invitation has expired.",
      });
    }

    if (!inviteCode) {
      return res.status(400).json({
        message: "Invitation code is required.",
      });
    }

    const codeHash = hashInvitationValue(inviteCode);

    if (codeHash !== invitation.codeHash) {
      return res.status(403).json({
        message: "Invalid invitation code.",
      });
    }

    if (invitation.invitedEmail.toLowerCase() !== normalizedEmail) {
      return res.status(403).json({
        message: "This invitation was issued for a different email address.",
      });
    }

    const verificationCode = generateVerificationCode();

    const verificationCodeHash = await hashVerificationCode(verificationCode);

    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const admin = await tx.admin.create({
        data: {
          name,
          email: normalizedEmail,
          password: hashedPassword,
          role: "Admin",
          emailVerified: false,
          verificationCodeHash,
          verificationCodeExpiry,
          restaurantId: invitation.restaurantId,
        },
      });

      await tx.restaurantInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "ACCEPTED",
          usedAt: new Date(),
        },
      });

      return admin;
    });

    await sendVerificationEmail(normalizedEmail, verificationCode);

    res.status(201).json({
      message: "Account created successfully. Please verify your email.",
      admin: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
        restaurantId: result.restaurantId,
        createdAt: result.createdAt,
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
    const normalizedEmail = email.trim().toLowerCase();

    const admin = await prisma.admin.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!admin)
      return res.status(404).json({
        message: `Admin doesn't exist.`,
      });

    if (!admin.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch)
      return res.status(401).json({
        message: "Invalid credentials",
      });

    generateToken(admin.id, res, "restaurant_admin", admin.restaurantId);

    res.status(200).json({
      message: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        createdAt: admin.createdAt,
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
