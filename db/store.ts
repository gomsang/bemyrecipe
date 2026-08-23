import { env } from 'cloudflare:workers';
import type { AppData, Bean, Cup, Recipe, Tasting } from '@/lib/brew';

function d1() {
  if (!env.DB) throw new Error('D1 binding `DB` is unavailable.');
  return env.DB;
}

export async function ensureDatabase() {
  const db = d1();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS beans (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, origin TEXT NOT NULL, region TEXT, farm TEXT, altitude TEXT,
      variety TEXT, process TEXT NOT NULL, roast_level TEXT NOT NULL, roast_date TEXT,
      tasting_notes TEXT NOT NULL, created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS cups (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, capacity_ml INTEGER NOT NULL, kind TEXT NOT NULL,
      notes TEXT, created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY, parent_id TEXT, bean_id TEXT NOT NULL, cup_id TEXT NOT NULL, name TEXT NOT NULL,
      version INTEGER NOT NULL, beverage_style TEXT NOT NULL, dose_g REAL NOT NULL, brew_water_g REAL NOT NULL,
      brew_ice_g REAL NOT NULL, serving_ice_g REAL NOT NULL, nominal_ratio REAL NOT NULL,
      grinder TEXT NOT NULL, grind_setting TEXT NOT NULL, bloom_ratio REAL NOT NULL, bloom_seconds INTEGER NOT NULL,
      bloom_temp_c REAL NOT NULL, pulse_count INTEGER NOT NULL, pulse_interval_seconds INTEGER NOT NULL,
      pulse_temps_c TEXT NOT NULL, water_profile TEXT, retention_factor REAL NOT NULL, drop_temp_c REAL NOT NULL,
      goal TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS tastings (
      id TEXT PRIMARY KEY, recipe_id TEXT NOT NULL, brewed_at TEXT NOT NULL, acidity INTEGER NOT NULL,
      sweetness INTEGER NOT NULL, bitterness INTEGER NOT NULL, astringency INTEGER NOT NULL,
      body INTEGER NOT NULL, aroma INTEGER NOT NULL, overall INTEGER NOT NULL, finish TEXT,
      drawdown TEXT NOT NULL, ice_remaining INTEGER NOT NULL, final_beverage_g REAL, notes TEXT
    )`),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_recipes_bean_created ON recipes(bean_id, created_at)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_recipes_parent ON recipes(parent_id)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_tastings_recipe_brewed ON tastings(recipe_id, brewed_at)'),
  ]);

  const existing = await db.prepare('SELECT COUNT(*) AS count FROM recipes').first<{ count: number }>();
  if ((existing?.count ?? 0) > 0) return;

  const now = new Date().toISOString();
  await db.batch([
    db.prepare(`INSERT INTO beans (id, name, origin, region, farm, altitude, variety, process, roast_level, roast_date, tasting_notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
        'bean-harfusa', 'Ethiopia Yirgacheffe Harfusa Washed G1', 'Ethiopia', 'SNNPR · Gedeo · Yirgacheffe',
        'Harfusa Kebele', '1,800–2,100m', 'Heirloom', 'Washed', 'Medium보다 아주 조금 Light', null,
        JSON.stringify(['베르가못', '백도', '오렌지필']), now,
      ),
    db.prepare('INSERT INTO cups (id, name, capacity_ml, kind, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind('cup-315', '315ml 유리잔', 315, 'glass', '주력 아이스 컵', now),
    db.prepare('INSERT INTO cups (id, name, capacity_ml, kind, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind('cup-420', '420ml 유리잔', 420, 'glass', '여유 있는 아이스 컵', now),
    db.prepare('INSERT INTO cups (id, name, capacity_ml, kind, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind('cup-500', '500ml 텀블러', 500, 'tumbler', '이동용', now),
    db.prepare(`INSERT INTO recipes (
      id, parent_id, bean_id, cup_id, name, version, beverage_style, dose_g, brew_water_g, brew_ice_g,
      serving_ice_g, nominal_ratio, grinder, grind_setting, bloom_ratio, bloom_seconds, bloom_temp_c,
      pulse_count, pulse_interval_seconds, pulse_temps_c, water_profile, retention_factor, drop_temp_c,
      goal, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
      'recipe-harfusa-v1', null, 'bean-harfusa', 'cup-315', '하르푸사, 차갑고 선명하게', 1, 'flash',
      20, 225, 90, 20, 14, 'Fellow Ode Gen 2 · Stock Burr', '4⅓', 3, 50, 96, 3, 20,
      JSON.stringify([96, 95, 94]), '정수/필터수 — 실제 물 정보 기록 권장', 2, 65,
      '베르가못과 백도의 향을 살리고, 315ml 잔에서 얼음이 남는 깨끗한 아이스 커피', 'baseline', now,
    ),
  ]);
  await db.prepare('PRAGMA optimize').run();
}

const parse = <T>(value: string | null, fallback: T): T => {
  try { return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
};

function beanFrom(row: Record<string, unknown>): Bean {
  return { id: String(row.id), name: String(row.name), origin: String(row.origin), region: row.region as string | null,
    farm: row.farm as string | null, altitude: row.altitude as string | null, variety: row.variety as string | null,
    process: String(row.process), roastLevel: String(row.roast_level), roastDate: row.roast_date as string | null,
    tastingNotes: parse(String(row.tasting_notes), []) };
}
function cupFrom(row: Record<string, unknown>): Cup {
  return { id: String(row.id), name: String(row.name), capacityMl: Number(row.capacity_ml), kind: String(row.kind), notes: row.notes as string | null };
}
function recipeFrom(row: Record<string, unknown>): Recipe {
  return { id: String(row.id), parentId: row.parent_id as string | null, beanId: String(row.bean_id), cupId: String(row.cup_id),
    name: String(row.name), version: Number(row.version), beverageStyle: row.beverage_style as Recipe['beverageStyle'],
    doseG: Number(row.dose_g), brewWaterG: Number(row.brew_water_g), brewIceG: Number(row.brew_ice_g),
    servingIceG: Number(row.serving_ice_g), nominalRatio: Number(row.nominal_ratio), grinder: String(row.grinder),
    grindSetting: String(row.grind_setting), bloomRatio: Number(row.bloom_ratio), bloomSeconds: Number(row.bloom_seconds),
    bloomTempC: Number(row.bloom_temp_c), pulseCount: Number(row.pulse_count), pulseIntervalSeconds: Number(row.pulse_interval_seconds),
    pulseTempsC: parse(String(row.pulse_temps_c), []), waterProfile: row.water_profile as string | null,
    retentionFactor: Number(row.retention_factor), dropTempC: Number(row.drop_temp_c), goal: String(row.goal),
    status: String(row.status), createdAt: String(row.created_at) };
}
function tastingFrom(row: Record<string, unknown>): Tasting {
  return { id: String(row.id), recipeId: String(row.recipe_id), brewedAt: String(row.brewed_at), acidity: Number(row.acidity),
    sweetness: Number(row.sweetness), bitterness: Number(row.bitterness), astringency: Number(row.astringency),
    body: Number(row.body), aroma: Number(row.aroma), overall: Number(row.overall), finish: row.finish as string | null,
    drawdown: row.drawdown as Tasting['drawdown'], iceRemaining: Boolean(row.ice_remaining),
    finalBeverageG: row.final_beverage_g === null ? null : Number(row.final_beverage_g), notes: row.notes as string | null };
}

export async function getAppData(): Promise<AppData> {
  await ensureDatabase();
  const db = d1();
  const [beansResult, cupsResult, recipesResult, tastingsResult] = await Promise.all([
    db.prepare('SELECT * FROM beans ORDER BY created_at DESC').all(), db.prepare('SELECT * FROM cups ORDER BY capacity_ml').all(),
    db.prepare('SELECT * FROM recipes ORDER BY created_at DESC').all(), db.prepare('SELECT * FROM tastings ORDER BY brewed_at DESC').all(),
  ]);
  return { beans: beansResult.results.map(beanFrom), cups: cupsResult.results.map(cupFrom), recipes: recipesResult.results.map(recipeFrom), tastings: tastingsResult.results.map(tastingFrom) };
}

export async function insertRecipe(input: Recipe) {
  await ensureDatabase();
  const recipe = { ...input, id: input.id || crypto.randomUUID(), createdAt: new Date().toISOString() };
  await d1().prepare(`INSERT INTO recipes (
    id, parent_id, bean_id, cup_id, name, version, beverage_style, dose_g, brew_water_g, brew_ice_g,
    serving_ice_g, nominal_ratio, grinder, grind_setting, bloom_ratio, bloom_seconds, bloom_temp_c,
    pulse_count, pulse_interval_seconds, pulse_temps_c, water_profile, retention_factor, drop_temp_c, goal, status, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
    recipe.id, recipe.parentId ?? null, recipe.beanId, recipe.cupId, recipe.name, recipe.version, recipe.beverageStyle,
    recipe.doseG, recipe.brewWaterG, recipe.brewIceG, recipe.servingIceG, recipe.nominalRatio, recipe.grinder,
    recipe.grindSetting, recipe.bloomRatio, recipe.bloomSeconds, recipe.bloomTempC, recipe.pulseCount,
    recipe.pulseIntervalSeconds, JSON.stringify(recipe.pulseTempsC), recipe.waterProfile ?? null,
    recipe.retentionFactor, recipe.dropTempC, recipe.goal, recipe.status, recipe.createdAt,
  ).run();
  return recipe;
}

export async function insertTasting(input: Tasting) {
  await ensureDatabase();
  const tasting = { ...input, id: input.id || crypto.randomUUID(), brewedAt: input.brewedAt || new Date().toISOString() };
  await d1().prepare(`INSERT INTO tastings (
    id, recipe_id, brewed_at, acidity, sweetness, bitterness, astringency, body, aroma, overall,
    finish, drawdown, ice_remaining, final_beverage_g, notes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
    tasting.id, tasting.recipeId, tasting.brewedAt, tasting.acidity, tasting.sweetness, tasting.bitterness,
    tasting.astringency, tasting.body, tasting.aroma, tasting.overall, tasting.finish ?? null,
    tasting.drawdown, tasting.iceRemaining ? 1 : 0, tasting.finalBeverageG ?? null, tasting.notes ?? null,
  ).run();
  return tasting;
}

export async function insertBean(input: Bean) {
  await ensureDatabase();
  const bean = { ...input, id: input.id || crypto.randomUUID() };
  await d1().prepare(`INSERT INTO beans (
    id, name, origin, region, farm, altitude, variety, process, roast_level, roast_date, tasting_notes, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
    bean.id, bean.name, bean.origin, bean.region ?? null, bean.farm ?? null, bean.altitude ?? null,
    bean.variety ?? null, bean.process, bean.roastLevel, bean.roastDate ?? null,
    JSON.stringify(bean.tastingNotes), new Date().toISOString(),
  ).run();
  return bean;
}
