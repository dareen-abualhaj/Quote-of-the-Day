# Quote-of-the-Day — MCP Server

An MCP (Model Context Protocol) server that lets an AI host (Claude, MCP Inspector, etc.) fetch, search, browse, and now manage inspirational quotes — either from a curated local dataset or a live external API, with a safe local fallback, plus create/update/delete tools that write straight back to the local dataset.

Ask your AI host things like:
- "Give me a quote of the day."
- "Find me quotes about courage."
- "What quote categories are available?"
- "Add a new quote from Marie Curie about perseverance."
- "Update quote &lt;id&gt; to fix a typo in the author name."
- "Delete quote &lt;id&gt;." (requires an explicit confirmation)

Built by Tala Saabneh, Dareen Abualhaj, and Saja Sayare as part of [NextFlows Academy](https://nextflows.ai/academy) — the cohort program *Building an MCP for an AI Engine*.

## Requirements

- Node.js **20+** (`node -v`)
- npm (`npm -v`)

## Install

```bash
git clone <YOUR_FORK_OR_ORG_URL>/Quote-of-the-Day.git
cd Quote-of-the-Day
npm install
cp .env.example .env   # optional — only needed for live API mode
```

`.env` is git-ignored — never commit a real key. Leave `API_KEY` blank (or delete the line) to run fully offline on `data/quotes.json`.

## Run

To run the server alone (it waits on stdin — this is expected):

```bash
npm run dev
```

Stop it with `Ctrl+C`. `npm start` does the same thing.

> **Important:** the server logs only with `console.error`. Never `console.log` — stdout is reserved for the MCP protocol.

## Inspect it (recommended for first run)

```bash
npm run inspect
```

This opens MCP Inspector in your browser, pointed at this server. From there:

1. Click **Connect**
2. Open the **Tools** tab
3. Try `get_daily_quote`, `search_quotes` (e.g. `keyword: "motivation"`), and `list_categories`
4. Try invalid input (a keyword with digits, or a `limit` over 50) and confirm Zod rejects it with a clear error
5. Try the write tools: `create_quote`, then `update_quote` with the returned `id`, then `delete_quote` with that same `id` and `confirm: true`

## Tools

| Tool | Description | Key inputs | Owner |
| --- | --- | --- | --- |
| `get_daily_quote` | Gets a daily inspirational quote from a safe local file or the external API. | `file` (optional) — name/relative path of a quote file inside `data/` | Tala |
| `search_quotes` | Searches for quotes matching a keyword, topic, or author name. | `keyword` (required, 2–100 chars, no digits), `limit` (optional, 1–50, default 10) | Dareen |
| `list_categories` | Lists all available quote categories/tags. | `limit` (optional, integer, 1–50, default 10) | Saja |
| `create_quote` | Adds a new quote to the local `quotes.json` dataset. No path/filename input — it can only ever write to the server's own data file. | `quote` (3–500 chars), `author` (letters/spaces/`.`/`'`/`-` only), `category` (letters/spaces/hyphens only) | Tala |
| `update_quote` | Updates one or more fields of an existing quote, addressed by `id`. Fails cleanly (no-op) if the `id` doesn't exist — never creates a new entry. | `id` (UUID, required), `quote`/`author`/`category` (all optional — at least one required) | Dareen |
| `delete_quote` | Permanently deletes exactly one quote by `id`. Always backs up `quotes.json` first and refuses to empty the collection entirely. | `id` (UUID, required), `confirm` (must be the literal `true`) | Saja |

Example arguments for the original three tools live in `examples/`.

### About the write tools (`create_quote` / `update_quote` / `delete_quote`)

- **Ids** — every quote has a UUID `id`. Legacy entries in `data/quotes.json` that predate these tools are automatically back-filled with an `id` the first time a write tool runs.
- **Atomic writes** — every save writes to a temp file in `data/` and then renames it over `quotes.json`, so a crash mid-write can never corrupt the file.
- **Automatic backups** — before any real change, a timestamped `quotes.json.bak-<timestamp>` copy is written to `data/`, so any bad create/update/delete can be reverted by hand.
- **Guardrails** — `create_quote` refuses once the collection hits 1000 quotes (`MAX_QUOTES`); `delete_quote` refuses to remove the last remaining quote and requires `confirm: true` — a prompt-injection attempt can't satisfy this by accident, and Zod rejects the call before any file is touched if it's missing or `false`.
- **No path input** — unlike `get_daily_quote`, none of the write tools accept a filename/path from the caller. They only ever read and write the server's own `data/quotes.json`, which removes path traversal as an attack surface for writes entirely.

### Data source & fallback order

`get_daily_quote` and `search_quotes` resolve data in this order:

1. **Local file** — if `file` is passed, it's read safely from `data/` (path-traversal guarded).
2. **External API** — if `API_KEY` is set in `.env`, calls `api.api-ninjas.com` (host allowlisted, 10s timeout).
3. **Local fallback** — if no key is set or the API call fails, falls back to the bundled `data/quotes.json`.

## Example prompts
For complete model-to-MCP interaction examples, see [Example Conversations](examples/conversations.md).
Once connected in Claude Desktop, Cursor, or Inspector, try:


- *"Give me today's quote."* → calls `get_daily_quote` with no arguments
- *"Show me a quote from the file `data/quotes.json`."* → calls `get_daily_quote` with `file: "quotes.json"`
- *"Find me quotes about courage."* → calls `search_quotes` with `keyword: "courage"`
- *"Give me 5 quotes mentioning Einstein."* → calls `search_quotes` with `keyword: "Einstein", limit: 5`
- *"What quote categories do you have?"* → calls `list_categories`
- *"Add a quote: 'The only way out is through', author Robert Frost, category resilience."* → calls `create_quote` with `quote`, `author: "Robert Frost"`, `category: "resilience"`
- *"Change the category of quote &lt;id&gt; to motivation."* → calls `update_quote` with `id`, `category: "motivation"`
- *"Delete quote &lt;id&gt;, I confirm."* → calls `delete_quote` with `id`, `confirm: true`

## Troubleshooting

**`npm install` or `npm run dev` fails with syntax/engine errors**
Your Node version is too old — this project needs Node 20+. Check with `node -v` and upgrade (e.g. via [nvm](https://github.com/nvm-sh/nvm)) if needed.

**Inspector opens but "Connect" fails, or the server exits immediately**
Usually means `npm install` didn't finish cleanly. Delete `node_modules` and `package-lock.json` if you edited them, then re-run `npm install`. Make sure you're running `npm run inspect` from inside the `Quote-of-the-Day` folder, not its parent.

**A tool call returns a validation error like `"Keyword must be at least 2 characters long."` or `"Keyword cannot contain numbers."`**
This is Zod doing its job — `search_quotes` requires a `keyword` of 2–100 characters with no digits. Check `examples/search_quotes.json` for a working shape; note the argument name is `keyword`, not `query`.

## Security hardening (Week 4)

Full details in [`SECURITY.md`](SECURITY.md) and [`docs/threat-model.md`](docs/threat-model.md). Summary:

- ✅ Strict Zod input validation (types, length limits, character allowlists)
- ✅ Path-traversal protection on local file reads (`get_daily_quote` `file` arg)
- ✅ SSRF protection — outbound requests locked to the `api.api-ninjas.com` allowlist
- ✅ 10-second `AbortController` timeout on all external HTTP calls
- ✅ Output caps (max 50 records) on search/list results
- ✅ Secrets isolated in `.env` (git-ignored); never logged or echoed in tool errors
- ✅ Short, actionable tool errors — no raw stack traces leaked to the model
- ✅ Write tools (`create_quote`/`update_quote`/`delete_quote`) take no path/filename input — no user-controlled path exists to sanitize
- ✅ Atomic writes (temp file + rename) and a timestamped backup before every write, so a crash or a bad edit can't corrupt or permanently lose data
- ✅ `delete_quote` requires a literal `confirm: true` and refuses to empty the collection; `create_quote` is capped at 1000 quotes to prevent bloat

## Project structure

```text
Quote-of-the-Day/
├── data/
│   └── quotes.json              # Local quote dataset (fallback + offline demo data)
├── docs/
│   ├── data-plan.md
│   ├── demo-script.md           # 5-minute live demo script
│   ├── design.md                # Week 2 design doc
│   ├── project-choice.md        # Week 2 project pitch & scoring
│   ├── review-checklist.md
│   ├── test-plan.md
│   └── threat-model.md          # Week 4 security threat model
├── examples/
│   ├── conversations.md
│   ├── get_daily_quote.json
│   ├── list_categories.json
│   └── search_quotes.json
│ 
├── src/
│   ├── index.ts                 # MCP server entrypoint + stdio transport
│   ├── lib/
│   │   ├── quotes.ts            # Pure functions: load / search / pick local quotes
│   │   └── quotes-write.ts      # Atomic writes, backups, id lookup for create/update/delete
│   ├── schemas/
│   │   ├── create-quote.ts
│   │   ├── delete-quote.ts
│   │   ├── get-daily-quote.ts
│   │   ├── list-categories.ts
│   │   ├── search-quotes.ts
│   │   └── update-quote.ts
│   └── tools/
│       ├── create-quote.ts
│       ├── delete-quote.ts
│       ├── get-daily-quote.ts
│       ├── list-categories.ts
│       ├── search-quotes.ts
│       └── update-quote.ts
├── .env.example
├── .gitignore
├── package.json
├── SECURITY.md
└── tsconfig.json
```

## Stack

- TypeScript via `tsx` (no build step)
- Official MCP TypeScript SDK (`@modelcontextprotocol/sdk`)
- Zod v4 for tool `inputSchema` validation
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) for local testing
- stdio transport for Claude Desktop / Cursor demos

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` / `npm start` | Start the MCP server on stdio (stays alive; stop with Ctrl+C) |
| `npm run inspect` | Open MCP Inspector against this server |

## Links

- [NextFlows Academy](https://nextflows.ai/academy)
- [MCP docs](https://modelcontextprotocol.io/docs)
- [MCP specification](https://modelcontextprotocol.io/specification/latest)

## License

MIT — see [`LICENSE`](LICENSE).
