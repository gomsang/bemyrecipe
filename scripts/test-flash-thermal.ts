import assert from "node:assert/strict";
import { estimateFlashThermalBalance } from "../shared/flash-thermal";

const failed315v2 = estimateFlashThermalBalance({
  selectedWaterG: 190, doseG: 17, retentionFactor: 2,
  brewIceG: 110, servingIceG: 20, dropTempC: 70, cupCapacityMl: 315,
});
assert.equal(failed315v2.remainingIceG, 0);

const corrected315v3 = estimateFlashThermalBalance({
  selectedWaterG: 180, doseG: 16, retentionFactor: 2,
  brewIceG: 120, servingIceG: 22, dropTempC: 70, cupCapacityMl: 315,
});
assert(corrected315v3.remainingIceG >= 10);
assert(corrected315v3.estimatedHeadspaceMl >= 20);

const safe500v1 = estimateFlashThermalBalance({
  selectedWaterG: 280, doseG: 25, retentionFactor: 2,
  brewIceG: 150, servingIceG: 80, dropTempC: 70, cupCapacityMl: 500,
});
assert(safe500v1.remainingIceG >= 10);
assert(safe500v1.estimatedHeadspaceMl >= 30);

console.log("✓ flash thermal: failed legacy / corrected 315 / safe 500");
