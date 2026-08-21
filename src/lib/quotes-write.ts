import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import * as z from "zod/v4";

// Turns a ZodError into a short, specific message instead of a raw
// validation dump, so callers can tell "bad input shape" (e.g. id is
// not a uuid at all) apart from "valid input, but not found in data".
export function formatZodError(error: z.ZodError): string {
  const first = error.issues[0];
  if (!first) return "Invalid input.";
  const field = first.path.join(".") || "input";
  return `Invalid ${field}: ${first.message}`;
}

// Same resolution pattern used in lib/quotes.ts — never depends on
// process.cwd(), so it works the same from Claude Desktop, Inspector,
// or the terminal.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, "../../data");
const QUOTES_FILE = path.resolve(DATA_DIR, "quotes.json");

export const MAX_QUOTES = 1000; // hard cap so create_quote can't be used for DoS bloat
const MIN_QUOTES = 1; // delete_quote is not allowed to empty the file

export interface Quote {
  id: string;
  quote: string;
  author: string;
  category: string;
}

// SECURITY NOTE:
// Unlike get_daily_quote (which accepts an optional `file` param), none of
// the write tools accept a filename from the model. They only ever read
// and write QUOTES_FILE, resolved once, on the server. This removes path
// traversal as an attack surface for create/update/delete entirely — there
// is no user-controlled path to sanitize because there is no path input.

function assertInsideDataDir(target: string) {
  const real = fs.existsSync(target) ? fs.realpathSync(target) : target;
  const relative = path.relative(DATA_DIR, real);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Refusing to write outside the data directory.");
  }
}

export function loadQuotesForWrite(): Quote[] {
  assertInsideDataDir(QUOTES_FILE);

  if (!fs.existsSync(QUOTES_FILE)) {
    throw new Error("Quotes file not found.");
  }

  const raw = fs.readFileSync(QUOTES_FILE, "utf-8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("Invalid quotes.json format.");
  }

  // Back-fill ids for any legacy entries that predate create/update/delete.
  let mutated = false;
  const withIds: Quote[] = data.map((q: any) => {
    if (!q.id) {
      mutated = true;
      return { id: crypto.randomUUID(), ...q };
    }
    return q;
  });

  if (mutated) {
    saveQuotesAtomic(withIds, { skipBackup: true });
  }

  return withIds;
}

// Atomic write: write to a temp file in the same directory, then rename.
// This means a crash mid-write can never leave quotes.json half-written.
// A timestamped backup is kept before every real change so a bad
// create/update/delete can always be manually reverted.
export function saveQuotesAtomic(
  quotes: Quote[],
  opts: { skipBackup?: boolean } = {}
) {
  assertInsideDataDir(QUOTES_FILE);

  if (quotes.length > MAX_QUOTES) {
    throw new Error(`Refusing to save more than ${MAX_QUOTES} quotes.`);
  }
  if (quotes.length < MIN_QUOTES) {
    throw new Error("Refusing to save an empty quotes file.");
  }

  if (!opts.skipBackup && fs.existsSync(QUOTES_FILE)) {
    const backupPath = path.resolve(
      DATA_DIR,
      `quotes.json.bak-${Date.now()}`
    );
    assertInsideDataDir(backupPath);
    fs.copyFileSync(QUOTES_FILE, backupPath);
  }

  const tmpPath = path.resolve(DATA_DIR, `quotes.json.tmp-${Date.now()}`);
  assertInsideDataDir(tmpPath);

  fs.writeFileSync(tmpPath, JSON.stringify(quotes, null, 2), "utf-8");
  fs.renameSync(tmpPath, QUOTES_FILE);
}

export function findQuoteIndex(quotes: Quote[], id: string): number {
  return quotes.findIndex((q) => q.id === id);
}