import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { AidenProfile } from "../shared/aiden-profile";
import { validateAidenProfile } from "../shared/aiden-profile";
import { estimateFlashThermalBalance } from "../shared/flash-thermal";
import {
  evaluateRecipeRules,
  type RuleException,
  type RuleExtensionRequest,
} from "../shared/recipe-rules";
import type {
  Catalog,
  CatalogBean,
  CatalogRecipe,
  BeanStory,
  DrinkGuide,
  PreparationPlan,
  RecipeRevision,
  RecipeStatus,
  RevisionKind,
} from "../src/lib/types";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const REVISION_KINDS = new Set<RevisionKind>([
  "baseline",
  "gate_completion",
  "sensory_adjustment",
  "execution_adjustment",
  "correction",
  "equipment_adaptation",
]);

function asDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value ? String(value) : "";
}

function readBean(recipeFile: string, beanReference: unknown): CatalogBean {
  const beanPath = path.resolve(path.dirname(recipeFile), String(beanReference));
  const bean = matter(fs.readFileSync(beanPath, "utf8")).data;
  return {
    id: path.basename(beanPath, ".md"),
    name: String(bean.name ?? path.basename(beanPath, ".md")),
    origin: String(bean.origin ?? ""),
    region: String(bean.region ?? ""),
    producer: String(bean.producer_or_station ?? ""),
    altitude: String(bean.altitude ?? ""),
    variety: String(bean.variety ?? ""),
    process: String(bean.process ?? ""),
    roastLevel: String(bean.roast_level ?? ""),
    roastDate: asDate(bean.roast_date),
    roaster: String(bean.roaster ?? ""),
    roasterCode: String(bean.roaster_code ?? "").trim().toUpperCase(),
    tastingNotes: Array.isArray(bean.tasting_notes) ? bean.tasting_notes.map(String) : [],
    story: readBeanStory(bean),
  };
}

function cleanStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((item) => item.trim()).filter(Boolean) : [];
}

function readBeanStory(data: Record<string, unknown>): BeanStory {
  const story = record(data.story);
  const sections = Array.isArray(story.sections) ? story.sections.map(record) : [];
  const facts = Array.isArray(story.facts) ? story.facts.map(record) : [];
  const sources = Array.isArray(story.sources) ? story.sources.map(record) : [];
  const processJourney = Array.isArray(story.process_journey) ? story.process_journey.map(record) : [];
  const tastingLexicon = Array.isArray(story.tasting_lexicon) ? story.tasting_lexicon.map(record) : [];
  const glossary = Array.isArray(story.glossary) ? story.glossary.map(record) : [];
  return {
    headline: String(story.headline ?? "").trim(),
    deck: String(story.deck ?? "").trim(),
    sections: sections.map((section) => ({
      id: String(section.id ?? "").trim(),
      eyebrow: String(section.eyebrow ?? "").trim(),
      title: String(section.title ?? "").trim(),
      body: String(section.body ?? "").trim(),
      evidence: String(section.evidence ?? "regional_context") as BeanStory["sections"][number]["evidence"],
    })),
    facts: facts.map((fact) => ({
      label: String(fact.label ?? "").trim(),
      value: String(fact.value ?? "").trim(),
      note: String(fact.note ?? "").trim(),
    })),
    unknowns: cleanStrings(story.unknowns),
    sources: sources.map((source) => ({
      label: String(source.label ?? "").trim(),
      url: source.url ? String(source.url).trim() : null,
      scope: String(source.scope ?? "").trim(),
      note: String(source.note ?? "").trim(),
    })),
    processJourney: processJourney.map((item) => ({
      step: String(item.step ?? "").trim(),
      title: String(item.title ?? "").trim(),
      body: String(item.body ?? "").trim(),
      scope: String(item.scope ?? "").trim(),
    })),
    tastingLexicon: tastingLexicon.map((item) => ({
      term: String(item.term ?? "").trim(),
      cue: String(item.cue ?? "").trim(),
      distinction: String(item.distinction ?? "").trim(),
    })),
    glossary: glossary.map((item) => ({
      term: String(item.term ?? "").trim(),
      definition: String(item.definition ?? "").trim(),
    })),
  };
}

function readProfile(data: Record<string, unknown>): AidenProfile {
  return {
    profile_name: String(data.profile_name ?? ""),
    profile_temperature_c: Number(data.profile_temperature_c),
    nominal_ratio: Number(data.nominal_ratio),
    cold_brew_enabled: Boolean(data.cold_brew_enabled),
    bloom_enabled: Boolean(data.bloom_enabled),
    bloom_ratio: Number(data.bloom_ratio),
    bloom_seconds: Number(data.bloom_seconds),
    bloom_temp_c: Number(data.bloom_temp_c),
    single_serve_pulses_enabled: Boolean(data.single_serve_pulses_enabled),
    pulse_count: Number(data.pulse_count),
    pulse_interval_seconds: Number(data.pulse_interval_seconds),
    pulse_temps_c: Array.isArray(data.pulse_temps_c) ? data.pulse_temps_c.map(Number) : [],
    batch_pulses_enabled: Boolean(data.batch_pulses_enabled),
    batch_pulse_count: Number(data.batch_pulse_count),
    batch_pulse_interval_seconds: Number(data.batch_pulse_interval_seconds),
    batch_pulse_temps_c: Array.isArray(data.batch_pulse_temps_c) ? data.batch_pulse_temps_c.map(Number) : [],
  };
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function readPreparation(data: Record<string, unknown>): PreparationPlan {
  const rinse = record(data.filter_rinse);
  const icePlan = record(data.ice_plan);
  const brewIce = record(icePlan.brew_ice);
  const servingIce = record(icePlan.serving_ice);
  const steps = Array.isArray(data.prep_steps) ? data.prep_steps.map(record) : [];
  return {
    filterRinse: {
      enabled: Boolean(rinse.enabled),
      water: String(rinse.water ?? "none") as PreparationPlan["filterRinse"]["water"],
      discardRinseWater: Boolean(rinse.discard_rinse_water),
    },
    icePlan: {
      strategy: String(icePlan.strategy ?? "none") as PreparationPlan["icePlan"]["strategy"],
      brewIce: {
        grams: Number(brewIce.grams ?? 0),
        vessel: String(brewIce.vessel ?? ""),
        timing: String(brewIce.timing ?? "before_brew") as PreparationPlan["icePlan"]["brewIce"]["timing"],
        purpose: String(brewIce.purpose ?? "flash_chill") as PreparationPlan["icePlan"]["brewIce"]["purpose"],
      },
      servingIce: {
        grams: Number(servingIce.grams ?? 0),
        vessel: String(servingIce.vessel ?? ""),
        timing: String(servingIce.timing ?? "before_transfer") as PreparationPlan["icePlan"]["servingIce"]["timing"],
        purpose: String(servingIce.purpose ?? "keep_cold") as PreparationPlan["icePlan"]["servingIce"]["purpose"],
      },
    },
    steps: steps.map((step) => ({
      id: String(step.id ?? ""),
      phase: String(step.phase ?? "before_brew") as PreparationPlan["steps"][number]["phase"],
      label: String(step.label ?? ""),
      instruction: String(step.instruction ?? ""),
      critical: Boolean(step.critical),
    })),
  };
}

function readRuleExceptions(data: Record<string, unknown>): RuleException[] {
  if (!Array.isArray(data.rule_exceptions)) return [];
  return data.rule_exceptions.map(record).map((item) => ({
    ruleId: String(item.rule_id ?? ""),
    reason: String(item.reason ?? ""),
    evidence: String(item.evidence ?? ""),
    expiresWhen: String(item.expires_when ?? ""),
  }));
}

function readRuleExtensionRequests(data: Record<string, unknown>): RuleExtensionRequest[] {
  if (!Array.isArray(data.rule_extension_requests)) return [];
  return data.rule_extension_requests.map(record).map((item) => ({
    condition: String(item.condition ?? ""),
    reason: String(item.reason ?? ""),
    proposedChanges: Array.isArray(item.proposed_changes) ? item.proposed_changes.map(String) : [],
  }));
}

function normalizeParentId(value: unknown): string | null {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  return path.basename(String(value).trim(), ".md");
}

function readRevision(data: Record<string, unknown>): RecipeRevision {
  const revision = record(data.revision);
  const primaryVariable = revision.primary_variable === null || revision.primary_variable === undefined
    ? null
    : String(revision.primary_variable).trim() || null;
  return {
    kind: String(revision.kind ?? "") as RevisionKind,
    parentId: normalizeParentId(revision.parent ?? data.parent),
    primaryVariable,
    summary: String(revision.summary ?? "").trim(),
    rationale: String(revision.rationale ?? "").trim(),
    changes: Array.isArray(revision.changes) ? revision.changes.map(String).map((item) => item.trim()).filter(Boolean) : [],
    successCriteria: Array.isArray(revision.success_criteria) ? revision.success_criteria.map(String).map((item) => item.trim()).filter(Boolean) : [],
  };
}

function readDrinkGuide(data: Record<string, unknown>, coffeeStory: BeanStory): DrinkGuide {
  const guide = record(data.drink_guide);
  const brewChoices = Array.isArray(guide.brew_choices) ? guide.brew_choices.map(record) : [];
  const tasteJourney = Array.isArray(guide.taste_journey) ? guide.taste_journey.map(record) : [];
  return {
    status: String(guide.status ?? "research_hold") as DrinkGuide["status"],
    title: String(guide.title ?? "").trim(),
    deck: String(guide.deck ?? "").trim(),
    estimatedReadMinutes: Number(guide.estimated_read_minutes ?? 0),
    brewStory: String(guide.brew_story ?? "").trim(),
    servingRitual: String(guide.serving_ritual ?? "").trim(),
    brewChoices: brewChoices.map((choice) => ({
      label: String(choice.label ?? "").trim(),
      value: String(choice.value ?? "").trim(),
      reason: String(choice.reason ?? "").trim(),
    })),
    tasteJourney: tasteJourney.map((item) => ({
      moment: String(item.moment ?? "").trim(),
      cue: String(item.cue ?? "").trim(),
    })),
    coffeeStory,
  };
}

function titleFromMarkdown(content: string, fallback: string): string {
  return content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? fallback;
}

function summaryFromMarkdown(content: string): string {
  const goalSection = content.match(/## 목표\s+([\s\S]*?)(?=\n## |$)/)?.[1] ?? "";
  const first = goalSection.match(/^[-*]\s+(.+)$/m)?.[1];
  return first?.replace(/\*\*/g, "").trim() ?? "Aiden용 정밀 추출 레시피";
}

function recipeFiles(): string[] {
  const folders = ["recipes/accepted", "recipes/candidates"];
  return folders.flatMap((folder) => {
    const absolute = path.join(REPO_ROOT, folder);
    return fs
      .readdirSync(absolute)
      .filter((file) => file.endsWith(".md") && file !== "README.md")
      .map((file) => path.join(absolute, file));
  });
}

export function buildCatalog(): Catalog {
  const recipes = recipeFiles().map((file): CatalogRecipe => {
    const parsed = matter(fs.readFileSync(file, "utf8"));
    const data = parsed.data as Record<string, unknown>;
    const profile = readProfile(data);
    const bean = readBean(file, data.bean);
    const preparation = readPreparation(data);
    const controlConditions = record(data.control_conditions);
    const ruleExceptions = readRuleExceptions(data);
    const ruleExtensionRequests = readRuleExtensionRequests(data);
    const parsedRulesetVersion = Number(data.ruleset_version);
    const rulesetVersion = Number.isInteger(parsedRulesetVersion) && parsedRulesetVersion > 0 ? parsedRulesetVersion : null;
    const ruleEvaluation = evaluateRecipeRules({
      recipeRulesetVersion: rulesetVersion,
      serveMode: String(data.serve_mode),
      brewMethod: String(data.brew_method),
      brewReady: Boolean(data.brew_ready),
      coldBrewEnabled: Boolean(data.cold_brew_enabled),
      preparation,
      controlConditions,
      exceptions: ruleExceptions,
      extensionRequests: ruleExtensionRequests,
    });
    const errors = [...validateAidenProfile(profile), ...ruleEvaluation.errors.map((item) => `${item.ruleId}: ${item.message}`)];
    const warnings = ruleEvaluation.warnings.map((item) => `${item.ruleId}: ${item.message}`);
    const id = path.basename(file, ".md");
    const recipe: CatalogRecipe = {
      id,
      title: titleFromMarkdown(parsed.content, id),
      status: String(data.status) as RecipeStatus,
      brewReady: Boolean(data.brew_ready),
      lineage: String(data.lineage ?? ""),
      version: Number(data.version ?? 1),
      isLatest: false,
      versionCount: 1,
      revision: readRevision(data),
      created: asDate(data.created),
      acceptedAt: data.accepted_at ? asDate(data.accepted_at) : null,
      acceptanceNote: data.acceptance_note ? String(data.acceptance_note) : null,
      serveMode: String(data.serve_mode) as CatalogRecipe["serveMode"],
      brewMethod: String(data.brew_method) as CatalogRecipe["brewMethod"],
      bean,
      profile,
      brew: {
        cupId: String(data.cup_id ?? ""),
        doseG: Number(data.dose_g),
        brewWaterG: Number(data.brew_water_g),
        brewIceG: preparation.icePlan.brewIce.grams,
        servingIceG: preparation.icePlan.servingIce.grams,
        cupCapacityMl: Number(data.cup_capacity_ml),
        beverageStyle: String(data.beverage_style ?? ""),
        grinder: String(data.grinder ?? ""),
        grindSetting: String(data.grind_setting ?? ""),
        targetTempC: Number(data.target_temp_c),
        retentionFactor: Number(data.retention_factor),
        dropTempC: Number(data.drop_temp_c),
        minHeadspaceMl: Number(data.minimum_headspace_ml),
      },
      preparation,
      drinkGuide: readDrinkGuide(data, bean.story),
      rulesetVersion,
      controlConditions,
      ruleExceptions,
      ruleExtensionRequests,
      ruleEvaluation,
      validation: { valid: errors.length === 0, errors, warnings },
      sourcePath: path.relative(REPO_ROOT, file),
      summary: summaryFromMarkdown(parsed.content),
    };
    recipe.validation.errors.push(...validateRevisionShape(recipe), ...validateDrinkGuide(recipe), ...validateRoasterIdentity(recipe), ...validateFlashThermalBalance(recipe));
    recipe.validation.valid = recipe.validation.errors.length === 0;
    return recipe;
  });

  validateVersionGraph(recipes);

  recipes.sort((left, right) => {
    const statusOrder = { accepted: 0, candidate: 1, superseded: 2, rejected: 3 };
    const latestLeft = recipes.find((recipe) => recipe.lineage === left.lineage && recipe.isLatest) ?? left;
    const latestRight = recipes.find((recipe) => recipe.lineage === right.lineage && recipe.isLatest) ?? right;
    return statusOrder[latestLeft.status] - statusOrder[latestRight.status]
      || Number(latestRight.brewReady) - Number(latestLeft.brewReady)
      || latestRight.created.localeCompare(latestLeft.created)
      || left.lineage.localeCompare(right.lineage)
      || right.version - left.version;
  });

  return {
    generatedAt: new Date().toISOString(),
    schemaVersion: 1,
    recipes,
  };
}

function validateDrinkGuide(recipe: CatalogRecipe): string[] {
  const errors: string[] = [];
  const guide = recipe.drinkGuide;
  const story = guide.coffeeStory;
  const requiredStorySections = ["place", "region", "people", "variety", "altitude", "process", "roast"];
  if (!story.headline || !story.deck) errors.push("drink_guide.bean_story.missing: bean story의 headline과 deck이 필요합니다.");
  for (const sectionId of requiredStorySections) {
    const section = story.sections.find((item) => item.id === sectionId);
    if (!section?.title || !section.body || !section.eyebrow) errors.push(`drink_guide.bean_story.section_missing: ${sectionId} section이 필요합니다.`);
  }
  if (story.facts.length < 6 || story.facts.some((fact) => !fact.label || !fact.value)) errors.push("drink_guide.bean_story.facts: 확인 가능한 원두 fact가 6개 이상 필요합니다.");
  if (story.sources.length < 3 || story.sources.some((source) => !source.label || !source.scope)) errors.push("drink_guide.bean_story.sources: 범위를 표시한 출처가 3개 이상 필요합니다.");
  if (story.processJourney.length < 4 || story.processJourney.some((item) => !item.step || !item.title || !item.body || !item.scope)) errors.push("drink_guide.bean_story.process_journey: 범위를 표시한 가공 단계가 4개 이상 필요합니다.");
  if (story.tastingLexicon.length < 3 || story.tastingLexicon.some((item) => !item.term || !item.cue || !item.distinction)) errors.push("drink_guide.bean_story.tasting_lexicon: 감각어 해설이 3개 이상 필요합니다.");
  if (story.glossary.length < 4 || story.glossary.some((item) => !item.term || !item.definition)) errors.push("drink_guide.bean_story.glossary: 독자를 위한 용어 해설이 4개 이상 필요합니다.");
  if (!guide.title || !guide.deck || !guide.brewStory || !guide.servingRitual) errors.push("drink_guide.recipe_story.missing: title, deck, brew_story, serving_ritual이 필요합니다.");
  if (!Number.isInteger(guide.estimatedReadMinutes) || guide.estimatedReadMinutes < 1 || guide.estimatedReadMinutes > 15) errors.push("drink_guide.read_time.invalid: estimated_read_minutes는 1–15분 정수여야 합니다.");
  if (guide.brewChoices.length < 3 || guide.brewChoices.some((choice) => !choice.label || !choice.value || !choice.reason)) errors.push("drink_guide.brew_choices: 값과 이유가 있는 brew choice가 3개 이상 필요합니다.");
  if (guide.tasteJourney.length < 3 || guide.tasteJourney.some((item) => !item.moment || !item.cue)) errors.push("drink_guide.taste_journey: moment와 cue가 있는 tasting 단계가 3개 이상 필요합니다.");
  if (recipe.brewReady && guide.status !== "ready") errors.push("drink_guide.status: brew_ready recipe의 drink_guide.status는 ready여야 합니다.");
  if (!recipe.brewReady && guide.status !== "research_hold") errors.push("drink_guide.status: Research Hold recipe의 drink_guide.status는 research_hold여야 합니다.");
  return errors;
}

function validateFlashThermalBalance(recipe: CatalogRecipe): string[] {
  if (!recipe.brewReady || recipe.serveMode !== "iced" || recipe.brewMethod !== "flash") return [];
  const errors: string[] = [];
  const { retentionFactor, dropTempC, minHeadspaceMl } = recipe.brew;
  if (![retentionFactor, dropTempC, minHeadspaceMl].every(Number.isFinite) || retentionFactor <= 0 || dropTempC <= 0 || minHeadspaceMl < 0) {
    return ["thermal.input.invalid: flash recipe에는 유효한 retention_factor, drop_temp_c, minimum_headspace_ml이 필요합니다."];
  }
  const input = {
    selectedWaterG: recipe.brew.brewWaterG,
    doseG: recipe.brew.doseG,
    retentionFactor,
    brewIceG: recipe.brew.brewIceG,
    servingIceG: recipe.brew.servingIceG,
    dropTempC,
    cupCapacityMl: recipe.brew.cupCapacityMl,
  };
  const base = estimateFlashThermalBalance(input);
  const stress = estimateFlashThermalBalance({ ...input, dropTempC: dropTempC + 5 });
  if (recipe.controlConditions.ice_goal === "remain_while_drinking" && (base.remainingIceG < 10 || stress.remainingIceG < 10)) {
    errors.push(`thermal.ice_remaining: 0°C ice model에서 base/stress 잔존 얼음이 각각 ${base.remainingIceG.toFixed(1)}g/${stress.remainingIceG.toFixed(1)}g입니다. 두 조건 모두 10g 이상이어야 합니다.`);
  }
  if (base.estimatedHeadspaceMl < minHeadspaceMl || stress.estimatedHeadspaceMl < minHeadspaceMl) {
    errors.push(`thermal.headspace: 고체 얼음 부피를 포함한 base/stress headspace가 각각 ${base.estimatedHeadspaceMl.toFixed(1)}ml/${stress.estimatedHeadspaceMl.toFixed(1)}ml입니다. minimum_headspace_ml ${minHeadspaceMl}ml 이상이어야 합니다.`);
  }
  return errors;
}

function validateRoasterIdentity(recipe: CatalogRecipe): string[] {
  const errors: string[] = [];
  const code = recipe.bean.roasterCode;
  if (!/^[A-Z0-9]{2,8}$/.test(code)) errors.push("roaster.code.invalid: roaster_code는 2–8자의 대문자 영문·숫자여야 합니다. 미확인은 UNK를 사용하세요.");
  if (!recipe.bean.roaster.trim()) errors.push("roaster.name.missing: roaster가 필요합니다. 미확인은 미기록으로 표시하세요.");
  if (code && !recipe.lineage.startsWith(`${code.toLowerCase()}-`)) errors.push(`roaster.lineage.mismatch: lineage는 roaster code ${code.toLowerCase()}- 로 시작해야 합니다.`);
  if (code && !recipe.title.startsWith(`${code} · `)) errors.push(`roaster.title.mismatch: 레시피 제목은 ${code} · 로 시작해야 합니다.`);
  if (code && !recipe.profile.profile_name.startsWith(`${code} `)) errors.push(`roaster.profile_name.mismatch: profile_name은 ${code} 로 시작해야 합니다.`);
  return errors;
}

function validateRevisionShape(recipe: CatalogRecipe): string[] {
  const errors: string[] = [];
  if (!/^[a-z0-9][a-z0-9-]*$/.test(recipe.lineage)) errors.push("version.lineage.invalid: lineage는 lowercase ASCII slug여야 합니다.");
  if (!Number.isInteger(recipe.version) || recipe.version < 1) errors.push("version.number.invalid: version은 1 이상의 정수여야 합니다.");
  if (recipe.id !== `${recipe.lineage}-v${recipe.version}`) errors.push(`version.id.mismatch: 파일 id는 ${recipe.lineage}-v${recipe.version}이어야 합니다.`);
  if (!REVISION_KINDS.has(recipe.revision.kind)) errors.push("version.kind.invalid: revision.kind가 허용 목록에 없습니다.");
  if (!recipe.revision.summary) errors.push("version.summary.missing: revision.summary가 필요합니다.");
  if (!recipe.revision.rationale) errors.push("version.rationale.missing: revision.rationale이 필요합니다.");
  if (!recipe.revision.successCriteria.length) errors.push("version.success_criteria.missing: revision.success_criteria가 하나 이상 필요합니다.");
  if (recipe.version === 1) {
    if (recipe.revision.kind !== "baseline") errors.push("version.baseline.kind: v1의 revision.kind는 baseline이어야 합니다.");
    if (recipe.revision.parentId !== null) errors.push("version.baseline.parent: v1의 revision.parent는 null이어야 합니다.");
    if (recipe.revision.primaryVariable !== null) errors.push("version.baseline.primary: v1의 primary_variable은 null이어야 합니다.");
  } else {
    if (recipe.revision.kind === "baseline") errors.push("version.revision.kind: v2 이상은 baseline이 될 수 없습니다.");
    if (!recipe.revision.parentId) errors.push("version.parent.missing: v2 이상은 직전 parent가 필요합니다.");
    if (!recipe.revision.primaryVariable) errors.push("version.primary_variable.missing: v2 이상은 primary_variable이 필요합니다.");
    if (!recipe.revision.changes.length) errors.push("version.changes.missing: v2 이상은 changes가 하나 이상 필요합니다.");
  }
  return errors;
}

function versionIdentity(recipe: CatalogRecipe): string {
  return JSON.stringify([
    recipe.bean.id,
    recipe.serveMode,
    recipe.brewMethod,
    recipe.brew.beverageStyle,
    recipe.brew.cupId,
    recipe.brew.cupCapacityMl,
    recipe.controlConditions.basket ?? null,
    recipe.controlConditions.vessel ?? null,
    recipe.controlConditions.ice_goal ?? null,
  ]);
}

function fullContextIdentity(recipe: CatalogRecipe): string {
  const conditions = Object.fromEntries(Object.entries(recipe.controlConditions).sort(([left], [right]) => left.localeCompare(right)));
  return JSON.stringify([versionIdentity(recipe), conditions]);
}

function addVersionError(recipe: CatalogRecipe, message: string) {
  if (!recipe.validation.errors.includes(message)) recipe.validation.errors.push(message);
  recipe.validation.valid = false;
}

export function validateVersionGraph(recipes: CatalogRecipe[]) {
  const byLineage = new Map<string, CatalogRecipe[]>();
  for (const recipe of recipes) {
    const versions = byLineage.get(recipe.lineage) ?? [];
    versions.push(recipe);
    byLineage.set(recipe.lineage, versions);
  }

  for (const [lineage, versions] of byLineage) {
    versions.sort((left, right) => left.version - right.version);
    const baselineIdentity = versionIdentity(versions[0]);
    const seenVersions = new Set<number>();
    const accepted = versions.filter((recipe) => recipe.status === "accepted");
    if (accepted.length > 1) {
      accepted.forEach((recipe) => addVersionError(recipe, "version.accepted.multiple: 한 lineage에는 accepted version이 하나만 있을 수 있습니다."));
    }
    versions.forEach((recipe, index) => {
      recipe.versionCount = versions.length;
      recipe.isLatest = index === versions.length - 1;
      if (seenVersions.has(recipe.version)) addVersionError(recipe, `version.duplicate: ${lineage}의 v${recipe.version}이 중복됩니다.`);
      seenVersions.add(recipe.version);
      const expectedVersion = index + 1;
      if (recipe.version !== expectedVersion) addVersionError(recipe, `version.sequence.gap: ${lineage}는 v1부터 끊김 없이 증가해야 합니다.`);
      if (versionIdentity(recipe) !== baselineIdentity) {
        addVersionError(recipe, "version.identity.changed: 같은 lineage에서는 bean·serve mode·brew method·cup·basket·vessel·ice goal을 바꿀 수 없습니다. 새 lineage를 만드세요.");
      }
      if (recipe.version > 1) {
        const expectedParent = `${lineage}-v${recipe.version - 1}`;
        if (recipe.revision.parentId !== expectedParent) addVersionError(recipe, `version.parent.invalid: revision.parent는 ${expectedParent}이어야 합니다.`);
      }
    });
  }

  const contextOwners = new Map<string, string>();
  for (const recipe of recipes) {
    const signature = fullContextIdentity(recipe);
    const owner = contextOwners.get(signature);
    if (owner && owner !== recipe.lineage) {
      addVersionError(recipe, `version.lineage.duplicate_context: ${owner}와 모든 실행 조건이 같습니다. 새 recipe가 아니라 해당 lineage의 다음 version으로 기록하세요.`);
    } else {
      contextOwners.set(signature, recipe.lineage);
    }
  }
}
