# Week 3 – Data Plan

## Overview

This document describes the data sources that will be used by the core (P0) tools in the Quote of the Day MCP server. To ensure the project works reliably during the Demo Day presentation, all tools will use a local JSON dataset stored inside the repository. This approach removes the dependency on an internet connection and provides a consistent testing environment.

---

## Data Sources

| Tool | Source | Fixture Path | Auth | Failure Modes | Example Response |
|------|--------|-------------|------|---------------|-----------------|
| get_daily_quote | Local JSON file | `data/quotes.json` | None | Empty dataset, invalid JSON format | `{ "quote": "...", "author": "...", "category": "..." }` |
| search_quotes | Local JSON file | `data/quotes.json` | None | No matching keyword, invalid JSON format | `{ "results": [{ "quote": "...", "author": "..." }] }` |
| list_categories | Local JSON file | `data/quotes.json` | None | Empty dataset, missing category field | `{ "categories": ["Motivation", "Life", "Success"] }` |

---

# Example Responses

## get_daily_quote

```json
{
  "quote": "Believe you can and you're halfway there.",
  "author": "Theodore Roosevelt",
  "category": "Motivation"
}
```

---

## search_quotes

```json
{
  "results": [
    {
      "quote": "Success is not final. Failure is not fatal. It is the courage to continue that counts.",
      "author": "Winston Churchill"
    },
    {
      "quote": "Success usually comes to those who are too busy to be looking for it.",
      "author": "Henry David Thoreau"
    }
  ]
}
```

---

## list_categories

```json
{
  "categories": [
    "Motivation",
    "Success",
    "Life",
    "Future",
    "Wisdom"
  ]
}
```

---

# Failure Modes

### get_daily_quote

- The `quotes.json` file is empty.
- The JSON file contains invalid formatting.
- A quote object is missing one or more required fields.
- The dataset cannot be loaded.

### search_quotes

- No quotes match the requested keyword.
- The JSON file is empty.
- The JSON file contains invalid formatting.
- The keyword provided is empty or invalid.

### list_categories

- The JSON file is empty.
- One or more quotes do not contain a category field.
- Duplicate categories need to be filtered.
- The dataset cannot be loaded.

---

# Offline Demo Strategy

The Quote of the Day MCP server is designed to work completely offline during the Demo Day presentation. All quote data will be stored locally in `data/quotes.json`, ensuring that every tool continues to function even if there is no internet connection. This approach provides consistent behavior, faster responses, and eliminates the risk of failures caused by network issues or external API downtime.

---

# Notes

- No authentication is required for any tool.
- All P0 tools use the same local dataset.
- The local dataset serves as both the primary data source and the offline fallback.
- During Week 3, the current stub handlers will be replaced with logic that reads and processes data from `data/quotes.json`.
