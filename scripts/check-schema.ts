import { searchNotesInputSchema } from "../src/schemas/search-notes.ts";

const valid = searchNotesInputSchema.parse({ query: "budget" });
console.log("valid:", valid);

// Uncomment to inspect a failure:
//searchNotesInputSchema.parse({ query: "12" });