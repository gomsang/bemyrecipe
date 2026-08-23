export const AIDEN_QUANTITY_MODES = {
  standard_cup: {
    label: "CUP / HALF-CUP",
    stepLabel: "75ml 간격",
    description: "현재 기기의 기본 컵 표시 방식입니다. 150ml(1 cup)부터 75ml씩 선택합니다.",
    setup: "Aiden의 기본 cup 단위를 사용합니다.",
  },
  metric_precise: {
    label: "PRECISE METRIC",
    stepLabel: "Single 10ml · Batch 50ml 간격",
    description: "Settings → Units → Precise Units를 켭니다. Single Serve에서는 150–450ml를 10ml씩 선택할 수 있습니다.",
    setup: "Aiden에서 Settings → Units → Precise Units를 켠 뒤 물양을 ml로 선택합니다.",
  },
} as const;

export type AidenQuantityMode = keyof typeof AIDEN_QUANTITY_MODES;
export type AidenBasket = "single_serve" | "batch";

export type AidenWaterSelection = {
  selectedWaterMl: number;
  quantityMode: string;
  basket: string;
};

function isWhole(value: number) {
  return Number.isInteger(value);
}

function onStep(value: number, start: number, step: number) {
  return isWhole(value) && (value - start) % step === 0;
}

export function expectedBasketForWater(selectedWaterMl: number): AidenBasket | null {
  if (selectedWaterMl >= 150 && selectedWaterMl <= 450) return "single_serve";
  if (selectedWaterMl >= 500 && selectedWaterMl <= 1500) return "batch";
  return null;
}

export function isAidenWaterSelectable(selectedWaterMl: number, quantityMode: string) {
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

export function validateAidenWaterSelection(input: AidenWaterSelection): string[] {
  const errors: string[] = [];
  if (!(input.quantityMode in AIDEN_QUANTITY_MODES)) {
    errors.push("aiden_quantity_mode는 standard_cup 또는 metric_precise여야 합니다.");
    return errors;
  }
  if (!isAidenWaterSelectable(input.selectedWaterMl, input.quantityMode)) {
    const allowed = input.quantityMode === "standard_cup"
      ? "150ml부터 75ml 간격"
      : "Single 150–450ml는 10ml 간격, Batch 500–1500ml는 50ml 간격";
    errors.push(`${input.selectedWaterMl}ml는 ${input.quantityMode} 모드에서 선택할 수 없습니다. 허용 범위: ${allowed}.`);
  }
  const expectedBasket = expectedBasketForWater(input.selectedWaterMl);
  if (!expectedBasket) {
    errors.push(`${input.selectedWaterMl}ml는 확인된 Aiden brew volume 범위 밖입니다.`);
  } else if (input.basket !== expectedBasket) {
    errors.push(`${input.selectedWaterMl}ml에는 ${expectedBasket} basket을 사용해야 합니다.`);
  }
  return errors;
}

