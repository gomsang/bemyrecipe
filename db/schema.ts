import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const beans = sqliteTable('beans', {
  id: text('id').primaryKey(), name: text('name').notNull(), origin: text('origin').notNull(),
  region: text('region'), farm: text('farm'), altitude: text('altitude'), variety: text('variety'),
  process: text('process').notNull(), roastLevel: text('roast_level').notNull(), roastDate: text('roast_date'),
  tastingNotes: text('tasting_notes').notNull(), createdAt: text('created_at').notNull(),
});

export const cups = sqliteTable('cups', {
  id: text('id').primaryKey(), name: text('name').notNull(), capacityMl: integer('capacity_ml').notNull(),
  kind: text('kind').notNull(), notes: text('notes'), createdAt: text('created_at').notNull(),
});

export const recipes = sqliteTable('recipes', {
  id: text('id').primaryKey(), parentId: text('parent_id'), beanId: text('bean_id').notNull(),
  cupId: text('cup_id').notNull(), name: text('name').notNull(), version: integer('version').notNull(),
  beverageStyle: text('beverage_style').notNull(), doseG: real('dose_g').notNull(),
  brewWaterG: real('brew_water_g').notNull(), brewIceG: real('brew_ice_g').notNull(),
  servingIceG: real('serving_ice_g').notNull(), nominalRatio: real('nominal_ratio').notNull(),
  grinder: text('grinder').notNull(), grindSetting: text('grind_setting').notNull(),
  bloomRatio: real('bloom_ratio').notNull(), bloomSeconds: integer('bloom_seconds').notNull(),
  bloomTempC: real('bloom_temp_c').notNull(), pulseCount: integer('pulse_count').notNull(),
  pulseIntervalSeconds: integer('pulse_interval_seconds').notNull(), pulseTempsC: text('pulse_temps_c').notNull(),
  waterProfile: text('water_profile'), retentionFactor: real('retention_factor').notNull(),
  dropTempC: real('drop_temp_c').notNull(), goal: text('goal').notNull(), status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [
  index('idx_recipes_bean_created').on(table.beanId, table.createdAt),
  index('idx_recipes_parent').on(table.parentId),
]);

export const tastings = sqliteTable('tastings', {
  id: text('id').primaryKey(), recipeId: text('recipe_id').notNull(), brewedAt: text('brewed_at').notNull(),
  acidity: integer('acidity').notNull(), sweetness: integer('sweetness').notNull(),
  bitterness: integer('bitterness').notNull(), astringency: integer('astringency').notNull(),
  body: integer('body').notNull(), aroma: integer('aroma').notNull(), overall: integer('overall').notNull(),
  finish: text('finish'), drawdown: text('drawdown').notNull(), iceRemaining: integer('ice_remaining').notNull(),
  finalBeverageG: real('final_beverage_g'), notes: text('notes'),
}, (table) => [index('idx_tastings_recipe_brewed').on(table.recipeId, table.brewedAt)]);
