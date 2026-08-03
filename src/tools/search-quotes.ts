import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SearchQuotesInputSchema } from "../schemas/search-quotes.js";
import fs from "fs";
import path from "path";

export function registerSearchQuotesTool(server: McpServer) {
  server.registerTool(
    "search_quotes",
    {
      description: "Search for quotes matching a keyword, topic, or author.",
      inputSchema: SearchQuotesInputSchema,
    },
    async (input) => {
      const apiKey = process.env.API_KEY || process.env.API_NINJAS_KEY;
      const searchInput = input as Record<string, any>;
      const query = searchInput?.query || searchInput?.keyword || searchInput?.topic || "";
      let results: any[] = [];

      try {
       
        const url = https://api.api-ninjas.com/v1/quotes?quote=${encodeURIComponent(query)};
        const response = await fetch(url, {
          headers: {
            "X-Api-Key": apiKey || "",
          },
        });

        if (!response.ok) {
          throw new Error(API response status: ${response.status});
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          results = data;
        } else {
          throw new Error("No quotes returned from API");
        }
      } catch (error) {
      
        try {
          const filePath = path.join(process.cwd(), "data", "quotes.json");
          const fileData = fs.readFileSync(filePath, "utf-8");
          const localQuotes = JSON.parse(fileData);

          const searchLower = String(query).toLowerCase();
          results = localQuotes.filter((q: any) =>
            (q.quote && String(q.quote).toLowerCase().includes(searchLower)) ||
            (q.author && String(q.author).toLowerCase().includes(searchLower)) ||
            (q.category && String(q.category).toLowerCase().includes(searchLower))
          );
        } catch (localError) {
          results = [];
        }
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
