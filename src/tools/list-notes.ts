import type { McpServer } from "@modelcontextprotocol/server";

import { listNotesInputSchema } from "../schemas/list-notes.js";

/** EXAMPLE Week 2 stub — list available note/FAQ files. */
export function registerListNotesTool(server: McpServer): void {
  server.registerTool(
    "list_notes",
    {
      description:
        "List available local note and FAQ files the model can search or open.",
      inputSchema: listNotesInputSchema,
    },
    async ({ folder }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stub: true,
                tool: "list_notes",
                folder: folder ?? "notes",
                message: "Replace this stub in Week 3 with a real directory listing.",
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
