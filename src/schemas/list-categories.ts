// schemas/list-categories.ts
import * as z from "zod/v4";
export const ListCategoriesInputSchema = {
  limit: z
    .number()
    .int()
    .optional(),
};
