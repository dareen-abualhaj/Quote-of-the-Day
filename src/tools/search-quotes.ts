import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SearchQuotesInputSchema } from "../schemas/search-quotes.js";

export function registerSearchQuotesTool(server: McpServer) {
  server.registerTool(
    "search_quotes",
    {
      description: "Search for quotes matching a keyword, topic, or author.",
      inputSchema: SearchQuotesInputSchema,
    },
    async (input) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { ok: true, stub: true, tool: "search_quotes", input },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
