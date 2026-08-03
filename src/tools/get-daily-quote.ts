import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getDailyQuoteInputSchema } from "../schemas/get-daily-quote.js";
import { getLocalDailyQuote } from "../lib/quotes.js";

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

      try {
        let url = "https://api.api-ninjas.com/v1/quotes";

        if (category) {
          url += `?category=${encodeURIComponent(category)}`;
        }

        const response = await fetch(url, {
          headers: {
            "X-Api-Key": apiKey || "",
          },
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
      } catch (error) {
        // Fallback to local data if the API fails
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
