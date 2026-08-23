import fs from "node:fs";
import path from "node:path";
import { buildCatalog } from "./catalog-lib";

const output = path.resolve(import.meta.dirname, "../public/catalog.json");
const catalog = buildCatalog();
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`catalog: ${catalog.recipes.length} recipes → ${output}`);
