import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import crypto from "crypto";

import { CreateQuoteInputSchema } from "../schemas/create-quote.js";
import {
  loadQuotesForWrite,
  saveQuotesAtomic,
  formatZodError,
  MAX_QUOTES,
} from "../lib/quotes-write.js";

export function registerCreateQuoteTool(server: McpServer) {
  server.registerTool(
    "create_quote",
    {
      description:
        "Adds a new quote to the local quotes collection. Only ever writes to the server's own data file — no path or filename is accepted from the caller.",
      inputSchema: CreateQuoteInputSchema.shape,
    },

    async (args) => {
      const parsed = CreateQuoteInputSchema.safeParse(args);
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
      const { quote, author, category } = parsed.data;

      try {
        const quotes = loadQuotesForWrite();

        if (quotes.length >= MAX_QUOTES) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Cannot add quote: the collection is already at its maximum of ${MAX_QUOTES} quotes.`,
              },
            ],
          };
        }

        const newQuote = {
          id: crypto.randomUUID(),
          quote,
          author,
          category: category.toLowerCase(),
        };

        quotes.push(newQuote);
        saveQuotesAtomic(quotes);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { message: "Quote created.", quote: newQuote },
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
              text: `Failed to create quote: ${error.message ?? "Unknown error"}`,
            },
          ],
        };
      }
    }
  );
}