import * as z from "zod/v4";

/**
 * Schema for tool: search_quotes
 * Description: Searches for quotes matching a keyword, topic, or author name.
 */
export const SearchQuotesInputSchema = z.object({
  keyword: z
    .string()
    .trim()
    .min(2, { message: "Keyword must be at least 2 characters long." })
    .max(100)
    .regex(/^[^0-9]+$/, { message: "Keyword cannot contain numbers." })
    .describe("The keyword, topic, or author name to search for in quotes"),
  limit: z
    .number()
    .int()
    .positive()
    .max(50)
    .optional()
    .describe("Maximum number of quotes to return (1-50). Defaults to 10."),
});