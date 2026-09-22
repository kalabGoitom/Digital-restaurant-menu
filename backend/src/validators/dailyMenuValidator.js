import { z } from "zod";

const dailyMenuItemSchema = z.object({
  dailyMenuId: z.string().uuid("Invalid daily menu ID"),
  menuId: z.string().uuid("Invalid menu ID"),
});

const dailyMenuSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export { dailyMenuItemSchema, dailyMenuSchema };
