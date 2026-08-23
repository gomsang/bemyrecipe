export type AidenWaterSelection = {
  selectedWaterMl: number;
  quantityMode: string;
  basket: string;
};

function onStep(value: number, start: number, step: number) {
  return Number.isInteger(value) && (value - start) % step === 0;
}

function expectedBasketForWater(selectedWaterMl: number) {
  if (selectedWaterMl >= 150 && selectedWaterMl <= 450) return "single_serve";
  if (selectedWaterMl >= 500 && selectedWaterMl <= 1500) return "batch";
  return null;
}

function isSelectable(selectedWaterMl: number, quantityMode: string) {
  if (!Number.isFinite(selectedWaterMl)) return false;
  if (quantityMode === "standard_cup") {
    return selectedWaterMl >= 150 && selectedWaterMl <= 1500 && onStep(selectedWaterMl, 150, 75);
  }
  if (quantityMode === "metric_precise") {
    return (selectedWaterMl >= 150 && selectedWaterMl <= 450 && onStep(selectedWaterMl, 150, 10))
      || (selectedWaterMl >= 500 && selectedWaterMl <= 1500 && onStep(selectedWaterMl, 500, 50));
  }
  return false;
}

export function validateAidenWaterSelection(input: AidenWaterSelection) {
  if (input.quantityMode !== "standard_cup" && input.quantityMode !== "metric_precise") {
    throw new Error("aiden_quantity_mode가 없거나 지원되지 않습니다.");
  }
  if (!isSelectable(input.selectedWaterMl, input.quantityMode)) {
    throw new Error(`${input.selectedWaterMl}ml는 ${input.quantityMode} 모드에서 Aiden이 선택할 수 없는 물양입니다.`);
  }
  const expectedBasket = expectedBasketForWater(input.selectedWaterMl);
  if (!expectedBasket || input.basket !== expectedBasket) {
    throw new Error(`${input.selectedWaterMl}ml와 ${input.basket} basket 조합이 올바르지 않습니다.`);
  }
}

