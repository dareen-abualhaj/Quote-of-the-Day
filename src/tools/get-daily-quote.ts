import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GetDailyQuoteInputSchema } from "../schemas/get-daily-quote.js";
export function registerGetDailyQuoteTool(server: McpServer) {
  server.registerTool(
    "get_daily_quote",
    {
      description: "Get the inspirational quote of the day.",
      inputSchema: GetDailyQuoteInputSchema,
    },
    async (input) => {
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
