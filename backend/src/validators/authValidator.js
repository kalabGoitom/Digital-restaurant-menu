import { z } from "zod";

const restaurantSignupSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(70, "Name must be at most 70 characters"),

  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number",
    ),

  inviteCode: z.string().min(1, "Invite code is required"),

  token: z.string().min(1, "Invitation token is required"),
});

const platformAdminSignupSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(70, "Name must be at most 70 characters"),

  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number",
    ),

  setupSecret: z.string().min(1, "Setup secret is required"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email address"),

  code: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only numbers"),
});

const resendVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export {
  restaurantSignupSchema,
  platformAdminSignupSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
};
