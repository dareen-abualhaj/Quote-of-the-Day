# MCPRepo — NextFlows Academy Starter

> Part of **[NextFlows Academy](https://nextflows.ai/academy)** — the free cohort program **Building an MCP for an AI Engine**.

Clone this repo to build your **Model Context Protocol (MCP)** server in TypeScript. By Demo Day you will ship a public GitHub repo with real tools, Zod validation, docs, and a live demo — the same path used in the free NextFlows Academy cohort.

**Program hub:** [nextflows.ai/academy](https://nextflows.ai/academy)  
**Full program page (in this repo):** [`docs/PROGRAM.md`](docs/PROGRAM.md)  
**Apply:** [Cohort application](https://nextflows.ai/academy/apply?cohort=1&program=building-mcp-ai-engines)

---

## About NextFlows Academy

[NextFlows Academy](https://nextflows.ai/academy) runs structured, cohort-based programs with live sessions, mentor support, and a real project you ship by the end.

This repository belongs to:

| | |
| --- | --- |
| **Program** | Building an MCP for an AI Engine |
| **Audience** | 4th & 5th year CS / CE students |
| **Duration** | 6 weeks |
| **Format** | Cohort + project |
| **Price** | Free |
| **Level** | Intermediate |
| **Outcome** | Shipped MCP server on GitHub |
| **Schedule** | Wed & Sat online 1:30–3:30 PM + Monday on-site workshop days |

You go from “what’s an MCP?” to a working MCP server connected to an AI engine (for example Claude), fully documented, and live on GitHub.

See [`docs/PROGRAM.md`](docs/PROGRAM.md) for outcomes, weekly plan, starter projects, and who it’s for.

---

## What you get

| Path | Purpose |
| --- | --- |
| `src/index.ts` | MCP server + stdio transport |
| `src/tools/` | One register helper per tool |
| `src/schemas/` | Zod input contracts (with `.describe(...)`) |
| `examples/` | Sample JSON args for Inspector |
| `docs/PROGRAM.md` | Full NextFlows Academy program page |
| `docs/WEEK-2.md` | Full Week 2 step-by-step plan |
| `docs/CURRICULUM.md` | 6-week overview |
| `docs/project-choice.md` | Week 2 project choice template |
| `docs/design.md` | Week 2 design doc template |

**Week 1 is already wired:** a working `greet` tool so you can open Inspector on day one.

**Week 2 examples included:** stub tools for *Notes & FAQ Search* (`search_notes`, `list_notes`, `add_note`). Enable them when you pick that starter (or copy the pattern for your own idea).

## Prerequisites

- Node.js **20+** (`node -v`)
- npm (`npm -v`)
- Git + a GitHub account
- Cursor or VS Code

## Quick start

```bash
git clone <YOUR_FORK_OR_ORG_URL>/MCPRepo.git
cd MCPRepo
npm install
npm run inspect
```

In the Inspector browser tab:

1. Click **Connect**
2. Open **Tools**
3. Select `greet` and put `Alex` in the **name** field (see `examples/greet.json` for the full args shape)
4. Try invalid input (empty name) and confirm Zod rejects it

To run the server alone (waits on stdin):

```bash
npm run dev
```

> **Important:** log only with `console.error`. Never use `console.log` — stdout is reserved for the MCP protocol.

## Week 2

Week 2 is design-first. Follow [`docs/WEEK-2.md`](docs/WEEK-2.md).

Useful scripts:

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the MCP server on stdio (stays alive; stop with Ctrl+C) |
| `npm start` | Same as `dev` |
| `npm run inspect` | Open MCP Inspector against this server |

## Stack

- TypeScript via `tsx` (no build step early on)
- Official MCP TypeScript SDK (`@modelcontextprotocol/server`)
- Zod for tool `inputSchema`
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) for local testing
- stdio transport for Claude Desktop / Cursor demos

## Six-week journey

| Week | Focus |
| --- | --- |
| 1 | Set up & first MCP tool (`greet` ✅ in this repo) |
| 2 | Design your own tools → see [`docs/WEEK-2.md`](docs/WEEK-2.md) |
| 3 | Connect tools to real data |
| 4 | Make it safe & reliable |
| 5 | Test & write docs people can follow |
| 6 | Ship on GitHub & Demo Day |

Full program details: [`docs/PROGRAM.md`](docs/PROGRAM.md)

## Starter project options (pick in Week 2)

1. **Notes & FAQ Search** — fully offline (example stubs included)
2. **Personal Expense Tracker** — summarize spending from a spreadsheet
3. **To-Do List** — create / list / complete tasks
4. **Weather Briefing** — free API (e.g. Open-Meteo), no paid keys
5. **Quote of the Day** — simple offline or public API

Advanced ideas (repo health, course planner, job tracker) need **mentor approval** before you expand scope.

## Repo layout after Week 2

```text
MCPRepo/
├── docs/
│   ├── PROGRAM.md
│   ├── CURRICULUM.md
│   ├── WEEK-2.md
│   ├── project-choice.md
│   └── design.md
├── examples/
│   └── <tool_name>.json
├── src/
│   ├── index.ts
│   ├── schemas/
│   └── tools/
├── package.json
└── README.md
```

## Rules that matter

- One job per tool; use `verb_noun` names (`search_notes`, `add_expense`)
- Write descriptions for the **model**, not only for humans
- Every Zod field needs `.describe(...)`
- Prefer small focused tools over one mega-tool with an `action` enum
- Avoid paid APIs / OAuth-heavy projects in Weeks 1–2

## Links

- [NextFlows Academy](https://nextflows.ai/academy)
- [Program page (this repo)](docs/PROGRAM.md)
- [Apply for Cohort #1](https://nextflows.ai/academy/apply?cohort=1&program=building-mcp-ai-engines)
- [MCP docs](https://modelcontextprotocol.io/docs)
- [MCP specification](https://modelcontextprotocol.io/specification/latest)
- [Build your first server (TypeScript SDK)](https://ts.sdk.modelcontextprotocol.io/v2/get-started/first-server.html)

## License

MIT — built for [NextFlows Academy](https://nextflows.ai/academy) students.
