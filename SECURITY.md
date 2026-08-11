# Security Policy

## Supported Versions
Only the current version of the Quote-of-the-Day MCP server is supported with security updates.

## Reporting a Vulnerability
If you discover a security vulnerability, please report it directly to the project mentor via email rather than opening a public issue.

## Security Mitigations & Hardening
- **Input Validation:** Strict Zod schemas enforcing type checking, string length limits (`.max()`), and character allowlists on all tool arguments.
- **SSRF & Allowlist Protection:** External network calls are strictly restricted to the authorized host (`api.api-ninjas.com`) using explicit URL parsing and validation.
- **Timeouts:** All external HTTP requests are bounded by a 10-second timeout using `AbortController` to prevent hanging processes.
- **Output Caps:** Search results and list responses are capped to safe record limits (maximum 50 items) to prevent context exhaustion.
- **Secrets Management:** Environment variables are strictly isolated via `.env` (ignored by git), with a safe `.env.example` template provided. No secrets are ever hardcoded or printed in logs or tool errors.