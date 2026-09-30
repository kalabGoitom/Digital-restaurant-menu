import { z } from "zod";

const createRestaurantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Restaurant name must be at least 2 characters")
    .max(100, "Restaurant name is too long"),

  ownerEmail: z
    .string()
    .trim()
    .email("Please provide a valid owner email address")
    .toLowerCase(),
});

const restaurantIdSchema = z.object({
  id: z.string().uuid("Invalid restaurant ID"),
});

const updateRestaurantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Restaurant name must be at least 2 characters")
    .max(100, "Restaurant name is too long")
    .optional(),

  logoUrl: z.string().url("Logo URL must be a valid URL").optional().nullable(),

  primaryColor: z.string().optional().nullable(),

  secondaryColor: z.string().optional().nullable(),

  accentColor: z.string().optional().nullable(),

  defaultLanguage: z
    .string()
    .min(2, "Language code must be at least 2 characters")
    .max(10, "Language code is too long")
    .optional(),
});

export { createRestaurantSchema, restaurantIdSchema, updateRestaurantSchema };
