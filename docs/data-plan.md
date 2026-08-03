# Data Plan - Week 3

| Tool Name | Data Source | Fixture Path / Fallback | Auth Required | Rate Limits |
| --- | --- | --- | --- | --- |
| `get_daily_quote` | API Ninjas | `data/quotes.json` | API Key (`X-Api-Key`) | 50,000 req/month |
| `search_quotes` | API Ninjas | `data/quotes.json` | API Key (`X-Api-Key`) | 50,000 req/month |
| `list_categories` | Local File | `data/quotes.json` | None | None |

## Happy Path Example Responses

### 1. `get_daily_quote`
```json
{
  "quote": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs",
  "category": "motivation"
}

{
  "results": [
    {
      "quote": "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "author": "Winston Churchill",
      "category": "courage"
    }
  ]
}
  {
  "categories": ["motivation", "courage", "inspiration"]
}

