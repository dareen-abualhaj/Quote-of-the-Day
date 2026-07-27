import type { McpServer } from "@modelcontextprotocol/server";

import { searchNotesInputSchema } from "../schemas/search-notes.js";

/**
 * EXAMPLE Week 2 stub — Notes & FAQ Search (P0 candidate).
 *
 * How to use:
 * 1. Pick Notes & FAQ as your project (or copy this pattern for your idea).
 * 2. Uncomment the import + register call in src/index.ts.
 * 3. Leave the handler as a stub until Week 3 (real data).
 */
export function registerSearchNotesTool(server: McpServer): void {
  server.registerTool(
    "search_notes",
    {
      description:
        "Search local notes and FAQ files by keyword. Returns matching snippets with file paths.",
      inputSchema: searchNotesInputSchema,
    },
    async ({ query, limit }) => {
      // Week 2: stub is intentional. Week 3: replace with a real file search.
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stub: true,
                tool: "search_notes",
                query,
                limit: limit ?? 5,
                message:
                  "Replace this stub in Week 3 with a real notes/FAQ search.",
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}
