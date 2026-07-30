import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getDailyQuoteInputSchema } from "../schemas/get-daily-quote.js";

export function registerGetDailyQuoteTool(server: McpServer) {
  server.registerTool(
    "get_daily_quote",
    {
      description: "Get the inspirational quote of the day.",
      inputSchema: getDailyQuoteInputSchema,
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { ok: true, stub: true, tool: "get_daily_quote" },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
