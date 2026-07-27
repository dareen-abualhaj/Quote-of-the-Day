import type { McpServer } from "@modelcontextprotocol/server";

import { addNoteInputSchema } from "../schemas/add-note.js";

/** EXAMPLE Week 2 stub — append a new note (P0 candidate). */
export function registerAddNoteTool(server: McpServer): void {
  server.registerTool(
    "add_note",
    {
      description:
        "Create a new local note file with a title and body for later search.",
      inputSchema: addNoteInputSchema,
    },
    async ({ title, body }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stub: true,
                tool: "add_note",
                title,
                bodyPreview: body.slice(0, 80),
                message: "Replace this stub in Week 3 with a real file write.",
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
