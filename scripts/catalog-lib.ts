import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { AidenProfile } from "../shared/aiden-profile";
import { validateAidenProfile } from "../shared/aiden-profile";
import {
  evaluateRecipeRules,
  type RuleException,
  type RuleExtensionRequest,
} from "../shared/recipe-rules";
import type { Catalog, CatalogBean, CatalogRecipe, PreparationPlan, RecipeStatus } from "../src/lib/types";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

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
    tastingNotes: Array.isArray(bean.tasting_notes) ? bean.tasting_notes.map(String) : [],
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
    return {
      id,
      title: titleFromMarkdown(parsed.content, id),
      status: String(data.status) as RecipeStatus,
      brewReady: Boolean(data.brew_ready),
      lineage: String(data.lineage ?? ""),
      version: Number(data.version ?? 1),
      created: asDate(data.created),
      acceptedAt: data.accepted_at ? asDate(data.accepted_at) : null,
      acceptanceNote: data.acceptance_note ? String(data.acceptance_note) : null,
      serveMode: String(data.serve_mode) as CatalogRecipe["serveMode"],
      brewMethod: String(data.brew_method) as CatalogRecipe["brewMethod"],
      bean: readBean(file, data.bean),
      profile,
      brew: {
        doseG: Number(data.dose_g),
        brewWaterG: Number(data.brew_water_g),
        brewIceG: preparation.icePlan.brewIce.grams,
        servingIceG: preparation.icePlan.servingIce.grams,
        cupCapacityMl: Number(data.cup_capacity_ml),
        beverageStyle: String(data.beverage_style ?? ""),
        grinder: String(data.grinder ?? ""),
        grindSetting: String(data.grind_setting ?? ""),
        targetTempC: Number(data.target_temp_c),
      },
      preparation,
      rulesetVersion,
      controlConditions,
      ruleExceptions,
      ruleExtensionRequests,
      ruleEvaluation,
      validation: { valid: errors.length === 0, errors, warnings },
      sourcePath: path.relative(REPO_ROOT, file),
      summary: summaryFromMarkdown(parsed.content),
    };
  });

  recipes.sort((left, right) => {
    const statusOrder = { accepted: 0, candidate: 1, superseded: 2, rejected: 3 };
    return statusOrder[left.status] - statusOrder[right.status]
      || Number(right.brewReady) - Number(left.brewReady)
      || right.created.localeCompare(left.created);
  });

  return {
    generatedAt: new Date().toISOString(),
    schemaVersion: 1,
    recipes,
  };
}
