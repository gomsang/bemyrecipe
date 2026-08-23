export type Bean = { id: string; name: string; origin: string; region?: string | null; farm?: string | null; altitude?: string | null; variety?: string | null; process: string; roastLevel: string; roastDate?: string | null; tastingNotes: string[] };
export type Cup = { id: string; name: string; capacityMl: number; kind: string; notes?: string | null };
export type Recipe = { id: string; parentId?: string | null; beanId: string; cupId: string; name: string; version: number; beverageStyle: 'flash' | 'iced' | 'hot' | 'cold'; doseG: number; brewWaterG: number; brewIceG: number; servingIceG: number; nominalRatio: number; grinder: string; grindSetting: string; bloomRatio: number; bloomSeconds: number; bloomTempC: number; pulseCount: number; pulseIntervalSeconds: number; pulseTempsC: number[]; waterProfile?: string | null; retentionFactor: number; dropTempC: number; goal: string; status: string; createdAt: string };
export type Tasting = { id: string; recipeId: string; brewedAt: string; acidity: number; sweetness: number; bitterness: number; astringency: number; body: number; aroma: number; overall: number; finish?: string | null; drawdown: 'fast' | 'normal' | 'slow'; iceRemaining: boolean; finalBeverageG?: number | null; notes?: string | null };
export type AppData = { beans: Bean[]; cups: Cup[]; recipes: Recipe[]; tastings: Tasting[] };
export type HarnessCheck = { tone: 'good' | 'watch' | 'danger'; title: string; detail: string };

const round = (value: number, digits = 2) => Number(value.toFixed(digits));

export function calculateRecipe(recipe: Recipe, cup?: Cup) {
  const machineDoseG = recipe.brewWaterG / recipe.nominalRatio;
  const actualHotRatio = recipe.brewWaterG / recipe.doseG;
  const totalRecipeRatio = (recipe.brewWaterG + recipe.brewIceG + recipe.servingIceG) / recipe.doseG;
  const actualBloomWaterG = machineDoseG * recipe.bloomRatio;
  const actualBloomRatio = actualBloomWaterG / recipe.doseG;
  const hotBeverageG = Math.max(0, recipe.brewWaterG - recipe.doseG * recipe.retentionFactor);
  const finalLoadG = hotBeverageG + recipe.brewIceG + recipe.servingIceG;
  const headspaceMl = cup ? cup.capacityMl - finalLoadG : null;
  const targetTempC = 5;
  const heatToRemoveJ = hotBeverageG * 4.186 * Math.max(0, recipe.dropTempC - targetTempC);
  const coolingPerIceGramJ = 333.55 + 4.186 * targetTempC;
  const iceNeededFor5C = heatToRemoveJ / coolingPerIceGramJ;
  const totalIceG = recipe.brewIceG + recipe.servingIceG;
  const estimatedIceRemainingG = Math.max(0, totalIceG - iceNeededFor5C);

  return {
    machineDoseG: round(machineDoseG, 1), actualHotRatio: round(actualHotRatio), totalRecipeRatio: round(totalRecipeRatio),
    actualBloomWaterG: round(actualBloomWaterG, 1), actualBloomRatio: round(actualBloomRatio),
    hotBeverageG: round(hotBeverageG, 1), finalLoadG: round(finalLoadG, 1),
    headspaceMl: headspaceMl === null ? null : round(headspaceMl, 1), iceNeededFor5C: round(iceNeededFor5C, 1),
    estimatedIceRemainingG: round(estimatedIceRemainingG, 1),
  };
}

export function runHarness(recipe: Recipe, cup?: Cup): HarnessCheck[] {
  const m = calculateRecipe(recipe, cup);
  const checks: HarnessCheck[] = [];
  const doseGap = Math.abs(m.machineDoseG - recipe.doseG) / recipe.doseG;
  checks.push(doseGap >= 0.1 ? {
    tone: 'watch', title: '명목 dose와 실제 dose가 다릅니다',
    detail: `Aiden은 ${m.machineDoseG}g을 기준으로 계산하지만 실제 투입은 ${recipe.doseG}g입니다. Bloom도 실제 1:${m.actualBloomRatio}가 됩니다.`,
  } : { tone: 'good', title: '기기 계산과 실제 dose가 가깝습니다', detail: `Aiden 안내 ${m.machineDoseG}g · 실제 ${recipe.doseG}g` });

  if (recipe.brewWaterG < 150 || recipe.brewWaterG > 1500) checks.push({ tone: 'danger', title: 'Aiden 용량 범위 확인', detail: '공식 범위인 150–1,500mL 안에서 설정하세요.' });
  else checks.push({ tone: 'good', title: recipe.brewWaterG <= 450 ? 'Single Serve basket' : 'Batch basket', detail: `${recipe.brewWaterG}mL는 ${recipe.brewWaterG <= 450 ? '#2 cone filter' : '8–12 cup flat filter'} 영역입니다.` });

  if (m.actualBloomRatio < 2) checks.push({ tone: 'danger', title: 'Bloom 물이 빠듯합니다', detail: `실제 bloom 1:${m.actualBloomRatio}. 마른 포켓이 보이면 nominal bloom ratio를 높이세요.` });
  else if (m.actualBloomRatio < 2.5) checks.push({ tone: 'watch', title: 'Bloom 포화 관찰', detail: `실제 bloom 1:${m.actualBloomRatio}. 첫 추출에서 베드 전체가 젖는지 확인하세요.` });

  if (cup && m.headspaceMl !== null) {
    if (m.headspaceMl < 0) checks.push({ tone: 'danger', title: '컵이 넘칠 수 있습니다', detail: `${Math.abs(m.headspaceMl)}mL만큼 초과합니다. 물이나 얼음을 줄이세요.` });
    else if (m.headspaceMl < 18) checks.push({ tone: 'watch', title: '컵 여유가 적습니다', detail: `예상 여유 ${m.headspaceMl}mL. 실제 retention과 얼음 크기에 따라 넘칠 수 있습니다.` });
    else checks.push({ tone: 'good', title: '컵 용량 여유', detail: `예상 적재 ${m.finalLoadG}g · 여유 약 ${m.headspaceMl}mL` });
  }

  if ((recipe.beverageStyle === 'flash' || recipe.beverageStyle === 'iced') && m.estimatedIceRemainingG < 5) checks.push({
    tone: 'watch', title: '얼음이 모두 녹을 가능성',
    detail: `낙하 온도 ${recipe.dropTempC}°C 가정 시 5°C까지 약 ${m.iceNeededFor5C}g의 얼음이 필요합니다. 첫 잔에서 실제 온도와 남은 얼음을 기록해 보정하세요.`,
  });
  if ([recipe.bloomTempC, ...recipe.pulseTempsC].some((temp) => temp < 50 || temp > 99)) checks.push({ tone: 'danger', title: '온도 범위 초과', detail: 'Aiden hot brew 설정 범위 50–99°C 안으로 조정하세요.' });
  return checks;
}

export function suggestNextChange(recipe: Recipe, tasting: Tasting) {
  if (tasting.drawdown === 'slow' || tasting.astringency >= 4) return { field: 'grindSetting', label: '분쇄도 한 단계 굵게', reason: '느린 drawdown/떫은맛을 먼저 줄입니다.' };
  if (tasting.bitterness >= 4) return { field: 'lastPulseTemp', label: '마지막 pulse −1°C', reason: '전체 추출을 흔들지 않고 거친 후미만 줄입니다.' };
  if (tasting.acidity >= 4 && tasting.sweetness <= 2) return { field: 'grindSetting', label: '분쇄도 한 클릭 곱게', reason: '날카로운 산미와 부족한 단맛을 먼저 확인합니다.' };
  if (tasting.body <= 2 && tasting.overall <= 3) return { field: 'brewIceG', label: '브루 얼음 −10g', reason: '추출 변수보다 먼저 희석을 줄여 농도를 확인합니다.' };
  if (!tasting.iceRemaining && (recipe.beverageStyle === 'flash' || recipe.beverageStyle === 'iced')) return { field: 'servingIceG', label: '서빙 얼음 +10g', reason: '얼음 잔존 목표를 맞추되 컵 용량 경고를 함께 확인합니다.' };
  return { field: 'none', label: '현재 레시피 유지', reason: '큰 결함이 없습니다. 같은 조건으로 한 번 더 재현성을 확인하세요.' };
}

export function codexPrompt(recipe: Recipe, bean: Bean, cup: Cup, tastings: Tasting[]) {
  return `#ohmycoffee\n\nFellow Aiden 레시피를 한 변수만 바꿔 개선해 주세요. 숫자는 기기 입력값과 실제값을 구분하고, 확실하지 않은 기기 UI 한계는 단정하지 마세요.\n\n원두: ${bean.name}\n산지/가공: ${bean.origin}, ${bean.process}\n로스팅: ${bean.roastLevel}\n컵노트: ${bean.tastingNotes.join(', ')}\n목표: ${recipe.goal}\n컵: ${cup.name} (${cup.capacityMl}mL)\n현재 레시피 JSON:\n${JSON.stringify(recipe, null, 2)}\n\nHarness 계산:\n${JSON.stringify(calculateRecipe(recipe, cup), null, 2)}\n\n최근 시음:\n${JSON.stringify(tastings.slice(0, 3), null, 2)}\n\n응답은 (1) 바꿀 변수 하나와 이유, (2) 수정된 전체 레시피, (3) 다음 잔에서 관찰할 항목 순서로 작성해 주세요.`;
}
