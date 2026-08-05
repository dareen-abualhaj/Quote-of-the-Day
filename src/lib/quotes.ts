import fs from "fs";
import path from "path";
اً
export function loadLocalQuotes() {
  const filePath = path.join(process.cwd(), "data", "quotes.json");
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

//
export function searchLocalQuotes(keyword: string, limit: number = 10) {
  const localData = loadLocalQuotes();
  const searchLower = keyword.toLowerCase();

  return localData
    .filter((q: any) => {
      const quoteMatch =
        q.quote && String(q.quote).toLowerCase().includes(searchLower);
      const authorMatch =
        q.author && String(q.author).toLowerCase().includes(searchLower);
      const categoryMatch =
        q.category && String(q.category).toLowerCase().includes(searchLower);

      return quoteMatch || authorMatch || categoryMatch;
    })
    .slice(0, limit);
}

//
export function getLocalDailyQuote(category?: string) {
  const localData = loadLocalQuotes();
  let filtered = localData;

  if (category) {
    filtered = localData.filter(
      (q: any) => q.category && q.category.toLowerCase() === category.toLowerCase()
    );
  }

  const pool = filtered.length > 0 ? filtered : localData;
  if (pool.length === 0) return { quote: "Keep going!", author: "System", category: "general" };

  return pool[Math.floor(Math.random() * pool.length)];
}

export function getLocalCategories(limit: number = 10) {
  const localData = loadLocalQuotes();

  const categoriesMap: { [key: string]: number } = {};

  localData.forEach((q: any) => {
    if (q.category) {
      const cat = String(q.category).toLowerCase();
      categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
    }
  });

  const categories = Object.keys(categoriesMap).map((name) => ({
    name,
    count: categoriesMap[name],
  }));

  return categories.slice(0, limit);
}
