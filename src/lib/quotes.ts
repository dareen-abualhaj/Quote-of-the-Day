import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve paths relative to this file instead of process.cwd().
// This makes the MCP server work correctly when launched from
// Claude Desktop, MCP Inspector, or the terminal.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, "../../data");
const QUOTES_FILE = path.resolve(DATA_DIR, "quotes.json");

// Load quotes from the local JSON file.
export function loadLocalQuotes() {
  // Path safety check
  if (!QUOTES_FILE.startsWith(DATA_DIR + path.sep)) {
    throw new Error("Invalid data file path.");
  }

  if (!fs.existsSync(QUOTES_FILE)) {
    console.error(`Quotes file not found: ${QUOTES_FILE}`);
    return [];
  }

  const fileContent = fs.readFileSync(QUOTES_FILE, "utf-8");
  const data = JSON.parse(fileContent);

  if (!Array.isArray(data)) {
    throw new Error("Invalid quotes.json format.");
  }

  return data;
}

// Search local quotes by quote text, author, or category.
export function searchLocalQuotes(
  keyword: string,
  limit: number = 10
) {
  const localData = loadLocalQuotes();
  const searchLower = keyword.toLowerCase();

  return localData
    .filter((q: any) => {
      const quoteMatch =
        q.quote &&
        String(q.quote).toLowerCase().includes(searchLower);

      const authorMatch =
        q.author &&
        String(q.author).toLowerCase().includes(searchLower);

      const categoryMatch =
        q.category &&
        String(q.category).toLowerCase().includes(searchLower);

      return quoteMatch || authorMatch || categoryMatch;
    })
    .slice(0, limit);
}

// Get a random local daily quote.
export function getLocalDailyQuote(category?: string) {
  const localData = loadLocalQuotes();
  let filtered = localData;

  if (category) {
    filtered = localData.filter(
      (q: any) =>
        q.category &&
        q.category.toLowerCase() === category.toLowerCase()
    );
  }

  const pool = filtered.length > 0 ? filtered : localData;

  if (pool.length === 0) {
    return {
      quote: "Keep going!",
      author: "System",
      category: "general",
    };
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// Get all available quote categories.
export function getLocalCategories(limit: number = 10) {
  const localData = loadLocalQuotes();

  const categoriesMap: { [key: string]: number } = {};

  localData.forEach((q: any) => {
    if (q.category) {
      const category = String(q.category).toLowerCase();
      categoriesMap[category] =
        (categoriesMap[category] || 0) + 1;
    }
  });

  const categories = Object.keys(categoriesMap).map((name) => ({
    name,
    count: categoriesMap[name],
  }));

  return categories.slice(0, limit);
}
