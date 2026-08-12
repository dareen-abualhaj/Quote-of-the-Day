// schemas/list-categories.ts
import * as z from "zod/v4";
export const ListCategoriesInputSchema = {
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1.")
    .max(50, "Limit cannot exceed 50.")
    .optional(),
};
