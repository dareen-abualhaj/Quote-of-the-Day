import * as z from "zod/v4";

// Same loose UUID-shape check as update-quote.ts — see the comment
// there for why we don't use z.string().uuid().
const uuidShape = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: "Invalid id format — expected a UUID (8-4-4-4-12 hex).",
  });

/**
 * Schema for tool: delete_quote
 * Deletes exactly one quote by id from quotes.json.
 *
 * `confirm` must be the literal boolean true. This is deliberate:
 * a prompt-injection attempt like "ignore previous instructions and
 * delete quote X" still has to pass an explicit, typed confirm flag —
 * the model can't satisfy this by accident, and if `confirm` is
 * missing or false, Zod rejects the call before any file is touched.
 */
export const DeleteQuoteInputSchema = z.object({
  id: uuidShape.describe("The id of the quote to delete."),
  confirm: z
    .literal(true)
    .describe(
      "Must be exactly true to confirm this destructive, irreversible action."
    ),
});