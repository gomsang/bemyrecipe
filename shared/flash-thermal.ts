export const WATER_SPECIFIC_HEAT_J_G_C = 4.186;
export const ICE_LATENT_HEAT_J_G = 333.55;
export const ICE_DENSITY_G_ML = 0.917;

export type FlashThermalInput = {
  selectedWaterG: number;
  doseG: number;
  retentionFactor: number;
  brewIceG: number;
  servingIceG: number;
  dropTempC: number;
  cupCapacityMl: number;
};

export type FlashThermalBalance = {
  hotBeverageG: number;
  totalIceG: number;
  brewIceMeltedG: number;
  brewIceRemainingInCarafeG: number;
  transferLiquidG: number;
  transferLiquidTempC: number;
  servingIceMeltedG: number;
  servingIceRemainingG: number;
  meltedIceG: number;
  remainingIceG: number;
  finalLiquidTempC: number;
  estimatedOccupiedVolumeMl: number;
  estimatedHeadspaceMl: number;
};

/**
 * Conservative two-stage flash-brew balance with ice starting at 0°C and no
 * heat loss to the vessel or air. Brew ice acts in the carafe first. Only the
 * resulting liquid is transferred onto fresh serving ice; solid brew ice left
 * in the carafe is not counted as ice in the drinking vessel.
 */
export function estimateFlashThermalBalance(input: FlashThermalInput): FlashThermalBalance {
  const hotBeverageG = Math.max(0, input.selectedWaterG - input.doseG * input.retentionFactor);
  const brewIceG = Math.max(0, input.brewIceG);
  const servingIceG = Math.max(0, input.servingIceG);
  const totalIceG = brewIceG + servingIceG;
  const initialHeatJ = hotBeverageG * WATER_SPECIFIC_HEAT_J_G_C * Math.max(0, input.dropTempC);

  const brewIceMeltedG = Math.min(brewIceG, initialHeatJ / ICE_LATENT_HEAT_J_G);
  const brewIceRemainingInCarafeG = Math.max(0, brewIceG - brewIceMeltedG);
  const transferLiquidG = hotBeverageG + brewIceMeltedG;
  const heatAfterBrewIceJ = Math.max(0, initialHeatJ - brewIceMeltedG * ICE_LATENT_HEAT_J_G);
  const transferLiquidTempC = brewIceRemainingInCarafeG > 0 || transferLiquidG <= 0
    ? 0
    : heatAfterBrewIceJ / (WATER_SPECIFIC_HEAT_J_G_C * transferLiquidG);

  const servingMeltCapacityG = transferLiquidG * WATER_SPECIFIC_HEAT_J_G_C * transferLiquidTempC / ICE_LATENT_HEAT_J_G;
  const servingIceMeltedG = Math.min(servingIceG, servingMeltCapacityG);
  const servingIceRemainingG = Math.max(0, servingIceG - servingIceMeltedG);
  const finalLiquidMassG = transferLiquidG + servingIceMeltedG;
  const heatAfterServingIceJ = Math.max(0, heatAfterBrewIceJ - servingIceMeltedG * ICE_LATENT_HEAT_J_G);
  const finalLiquidTempC = servingIceRemainingG > 0 || finalLiquidMassG <= 0
    ? 0
    : heatAfterServingIceJ / (WATER_SPECIFIC_HEAT_J_G_C * finalLiquidMassG);
  const meltedIceG = brewIceMeltedG + servingIceMeltedG;
  const remainingIceG = brewIceRemainingInCarafeG + servingIceRemainingG;
  const estimatedOccupiedVolumeMl = finalLiquidMassG + servingIceRemainingG / ICE_DENSITY_G_ML;

  return {
    hotBeverageG,
    totalIceG,
    brewIceMeltedG,
    brewIceRemainingInCarafeG,
    transferLiquidG,
    transferLiquidTempC,
    servingIceMeltedG,
    servingIceRemainingG,
    meltedIceG,
    remainingIceG,
    finalLiquidTempC,
    estimatedOccupiedVolumeMl,
    estimatedHeadspaceMl: input.cupCapacityMl - estimatedOccupiedVolumeMl,
  };
}
