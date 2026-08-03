import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SearchQuotesInputSchema } from "../schemas/search-quotes.js";
import { searchLocalQuotes } from "../lib/quotes.js";

export function registerSearchQuotesTool(server: McpServer) {
  server.registerTool(
    "search_quotes",
    {
      description: "Searches for quotes matching a keyword, topic, or author name.",
      inputSchema: SearchQuotesInputSchema,
    },
    async (args: any) => {
      const apiKey = process.env.API_KEY || process.env.API_NINJAS_KEY;
      const keyword = args?.keyword || args?.query || args?.topic || "";
      const limit = args?.limit || 10;
      let results: any[] = [];

      try {
        const url = `https://api.api-ninjas.com/v1/quotes?quote=${encodeURIComponent(keyword)}`;

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
          results = data.slice(0, limit);
        } else {
          throw new Error("No quotes returned from API");
        }
      } catch (error) {
        // الاعتماد على الدالة النقية المنفصلة في حال فشل الـ API
        results = searchLocalQuotes(keyword, limit);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ results }, null, 2),
          },
        ],
      };
    }
  );
}