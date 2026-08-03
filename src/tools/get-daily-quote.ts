import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getDailyQuoteInputSchema } from "../schemas/get-daily-quote.js";
import fs from "fs";
import path from "path";

export function registerGetDailyQuoteTool(server: McpServer) {
  server.registerTool(
    "get_daily_quote",
    {
      description: "Get the inspirational quote of the day.",
      inputSchema: getDailyQuoteInputSchema,
    },
    async (args: any) => {
      const apiKey = process.env.API_KEY;
      const category = args?.category;
      let resultQuote;

      try {
        // 1. محاولة الاتصال بـ API Ninjas
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
          throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();
        if (data && data.length > 0) {
          resultQuote = {
            quote: data[0].quote,
            author: data[0].author,
            category: data[0].category,
          };
        } else {
          throw new Error("Empty response from API");
        }
      } catch (error) {
        // 2. Fallback: القراءة من data/quotes.json المحلي عند حدوث خطأ
        const filePath = path.join(process.cwd(), "data", "quotes.json");
        const localData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        let filtered = localData;
        if (category) {
          filtered = localData.filter(
            (q: any) => q.category.toLowerCase() === category.toLowerCase()
          );
        }

        const pool = filtered.length > 0 ? filtered : localData;
        resultQuote = pool[Math.floor(Math.random() * pool.length)];
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(resultQuote, null, 2),
          },
        ],
      };
    }
  );
}