import "dotenv/config";
import { buildCatalog } from "./catalog-lib";

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
