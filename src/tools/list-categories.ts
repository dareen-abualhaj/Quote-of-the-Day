import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ListCategoriesInputSchema } from "../schemas/list-categories.js";

export function registerListCategoriesTool(server: McpServer) {
  server.registerTool(
    "list_categories",
    {
      description: "List all available quote categories/tags.",
      inputSchema: ListCategoriesInputSchema,
    },
    async (input) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { ok: true, stub: true, tool: "list_categories" },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
