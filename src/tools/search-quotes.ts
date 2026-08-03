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
    async (input: any) => {
      const apiKey = process.env.API_KEY || process.env.API_NINJAS_KEY;
      const query = input?.query || input?.keyword || input?.topic || "";
      let results = [];

      try {
        // 1. المحاولة الأولى: جلب البيانات من API Ninjas
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
        // 2. الـ Fallback المحلي: البحث داخل ملف data/quotes.json
        try {
          const filePath = path.join(process.cwd(), "data", "quotes.json");
          const fileData = fs.readFileSync(filePath, "utf-8");
          const localQuotes = JSON.parse(fileData);

          const searchLower = query.toLowerCase();
          results = localQuotes.filter((q: any) =>
            (q.quote && q.quote.toLowerCase().includes(searchLower)) ||
            (q.author && q.author.toLowerCase().includes(searchLower)) ||
            (q.category && q.category.toLowerCase().includes(searchLower))
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
