import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getDailyQuoteInputSchema } from "../schemas/get-daily-quote.js";
import { getLocalDailyQuote } from "../lib/quotes.js";

const ALLOWED_HOST = "api.api-ninjas.com";

export function registerGetDailyQuoteTool(server: McpServer) {
  server.registerTool(
    "get_daily_quote",
    {
      description:
        "Gets a daily inspirational quote, optionally filtered by category.",
      inputSchema: getDailyQuoteInputSchema,
    },
    async (args: any) => {
      const apiKey = process.env.API_KEY || process.env.API_NINJAS_KEY;
      const category = args?.category || "";
      let quoteData: any = null;

      if (apiKey) {
        try {
          const url = new URL("https://api.api-ninjas.com/v1/quotes");
          if (category) url.searchParams.set("category", category);

          if (url.hostname !== ALLOWED_HOST) {
            throw new Error("External host is not allowed.");
          }

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);

          try {
            const response = await fetch(url, {
              headers: { "X-Api-Key": apiKey },
              signal: controller.signal,
            });
          
            if (!response.ok) {
              throw new Error(`API error ${response.status}`);
            }
          
            const data = await response.json();
          
            if (Array.isArray(data) && data.length > 0) {
              quoteData = data[0];
            } else {
              throw new Error("No quote returned from API");
            }
          } finally {
            clearTimeout(timeout);
          }
        } catch (error) {
          console.error(
            "get_daily_quote API error:",
            error instanceof Error ? error.message : error
          );
        
          console.error("Using local quote fallback.");
        
          quoteData = getLocalDailyQuote(category);
        }
      } else {
        quoteData = getLocalDailyQuote(category);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(quoteData, null, 2),
          },
        ],
      };
    }
  );
}
