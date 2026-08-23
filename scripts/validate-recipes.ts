import { buildCatalog } from "./catalog-lib";

const catalog = buildCatalog();
const invalid = catalog.recipes.filter((recipe) => !recipe.validation.valid);

for (const recipe of catalog.recipes) {
  const marker = recipe.validation.valid ? "✓" : "✗";
  console.log(`${marker} ${recipe.sourcePath} · rules ${recipe.ruleEvaluation.status} / v${recipe.ruleEvaluation.rulesetVersion}`);
  recipe.validation.errors.forEach((error) => console.log(`  - ${error}`));
  recipe.validation.warnings.forEach((warning) => console.log(`  ! ${warning}`));
  recipe.ruleEvaluation.proposals.forEach((proposal) => console.log(`  → system proposal: ${proposal.title}`));
}

if (invalid.length) {
  console.error(`\n${invalid.length} recipe(s) failed recipe/Aiden hard validation.`);
  process.exitCode = 1;
} else {
  console.log(`\n${catalog.recipes.length} recipe(s) passed recipe/Aiden hard validation.`);
}
