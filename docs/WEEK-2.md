# Week 2 — Design your own tools

**Goal:** A designed multi-tool skeleton.  
Pick a starter project, write a mentor-ready design doc, define Zod schemas for your P0 tools, register stubs, and prove every tool appears in Inspector — even if handlers still return `{ "stub": true }`.

**Included this week (cohort):** 2 live sessions + 1:1 mentor session.

---

## Step 1 — Create your branch

From your Week 1 main branch:

```bash
git checkout -b week-2-design
```

---

## Step 2 — Pick one project idea

Choose one starter:

| Starter | Why it works |
| --- | --- |
| Notes & FAQ Search | Fully offline; example stubs already in this repo |
| Personal Expense Tracker | Spreadsheet / CSV data |
| To-Do List | Simple CRUD mental model |
| Weather Briefing | Free API (Open-Meteo), no paid keys |
| Quote of the Day | Tiny scope; great for first Demo Day |

Score on: **interest**, **offline demoability**, **no paid API keys**, **fit in four remaining build weeks**.

Write one sentence in [`project-choice.md`](./project-choice.md):

> I am building X for Y so that Z.

---

## Step 3 — Learn the tool design rules

- One job per tool
- Use `verb_noun` names (`search_notes`, `add_expense`)
- Write descriptions for the **model**
- Prefer small focused tools over one mega-tool with an `action` enum

---

## Step 4 — Write `docs/design.md` (required)

Use the template in [`design.md`](./design.md). Include:

- Pitch
- Demo Day user story
- Tool inventory table (4–7 tools with inputs / outputs)
- Exactly **3 tools** marked as **P0**
- Out-of-scope list
- Success criteria
- Top risks

Then open a **GitHub Issue** for mentor review **before Week 3**.

---

## Step 5 — Add Zod schemas (required)

Create schemas for at least your 3 P0 tools under `src/schemas/`.

- Every field needs `.describe(...)`
- Handlers may still be stubs

Example schemas already in the repo (Notes starter):

- `src/schemas/search-notes.ts`
- `src/schemas/list-notes.ts`
- `src/schemas/add-note.ts`

---

## Step 6 — Register the skeleton

Keep this layout:

```text
src/index.ts
src/tools/
src/schemas/
examples/
docs/
```

Register every inventory tool. Stub handlers can return JSON with `{ "stub": true }`.

If you chose **Notes & FAQ Search**, uncomment the three register calls in `src/index.ts`.

---

## Step 7 — Inspector + examples (required)

1. Add `examples/<tool_name>.json` for each tool
2. Run:

```bash
npm run inspect
```

3. Confirm Inspector lists all tools
4. Confirm valid samples are accepted
5. Confirm bad input is rejected
6. Attach screenshots to your design GitHub Issue

---

## Step 8 — Definition of done

You are done with Week 2 when:

- [ ] Project choice is filed in `docs/project-choice.md`
- [ ] Design is approved (or pending with Issue link) in `docs/design.md`
- [ ] ≥3 Zod schemas exist
- [ ] Server starts cleanly (`npm start` / `npm run inspect`)
- [ ] Example JSON files are present
- [ ] `week-2-design` branch is pushed

---

## Common mistakes

- Logging to stdout (breaks stdio) — use `console.error`
- Vague tool names / descriptions the model cannot select
- Skipping the design doc and coding seven tools with no Demo Day story
- Schemas without `.describe(...)`
- Choosing a paid API or OAuth-heavy project this week

---

## After Week 2

Week 3 replaces stubs with real data loaders **without** rewriting registration or schemas.  
Keep your contracts stable.
