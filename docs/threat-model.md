
# Threat Model: Quote-of-the-Day MCP Server

## 1. Assets
* **Local Data Files:** The `./data/quotes.json` fixture file containing our core collection of quotes and categories.
* **Source Code & Integrity:** The TypeScript source code (`src/`) implementing tool handlers and pure functions.
* **Execution Environment:** The host machine running the MCP server process via `stdio` transport.

## 2. Trust Boundaries
* **Model to Tool Arguments:** Untrusted string inputs passed from the LLM model to tool parameters (e.g., `keyword` in `search_quotes`).
* **Tool to Filesystem:** The server reading local fixture files to retrieve and filter quotes.
* **Tool to Network:** External HTTP calls or API fetching (if any external quote endpoint is queried).

## 3. Top 5 Risks
1. **Path Traversal / Arbitrary File Read:** A malicious or malformed input supplied to a tool parameter that might attempt to access files outside `./data/`.
2. **Denial of Service (DoS) via Runaway Responses:** Large, unstructured, or un-capped search queries returning massive payloads that overflow or crash the model's context window.
3. **Invalid Type Injection (Malformed Inputs):** Passing unexpected data types (objects/arrays instead of strings/numbers) to tool arguments, breaking runtime execution.
4. **Unhandled Runtime Exceptions:** Network timeouts or missing fixture files causing unhandled crashes instead of clean error returns.
5. **Information Disclosure via Verbose Errors:** Exposing raw stack traces, file paths, or internal system details back to the LLM interface.

## 4. Mitigations This Week
* **Zod Validation:** Enforce strict input schemas on all tool parameters (e.g., defining precise types, minimum/maximum lengths, and default values).
* **Pagination & Size Caps:** Hard-cap list outputs and search results (e.g., defaulting `limit` to 10, max 50 items) to prevent context exhaustion.
* **Safe Path Resolution:** Restrict file reading operations strictly to the designated `./data/` directory.
* **Robust Error Handling:** Wrap core logic in `try/catch` blocks and return clean, structured, user-friendly error messages rather than crashing the server process.

## 5. Out of Scope
* Multi-user authentication and authorization (since this is a local single-user MCP server communicating over `stdio`).
* Encryption at rest for public quote fixtures since the data is non-sensitive and publicly sourced.
