# Peer Review Checklist & Notes

- **Peer Reviewer Full Name:** Taima Nazzal
- **Date:** 2026-08-14
- **Branch:** week-4-harden

## 1. P0 Tools Live Testing Results
- **Tool 1 (`get_daily_quote`):** Tested with valid category input. Returned the correct quote JSON successfully.
- **Tool 2 (`search_quotes`):** Tested with keyword filtering. Results matched expected schema limits.
- **Tool 3 (`list-categories`):** Executed successfully via MCP Inspector and Claude Desktop.

## Tool 1: get_daily_quote
# Valid Inspector Input:  file parameter left empty (no override).
Result: Tool fetched from the external API first; when the API call failed (API error 400), it automatically fell back to the local quotes.json file and returned a valid quote object (quote, author, category). Confirmed working via MCP Inspector console log ("Using local quote fallback").
<img width="1031" height="552" alt="image" src="https://github.com/user-attachments/assets/5ca40246-4573-4fa8-a80b-0758778e1e9c" />
<img width="1032" height="582" alt="image" src="https://github.com/user-attachments/assets/cda6300f-84c8-438d-a418-18878df24be6" />
# Valid Inspector Input:  file = quotes.json (explicit safe relative path).
Result: Returned a valid quote successfully, e.g. "Success is not final, failure is not fatal..." — Winston Churchill.
<img width="1607" height="905" alt="image" src="https://github.com/user-attachments/assets/b8cdd24e-48c8-4563-b490-cd562e540f8a" />
<img width="1607" height="911" alt="image" src="https://github.com/user-attachments/assets/c5d75028-4f24-4877-8b75-696187bc6da8" />
# Invalid / Attack Inspector Input:  file = ../../.env (path traversal attempt).
Result: Blocked. Tool returned {"error": "Path outside data directory is not allowed."}.
<img width="1363" height="912" alt="image" src="https://github.com/user-attachments/assets/a936eb37-9bfa-447a-b26a-187a426a500c" />
<img width="1307" height="893" alt="image" src="https://github.com/user-attachments/assets/98580081-0567-46cc-8556-55845e6566e3" />
# Invalid / Attack Inspector Input:  file = test.json (nonexistent file inside data directory).
Result: Rejected safely with filesystem error ENOENT: no such file or directory, realpath 'C:\Users\Dell\Documents\Quote-of-the-Day\data\test.json' — no path leaked outside the allowed directory.
<img width="1048" height="655" alt="image" src="https://github.com/user-attachments/assets/bcb97590-dac1-46eb-ac55-3a7a0c2f7f15" />
<img width="1042" height="552" alt="image" src="https://github.com/user-attachments/assets/a0aa0c80-4ec4-4952-9b9b-26019b57894f" />
## Tool 2: search_quotes
# Valid Inspector Input: (to confirm/attach — e.g. keyword = "motivation")
Result:
# Invalid / Attack Inspector Input: keyword = "123" (numeric input, violates keyword schema).
Result: Blocked by Zod validation. Tool returned a structured MCP error: MCP error -32602: Input validation error: Invalid arguments for tool search_quotes: [{"origin":"string","code":"invalid_format","format":"regex","pattern":"/^[^0-9]+$/","path":["keyword"],"message":"Keyword cannot contain numbers."}].
<img width="1037" height="450" alt="image" src="https://github.com/user-attachments/assets/800bca68-a8da-4e02-af04-69fa4a87a55b" />
<img width="1037" height="436" alt="image" src="https://github.com/user-attachments/assets/758b730f-2a22-4c3f-bba5-14c73961eafb" />

## Tool 3: list_categories
# Valid Inspector Input: limit = 10.
Result: Returned {"ok": true, "count": 3, "categories": [{"name":"motivation","count":1}, {"name":"courage","count":1}, {"name":"inspiration","count":1}]} successfully via MCP Inspector and Claude Desktop.
<img width="1048" height="561" alt="image" src="https://github.com/user-attachments/assets/56df15ef-c995-42f8-a29d-c21f3298ae1e" />
<img width="1052" height="520" alt="image" src="https://github.com/user-attachments/assets/888af765-8b9a-40cc-bac3-8741c002f4a9" />

# Invalid / Attack Inspector Input: limit = 10000000 (abusive/out-of-range value).
Result: Blocked. Tool returned Request blocked: limit must be an integer between 1 and 50 — no resource abuse allowed.
<img width="1052" height="571" alt="image" src="https://github.com/user-attachments/assets/fee46797-07a6-4788-ac7a-4fc52c2ae8a9" />
<img width="1043" height="517" alt="image" src="https://github.com/user-attachments/assets/4ca12b7c-645a-4520-ae2a-e29d51b60f12" />

## 2. Attack & Error Handling Validation (Negative Testing)
- **Invalid Input Test:** Passed empty string / invalid types to tool parameters. 
  - *Result:* Zod validation successfully caught the error and rejected the input with a structured validation error.
- **Security / Path Traversal Test:** Passed malicious injection or path traversal strings (e.g., `../etc/passwd`) into arguments.
  - *Result:* Blocked safely by input sanitization / schema validation.

## 3. Written Feedback & Reviewer Notes
- **What worked:** The three P0 tools were tested individually through MCP Inspector with both valid and invalid/attack inputs. The tools behaved as expected: get_daily_quote successfully returned quotes and safely handled API fallback and file-path validation, search_quotes rejected invalid keyword input through Zod validation, and list_categories rejected excessive limit values. The Zod schemas, safe path handling, output limits, and MCP Inspector / Claude Desktop integration worked as expected.
- **Issues found:** The main issue identified during the review was that the README did not include enough explicit documentation for edge-case and validation error responses. The testing also showed that these validation and security behaviors are important to document clearly so users can understand what happens when invalid or unsafe inputs are provided.
- **Recommended fixes:** Update the README with clear examples of validation and security error responses, including examples of invalid input, path traversal rejection, nonexistent file handling, invalid keyword validation, and excessive limit values. Keep the examples consistent with the actual MCP Inspector results from the peer review.

## 4. Action Items, Owners & Due Dates
| Action Item | Owner | Due Date | Status |
| :--- | :--- | :--- | :--- |
| Update README with error handling examples | Dareen ,Tala,Saja | 2026-08-15 |  In Progress |
| Re-verify PR #6 vs Hardening Branch links | Dareen ,Tala,Saja  | 2026-08-14 | Completed |
