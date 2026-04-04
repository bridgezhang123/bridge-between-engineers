const fs = require("fs");
const path = require("path");
const { createSearchEngine } = require("./custom_search_worker.js");

const indexPath = path.join(__dirname, "..", "site", "search", "search_index.json");
const indexData = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const engine = createSearchEngine(indexData);

const queries = [
  "命名",
  "drawing",
  "bridge",
  "config",
  "版本",
];

for (const query of queries) {
  const result = engine.search(query);
  const firstGroup = result.items[0] || [];
  const firstItem = firstGroup[0];

  console.log(`Query: ${query}`);
  if (!firstItem) {
    console.log("  No results");
    continue;
  }

  console.log(`  Top result: ${firstItem.title} -> ${firstItem.location}`);
}
