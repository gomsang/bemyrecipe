import assert from "node:assert/strict";
import { buildCatalogRoute, canonicalRecipeId, parseCatalogRoute } from "../shared/catalog-route";

assert.deepEqual(parseCatalogRoute("/recipes/sbr-harfusa-flash-315-v4/brew"), {
  recipeId: "sbr-harfusa-flash-315-v4",
  detailView: "brew",
});
assert.deepEqual(parseCatalogRoute("/recipes/sbr-harfusa-flash-500-v2/guide/"), {
  recipeId: "sbr-harfusa-flash-500-v2",
  detailView: "guide",
});
assert.equal(parseCatalogRoute("/recipes/sbr-harfusa-flash-500-v2"), null);
assert.equal(parseCatalogRoute("/recipes/id/settings"), null);
assert.equal(buildCatalogRoute("coffee / v1", "guide"), "/recipes/coffee%20%2F%20v1/guide");
assert.equal(canonicalRecipeId({ id: "owner__recipe-v2", localId: "recipe-v2" }), "recipe-v2");
assert.equal(canonicalRecipeId({ id: "recipe-v2" }), "recipe-v2");

console.log("✓ catalog route: recipe id / Firestore local id / brew-guide mode / invalid path");
