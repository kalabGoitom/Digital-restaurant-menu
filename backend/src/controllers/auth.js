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

      include: {
        restaurant: {
          select: {
            isActive: true,
          },
        },
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

    if (!invitation.restaurant.isActive) {
      return res.status(400).json({
        message: "This restaurant is currently deactivated.",
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
      include: {
        restaurant: {
          select: {
            isActive: true,
          },
        },
      },
    });

    if (!admin)
      return res.status(404).json({
        message: `Admin doesn't exist.`,
      });

    if (!admin.restaurant.isActive) {
      return res.status(403).json({
        message: "This restaurant is currently deactivated.",
      });
    }

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

    const invitation = await prisma.restaurantInvitation.findFirst({
      where: {
        restaurantId: admin.restaurantId,
        invitedEmail: admin.email,
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const result2 = await prisma.$transaction(async (tx) => {
      const verifiedAdmin = await tx.admin.update({
        where: {
          id: admin.id,
        },
        data: {
          emailVerified: true,
          verificationCodeHash: null,
          verificationCodeExpiry: null,
        },
      });

      if (invitation) {
        await tx.restaurantInvitation.update({
          where: {
            id: invitation.id,
          },
          data: {
            status: "ACCEPTED",
            usedAt: new Date(),
          },
        });
      }

      return verifiedAdmin;
    });

    return res.status(200).json({
      message: "Email verified successfully.",
      admin: {
        id: result2.id,
        name: result2.name,
        email: result2.email,
        emailVerified: result2.emailVerified,
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
    const admin = await prisma.admin.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!admin) {
      return res.status(404).json({
        message: "Restaurant admin not found.",
      });
    }

    res.status(200).json({
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        logoUrl: admin.logoUrl,
        createdAt: admin.createdAt,
        restaurant: admin.restaurant,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/",
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
