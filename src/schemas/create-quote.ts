import * as z from "zod/v4";

/**
 * Schema for tool: create_quote
 * Adds a new quote to the local quotes.json fixture.
 *
 * No file/path parameter exists on purpose — this tool can only ever
 * write to the server's own quotes.json, so there is nothing for a
 * malicious prompt to redirect.
 */
export const CreateQuoteInputSchema = z.object({
  quote: z
    .string()
    .trim()
    .min(3, { message: "Quote must be at least 3 characters long." })
    .max(500, { message: "Quote must be at most 500 characters." })
    .describe("The quote text to add."),
  author: z
    .string()
    .trim()
    .min(1, { message: "Author is required." })
    .max(100)
    .regex(/^[\p{L}\p{M}\s.'-]+$/u, {
      message: "Author can only contain letters, spaces, and . ' -",
    })
    .describe("The name of the person the quote is attributed to."),
  category: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z\s-]+$/, {
      message: "Category can only contain letters, spaces, and hyphens.",
    })
    .describe("The category this quote belongs to (e.g. 'motivation')."),
});