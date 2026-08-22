# Demo Script — Quote of the Day MCP Server

**Total time: 5:00.** If we run long, we cut a slide — never the live demo.

---

## 0:00–0:40 — The Problem (0:40)

- Finding a good quote today means: open a browser, search a third-party site,
  scroll past ads, copy-paste one quote.
- No AI chat today can fetch, search, or organize quotes on its own — there's
  no tool for it.
- We built that tool, as an MCP server: three read tools any MCP-compatible
  AI host (Claude, Cursor, etc.) can call directly in conversation.

*(Slide 2 — Problem)*

---

## 0:40–1:10 — Architecture (0:30)

*(Slide 3 — Architecture diagram, one slide, no walking through code)*

- One MCP server, three tools exposed over stdio: `get_daily_quote`,
  `search_quotes`, `list_categories`.
- Every tool call is validated with Zod before it runs.
- Data source is layered: local file → external API (if a key is set) →
  local fallback — so a missing key or a dead network never breaks a call.

---

## 1:10–3:30 — Live Tool Calls (2:20)

Run these directly in MCP Inspector, connected to the real server — not
slides. Pulled from `examples/conversations.md`, already verified working.

**Live prompt 1 — Conversation A (Daily Quote)**
> Give me a quote of the day.

Expected: `get_daily_quote` called with no arguments, returns one quote,
author, and category as JSON. Read the quote out loud instead of narrating
the JSON.

**Live prompt 2 — Conversation B (Search)**
> Find me 3 quotes about courage.

Expected: `search_quotes` called with `keyword: "courage"`, `limit: 3`,
returns exactly 3 quotes. Point out the limit is respected.

**Backup prompt — Conversation C (Categories + Search)**
> What quote categories are available? Then find me 2 quotes about
> motivation.

Only run this if there's spare time or if a live prompt above needs a
retry. It chains `list_categories` then `search_quotes` in one exchange —
good proof the tools compose.

---

## 3:30–4:30 — What We'd Build Next (1:00)

*(Slide 4 — Tools table can double as the anchor for this beat)*

- `create_quote` / `update_quote` / `delete_quote` are already built and
  tested (UUID-based ids, atomic writes, `confirm: true` guard on delete) —
  next step is wiring them into the same demo flow.
- Rate limiting / per-session quotas if this were exposed publicly.
- A larger, curated quote dataset instead of the current fixture set.

---

## 4:30–5:00 — Ready for Questions (0:30)

*(Slide 5 — Next steps / thank you)*

- Recap in one line: an MCP server that gives any AI host three working
  quote tools, fully offline-capable, input-validated, and demo-tested.
- Open the floor.

---

## Backup Plan — Offline / Wi-Fi Failure

No backup plan is actually needed to "improvise" — the server is offline-first
by design (see `docs/data-plan.md`):

- No `.env` / API key set → every tool automatically reads from the bundled
  local fixture at `data/quotes.json`. No network call is ever made in that
  path.
- Before the demo, double-check `.env` has **no** API key set on the demo
  machine, so the local-fixture path is guaranteed to run — not the live API
  path, which is the one thing Wi-Fi could break.
- If MCP Inspector's browser UI fails to load (rare, usually a port
  conflict), fall back to the CLI form of the same call, e.g.:
  ```bash
  npx @modelcontextprotocol/inspector --cli npx tsx src/index.ts \
    --method tools/call --tool-name get_daily_quote
  ```
  This prints the JSON result directly in the terminal — no browser, no
  network dependency beyond what's already local.
