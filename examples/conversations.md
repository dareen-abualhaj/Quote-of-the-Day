# Example Conversations

These examples show how a user can interact with the Quote-of-the-Day MCP server through an AI model. Each example includes the user prompt, the expected MCP tool calls, and an example of a good final response.

## Conversation A — Daily Quote

**User prompt:**

> Give me a quote of the day.

**Expected tool calls:**

1. `get_daily_quote`

   * Arguments: none

**Good final answer:**

> “The best way to predict the future is to create it.” — Peter Drucker

The model should return the quote in a natural, readable format instead of displaying the raw MCP tool response.

---

## Conversation B — Search for Quotes

**User prompt:**

> Find me 3 quotes about courage.

**Expected tool calls:**

1. `search_quotes`

   * `keyword`: `"courage"`
   * `limit`: `3`

**Good final answer:**

> Here are three quotes about courage:
>
> 1. “Courage is resistance to fear, mastery of fear—not absence of fear.” — Mark Twain
> 2. “Success is not final, failure is not fatal: it is the courage to continue that counts.” — Winston Churchill
> 3. “It takes courage to grow up and become who you really are.” — E. E. Cummings

The model should present the returned quotes clearly and should not expose the raw JSON response.

---

## Conversation C — Browse Categories and Search

**User prompt:**

> What quote categories are available? Then find me 2 quotes about motivation.

**Expected tool calls:**

1. `list_categories`

   * `limit`: `10`

2. `search_quotes`

   * `keyword`: `"motivation"`
   * `limit`: `2`

**Good final answer:**

> Some available quote categories include motivation, success, courage, happiness, and life.
>
> Here are two motivational quotes:
>
> 1. “The secret of getting ahead is getting started.” — Mark Twain
> 2. “It always seems impossible until it’s done.” — Nelson Mandela

The model combines the results from both MCP tools into one concise, user-friendly response.
