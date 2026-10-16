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

import { generateUniqueSlug } from "../utilities/generateSlug.js";

import {
  generateInvitationToken,
  generateInvitationCode,
  hashInvitationValue,
} from "../utilities/generateInvitation.js";

const platformAdminSignup = async (req, res) => {
  try {
    const { name, email, password, setupSecret } = req.body;

    if (setupSecret !== process.env.PLATFORM_ADMIN_SETUP_SECRET) {
      return res.status(403).json({
        message: "Invalid setup secret.",
      });
    }

    const existingAdmin = await prisma.platformAdmin.findUnique({
      where: {
        email,
      },
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Platform admin already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = generateVerificationCode();

    const verificationCodeHash = await hashVerificationCode(verificationCode);

    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const admin = await prisma.platformAdmin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
        verificationCodeHash,
        verificationCodeExpiry,
      },
    });

    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: "Platform admin created successfully.",
      admin: {
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

const platformAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.platformAdmin.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!admin.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    generateToken(admin.id, res, "platform_admin");

    res.status(200).json({
      message: "Platform admin login successful.",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyPlatformAdminEmail = async (req, res) => {
  try {
    const result = verifyEmailSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email, code } = result.data;

    const admin = await prisma.platformAdmin.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return res.status(404).json({
        message: "Platform admin account not found.",
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

    const verifiedAdmin = await prisma.platformAdmin.update({
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
      message: "Platform admin email verified successfully.",
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

const resendPlatformAdminVerificationCode = async (req, res) => {
  try {
    const result = resendVerificationSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email } = result.data;

    const admin = await prisma.platformAdmin.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return res.status(404).json({
        message: "Platform admin account not found.",
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

    await prisma.platformAdmin.update({
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

const createRestaurant = async (req, res) => {
  try {
    const { name, ownerEmail } = req.body;

    const existingAdmin = await prisma.admin.findUnique({
      where: {
        email: ownerEmail,
      },
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "This email is already registered as a restaurant admin.",
      });
    }

    const slug = await generateUniqueSlug(name, prisma);

    const token = generateInvitationToken();
    const code = generateInvitationCode();

    const tokenHash = hashInvitationValue(token);
    const codeHash = hashInvitationValue(code);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const result = await prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.create({
        data: {
          name,
          slug,
        },
      });

      const invitation = await tx.restaurantInvitation.create({
        data: {
          restaurantId: restaurant.id,
          invitedEmail: ownerEmail,
          tokenHash,
          codeHash,
          expiresAt,
        },
      });

      return {
        restaurant,
        invitation,
      };
    });

    const invitationLink = `${process.env.FRONTEND_URL}/restaurant/signup?token=${token}`;

    return res.status(201).json({
      message: "Restaurant created successfully.",
      restaurant: {
        id: result.restaurant.id,
        name: result.restaurant.name,
        slug: result.restaurant.slug,
      },
      invitation: {
        link: invitationLink,
        code,
        expiresAt: result.invitation.expiresAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      restaurants,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        isActive: true,
        defaultLanguage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    return res.status(200).json({
      restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getRestaurantInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    const invitation = await prisma.restaurantInvitation.findFirst({
      where: {
        restaurantId: id,
      },
      select: {
        id: true,
        invitedEmail: true,
        expiresAt: true,
        status: true,
        usedAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found for this restaurant.",
      });
    }

    return res.status(200).json({
      invitation,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const resendRestaurantInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    if (!restaurant.isActive) {
      return res.status(400).json({
        message: "Cannot resend invitation for a deactivated restaurant.",
      });
    }

    const invitation = await prisma.restaurantInvitation.findFirst({
      where: {
        restaurantId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found for this restaurant.",
      });
    }

    if (invitation.status === "ACCEPTED") {
      return res.status(400).json({
        message: "This invitation has already been accepted.",
      });
    }

    const token = generateInvitationToken();
    const code = generateInvitationCode();

    const tokenHash = hashInvitationValue(token);
    const codeHash = hashInvitationValue(code);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const result = await prisma.$transaction(async (tx) => {
      await tx.restaurantInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "REVOKED",
        },
      });

      const newInvitation = await tx.restaurantInvitation.create({
        data: {
          restaurantId: restaurant.id,
          invitedEmail: invitation.invitedEmail,
          tokenHash,
          codeHash,
          expiresAt,
        },
      });

      return newInvitation;
    });

    const invitationLink = `${process.env.FRONTEND_URL}/restaurant/signup?token=${token}`;

    return res.status(200).json({
      message: "Restaurant invitation resent successfully.",
      invitation: {
        link: invitationLink,
        code,
        expiresAt: result.expiresAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const revokeRestaurantInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    const invitation = await prisma.restaurantInvitation.findFirst({
      where: {
        restaurantId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found for this restaurant.",
      });
    }

    if (invitation.status === "ACCEPTED") {
      return res.status(400).json({
        message: "This invitation has already been accepted.",
      });
    }

    if (invitation.status === "REVOKED") {
      return res.status(400).json({
        message: "This invitation has already been revoked.",
      });
    }

    const revokedInvitation = await prisma.restaurantInvitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: "REVOKED",
      },
    });

    return res.status(200).json({
      message: "Restaurant invitation revoked successfully.",
      invitation: {
        id: revokedInvitation.id,
        status: revokedInvitation.status,
        revokedAt: new Date(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id,
      },
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id,
      },
      data: req.body,
    });

    return res.status(200).json({
      message: "Restaurant updated successfully.",
      restaurant: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        slug: updatedRestaurant.slug,
        logoUrl: updatedRestaurant.logoUrl,
        primaryColor: updatedRestaurant.primaryColor,
        secondaryColor: updatedRestaurant.secondaryColor,
        accentColor: updatedRestaurant.accentColor,
        defaultLanguage: updatedRestaurant.defaultLanguage,
        updatedAt: updatedRestaurant.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deactivateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    if (!restaurant.isActive) {
      return res.status(400).json({
        message: "Restaurant is already deactivated.",
      });
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });

    return res.status(200).json({
      message: "Restaurant deactivated successfully.",
      restaurant: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        isActive: updatedRestaurant.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getCurrentPlatformAdmin = async (req, res) => {
  try {
    const admin = await prisma.platformAdmin.findUnique({
      where: {
        id: req.platformAdmin.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!admin) {
      return res.status(401).json({
        message: "Platform admin account not found.",
      });
    }

    return res.status(200).json({ admin });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve platform admin.",
    });
  }
};

export {
  platformAdminSignup,
  platformAdminLogin,
  verifyPlatformAdminEmail,
  resendPlatformAdminVerificationCode,
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  getRestaurantInvitation,
  resendRestaurantInvitation,
  revokeRestaurantInvitation,
  updateRestaurant,
  deactivateRestaurant,
  getCurrentPlatformAdmin,
};
