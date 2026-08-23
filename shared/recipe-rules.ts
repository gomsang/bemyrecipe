import { AIDEN_QUANTITY_MODES, validateAidenWaterSelection } from "./aiden-water";

export const RECIPE_RULES = {
  version: 5,
  ui: {
    quantityModes: AIDEN_QUANTITY_MODES,
    serveModes: {
      hot: {
        label: "HOT",
        icon: "thermometer",
        description: "추출 후 얼음을 사용하지 않고 뜨겁게 마시는 레시피",
        allowedBrewMethods: ["standard"],
      },
      iced: {
        label: "ICED",
        icon: "snowflake",
        description: "Brew ice 또는 Serving ice를 사용해 차갑게 마시는 레시피",
        allowedBrewMethods: ["standard", "flash"],
      },
      cold_brew: {
        label: "COLD BREW",
        icon: "snowflake",
        description: "Aiden Cold Brew 프로그램으로 저온 추출하는 레시피",
        allowedBrewMethods: ["cold_drip"],
      },
    },
    brewMethods: {
      standard: { label: "STANDARD" },
      flash: { label: "FLASH" },
      cold_drip: { label: "COLD DRIP" },
    },
    iceStrategies: {
      none: { label: "NONE" },
      brew_only: { label: "BREW ONLY" },
      serving_only: { label: "SERVING ONLY" },
      split: { label: "SPLIT" },
    },
    iceRoles: {
      brewIce: {
        label: "BREW ICE",
        timing: "before_brew",
        timingLabel: "추출 전",
        purpose: "flash_chill",
        description: "카라페에서 뜨거운 추출액을 즉시 식히고 최종 농도를 만듭니다. 녹는 것이 정상입니다.",
      },
      servingIce: {
        label: "SERVING ICE",
        timing: "before_transfer",
        timingLabel: "이송 직전",
        purpose: "keep_cold",
        description: "음용 컵에 새로 넣어 마시는 동안 차가움과 남은 얼음을 유지합니다.",
      },
    },
    filterRinse: {
      enabledLabel: "HOT WATER / DISCARD",
      disabledLabel: "NO RINSE",
      enabledDescription: "이 레시피에서는 필터 종류와 재현성을 통제하기 위해 린싱합니다. 카라페의 린스 물을 완전히 버린 뒤 Brew ice를 넣어야 계산한 농도가 유지됩니다.",
      disabledDescription: "이 레시피는 필터 린싱을 생략합니다. Aiden 동봉 필터처럼 제조사가 린스 불필요를 밝힌 종이는 그대로 사용할 수 있으며, 필터가 바뀌면 다시 확인합니다.",
    },
    showerSelector: {
      single_serve: {
        label: "ONE GREEN DOT / SINGLE",
        description: "Single Serve cone basket에 맞춘 물리 showerhead 위치입니다. 프로필의 pulse 설정과는 별개의 수동 설정입니다.",
      },
      batch: {
        label: "THREE BLUE DOTS / BATCH",
        description: "Batch basket에 맞춘 물리 showerhead 위치입니다. Single Serve basket에서 쓸 때는 공식 기본값이 아니라 통제 실험으로 기록합니다.",
      },
    },
    ruleStatus: {
      pass: { label: "RULES PASS", description: "현재 ruleset의 기계 한계와 실행 조건을 통과했습니다." },
      review: { label: "REVIEW", description: "레시피는 유지할 수 있지만 통제조건 또는 ruleset 확장을 검토해야 합니다." },
      blocked: { label: "BLOCKED", description: "기계 한계 또는 실행 일관성 오류를 먼저 수정해야 합니다." },
    },
  },
  schema: {
    serveModes: ["hot", "iced", "cold_brew"],
    brewMethods: ["standard", "flash", "cold_drip"],
    rinseWater: ["hot", "none"],
    iceStrategies: ["none", "brew_only", "serving_only", "split"],
    prepPhases: ["before_brew", "after_brew", "serve", "hold"],
  },
  controlConditions: {
    basket: {
      label: "Basket",
      type: "enum",
      values: ["single_serve", "batch"],
      required: "all",
      description: "Aiden에서 실제로 사용하는 basket",
    },
    shower_selector: {
      label: "Shower selector",
      type: "enum",
      values: ["single_serve", "batch"],
      required: "all",
      description: "추출 직전에 맞추는 물리 showerhead 위치. profile의 Single/Batch pulse branch와 다름",
    },
    filter_paper: {
      label: "Filter paper",
      type: "string",
      required: "all",
      description: "필터 brand·size와 bleached/unbleached 여부. 린스 필요성의 판정 기준",
    },
    grinder_burr: {
      label: "Grinder / burr",
      type: "string",
      required: "all",
      description: "분쇄도 해석의 기준이 되는 grinder와 burr",
    },
    water: {
      label: "Water",
      type: "string",
      required: "all",
      description: "추출수 또는 제품명과 알려진 수질 정보",
    },
    aiden_quantity_mode: {
      label: "Aiden water selector",
      type: "enum",
      values: ["standard_cup", "metric_precise"],
      required: "all",
      description: "선택 물양의 실제 간격을 결정하는 기기 단위 모드",
    },
    vessel: {
      label: "Serving vessel",
      type: "string",
      required: "all",
      description: "용량과 보온 특성을 포함한 음용 용기",
    },
    ice_goal: {
      label: "Ice goal",
      type: "enum",
      values: ["none", "melt_at_transfer", "remain_while_drinking"],
      required: "iced",
      description: "급랭 뒤 얼음 잔존 목표",
    },
    ambient_temperature_c: {
      label: "Ambient temperature",
      type: "number",
      min: 0,
      max: 40,
      required: "optional",
      description: "열수지 보정에 쓰는 실내 온도",
    },
    ice_temperature_c: {
      label: "Ice temperature",
      type: "number",
      min: -30,
      max: 0,
      required: "optional",
      description: "열수지 보정에 쓰는 냉동고 기준 얼음 온도",
    },
  },
  governance: {
    hardConstraintDescription: "기계가 받을 수 없는 값, 모순된 물·얼음 수지, 실행 불가능한 순서는 build를 막습니다.",
    adaptiveConstraintDescription: "새 향미 가설, 새로운 accessory나 통제조건은 build를 막지 않고 review와 system proposal을 만듭니다.",
    extensionChecklist: [
      "control condition schema와 허용값 정의",
      "validator의 hard/advisory 등급 결정",
      "UI label·설명·입력 또는 표시 요소 추가",
      "기존 Markdown migration 필요 여부 검토",
      "positive·negative rule test 추가",
    ],
  },
} as const;

export type ServeMode = keyof typeof RECIPE_RULES.ui.serveModes;
export type BrewMethod = keyof typeof RECIPE_RULES.ui.brewMethods;
export type IceStrategy = keyof typeof RECIPE_RULES.ui.iceStrategies;
export type PrepPhase = (typeof RECIPE_RULES.schema.prepPhases)[number];
export type RuleStatus = "pass" | "review" | "blocked";

export type RuleException = {
  ruleId: string;
  reason: string;
  evidence: string;
  expiresWhen: string;
};

export type RuleExtensionRequest = {
  condition: string;
  reason: string;
  proposedChanges: string[];
};

export type RuleMessage = {
  ruleId: string;
  message: string;
  acknowledged: boolean;
};

export type RuleProposal = {
  id: string;
  condition: string;
  title: string;
  rationale: string;
  suggestedChanges: string[];
};

export type RuleEvaluation = {
  rulesetVersion: number;
  recipeRulesetVersion: number | null;
  status: RuleStatus;
  errors: RuleMessage[];
  warnings: RuleMessage[];
  proposals: RuleProposal[];
};

export type RulePreparationPlan = {
  filterRinse: { enabled: boolean; water: string; discardRinseWater: boolean };
  icePlan: {
    strategy: string;
    brewIce: { grams: number; vessel: string; timing: string; purpose: string };
    servingIce: { grams: number; vessel: string; timing: string; purpose: string };
  };
  steps: { id: string; phase: string; label: string; instruction: string; critical: boolean }[];
};

export type RecipeRuleInput = {
  recipeRulesetVersion: number | null;
  serveMode: string;
  brewMethod: string;
  brewReady: boolean;
  coldBrewEnabled: boolean;
  selectedWaterMl: number;
  preparation: RulePreparationPlan;
  controlConditions: Record<string, unknown>;
  exceptions: RuleException[];
  extensionRequests: RuleExtensionRequest[];
};

export function evaluateRecipeRules(input: RecipeRuleInput): RuleEvaluation {
  const errors: RuleMessage[] = [];
  const warnings: RuleMessage[] = [];
  const proposals: RuleProposal[] = [];
  const acknowledged = new Set(input.exceptions.map((item) => item.ruleId));
  const requestedExtensions = new Map(input.extensionRequests.map((item) => [item.condition, item]));

  const hard = (ruleId: string, message: string) => errors.push({ ruleId, message, acknowledged: false });
  const advisory = (ruleId: string, message: string) => warnings.push({ ruleId, message, acknowledged: acknowledged.has(ruleId) });
  const propose = (condition: string, title: string, rationale: string, changes?: string[]) => {
    const request = requestedExtensions.get(condition);
    const id = `extend-${condition.replace(/[^a-z0-9_-]/gi, "-").toLowerCase()}`;
    if (proposals.some((item) => item.id === id)) return;
    proposals.push({
      id,
      condition,
      title,
      rationale: request?.reason || rationale,
      suggestedChanges: request?.proposedChanges.length
        ? request.proposedChanges
        : changes?.length
          ? changes
          : [...RECIPE_RULES.governance.extensionChecklist],
    });
  };

  if (input.recipeRulesetVersion === null) {
    advisory("ruleset.version.missing", `ruleset_version이 없습니다. 현재 v${RECIPE_RULES.version}로 평가했습니다.`);
  } else if (input.recipeRulesetVersion < RECIPE_RULES.version) {
    advisory("ruleset.version.stale", `Recipe ruleset v${input.recipeRulesetVersion}을 현재 v${RECIPE_RULES.version}로 재검토해야 합니다.`);
  } else if (input.recipeRulesetVersion > RECIPE_RULES.version) {
    advisory("ruleset.version.future", `Recipe가 현재 시스템보다 새로운 ruleset v${input.recipeRulesetVersion}을 요구합니다.`);
    propose("ruleset_version", "사이트 ruleset 업그레이드", "Recipe가 현재 evaluator보다 새로운 ruleset을 사용합니다.");
  }

  if (!includes(RECIPE_RULES.schema.serveModes, input.serveMode)) hard("mode.serve.invalid", "serve_mode는 hot, iced, cold_brew 중 하나여야 합니다.");
  if (!includes(RECIPE_RULES.schema.brewMethods, input.brewMethod)) hard("mode.method.invalid", "brew_method는 standard, flash, cold_drip 중 하나여야 합니다.");
  const modeRule = getServeModeRule(input.serveMode);
  if (modeRule && !includes(modeRule.allowedBrewMethods, input.brewMethod)) {
    hard("mode.method.mismatch", `${modeRule.label}에서 brew_method ${input.brewMethod}을 사용할 수 없습니다.`);
  }
  if (input.serveMode === "cold_brew" && !input.coldBrewEnabled) hard("mode.cold.profile", "COLD BREW recipe는 cold_brew_enabled: true여야 합니다.");
  if (input.serveMode !== "cold_brew" && input.coldBrewEnabled) hard("mode.cold.profile", "HOT/ICED recipe는 cold_brew_enabled: false여야 합니다.");

  const waterSelectionErrors = validateAidenWaterSelection({
    selectedWaterMl: input.selectedWaterMl,
    quantityMode: String(input.controlConditions.aiden_quantity_mode ?? ""),
    basket: String(input.controlConditions.basket ?? ""),
  });
  waterSelectionErrors.forEach((message) => hard("water.selection.invalid", message));

  const plan = input.preparation;
  if (!includes(RECIPE_RULES.schema.rinseWater, plan.filterRinse.water)) hard("rinse.water.invalid", "filter_rinse.water는 hot 또는 none이어야 합니다.");
  if (plan.filterRinse.enabled && (plan.filterRinse.water !== "hot" || !plan.filterRinse.discardRinseWater)) {
    hard("rinse.balance", "필터를 린싱하면 hot water를 사용하고 rinse water 폐기를 명시해야 합니다.");
  }
  if (!plan.filterRinse.enabled && (plan.filterRinse.water !== "none" || plan.filterRinse.discardRinseWater)) {
    hard("rinse.balance", "필터를 린싱하지 않으면 water는 none, discard_rinse_water는 false여야 합니다.");
  }

  const { brewIce, servingIce, strategy } = plan.icePlan;
  if (!includes(RECIPE_RULES.schema.iceStrategies, strategy)) hard("ice.strategy.invalid", "ice_plan.strategy 값이 올바르지 않습니다.");
  if (![brewIce.grams, servingIce.grams].every((grams) => Number.isFinite(grams) && grams >= 0)) hard("ice.grams.invalid", "Ice grams는 0 이상의 유한한 수여야 합니다.");
  if (brewIce.timing !== RECIPE_RULES.ui.iceRoles.brewIce.timing || brewIce.purpose !== RECIPE_RULES.ui.iceRoles.brewIce.purpose) {
    hard("ice.brew.role", "Brew ice는 timing: before_brew, purpose: flash_chill이어야 합니다.");
  }
  if (servingIce.timing !== RECIPE_RULES.ui.iceRoles.servingIce.timing || servingIce.purpose !== RECIPE_RULES.ui.iceRoles.servingIce.purpose) {
    hard("ice.serving.role", "Serving ice는 timing: before_transfer, purpose: keep_cold이어야 합니다.");
  }
  if (!brewIce.vessel.trim() || !servingIce.vessel.trim()) hard("ice.vessel.missing", "각 ice 항목에는 vessel을 명시해야 합니다.");
  if (strategy === "none" && (brewIce.grams !== 0 || servingIce.grams !== 0)) hard("ice.strategy.balance", "Ice strategy none이면 두 ice grams는 0이어야 합니다.");
  if (strategy === "brew_only" && !(brewIce.grams > 0 && servingIce.grams === 0)) hard("ice.strategy.balance", "brew_only는 Brew ice만 0g보다 커야 합니다.");
  if (strategy === "serving_only" && !(brewIce.grams === 0 && servingIce.grams > 0)) hard("ice.strategy.balance", "serving_only는 Serving ice만 0g보다 커야 합니다.");
  if (strategy === "split" && !(brewIce.grams > 0 && servingIce.grams > 0)) hard("ice.strategy.balance", "split은 Brew ice와 Serving ice가 모두 0g보다 커야 합니다.");
  if (input.serveMode === "iced" && strategy === "none") hard("ice.iced.required", "ICED recipe에는 ice strategy가 필요합니다.");
  if (input.serveMode === "hot" && (strategy !== "none" || brewIce.grams !== 0 || servingIce.grams !== 0)) {
    hard("ice.hot.forbidden", "HOT recipe는 ice strategy none, 두 ice grams 0이어야 합니다.");
  }

  const seenStepIds = new Set<string>();
  for (const step of plan.steps) {
    if (!/^[a-z0-9][a-z0-9_]{1,49}$/.test(step.id)) hard("prep.id.invalid", `prep_steps id가 올바르지 않습니다: ${step.id || "(empty)"}`);
    if (seenStepIds.has(step.id)) hard("prep.id.duplicate", `prep_steps id가 중복됩니다: ${step.id}`);
    seenStepIds.add(step.id);
    if (!includes(RECIPE_RULES.schema.prepPhases, step.phase)) hard("prep.phase.invalid", `prep_steps phase가 올바르지 않습니다: ${step.phase}`);
    if (!step.label.trim() || !step.instruction.trim()) hard("prep.copy.missing", `prep_steps ${step.id || "항목"}의 label과 instruction이 필요합니다.`);
  }
  if (input.brewReady) {
    if (!plan.steps.length) hard("prep.required", "brew_ready recipe에는 prep_steps가 필요합니다.");
    if (!seenStepIds.has("set_quantity_mode")) hard("prep.quantity_mode.required", "brew-ready recipe에는 Aiden 물양 단위 모드를 확인하는 set_quantity_mode step이 필요합니다.");
    if (plan.filterRinse.enabled && !seenStepIds.has("rinse_filter")) hard("prep.rinse.required", "린싱하는 brew-ready recipe에는 rinse_filter step이 필요합니다.");
    if (input.controlConditions.shower_selector && !seenStepIds.has("set_shower_selector")) hard("prep.shower_selector.required", "shower_selector를 기록한 brew-ready recipe에는 set_shower_selector step이 필요합니다.");
    if (brewIce.grams > 0 && !seenStepIds.has("add_brew_ice")) hard("prep.brew_ice.required", "Brew ice가 있으면 add_brew_ice step이 필요합니다.");
    if (servingIce.grams > 0 && !seenStepIds.has("add_serving_ice")) hard("prep.serving_ice.required", "Serving ice가 있으면 add_serving_ice step이 필요합니다.");
    if (plan.steps.some((step) => step.phase === "hold")) hard("prep.hold.forbidden", "brew_ready recipe에는 hold step을 둘 수 없습니다.");
  }

  evaluateControlConditions(input, advisory, propose);
  for (const request of input.extensionRequests) {
    propose(request.condition, `${request.condition} 통제조건 확장`, request.reason, request.proposedChanges);
  }
  for (const exception of input.exceptions) {
    if (!exception.ruleId || !exception.reason || !exception.evidence || !exception.expiresWhen) {
      advisory("exception.incomplete", "rule_exceptions에는 rule_id, reason, evidence, expires_when이 모두 필요합니다.");
    }
    if (errors.some((item) => item.ruleId === exception.ruleId)) {
      advisory("exception.hard-constraint", `${exception.ruleId}는 hard constraint라 exception으로 우회할 수 없습니다.`);
    }
  }

  return {
    rulesetVersion: RECIPE_RULES.version,
    recipeRulesetVersion: input.recipeRulesetVersion,
    status: errors.length ? "blocked" : warnings.length || proposals.length ? "review" : "pass",
    errors,
    warnings,
    proposals,
  };
}

function evaluateControlConditions(
  input: RecipeRuleInput,
  advisory: (ruleId: string, message: string) => void,
  propose: (condition: string, title: string, rationale: string, changes?: string[]) => void,
) {
  const definitions = RECIPE_RULES.controlConditions as Record<string, {
    label: string;
    type: "enum" | "string" | "number";
    values?: readonly string[];
    min?: number;
    max?: number;
    required: "all" | "iced" | "optional";
    description: string;
  }>;
  for (const [key, definition] of Object.entries(definitions)) {
    const required = definition.required === "all" || (definition.required === "iced" && input.serveMode === "iced");
    const value = input.controlConditions[key];
    if (required && (value === undefined || value === null || value === "")) advisory(`control.${key}.missing`, `${definition.label} 통제조건이 비어 있습니다.`);
  }
  for (const [key, value] of Object.entries(input.controlConditions)) {
    const definition = definitions[key];
    if (!definition) {
      advisory(`control.${key}.unknown`, `${key}는 현재 ruleset에 없는 새 통제조건입니다. Recipe에는 유지하고 system 확장을 검토합니다.`);
      propose(key, `${key} 통제조건 추가`, "현재 recipe가 ruleset에 없는 통제조건을 사용합니다.");
      continue;
    }
    if (definition.type === "string" && typeof value !== "string") advisory(`control.${key}.type`, `${definition.label} 값은 문자열이어야 합니다.`);
    if (definition.type === "number") {
      const number = Number(value);
      if (!Number.isFinite(number)) advisory(`control.${key}.type`, `${definition.label} 값은 숫자여야 합니다.`);
      else if ((definition.min !== undefined && number < definition.min) || (definition.max !== undefined && number > definition.max)) {
        advisory(`control.${key}.range`, `${definition.label} ${number}는 현재 검토 범위 밖입니다.`);
        propose(key, `${definition.label} 범위 확장 검토`, "실제 통제조건 값이 현재 ruleset 범위를 벗어납니다.");
      }
    }
    if (definition.type === "enum" && definition.values && !definition.values.includes(String(value))) {
      advisory(`control.${key}.value`, `${definition.label} 값 ${String(value)}는 현재 허용 목록에 없습니다.`);
      propose(key, `${definition.label} 허용값 확장 검토`, "새로운 실제 조건이 기존 enum에 포함되지 않습니다.");
    }
  }
  const basket = input.controlConditions.basket;
  const showerSelector = input.controlConditions.shower_selector;
  if (basket && showerSelector && basket !== showerSelector) {
    advisory(
      "control.shower_selector.mismatch",
      `Basket ${String(basket)}와 shower selector ${String(showerSelector)}가 다릅니다. 공식 기본 조합이 아니므로 한 변수 A/B 실험과 brew log 근거를 남기세요.`,
    );
  }
}

function includes(values: readonly string[], value: string) {
  return values.includes(value);
}

export function getServeModeRule(mode: string) {
  return RECIPE_RULES.ui.serveModes[mode as ServeMode];
}

export function getBrewMethodRule(method: string) {
  return RECIPE_RULES.ui.brewMethods[method as BrewMethod];
}

export function getIceStrategyRule(strategy: string) {
  return RECIPE_RULES.ui.iceStrategies[strategy as IceStrategy];
}
