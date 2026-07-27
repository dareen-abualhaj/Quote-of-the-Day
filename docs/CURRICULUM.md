# Curriculum overview — Building an MCP for an AI Engine

NextFlows Academy · 6 weeks · TypeScript MCP server

> Full program page: [PROGRAM.md](./PROGRAM.md)  
> Academy hub: [https://nextflows.ai/academy](https://nextflows.ai/academy)  
> Apply: [Cohort #1](https://nextflows.ai/academy/apply?cohort=1&program=building-mcp-ai-engines)

## Program outcomes

- A public GitHub repo with a working MCP server
- Multiple tools with Zod-validated inputs
- Real data wiring (local files and/or free APIs)
- Basic safety / reliability habits
- Docs a classmate can follow
- A Demo Day presentation

## How the program works

- Two live group sessions a week (90 minutes) — Zoom
- Three on-site workshop days across the six weeks — setup, code review, Demo Day
- Weekly 1:1 with your mentor (30 minutes)
- No prior GitHub experience required — Week 1 starts from zero

## Weekly plan

| Week | Focus | What's included |
| --- | --- | --- |
| 1 | Get set up & build your first MCP tool | 2 live sessions + on-site Git/GitHub kickoff + 1:1 |
| 2 | Design your own tools | 2 live sessions + 1:1 — see [WEEK-2.md](./WEEK-2.md) |
| 3 | Connect your tools to real data | 2 live sessions + 1:1 |
| 4 | Make it safe & reliable | 2 live sessions + on-site code review + 1:1 |
| 5 | Test it & write docs people can follow | 2 live sessions + 1:1 |
| 6 | Ship it on GitHub & Demo Day | 2 live sessions + on-site Demo Day + 1:1 |

## Week 1 checklist (already started in this repo)

- [x] Repo scaffold with `src/`, `examples/`, `docs/`
- [x] Working `greet` tool
- [ ] Fork / push your own GitHub remote
- [ ] Inspector screenshot of `greet` succeeding + invalid input failing
- [ ] Short note: tools vs resources vs prompts

## Mentors review

Before Week 3 coding expands, mentors expect:

1. `docs/project-choice.md`
2. `docs/design.md` (+ GitHub Issue link)
3. ≥3 Zod schemas with `.describe(...)`
4. Multi-tool skeleton visible in Inspector

## References

- [MCP documentation](https://modelcontextprotocol.io/docs)
- [MCP specification](https://modelcontextprotocol.io/specification/latest)
- [TypeScript SDK — first server](https://ts.sdk.modelcontextprotocol.io/v2/get-started/first-server.html)
