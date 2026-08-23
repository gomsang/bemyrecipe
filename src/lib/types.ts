import type { AidenProfile } from "../../shared/aiden-profile";
import type {
  BrewMethod,
  IceStrategy,
  PrepPhase,
  RuleEvaluation,
  RuleException,
  RuleExtensionRequest,
  ServeMode,
} from "../../shared/recipe-rules";

export type RecipeStatus = "accepted" | "candidate" | "rejected" | "superseded";
export type RevisionKind = "baseline" | "gate_completion" | "sensory_adjustment" | "execution_adjustment" | "correction" | "equipment_adaptation";

export type RecipeRevision = {
  kind: RevisionKind;
  parentId: string | null;
  primaryVariable: string | null;
  summary: string;
  rationale: string;
  changes: string[];
  successCriteria: string[];
};

export type CatalogBean = {
  id: string;
  name: string;
  origin: string;
  region: string;
  producer: string;
  altitude: string;
  variety: string;
  process: string;
  roastLevel: string;
  roastDate: string;
  roaster: string;
  roasterCode: string;
  tastingNotes: string[];
  story: BeanStory;
};

export type StoryEvidence = "exact_lot" | "station_context" | "regional_context" | "variety_context" | "brew_context";

export type StorySection = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  evidence: StoryEvidence;
};

export type StoryFact = {
  label: string;
  value: string;
  note: string;
};

export type StorySource = {
  label: string;
  url: string | null;
  scope: string;
  note: string;
};

export type BeanStory = {
  headline: string;
  deck: string;
  sections: StorySection[];
  facts: StoryFact[];
  unknowns: string[];
  sources: StorySource[];
  processJourney: Array<{ step: string; title: string; body: string; scope: string }>;
  tastingLexicon: Array<{ term: string; cue: string; distinction: string }>;
  glossary: Array<{ term: string; definition: string }>;
};

export type DrinkGuide = {
  status: "ready" | "research_hold";
  title: string;
  deck: string;
  estimatedReadMinutes: number;
  brewStory: string;
  servingRitual: string;
  brewChoices: Array<{ label: string; value: string; reason: string }>;
  tasteJourney: Array<{ moment: string; cue: string }>;
  coffeeStory: BeanStory;
};

export type BrewSettings = {
  cupId: string;
  doseG: number;
  brewWaterG: number;
  brewIceG: number;
  servingIceG: number;
  cupCapacityMl: number;
  beverageStyle: string;
  grinder: string;
  grindSetting: string;
  targetTempC: number;
  retentionFactor: number;
  dropTempC: number;
  minHeadspaceMl: number;
  minServingIceG: number;
  flashThermal: {
    base: FlashThermalProjection;
    stress: FlashThermalProjection;
  } | null;
};

export type FlashThermalProjection = {
  transferLiquidTempC: number;
  brewIceRemainingInCarafeG: number;
  servingIceRemainingG: number;
  estimatedHeadspaceMl: number;
};

export type PrepStep = {
  id: string;
  phase: PrepPhase;
  label: string;
  instruction: string;
  critical: boolean;
};

export type IceItem = {
  grams: number;
  vessel: string;
  timing: "before_brew" | "before_transfer";
  purpose: "flash_chill" | "keep_cold";
};

export type PreparationPlan = {
  filterRinse: {
    enabled: boolean;
    water: "hot" | "none";
    discardRinseWater: boolean;
  };
  icePlan: {
    strategy: IceStrategy;
    brewIce: IceItem;
    servingIce: IceItem;
  };
  steps: PrepStep[];
};

export type CatalogRecipe = {
  id: string;
  title: string;
  status: RecipeStatus;
  brewReady: boolean;
  lineage: string;
  version: number;
  isLatest: boolean;
  versionCount: number;
  revision: RecipeRevision;
  created: string;
  acceptedAt: string | null;
  acceptanceNote: string | null;
  serveMode: ServeMode;
  brewMethod: BrewMethod;
  bean: CatalogBean;
  profile: AidenProfile;
  brew: BrewSettings;
  preparation: PreparationPlan;
  drinkGuide: DrinkGuide;
  rulesetVersion: number | null;
  controlConditions: Record<string, unknown>;
  ruleExceptions: RuleException[];
  ruleExtensionRequests: RuleExtensionRequest[];
  ruleEvaluation: RuleEvaluation;
  validation: { valid: boolean; errors: string[]; warnings: string[] };
  sourcePath: string;
  summary: string;
};

export type Catalog = {
  generatedAt: string;
  schemaVersion: 1;
  recipes: CatalogRecipe[];
};
