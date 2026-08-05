import fs from "fs";
import path from "path";

// دالة قراءة الاقتباسات محلياً
export function loadLocalQuotes() {
  const filePath = path.join(process.cwd(), "data", "quotes.json");
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

// دالة فلترة والبحث في الاقتباسات محلياً
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

// دالة جلب الاقتباس اليومي عشوائياً أو حسب التصنيف محلياً
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
