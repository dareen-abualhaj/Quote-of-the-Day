# Design doc — Week 2

> Mandatory for mentor review. Open a GitHub Issue linking to this file before Week 3.

**Students:** Dareen Abualhaj, Tala Saabneh, Saja Sayaara  
**Repo:** Quote-of-the-Day  
**Branch:** `main`  
**GitHub Issue:** Week 2 design review  

---

## 1. Pitch

Many individuals, content creators, and students look for relevant daily quotes, inspirational content, or author-specific wisdom during their workflow. Finding these quotes usually requires searching manually across third-party websites or APIs. This MCP server exposes tools that allow AI assistants to seamlessly query quotes by keyword, author, or category, as well as fetch daily quotes directly through natural language.

## 2. Demo Day user story

During the live demo, the host connects the AI client (Claude / MCP Inspector) to the Quote-of-the-Day MCP server. The user asks, *"Can you find me a motivational quote about courage, and list available quote categories?"* The AI model identifies the request and sequentially invokes `search_quotes` with the keyword "courage", followed by `list_categories` to display all available topics. The audience sees the formatted quotes and category list returned live in the chat interface.

## 3. Tool inventory (4–7 tools)

| Priority | Tool name (`verb_noun`) | Description (for the model) | Inputs | Outputs |
| --- | --- | --- | --- | --- |
| P0 | `get_daily_quote` | Fetch a single daily inspirational quote. | None | `{ quote: string, author: string, category: string }` |
| P0 | `search_quotes` | Search for quotes by keyword, topic, or author name. | `keyword` (string) | `{ results: Array<{ quote: string, author: string }> }` |
| P0 | `list_categories` | Retrieve all available quote categories/tags. | None | `{ categories: Array<string> }` |
| P1 | `add_favorite_quote` | Save a quote to the user's local favorites list. | `quote` (string), `author` (string) | `{ success: boolean, message: string }` |
| P1 | `list_favorite_quotes` | Retrieve all quotes stored in the user's favorites list. | None | `{ favorites: Array<{ quote: string, author: string }> }` |

## 4. Out of scope

- User authentication, JWT sessions, or multi-tenant user accounts.
- Image/graphic generation for quotes (e.g., social media poster generation).
- Direct automated integration or posting to external social media platforms (X/Twitter, LinkedIn).

## 5. Success criteria

We Will succees on Demo Day if:

- [ ] `search_quotes` returns matching quotes from fixture data for a given keyword without schema errors.
- [ ] `get_daily_quote` successfully fetches and renders a valid quote structure live in the Inspector.
- [ ] `list_categories` successfully returns the full list of available categories.

## 6. Top risks

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| External quotes API downtime or rate limiting during testing | Medium | Implement local fallback JSON fixtures for offline development and testing. |
| Model failing to pass correct arguments to Zod schema | Low | Write sharp, explicit descriptions in Zod `.describe()` 
fields for every tool parameter. |
## Notes from reading Official Filesystem MCP Server

- **Naming Patterns:** Tools consistently use a strict `verb_noun` snake_case naming convention (e.g., `read_file`, `list_directory`), making their intent instantly clear.
- **Description Length:** Descriptions are concise (1–2 sentences) and focused purely on instructing the AI model when and how to invoke the tool.
- **Parameter Clarity:** Parameters use explicit `.describe()` annotations in Zod to specify allowed types, bounds, and defaults rather than relying on vague names.
- **Error Phrasing:** Validations and edge cases (e.g., required lengths, allowed formats) are directly stated in the Zod error messages to guide the client on failure.
- **Output Structure:** Tool responses favor structured JSON objects over plain unstructured strings to make response parsing reliable for the model.

## 7. Evidence for Week 2

- [ ] `docs/project-choice.md` filled
- [ ] ≥3 Zod schemas under `src/schemas/`
- [ ] Tools registered (stubs OK)
- [ ] `examples/<tool>.json` for each registered tool
- [ ] Inspector screenshots attached to the GitHub Issue

## Mentor decision

- Status: pending
- Comments:
