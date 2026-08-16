import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ListCategoriesInputSchema } from "../schemas/list-categories.js";
import { getLocalCategories } from "../lib/quotes.js";

export function registerListCategoriesTool(server: McpServer) {
  server.registerTool(
    "list_categories",
    {
      description: "List all available quote categories/tags.",
      inputSchema: ListCategoriesInputSchema,
    },
    async (input: any) => {
      const limit = input?.limit ?? 10;
      if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
  return {
    content: [
      {
        type: "text",
        text: "Request blocked: limit must be an integer between 1 and 50.",
      },
    ],
    isError: true,
  };
}
      
      // استدعاء Pure Function
      const categories = getLocalCategories(limit);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: true,
                count: categories.length,
                categories: categories,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
