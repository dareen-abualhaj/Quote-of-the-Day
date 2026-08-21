import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod/v4";

import { UpdateQuoteInputSchema } from "../schemas/update-quote.js";
import {
  loadQuotesForWrite,
  saveQuotesAtomic,
  findQuoteIndex,
  formatZodError,
} from "../lib/quotes-write.js";

export function registerUpdateQuoteTool(server: McpServer) {
  server.registerTool(
    "update_quote",
    {
      description:
        "Updates one or more fields (quote, author, category) of an existing quote, addressed by id. Fails cleanly if the id doesn't exist — never creates a new entry.",
      inputSchema: UpdateQuoteInputSchema.shape,
    },

    async (args) => {
      // Validate first, and separate "bad shape" (e.g. id isn't even a
      // uuid) from "well-formed but not found", which is checked below.
      const parsed = UpdateQuoteInputSchema.safeParse(args);
      if (!parsed.success) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Invalid input: ${formatZodError(parsed.error)}`,
            },
          ],
        };
      }
      const { id, quote, author, category } = parsed.data;

      try {
        const quotes = loadQuotesForWrite();
        const index = findQuoteIndex(quotes, id);

        if (index === -1) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `No quote found with id "${id}". Nothing was changed.`,
              },
            ],
          };
        }

        const updated = {
          ...quotes[index],
          ...(quote !== undefined && { quote }),
          ...(author !== undefined && { author }),
          ...(category !== undefined && { category: category.toLowerCase() }),
        };

        quotes[index] = updated;
        saveQuotesAtomic(quotes);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { message: "Quote updated.", quote: updated },
                null,
                2
              ),
            },
          ],
        };
      } catch (error: any) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Failed to update quote: ${error.message ?? "Unknown error"}`,
            },
          ],
        };
      }
    }
  );
}