import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { registerGetDailyQuoteTool } from "./tools/get-daily-quote.js";
import { registerSearchQuotesTool } from "./tools/search-quotes.js";
import { registerListCategoriesTool } from "./tools/list-categories.js";

//  Creates a new MCP server instance.
// Every client connection gets its own server.
function createServer(): McpServer {
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

void serveStdio(createServer);
console.error("Quote-of-the-Day MCP server running on stdio");
