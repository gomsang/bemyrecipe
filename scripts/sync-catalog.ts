import { config } from "dotenv";
import { buildCatalog } from "./catalog-lib";

// Keep explicit shell/CI variables authoritative, then fill missing local values
// from the ignored developer file documented in README.md.
config({ path: ".env.local", override: false, quiet: true });

const endpoint = process.env.CATALOG_SYNC_URL;
const token = process.env.CATALOG_SYNC_TOKEN;

if (!endpoint || !token) {
  throw new Error("CATALOG_SYNC_URL과 CATALOG_SYNC_TOKEN을 .env.local에 설정하세요.");
}

const catalog = buildCatalog();
const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
  },
  body: JSON.stringify(catalog),
});

const body = await response.text();
if (!response.ok) throw new Error(`catalog sync failed (${response.status}): ${body}`);
console.log(body);
