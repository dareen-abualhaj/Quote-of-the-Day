import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { registerGreetTool } from "./tools/greet.js";
// Week 2: import and register your project tools here, for example:
// import { registerSearchNotesTool } from "./tools/search-notes.js";
// import { registerListNotesTool } from "./tools/list-notes.js";
// import { registerAddNoteTool } from "./tools/add-note.js";

/**
 * Factory used by stdio (and later HTTP) so every connection gets a fresh server.
 * Register all tools inside this function — never on a shared global instance.
 */
function createServer(): McpServer {
  const server = new McpServer({
    name: "mcprepo",
    version: "0.1.0",
  });

  // Week 1 — one working tool so you can verify Inspector immediately
  registerGreetTool(server);

  // Week 2 — register your multi-tool skeleton (stubs are OK)
  // registerSearchNotesTool(server);
  // registerListNotesTool(server);
  // registerAddNoteTool(server);

  return server;
}

void serveStdio(createServer);
console.error("mcprepo MCP server running on stdio");
