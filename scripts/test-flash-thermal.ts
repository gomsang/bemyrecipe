import assert from "node:assert/strict";
import { estimateFlashThermalBalance } from "../shared/flash-thermal";
import { buildCatalog, validateFlashThermalBalance } from "./catalog-lib";

const failed315v2 = estimateFlashThermalBalance({
  selectedWaterG: 190, doseG: 17, retentionFactor: 2,
  brewIceG: 110, servingIceG: 20, dropTempC: 70, cupCapacityMl: 315,
});
assert.equal(failed315v2.servingIceRemainingG, 0);

const serviceForward315v4 = estimateFlashThermalBalance({
  selectedWaterG: 180, doseG: 16, retentionFactor: 2,
  brewIceG: 90, servingIceG: 52, dropTempC: 70, cupCapacityMl: 315,
});
assert(serviceForward315v4.servingIceRemainingG >= 10);
assert.equal(serviceForward315v4.brewIceRemainingInCarafeG, 0);
assert(serviceForward315v4.estimatedHeadspaceMl >= 20);

const serviceForward500v2 = estimateFlashThermalBalance({
  selectedWaterG: 280, doseG: 25, retentionFactor: 2,
  brewIceG: 80, servingIceG: 150, dropTempC: 70, cupCapacityMl: 500,
});
assert(serviceForward500v2.servingIceRemainingG >= 10);
assert.equal(serviceForward500v2.brewIceRemainingInCarafeG, 0);
assert(serviceForward500v2.estimatedHeadspaceMl >= 30);

const catalog = buildCatalog();
const belowServingFloor = structuredClone(catalog.recipes.find((recipe) => recipe.id === "sbr-harfusa-flash-315-v4"));
assert.ok(belowServingFloor);
belowServingFloor.brew.servingIceG = 49;
assert(validateFlashThermalBalance(belowServingFloor).some((error) => error.startsWith("thermal.serving_ice_floor")));

console.log("✓ flash thermal: two-stage carafe transfer / serving-ice floor and remaining / headspace");
