import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { AidenProfile } from "../shared/aiden-profile";
import { validateAidenProfile } from "../shared/aiden-profile";
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

function validatePreparation(data: Record<string, unknown>, plan: PreparationPlan) {
  const errors: string[] = [];
  const serveMode = String(data.serve_mode);
  const brewMethod = String(data.brew_method);
  if (!["hot", "iced", "cold_brew"].includes(serveMode)) errors.push("serve_mode는 hot, iced, cold_brew 중 하나여야 합니다.");
  if (!["standard", "flash", "cold_drip"].includes(brewMethod)) errors.push("brew_method는 standard, flash, cold_drip 중 하나여야 합니다.");
  if (!["hot", "none"].includes(plan.filterRinse.water)) errors.push("filter_rinse.water는 hot 또는 none이어야 합니다.");
  if (!["none", "brew_only", "serving_only", "split"].includes(plan.icePlan.strategy)) errors.push("ice_plan.strategy 값이 올바르지 않습니다.");
  if (plan.filterRinse.enabled && (plan.filterRinse.water !== "hot" || !plan.filterRinse.discardRinseWater)) {
    errors.push("필터를 린싱하면 hot water를 사용하고 rinse water 폐기를 명시해야 합니다.");
  }
  if (!plan.filterRinse.enabled && (plan.filterRinse.water !== "none" || plan.filterRinse.discardRinseWater)) {
    errors.push("필터를 린싱하지 않으면 water는 none, discard_rinse_water는 false여야 합니다.");
  }
  const { brewIce, servingIce, strategy } = plan.icePlan;
  if (!Number.isFinite(brewIce.grams) || !Number.isFinite(servingIce.grams) || brewIce.grams < 0 || servingIce.grams < 0) {
    errors.push("Ice grams는 0 이상의 유한한 수여야 합니다.");
  }
  if (brewIce.timing !== "before_brew" || brewIce.purpose !== "flash_chill") {
    errors.push("Brew ice는 timing: before_brew, purpose: flash_chill이어야 합니다.");
  }
  if (servingIce.timing !== "before_transfer" || servingIce.purpose !== "keep_cold") {
    errors.push("Serving ice는 timing: before_transfer, purpose: keep_cold이어야 합니다.");
  }
  if (!brewIce.vessel.trim() || !servingIce.vessel.trim()) errors.push("각 ice 항목에는 vessel을 명시해야 합니다.");
  if (strategy === "none" && (brewIce.grams !== 0 || servingIce.grams !== 0)) errors.push("Ice strategy none이면 두 ice grams는 0이어야 합니다.");
  if (strategy === "brew_only" && !(brewIce.grams > 0 && servingIce.grams === 0)) errors.push("brew_only는 Brew ice만 0g보다 커야 합니다.");
  if (strategy === "serving_only" && !(brewIce.grams === 0 && servingIce.grams > 0)) errors.push("serving_only는 Serving ice만 0g보다 커야 합니다.");
  if (strategy === "split" && !(brewIce.grams > 0 && servingIce.grams > 0)) errors.push("split은 Brew ice와 Serving ice가 모두 0g보다 커야 합니다.");
  if (serveMode === "iced") {
    if (strategy === "none") errors.push("ICED recipe에는 ice strategy가 필요합니다.");
  }
  if (serveMode === "hot" && (strategy !== "none" || brewIce.grams !== 0 || servingIce.grams !== 0)) {
    errors.push("HOT recipe는 ice strategy none, 두 ice grams 0이어야 합니다.");
  }
  if (serveMode === "cold_brew" && brewMethod !== "cold_drip") errors.push("COLD BREW recipe의 brew_method는 cold_drip이어야 합니다.");
  if (serveMode !== "cold_brew" && brewMethod === "cold_drip") errors.push("cold_drip은 serve_mode: cold_brew에서만 사용할 수 있습니다.");

  const allowedPhases = new Set(["before_brew", "after_brew", "serve", "hold"]);
  const seenStepIds = new Set<string>();
  for (const step of plan.steps) {
    if (!/^[a-z0-9][a-z0-9_]{1,49}$/.test(step.id)) errors.push(`prep_steps id가 올바르지 않습니다: ${step.id || "(empty)"}`);
    if (seenStepIds.has(step.id)) errors.push(`prep_steps id가 중복됩니다: ${step.id}`);
    seenStepIds.add(step.id);
    if (!allowedPhases.has(step.phase)) errors.push(`prep_steps phase가 올바르지 않습니다: ${step.phase}`);
    if (!step.label.trim() || !step.instruction.trim()) errors.push(`prep_steps ${step.id || "항목"}의 label과 instruction이 필요합니다.`);
  }
  if (Boolean(data.brew_ready)) {
    if (!plan.steps.length) errors.push("brew_ready recipe에는 prep_steps가 필요합니다.");
    if (plan.filterRinse.enabled && !seenStepIds.has("rinse_filter")) errors.push("린싱하는 brew-ready recipe에는 rinse_filter step이 필요합니다.");
    if (brewIce.grams > 0 && !seenStepIds.has("add_brew_ice")) errors.push("Brew ice가 있으면 add_brew_ice step이 필요합니다.");
    if (servingIce.grams > 0 && !seenStepIds.has("add_serving_ice")) errors.push("Serving ice가 있으면 add_serving_ice step이 필요합니다.");
    if (plan.steps.some((step) => step.phase === "hold")) errors.push("brew_ready recipe에는 hold step을 둘 수 없습니다.");
  }
  return errors;
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
    const errors = [...validateAidenProfile(profile), ...validatePreparation(data, preparation)];
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
      validation: { valid: errors.length === 0, errors },
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
