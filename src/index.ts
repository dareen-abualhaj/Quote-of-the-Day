import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerGetDailyQuoteTool } from "./tools/get-daily-quote.js";
import { registerSearchQuotesTool } from "./tools/search-quotes.js";
import { registerListCategoriesTool } from "./tools/list-categories.js";

// Creates a new MCP server instance.
export function createServer(): McpServer {
  const server = new McpServer({
    name: "quote-of-the-day",
    version: "0.1.0",
  });

  // P0 Tools
  registerGetDailyQuoteTool(server);     // Tala
  registerSearchQuotesTool(server);      // Dareen
  registerListCategoriesTool(server);    // Saja

  return server;
}

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Quote-of-the-Day MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
