import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import { getDailyQuoteInputSchema } from "../schemas/get-daily-quote.js";
import { getLocalDailyQuote } from "../lib/quotes.js";

const ALLOWED_HOST = "api.api-ninjas.com";

const DATA_ROOT = path.resolve(process.cwd(), "data");

async function readSafeQuoteFile(fileName: string) {
  const root = await fs.realpath(DATA_ROOT);// Get the trusted data directory
  const candidate = path.resolve(root, fileName);// Resolve the user-controlled path
  const relativeCandidate = path.relative(root, candidate);// FIRST security check:
  // Make sure the path is still inside DATA_ROOT
  if (
    relativeCandidate.startsWith("..") ||
    path.isAbsolute(relativeCandidate)
  ) {
    throw new Error("Path outside data directory is not allowed.");
  }
  const real = await fs.realpath(candidate);// SECOND security check:
  // Resolve symlinks only after confirming the path is inside data/
  const relativeReal = path.relative(root, real);
  if (
    relativeReal.startsWith("..") ||
    path.isAbsolute(relativeReal)
  ) {
    throw new Error("Path outside data directory is not allowed.");
  }
  // Read the file only after all security checks pass
  const content = await fs.readFile(real, "utf-8");
  const data = JSON.parse(content);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Quote file is empty or has an invalid format.");
  }
  return data[Math.floor(Math.random() * data.length)];
}
export function registerGetDailyQuoteTool(server: McpServer) {
  server.registerTool(
    "get_daily_quote",
    {
      description:
        "Gets a daily inspirational quote from a safe local file or the external API.",
      inputSchema: getDailyQuoteInputSchema,
    },

    async (args) => {
      const fileName = args?.file;

      if (fileName) {// 1. Local file mode
        try {
          const quoteData = await readSafeQuoteFile(fileName);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(quoteData, null, 2),
              },
            ],
          };
        } catch (error) {
          console.error(
            "get_daily_quote file error:",
            error instanceof Error ? error.message : error
          );

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    error:
                      error instanceof Error
                        ? error.message
                        : "Unable to read quote file.",
                  },
                  null,
                  2
                ),
              },
            ],
            isError: true,
          };
        }
      }

      const apiKey = process.env.API_KEY || process.env.API_NINJAS_KEY; // 2. External API mode

      if (apiKey) {
        try {
          const url = new URL("https://api.api-ninjas.com/v1/quotes");

          // SSRF protection: only allow the expected API host
          if (url.hostname !== ALLOWED_HOST) {
            throw new Error("External host is not allowed.");
          }

          const controller = new AbortController();

          const timeout = setTimeout(() => {
            controller.abort();
          }, 10000);

          try {
            const response = await fetch(url, {
              headers: {
                "X-Api-Key": apiKey,
              },
              signal: controller.signal,
            });

            if (!response.ok) {
              throw new Error(`API error ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data) || data.length === 0) {
              throw new Error("No quote returned from API");
            }

            const quoteData = data[0];

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(quoteData, null, 2),
                },
              ],
            };
          } finally {
            clearTimeout(timeout);
          }
        } catch (error) {
          console.error(
            "get_daily_quote API error:",
            error instanceof Error ? error.message : error
          );

          console.error("Using local quote fallback.");
        }
      }
      const quoteData = getLocalDailyQuote();// 3. Local fallback
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(quoteData, null, 2),
          },
        ],
      };
    }
  );
}
