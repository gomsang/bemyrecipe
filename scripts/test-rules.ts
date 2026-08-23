import assert from "node:assert/strict";
import { validateAidenWaterSelection as validateServerWater } from "../functions/src/aiden-water";
import { evaluateRecipeRules, type RecipeRuleInput } from "../shared/recipe-rules";

const base: RecipeRuleInput = {
  recipeRulesetVersion: 5,
  serveMode: "iced",
  brewMethod: "flash",
  brewReady: true,
  coldBrewEnabled: false,
  selectedWaterMl: 280,
  controlConditions: {
    aiden_quantity_mode: "metric_precise",
    basket: "single_serve",
    shower_selector: "single_serve",
    filter_paper: "fellow-aiden-single-white",
    grinder_burr: "ode-gen2-stock",
    water: "samdasoo",
    vessel: "tumbler-500",
    ice_goal: "remain_while_drinking",
  },
  exceptions: [],
  extensionRequests: [],
  preparation: {
    filterRinse: { enabled: true, water: "hot", discardRinseWater: true },
    icePlan: {
      strategy: "split",
      brewIce: { grams: 150, vessel: "carafe", timing: "before_brew", purpose: "flash_chill" },
      servingIce: { grams: 80, vessel: "tumbler-500", timing: "before_transfer", purpose: "keep_cold" },
    },
    steps: [
      { id: "set_quantity_mode", phase: "before_brew", label: "Precise Units", instruction: "10ml 단위를 확인한다.", critical: true },
      { id: "rinse_filter", phase: "before_brew", label: "필터 린싱", instruction: "린스 물을 버린다.", critical: true },
      { id: "set_shower_selector", phase: "before_brew", label: "Shower selector", instruction: "한 개의 초록 점에 맞춘다.", critical: true },
      { id: "add_brew_ice", phase: "before_brew", label: "Brew ice", instruction: "카라페에 넣는다.", critical: true },
      { id: "add_serving_ice", phase: "after_brew", label: "Serving ice", instruction: "이송 직전에 넣는다.", critical: true },
    ],
  },
};

const pass = evaluateRecipeRules(base);
assert.equal(pass.status, "pass");
assert.equal(pass.errors.length, 0);

const unsupportedPreciseWater = evaluateRecipeRules({ ...base, selectedWaterMl: 285 });
assert.equal(unsupportedPreciseWater.status, "blocked");
assert(unsupportedPreciseWater.errors.some((item) => item.ruleId === "water.selection.invalid"));

const standardCupWater = evaluateRecipeRules({
  ...base,
  selectedWaterMl: 225,
  controlConditions: { ...base.controlConditions, aiden_quantity_mode: "standard_cup" },
});
assert.equal(standardCupWater.status, "pass");

const impossibleStandardWater = evaluateRecipeRules({
  ...base,
  selectedWaterMl: 190,
  controlConditions: { ...base.controlConditions, aiden_quantity_mode: "standard_cup" },
});
assert.equal(impossibleStandardWater.status, "blocked");
assert(impossibleStandardWater.errors.some((item) => item.ruleId === "water.selection.invalid"));
assert.doesNotThrow(() => validateServerWater({ selectedWaterMl: 190, quantityMode: "metric_precise", basket: "single_serve" }));
assert.throws(() => validateServerWater({ selectedWaterMl: 190, quantityMode: "standard_cup", basket: "single_serve" }));

const impossibleHot = evaluateRecipeRules({ ...base, serveMode: "hot", brewMethod: "standard" });
assert.equal(impossibleHot.status, "blocked");
assert(impossibleHot.errors.some((item) => item.ruleId === "ice.hot.forbidden"));

const unknownCondition = evaluateRecipeRules({
  ...base,
  controlConditions: { ...base.controlConditions, ice_shape: "large-clear-cube" },
});
assert.equal(unknownCondition.status, "review");
assert.equal(unknownCondition.errors.length, 0);
assert(unknownCondition.proposals.some((item) => item.condition === "ice_shape"));

const showerMismatch = evaluateRecipeRules({
  ...base,
  controlConditions: { ...base.controlConditions, shower_selector: "batch" },
});
assert.equal(showerMismatch.status, "review");
assert.equal(showerMismatch.errors.length, 0);
assert(showerMismatch.warnings.some((item) => item.ruleId === "control.shower_selector.mismatch"));

const requestedExtension = evaluateRecipeRules({
  ...base,
  controlConditions: { ...base.controlConditions, ice_shape: "large-clear-cube" },
  extensionRequests: [{
    condition: "ice_shape",
    reason: "표면적이 희석 속도를 반복적으로 설명함",
    proposedChanges: ["ICE PLAN UI에 형태 표시"],
  }],
});
assert.equal(requestedExtension.proposals[0]?.rationale, "표면적이 희석 속도를 반복적으로 설명함");
assert.deepEqual(requestedExtension.proposals[0]?.suggestedChanges, ["ICE PLAN UI에 형태 표시"]);

const futureRuleset = evaluateRecipeRules({ ...base, recipeRulesetVersion: 6 });
assert.equal(futureRuleset.status, "review");
assert(futureRuleset.proposals.some((item) => item.condition === "ruleset_version"));

const hardException = evaluateRecipeRules({
  ...base,
  serveMode: "hot",
  brewMethod: "standard",
  exceptions: [{ ruleId: "ice.hot.forbidden", reason: "test", evidence: "test", expiresWhen: "test end" }],
});
assert.equal(hardException.status, "blocked");
assert(hardException.warnings.some((item) => item.ruleId === "exception.hard-constraint"));

console.log("✓ recipe rules: water selector / pass / blocked / review / proposal / exception behavior");
