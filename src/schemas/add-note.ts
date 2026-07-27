import { z } from "zod/v4";

export const addNoteInputSchema = z.object({
  title: z
    .string()
    .min(1)
    .describe("Short title used as the note file name stem"),
  body: z
    .string()
    .min(1)
    .describe("Full note content to save as plain text"),
});
