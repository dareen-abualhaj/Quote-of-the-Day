import * as z from "zod/v4";

/**
 * Tool: get_daily_quote
 * Returns a daily quote from a local file or the external API.
 *
 * The file path is restricted to the data directory
 * to prevent path traversal attacks.
 */
export const getDailyQuoteInputSchema = z.object({
  file: z
    .string()
    .min(1)
    .max(200)
    .describe(
      "Name or relative path of a quote file inside the data directory."
    )
    .optional(),
});
