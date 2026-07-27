import { z } from "zod/v4";

export const searchNotesInputSchema = z.object({
  query: z
    .string()
    .min(1)
    .describe("Keyword or phrase to search for inside notes and FAQ files"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(20)
    .optional()
    .describe("Maximum number of matching snippets to return (default 5)"),
});
