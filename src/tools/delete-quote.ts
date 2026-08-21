import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { DeleteQuoteInputSchema } from "../schemas/delete-quote.js";
import {
  loadQuotesForWrite,
  saveQuotesAtomic,
  findQuoteIndex,
  formatZodError,
} from "../lib/quotes-write.js";

export function registerDeleteQuoteTool(server: McpServer) {
  server.registerTool(
    "delete_quote",
    {
      description:
        "Permanently deletes exactly one quote by id. Requires confirm:true. Always backs up quotes.json before deleting, and refuses to empty the collection entirely.",
      inputSchema: DeleteQuoteInputSchema.shape,
    },

    async (args) => {
      // Separate "bad shape" (id not a uuid, confirm missing/false)
      // from "well-formed but not found", checked below.
      const parsed = DeleteQuoteInputSchema.safeParse(args);
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
      const { id, confirm } = parsed.data;

      try {
        // Defense in depth for a destructive operation — Zod already
        // rejects confirm !== true above, but we re-check explicitly.
        if (confirm !== true) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: "Deletion requires confirm:true. No changes were made.",
              },
            ],
          };
        }

        const quotes = loadQuotesForWrite();
        const index = findQuoteIndex(quotes, id);

        if (index === -1) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `No quote found with id "${id}". Nothing was deleted.`,
              },
            ],
          };
        }

        if (quotes.length <= 1) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: "Refusing to delete the last remaining quote — the collection cannot be emptied.",
              },
            ],
          };
        }

        const [deleted] = quotes.splice(index, 1);
        saveQuotesAtomic(quotes); // a timestamped backup is written automatically before this overwrite

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { message: "Quote deleted.", quote: deleted },
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
              text: `Failed to delete quote: ${error.message ?? "Unknown error"}`,
            },
          ],
        };
      }
    }
  );
}