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
  meltedIceG: number;
  remainingIceG: number;
  finalLiquidTempC: number;
  estimatedOccupiedVolumeMl: number;
  estimatedHeadspaceMl: number;
};

/**
 * Conservative flash-brew balance with ice starting at 0°C and no heat loss
 * to the vessel or air. While solid ice remains, equilibrium stays at 0°C.
 */
export function estimateFlashThermalBalance(input: FlashThermalInput): FlashThermalBalance {
  const hotBeverageG = Math.max(0, input.selectedWaterG - input.doseG * input.retentionFactor);
  const totalIceG = Math.max(0, input.brewIceG + input.servingIceG);
  const meltCapacityG = hotBeverageG * WATER_SPECIFIC_HEAT_J_G_C * Math.max(0, input.dropTempC) / ICE_LATENT_HEAT_J_G;
  const meltedIceG = Math.min(totalIceG, meltCapacityG);
  const remainingIceG = Math.max(0, totalIceG - meltedIceG);
  const liquidMassG = hotBeverageG + meltedIceG;
  const finalLiquidTempC = remainingIceG > 0 || liquidMassG <= 0
    ? 0
    : Math.max(0, (hotBeverageG * WATER_SPECIFIC_HEAT_J_G_C * input.dropTempC - totalIceG * ICE_LATENT_HEAT_J_G)
      / (WATER_SPECIFIC_HEAT_J_G_C * liquidMassG));
  const estimatedOccupiedVolumeMl = liquidMassG + remainingIceG / ICE_DENSITY_G_ML;

  return {
    hotBeverageG,
    totalIceG,
    meltedIceG,
    remainingIceG,
    finalLiquidTempC,
    estimatedOccupiedVolumeMl,
    estimatedHeadspaceMl: input.cupCapacityMl - estimatedOccupiedVolumeMl,
  };
}
