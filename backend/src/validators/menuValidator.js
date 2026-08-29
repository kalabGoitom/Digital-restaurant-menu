import { z } from "zod";

const menuSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description is too long"),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0"),

  imageUrl: z
    .string()
    .url("Please provide a valid image URL"),

  category: z
    .string()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category is too long"),
});

const updateMenuSchema = menuSchema.partial().extend({
  available: z.boolean().optional(),
});

export { menuSchema, updateMenuSchema };