import { buildCatalog } from "./catalog-lib";

const catalog = buildCatalog();
const invalid = catalog.recipes.filter((recipe) => !recipe.validation.valid);

for (const recipe of catalog.recipes) {
  const marker = recipe.validation.valid ? "✓" : "✗";
  console.log(`${marker} ${recipe.sourcePath}`);
  recipe.validation.errors.forEach((error) => console.log(`  - ${error}`));
}

if (invalid.length) {
  console.error(`\n${invalid.length} recipe(s) failed Aiden profile validation.`);
  process.exitCode = 1;
} else {
  console.log(`\n${catalog.recipes.length} recipe(s) passed Aiden profile validation.`);
}
