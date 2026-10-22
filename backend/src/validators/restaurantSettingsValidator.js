import { z } from "zod";

const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color, e.g. #2563eb.");

const restaurantSettingsSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    logoUrl: z.string().trim().url().nullable().optional(),
    primaryColor: hexColorSchema.nullable().optional(),
    secondaryColor: hexColorSchema.nullable().optional(),
    accentColor: hexColorSchema.nullable().optional(),
    defaultLanguage: z.enum(["en", "am"]).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one setting must be provided.",
  });

export default restaurantSettingsSchema;
