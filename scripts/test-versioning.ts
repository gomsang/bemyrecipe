import assert from "node:assert/strict";
import { buildCatalog, validateVersionGraph } from "./catalog-lib";
import type { CatalogRecipe } from "../src/lib/types";

function copy<T>(value: T): T {
  return structuredClone(value);
}

const catalog = buildCatalog();
const lineage315 = catalog.recipes.filter((recipe) => recipe.lineage === "sbr-harfusa-flash-315");
const latest315 = Math.max(...lineage315.map((recipe) => recipe.version));
assert.deepEqual(lineage315.map((recipe) => recipe.version), [...lineage315.map((recipe) => recipe.version)].sort((left, right) => right - left));
assert.equal(lineage315.find((recipe) => recipe.version === latest315)?.isLatest, true);
assert.equal(lineage315.every((recipe) => recipe.versionCount === lineage315.length), true);

const brokenParent = copy(catalog.recipes);
const brokenRevision = brokenParent.find((recipe) => recipe.lineage === "sbr-harfusa-flash-315" && recipe.version > 1);
assert.ok(brokenRevision);
brokenRevision.revision.parentId = "wrong-parent";
validateVersionGraph(brokenParent);
assert.equal(brokenRevision.validation.errors.some((error) => error.startsWith("version.parent.invalid")), true);

const baseline = copy(catalog.recipes.find((recipe) => recipe.id === "sbr-harfusa-flash-500-v1")) as CatalogRecipe;
const duplicate = copy(baseline);
duplicate.id = "sbr-harfusa-flash-500-copy-v1";
duplicate.lineage = "sbr-harfusa-flash-500-copy";
duplicate.validation = { valid: true, errors: [], warnings: [] };
validateVersionGraph([baseline, duplicate]);
assert.equal(duplicate.validation.errors.some((error) => error.startsWith("version.lineage.duplicate_context")), true);

console.log("✓ recipe versioning: latest head / parent chain / duplicate context behavior");
