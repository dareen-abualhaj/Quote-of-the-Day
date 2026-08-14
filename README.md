# Quote-of-the-Day — MCP Server

> Part of **[NextFlows Academy](https://nextflows.ai/academy)** — cohort program **Building an MCP for an AI Engine**.

MCP (Model Context Protocol) server that lets an AI host (Claude, MCP Inspector, etc.) fetch, search, and browse inspirational quotes — either from a curated local dataset or from a live external API, with a safe local fallback.

**Team:** Tala Saabneh · Dareen Abualhaj · Saja Sayare
**Status:** Week 4 — Hardening 

---

## What this server does

Ask your AI host things like:

- *"Give me a quote of the day."*
- *"Find me quotes about courage."*
- *"What quote categories are available?"*

The model calls the matching tool below and returns a formatted result.

## Tools

| Tool | Description | Key inputs | Owner |
| --- | --- | --- | --- |
| `get_daily_quote` | Gets a daily inspirational quote from a safe local file or the external API. | `file` *(optional)* — name/relative path of a quote file inside `data/` | Tala |
| `search_quotes` | Searches for quotes matching a keyword, topic, or author name. | `keyword` *(required, 2–100 chars, no digits)*, `limit` *(optional, 1–50, default 10)* | Dareen |
| `list_categories` | Lists all available quote categories/tags. | `limit` *(optional, integer)* | Saja |

Example arguments for each tool live in [`examples/`](examples/).

## Data source & fallback order

`get_daily_quote` and `search_quotes` resolve data in this order:

1. **Local file** — if `file` is passed, read it safely from `data/` (path-traversal guarded).
2. **External API** — if `API_NINJAS_KEY` is set in `.env`, call `api.api-ninjas.com` (host allowlisted, 10s timeout).
3. **Local fallback** — if no key or the API call fails, fall back to the bundled [`data/quotes.json`](data/quotes.json).

This keeps the server fully demoable **offline**, with no paid keys required.

## Prerequisites

- Node.js **20+** (`node -v`)
- npm (`npm -v`)

## Quick start

```bash
git clone <YOUR_FORK_OR_ORG_URL>/Quote-of-the-Day.git
cd Quote-of-the-Day
npm install
cp .env.example .env   # optional — only needed for live API mode
npm run inspect
```

In the Inspector browser tab:

1. Click **Connect**
2. Open **Tools**
3. Try `get_daily_quote`, `search_quotes` (e.g. `keyword: "motivation"`), and `list_categories`
4. Try invalid input (e.g. a `keyword` with digits, or `limit > 50`) and confirm Zod rejects it

To run the server alone (waits on stdin):

```bash
npm run dev
```

> **Important:** the server logs only with `console.error`. Never use `console.log` — stdout is reserved for the MCP protocol.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `API_NINJAS_KEY` | No | Enables live quote fetching from `api.api-ninjas.com`. Without it, the server runs fully offline on local data. |

Copy `.env.example` → `.env` and fill in your own key. `.env` is git-ignored — never commit real keys.

## Security hardening (Week 4)

Full details in [`SECURITY.md`](SECURITY.md) and [`docs/threat-model.md`](docs/threat-model.md). Summary:

- ✅ Strict Zod input validation (types, length limits, character allowlists)
- ✅ Path-traversal protection on local file reads (`get_daily_quote` `file` arg)
- ✅ SSRF protection — outbound requests locked to the `api.api-ninjas.com` allowlist
- ✅ 10-second `AbortController` timeout on all external HTTP calls
- ✅ Output caps (max 50 records) on search/list results
- ✅ Secrets isolated in `.env` (git-ignored); never logged or echoed in tool errors
- ✅ Short, actionable tool errors — no raw stack traces leaked to the model

## Project structure

```text
Quote-of-the-Day/
├── data/
│   └── quotes.json              # Local quote dataset (fallback + offline demo data)
├── docs/
│   ├── data-plan.md
│   ├── design.md                # Week 2 design doc
│   ├── project-choice.md        # Week 2 project pitch & scoring
│   ├── review-checklist.md
│   └── threat-model.md          # Week 4 security threat model
├── examples/
│   ├── get_daily_quote.json
│   ├── list_categories.json
│   └── search_quotes.json
├── scripts/
│   └── check-schema.ts          # Validates data/quotes.json against the expected shape
├── src/
│   ├── index.ts                 # MCP server entrypoint + stdio transport
│   ├── lib/
│   │   └── quotes.ts            # Pure functions: load / search / pick local quotes
│   ├── schemas/
│   │   ├── get-daily-quote.ts
│   │   ├── list-categories.ts
│   │   └── search-quotes.ts
│   └── tools/
│       ├── get-daily-quote.ts
│       ├── list-categories.ts
│       └── search-quotes.ts
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

MIT
