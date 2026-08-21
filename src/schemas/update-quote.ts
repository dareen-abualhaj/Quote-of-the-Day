import * as z from "zod/v4";

// A loose UUID-shape check (8-4-4-4-12 hex) instead of z.string().uuid(),
// which enforces RFC version/variant digits and rejects otherwise
// well-formed test ids (e.g. all-"a" placeholders). We only care that
// the *shape* is a uuid here — whether it actually exists in the data
// is checked separately by the tool, so that case correctly reports
// "not found" instead of "invalid format".
const uuidShape = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: "Invalid id format — expected a UUID (8-4-4-4-12 hex).",
  });

/**
 * Schema for tool: update_quote
 * Updates one or more fields of an existing quote, addressed by id.
 *
 * `id` must be a real uuid already in quotes.json — the tool looks it
 * up and fails cleanly if it doesn't exist, it never creates a new
 * entry as a side effect of "update".
 */
export const UpdateQuoteInputSchema = z
  .object({
    id: uuidShape.describe("The id of the quote to update."),
    quote: z.string().trim().min(3).max(500).optional().describe(
      "New quote text. Omit to leave unchanged."
    ),
    author: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .regex(/^[\p{L}\p{M}\s.'-]+$/u, {
        message: "Author can only contain letters, spaces, and . ' -",
      })
      .optional()
      .describe("New author. Omit to leave unchanged."),
    category: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .regex(/^[a-zA-Z\s-]+$/, {
        message: "Category can only contain letters, spaces, and hyphens.",
      })
      .optional()
      .describe("New category. Omit to leave unchanged."),
  })
  .refine((data) => data.quote || data.author || data.category, {
    message: "Provide at least one of: quote, author, category.",
  });