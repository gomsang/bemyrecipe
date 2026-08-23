import type { AidenProfile } from "../../shared/aiden-profile";

export type RecipeStatus = "accepted" | "candidate" | "rejected" | "superseded";

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
  tastingNotes: string[];
};

export type BrewSettings = {
  doseG: number;
  brewWaterG: number;
  brewIceG: number;
  servingIceG: number;
  cupCapacityMl: number;
  beverageStyle: string;
  grinder: string;
  grindSetting: string;
  targetTempC: number;
};

export type PrepStep = {
  id: string;
  phase: "before_brew" | "after_brew" | "serve" | "hold";
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
    strategy: "none" | "brew_only" | "serving_only" | "split";
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
  created: string;
  acceptedAt: string | null;
  acceptanceNote: string | null;
  serveMode: "hot" | "iced" | "cold_brew";
  brewMethod: "standard" | "flash" | "cold_drip";
  bean: CatalogBean;
  profile: AidenProfile;
  brew: BrewSettings;
  preparation: PreparationPlan;
  validation: { valid: boolean; errors: string[] };
  sourcePath: string;
  summary: string;
};

export type Catalog = {
  generatedAt: string;
  schemaVersion: 1;
  recipes: CatalogRecipe[];
};
