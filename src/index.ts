import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCreateQuoteTool } from "./tools/create-quote.js";
import { registerGetDailyQuoteTool } from "./tools/get-daily-quote.js";
import { registerSearchQuotesTool } from "./tools/search-quotes.js";
import { registerListCategoriesTool } from "./tools/list-categories.js";
import { registerUpdateQuoteTool } from "./tools/update-quote.js";
import { registerDeleteQuoteTool } from "./tools/delete-quote.js";
// Resolve the project root relative to this file.
// This avoids depending on process.cwd(), which can be different
// when the server is launched from Claude Desktop.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the project root.
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Creates a new MCP server instance.
export function createServer(): McpServer {
  const server = new McpServer({
    name: "quote-of-the-day",
    version: "0.1.0",
  });

  // P0 Tools
  registerGetDailyQuoteTool(server); // Tala
  registerSearchQuotesTool(server); // Dareen
  registerListCategoriesTool(server); // Saja
  registerCreateQuoteTool(server); // Tala
  registerUpdateQuoteTool(server); // Dareen
  registerDeleteQuoteTool(server); // Saja
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
