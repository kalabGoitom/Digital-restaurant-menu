import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(3, "Username too short").max(70, "Username too long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "password too long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number",
    ),
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
  signupSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
};
