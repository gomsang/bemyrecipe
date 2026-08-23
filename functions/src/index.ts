import { createHash, randomBytes } from "node:crypto";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import type { AidenProfile } from "./aiden-profile.js";
import { fromFellowProfile, profileNameForRecipe, profileTitleAliasesForRecipe, toFellowPayload, validateProfile } from "./aiden-profile.js";
import { validateAidenWaterSelection } from "./aiden-water.js";
import { createOpaqueToken, decryptJson, digestMatches, encryptJson, tokenDigest, type EncryptedValue } from "./crypto.js";
import { FellowClient } from "./fellow-client.js";

initializeApp();
const db = getFirestore();
const REGION = "asia-northeast3";
const SUPPORTED_RECIPE_RULESET_VERSION = 5;
const credentialKey = defineSecret("CREDENTIAL_ENCRYPTION_KEY");
const tokenPepper = defineSecret("TOKEN_PEPPER");

type Credentials = { email: string; password: string };
type IntegrationDocument = { credentials: EncryptedValue; maskedEmail: string; updatedAt?: Timestamp };

function userId(request: { auth?: { uid: string; token?: Record<string, unknown> } | null }) {
  if (!request.auth?.uid) throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
  if (request.auth.token?.email_verified !== true) throw new HttpsError("permission-denied", "이메일 인증이 필요합니다.");
  return request.auth.uid;
}

function integrationRef(uid: string) {
  return db.doc(`users/${uid}/private/aiden`);
}

function publicOwnerKey(uid: string) {
  return createHash("sha256").update(`bemyrecipe:${uid}`).digest("hex").slice(0, 24);
}

function recipeSyncRef(uid: string, localId: string) {
  return db.doc(`users/${uid}/recipeSync/${localId}`);
}

function maskEmail(email: string) {
  const [local = "", domain = ""] = email.split("@");
  return `${local.slice(0, 2)}${"•".repeat(Math.max(2, local.length - 2))}@${domain}`;
}

async function credentialsFor(uid: string): Promise<Credentials | null> {
  const snapshot = await integrationRef(uid).get();
  if (!snapshot.exists) return null;
  const data = snapshot.data() as IntegrationDocument;
  return decryptJson<Credentials>(data.credentials, credentialKey.value(), uid);
}

function safeMessage(reason: unknown) {
  const message = reason instanceof Error ? reason.message : "요청을 처리할 수 없습니다.";
  return message.replace(/[\w.+-]+@[\w.-]+/g, "[email]").slice(0, 500);
}

function timestampText(value: unknown) {
  if (value instanceof Timestamp) return value.toDate().toISOString().slice(0, 10);
  return value ? String(value) : null;
}

export const saveAidenCredentials = onCall(
  { region: REGION, secrets: [credentialKey], timeoutSeconds: 30 },
  async (request) => {
    const uid = userId(request);
    const input = request.data as Partial<Credentials>;
    const email = String(input.email ?? "").trim().toLowerCase();
    const password = String(input.password ?? "");
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6 || password.length > 256) {
      throw new HttpsError("invalid-argument", "Fellow 이메일 또는 비밀번호 형식이 올바르지 않습니다.");
    }
    try {
      const client = new FellowClient({ email, password });
      const devices = await client.connect();
      await integrationRef(uid).set({
        credentials: encryptJson({ email, password }, credentialKey.value(), uid),
        maskedEmail: maskEmail(email),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return {
        connected: true,
        aiden: {
          configured: true,
          maskedEmail: maskEmail(email),
          devices: devices.map((device) => ({
            id: String(device.id ?? ""),
            name: String(device.displayName ?? "Aiden"),
            firmware: device.firmwareVersion ? String(device.firmwareVersion) : undefined,
          })),
          connectionError: null,
        },
      };
    } catch (reason) {
      throw new HttpsError("failed-precondition", safeMessage(reason));
    }
  },
);

export const getDashboard = onCall(
  { region: REGION, secrets: [credentialKey], timeoutSeconds: 30 },
  async (request) => {
    const uid = userId(request);
    const [integration, tokenSnapshot, recipeSnapshot] = await Promise.all([
      integrationRef(uid).get(),
      db.collection("apiTokens").where("ownerId", "==", uid).get(),
      db.collection("recipes").where("ownerKey", "==", publicOwnerKey(uid)).get(),
    ]);
    const integrationData = integration.exists ? integration.data() as IntegrationDocument : null;
    const aiden = {
      configured: Boolean(integrationData),
      maskedEmail: integrationData?.maskedEmail ?? null,
      devices: [] as { id: string; name: string; firmware?: string; profileCount?: number }[],
      connectionError: null as string | null,
    };
    let profiles: ReturnType<typeof fromFellowProfile>[] = [];
    if (integrationData) {
      try {
        const credentials = decryptJson<Credentials>(integrationData.credentials, credentialKey.value(), uid);
        const client = new FellowClient(credentials);
        const devices = await client.connect();
        const remoteProfiles = await client.profiles();
        aiden.devices = devices.map((device) => ({
          id: String(device.id ?? ""),
          name: String(device.displayName ?? "Aiden"),
          firmware: device.firmwareVersion ? String(device.firmwareVersion) : undefined,
          profileCount: remoteProfiles.filter((profile) => /^p\d+$/.test(String(profile.id))).length,
        }));
        profiles = remoteProfiles.filter((profile) => /^p\d+$/.test(String(profile.id))).map(fromFellowProfile);
      } catch (reason) {
        aiden.connectionError = safeMessage(reason);
      }
    }
    return {
      aiden,
      profiles,
      tokens: tokenSnapshot.docs
        .filter((document) => document.data().active !== false)
        .map((document) => {
          const data = document.data();
          return {
            id: document.id,
            label: String(data.label ?? "Local client"),
            prefix: String(data.prefix ?? "bmr_live"),
            createdAt: timestampText(data.createdAt),
            lastUsedAt: timestampText(data.lastUsedAt),
          };
        })
        .sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt))),
      recipes: recipeSnapshot.docs.map((document) => document.data()),
    };
  },
);

export const createApiToken = onCall(
  { region: REGION, secrets: [tokenPepper] },
  async (request) => {
    const uid = userId(request);
    const label = String((request.data as { label?: unknown })?.label ?? "").trim();
    if (!label || label.length > 40) throw new HttpsError("invalid-argument", "토큰 이름은 1–40자여야 합니다.");
    const active = await db.collection("apiTokens").where("ownerId", "==", uid).where("active", "==", true).get();
    if (active.size >= 10) throw new HttpsError("resource-exhausted", "활성 토큰은 계정당 최대 10개입니다.");
    const generated = createOpaqueToken();
    await db.doc(`apiTokens/${generated.id}`).set({
      ownerId: uid,
      label,
      prefix: generated.prefix,
      digest: tokenDigest(generated.token, tokenPepper.value()),
      active: true,
      createdAt: FieldValue.serverTimestamp(),
      lastUsedAt: null,
    });
    return { token: generated.token };
  },
);

export const revokeApiToken = onCall({ region: REGION }, async (request) => {
  const uid = userId(request);
  const tokenId = String((request.data as { tokenId?: unknown })?.tokenId ?? "");
  const reference = db.doc(`apiTokens/${tokenId}`);
  const snapshot = await reference.get();
  if (!snapshot.exists || snapshot.data()?.ownerId !== uid) throw new HttpsError("not-found", "토큰을 찾을 수 없습니다.");
  await reference.update({ active: false, revokedAt: FieldValue.serverTimestamp() });
  return { revoked: true };
});

export const saveAidenProfile = onCall(
  { region: REGION, secrets: [credentialKey], timeoutSeconds: 30 },
  async (request) => {
    const uid = userId(request);
    const input = request.data as { profile?: unknown; profileId?: unknown };
    try {
      validateProfile(input.profile);
      const credentials = await credentialsFor(uid);
      if (!credentials) throw new Error("먼저 Fellow 계정을 연결하세요.");
      const client = new FellowClient(credentials);
      await client.connect();
      const profileId = input.profileId ? String(input.profileId) : null;
      if (profileId && !/^p\d+$/.test(profileId)) throw new Error("사용자 profile만 수정할 수 있습니다.");
      const saved = await client.saveProfile(toFellowPayload(input.profile), profileId);
      return { profile: fromFellowProfile(saved) };
    } catch (reason) {
      throw new HttpsError("failed-precondition", safeMessage(reason));
    }
  },
);

export const saveRecipeToAiden = onCall(
  { region: REGION, secrets: [credentialKey], timeoutSeconds: 30 },
  async (request) => {
    const uid = userId(request);
    const recipeId = String((request.data as { recipeId?: unknown })?.recipeId ?? "");
    if (!/^[A-Za-z0-9_-]{1,180}$/.test(recipeId)) {
      throw new HttpsError("invalid-argument", "Recipe ID 형식이 올바르지 않습니다.");
    }
    try {
      const ownerKey = publicOwnerKey(uid);
      let snapshot = await db.doc(`recipes/${recipeId}`).get();
      if (!snapshot.exists) {
        snapshot = await db.doc(`recipes/${ownerKey}__${recipeId}`).get();
      }
      if (!snapshot.exists) throw new Error("저장할 레시피를 찾지 못했습니다.");

      const recipe = snapshot.data() as Record<string, unknown>;
      const status = recipe.status;
      if (status !== "candidate" && status !== "accepted") throw new Error("Candidate 또는 Accepted 레시피만 저장할 수 있습니다.");
      if (recipe.brewReady !== true) throw new Error("Brew ready 검증을 마친 레시피만 Aiden에 저장할 수 있습니다.");
      if ((recipe.validation as { valid?: unknown } | undefined)?.valid !== true) throw new Error("입력값 검증을 통과한 레시피만 Aiden에 저장할 수 있습니다.");
      const ruleEvaluation = recipe.ruleEvaluation as { rulesetVersion?: unknown; status?: unknown; errors?: unknown } | undefined;
      if (Number(ruleEvaluation?.rulesetVersion) !== SUPPORTED_RECIPE_RULESET_VERSION) throw new Error("현재 ruleset으로 다시 동기화한 뒤 저장하세요.");
      if (ruleEvaluation?.status === "blocked" || !Array.isArray(ruleEvaluation?.errors) || ruleEvaluation.errors.length > 0) {
        throw new Error("Recipe hard rule validation을 통과하지 못했습니다.");
      }
      validateCatalogAidenWater(recipe);

      const sourceProfile = recipe.profile as AidenProfile;
      const profile = { ...sourceProfile, profile_name: profileNameForRecipe(sourceProfile.profile_name, status) };
      validateProfile(profile);
      const credentials = await credentialsFor(uid);
      if (!credentials) throw new Error("먼저 Fellow 계정을 연결하세요.");
      const client = new FellowClient(credentials);
      await client.connect();
      const saved = await client.upsertByTitle(
        toFellowPayload(profile),
        profileTitleAliasesForRecipe(sourceProfile.profile_name, status),
      );
      const localId = String(recipe.localId ?? recipe.id ?? recipeId);
      const profileId = String(saved.id ?? "");
      await recipeSyncRef(uid, localId).set({
        status: "manual_synced",
        sourceStatus: status,
        profileId,
        profileName: profile.profile_name,
        syncedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      return { profile: fromFellowProfile(saved), profileName: profile.profile_name, recipeStatus: status };
    } catch (reason) {
      throw new HttpsError("failed-precondition", safeMessage(reason));
    }
  },
);

export const deleteAidenProfile = onCall(
  { region: REGION, secrets: [credentialKey], timeoutSeconds: 30 },
  async (request) => {
    const uid = userId(request);
    const profileId = String((request.data as { profileId?: unknown })?.profileId ?? "");
    try {
      const credentials = await credentialsFor(uid);
      if (!credentials) throw new Error("먼저 Fellow 계정을 연결하세요.");
      const client = new FellowClient(credentials);
      await client.connect();
      await client.deleteProfile(profileId);
      return { deleted: true };
    } catch (reason) {
      throw new HttpsError("failed-precondition", safeMessage(reason));
    }
  },
);

async function authenticateToken(authorization: string | undefined) {
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1] ?? "";
  const match = token.match(/^bmr_live_([A-Za-z0-9_-]{12})_[A-Za-z0-9_-]{40,}$/);
  if (!match?.[1]) return null;
  const reference = db.doc(`apiTokens/${match[1]}`);
  const snapshot = await reference.get();
  const data = snapshot.data();
  if (!snapshot.exists || !data || data.active !== true) return null;
  const calculated = tokenDigest(token, tokenPepper.value());
  if (!digestMatches(calculated, String(data.digest))) return null;
  await reference.update({ lastUsedAt: FieldValue.serverTimestamp() });
  return { uid: String(data.ownerId), tokenId: snapshot.id };
}

function catalogRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function validateCatalogAidenWater(recipe: Record<string, unknown>) {
  const localId = String(recipe.id ?? "unknown");
  const brew = catalogRecord(recipe.brew);
  const conditions = catalogRecord(recipe.controlConditions);
  if (!brew || !conditions) throw new Error(`Aiden water selector 통제조건이 없습니다: ${localId}`);
  validateAidenWaterSelection({
    selectedWaterMl: Number(brew.brewWaterG),
    quantityMode: String(conditions.aiden_quantity_mode ?? ""),
    basket: String(conditions.basket ?? ""),
  });
}

function validateCatalogDrinkGuide(recipe: Record<string, unknown>) {
  const localId = String(recipe.id ?? "unknown");
  const guide = catalogRecord(recipe.drinkGuide);
  const story = catalogRecord(guide?.coffeeStory);
  const bean = catalogRecord(recipe.bean);
  if (!guide || !story) throw new Error(`Drink Guide가 없습니다: ${localId}`);
  if (!bean) throw new Error(`원두 정보가 없습니다: ${localId}`);
  const roasterCode = String(bean.roasterCode ?? "").trim().toUpperCase();
  if (!/^[A-Z0-9]{2,8}$/.test(roasterCode) || !String(bean.roaster ?? "").trim()) throw new Error(`Roaster 식별자가 올바르지 않습니다: ${localId}`);
  if (!String(recipe.lineage ?? "").startsWith(`${roasterCode.toLowerCase()}-`)) throw new Error(`Lineage에 roaster code가 없습니다: ${localId}`);
  if (!String(recipe.title ?? "").startsWith(`${roasterCode} · `)) throw new Error(`Recipe title에 roaster code가 없습니다: ${localId}`);
  const profile = catalogRecord(recipe.profile);
  if (!String(profile?.profile_name ?? "").startsWith(`${roasterCode} `)) throw new Error(`Aiden profile name에 roaster code가 없습니다: ${localId}`);
  for (const field of ["title", "deck", "brewStory", "servingRitual"] as const) {
    if (!String(guide[field] ?? "").trim()) throw new Error(`Drink Guide ${field}가 없습니다: ${localId}`);
  }
  const expectedStatus = recipe.brewReady === true ? "ready" : "research_hold";
  if (guide.status !== expectedStatus) throw new Error(`Drink Guide status가 brewReady와 일치하지 않습니다: ${localId}`);
  const readMinutes = Number(guide.estimatedReadMinutes);
  if (!Number.isInteger(readMinutes) || readMinutes < 1 || readMinutes > 15) throw new Error(`Drink Guide 읽기 시간이 올바르지 않습니다: ${localId}`);
  const choices = Array.isArray(guide.brewChoices) ? guide.brewChoices : [];
  const journey = Array.isArray(guide.tasteJourney) ? guide.tasteJourney : [];
  if (choices.length < 3 || journey.length < 3) throw new Error(`Drink Guide의 추출 선택과 맛의 흐름이 부족합니다: ${localId}`);
  if (!String(story.headline ?? "").trim() || !String(story.deck ?? "").trim()) throw new Error(`원두 Story의 headline/deck이 없습니다: ${localId}`);
  const sections = Array.isArray(story.sections) ? story.sections.map(catalogRecord).filter((item): item is Record<string, unknown> => item !== null) : [];
  const sectionIds = new Set(sections.filter((section) => String(section.title ?? "").trim() && String(section.body ?? "").trim()).map((section) => String(section.id ?? "")));
  for (const sectionId of ["place", "region", "people", "variety", "altitude", "process", "roast"]) {
    if (!sectionIds.has(sectionId)) throw new Error(`원두 Story ${sectionId} section이 없습니다: ${localId}`);
  }
  if (!Array.isArray(story.facts) || story.facts.length < 6 || !Array.isArray(story.sources) || story.sources.length < 3) {
    throw new Error(`원두 Story의 fact/source가 부족합니다: ${localId}`);
  }
  if (!Array.isArray(story.processJourney) || story.processJourney.length < 4
    || !Array.isArray(story.tastingLexicon) || story.tastingLexicon.length < 3
    || !Array.isArray(story.glossary) || story.glossary.length < 4) {
    throw new Error(`원두 Story의 가공 과정·감각어·용어 해설이 부족합니다: ${localId}`);
  }
  validateCatalogFlashThermal(recipe);
}

function validateCatalogFlashThermal(recipe: Record<string, unknown>) {
  if (recipe.brewReady !== true || recipe.serveMode !== "iced" || recipe.brewMethod !== "flash") return;
  const localId = String(recipe.id ?? "unknown");
  const brew = catalogRecord(recipe.brew);
  const conditions = catalogRecord(recipe.controlConditions);
  if (!brew) throw new Error(`Flash 열수지 입력이 없습니다: ${localId}`);
  const selectedWaterG = Number(brew.brewWaterG);
  const doseG = Number(brew.doseG);
  const retentionFactor = Number(brew.retentionFactor);
  const brewIceG = Number(brew.brewIceG);
  const servingIceG = Number(brew.servingIceG);
  const totalIceG = brewIceG + servingIceG;
  const dropTempC = Number(brew.dropTempC);
  const cupCapacityMl = Number(brew.cupCapacityMl);
  const minHeadspaceMl = Number(brew.minHeadspaceMl);
  const minServingIceG = Number(brew.minServingIceG ?? 0);
  if (![selectedWaterG, doseG, retentionFactor, totalIceG, dropTempC, cupCapacityMl, minHeadspaceMl].every(Number.isFinite)
    || selectedWaterG <= 0 || doseG <= 0 || retentionFactor <= 0 || totalIceG < 0 || dropTempC <= 0 || cupCapacityMl <= 0 || minHeadspaceMl < 0) {
    throw new Error(`Flash 열수지 입력이 올바르지 않습니다: ${localId}`);
  }
  const evaluate = (temperatureC: number) => {
    const hotBeverageG = Math.max(0, selectedWaterG - doseG * retentionFactor);
    const initialHeatJ = hotBeverageG * 4.186 * temperatureC;
    const meltedBrewIceG = Math.min(brewIceG, initialHeatJ / 333.55);
    const transferLiquidG = hotBeverageG + meltedBrewIceG;
    const heatAfterBrewIceJ = Math.max(0, initialHeatJ - meltedBrewIceG * 333.55);
    const transferTempC = brewIceG - meltedBrewIceG > 0 || transferLiquidG <= 0
      ? 0
      : heatAfterBrewIceJ / (4.186 * transferLiquidG);
    const servingMeltCapacityG = transferLiquidG * 4.186 * transferTempC / 333.55;
    const meltedServingIceG = Math.min(servingIceG, servingMeltCapacityG);
    const servingIceRemainingG = Math.max(0, servingIceG - meltedServingIceG);
    const occupiedVolumeMl = transferLiquidG + meltedServingIceG + servingIceRemainingG / 0.917;
    return { servingIceRemainingG, headspaceMl: cupCapacityMl - occupiedVolumeMl };
  };
  const base = evaluate(dropTempC);
  const stress = evaluate(dropTempC + 5);
  if (conditions?.ice_goal === "remain_while_drinking" && (base.servingIceRemainingG < 10 || stress.servingIceRemainingG < 10)) {
    throw new Error(`Flash serving ice 잔존량이 보수 기준을 통과하지 못했습니다: ${localId}`);
  }
  if (Number(recipe.rulesetVersion) >= 5 && (!Number.isFinite(minServingIceG) || minServingIceG <= 0 || servingIceG < minServingIceG)) {
    throw new Error(`Flash serving ice 최소 투입량을 통과하지 못했습니다: ${localId}`);
  }
  if (base.headspaceMl < minHeadspaceMl || stress.headspaceMl < minHeadspaceMl) {
    throw new Error(`Flash headspace가 minimum_headspace_ml을 통과하지 못했습니다: ${localId}`);
  }
}

function validateCatalogVersionGraph(recipes: Record<string, unknown>[]) {
  const byLineage = new Map<string, Record<string, unknown>[]>();
  for (const recipe of recipes) {
    const lineage = String(recipe.lineage ?? "");
    const version = Number(recipe.version);
    const localId = String(recipe.id ?? "");
    const revision = recipe.revision as Record<string, unknown> | undefined;
    if (!/^[a-z0-9][a-z0-9-]*$/.test(lineage) || !Number.isInteger(version) || version < 1) throw new Error(`Recipe version 정보가 올바르지 않습니다: ${localId}`);
    if (localId !== `${lineage}-v${version}`) throw new Error(`Recipe id와 lineage/version이 일치하지 않습니다: ${localId}`);
    if (!revision || !String(revision.kind ?? "") || !String(revision.summary ?? "") || !String(revision.rationale ?? "")) throw new Error(`Recipe revision 정보가 부족합니다: ${localId}`);
    const versions = byLineage.get(lineage) ?? [];
    versions.push(recipe);
    byLineage.set(lineage, versions);
  }
  for (const [lineage, versions] of byLineage) {
    versions.sort((left, right) => Number(left.version) - Number(right.version));
    versions.forEach((recipe, index) => {
      const version = Number(recipe.version);
      const revision = recipe.revision as Record<string, unknown>;
      if (version !== index + 1) throw new Error(`${lineage} version이 v1부터 연속되지 않습니다.`);
      if (Number(recipe.versionCount) !== versions.length || Boolean(recipe.isLatest) !== (index === versions.length - 1)) throw new Error(`${lineage}의 latest/versionCount projection이 올바르지 않습니다.`);
      if (version === 1) {
        if (revision.kind !== "baseline" || revision.parent !== undefined && revision.parent !== null || revision.parentId !== null) throw new Error(`${lineage} v1 baseline 정보가 올바르지 않습니다.`);
      } else {
        const expectedParent = `${lineage}-v${version - 1}`;
        if (revision.parentId !== expectedParent) throw new Error(`${lineage} v${version} parent는 ${expectedParent}이어야 합니다.`);
      }
    });
  }
}

export const syncCatalog = onRequest(
  {
    region: REGION,
    secrets: [credentialKey, tokenPepper],
    timeoutSeconds: 120,
    memory: "512MiB",
    cors: false,
    // Codex and local clients reach this endpoint without Google IAM credentials.
    // Application-level writes still require a revocable bmr_live token below.
    invoker: "public",
  },
  async (request, response) => {
    response.set("access-control-allow-origin", "*");
    response.set("access-control-allow-headers", "authorization, content-type");
    response.set("access-control-allow-methods", "POST, OPTIONS");
    if (request.method === "OPTIONS") { response.status(204).send(""); return; }
    if (request.method !== "POST") { response.status(405).json({ error: "method_not_allowed" }); return; }
    const principal = await authenticateToken(request.headers.authorization);
    if (!principal) { response.status(401).json({ error: "invalid_token" }); return; }
    const catalog = request.body as { schemaVersion?: unknown; recipes?: unknown };
    if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.recipes) || catalog.recipes.length > 200) {
      response.status(400).json({ error: "invalid_catalog" }); return;
    }
    const incomingIds = new Set<string>();
    const validated: { documentId: string; recipe: Record<string, unknown>; profile: AidenProfile }[] = [];
    try {
      for (const raw of catalog.recipes) {
        if (!raw || typeof raw !== "object") throw new Error("Recipe object가 아닙니다.");
        const recipe = raw as Record<string, unknown>;
        const localId = String(recipe.id ?? "");
        if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(localId)) throw new Error(`Recipe id가 올바르지 않습니다: ${localId}`);
        validateProfile(recipe.profile);
        const ruleEvaluation = recipe.ruleEvaluation as { rulesetVersion?: unknown; status?: unknown; errors?: unknown } | undefined;
        if (Number(ruleEvaluation?.rulesetVersion) !== SUPPORTED_RECIPE_RULESET_VERSION) {
          throw new Error(`지원하지 않는 recipe ruleset입니다: ${String(ruleEvaluation?.rulesetVersion ?? "missing")}`);
        }
        if (ruleEvaluation?.status === "blocked" || !Array.isArray(ruleEvaluation?.errors) || ruleEvaluation.errors.length > 0) {
          throw new Error(`Recipe hard rule validation을 통과하지 못했습니다: ${localId}`);
        }
        validateCatalogAidenWater(recipe);
        validateCatalogDrinkGuide(recipe);
        const documentId = `${publicOwnerKey(principal.uid)}__${localId}`;
        incomingIds.add(documentId);
        validated.push({ documentId, recipe, profile: recipe.profile });
      }
      validateCatalogVersionGraph(validated.map((item) => item.recipe));
    } catch (reason) {
      response.status(400).json({ error: "validation_failed", message: safeMessage(reason) }); return;
    }

    const existing = await db.collection("recipes").where("ownerKey", "==", publicOwnerKey(principal.uid)).get();
    const batch = db.batch();
    for (const document of existing.docs) if (!incomingIds.has(document.id)) batch.delete(document.ref);
    for (const item of validated) {
      batch.set(db.doc(`recipes/${item.documentId}`), {
        ...item.recipe,
        id: item.documentId,
        localId: String(item.recipe.id),
        ownerKey: publicOwnerKey(principal.uid),
        syncedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }
    await batch.commit();

    const aidenResults: { recipeId: string; status: string; profileId?: string; message?: string }[] = [];
    const accepted = validated.filter(({ recipe }) => recipe.status === "accepted" && recipe.brewReady === true && (recipe.validation as { valid?: boolean } | undefined)?.valid === true);
    if (accepted.length) {
      const credentials = await credentialsFor(principal.uid);
      if (!credentials) {
        accepted.forEach(({ documentId }) => aidenResults.push({ recipeId: documentId, status: "skipped", message: "aiden_not_connected" }));
      } else {
        const client = new FellowClient(credentials);
        try {
          await client.connect();
          for (const item of accepted) {
            try {
              const acceptedProfile = {
                ...item.profile,
                profile_name: profileNameForRecipe(item.profile.profile_name, "accepted"),
              };
              const saved = await client.upsertByTitle(
                toFellowPayload(acceptedProfile),
                profileTitleAliasesForRecipe(item.profile.profile_name, "accepted"),
              );
              const profileId = String(saved.id ?? "");
              await recipeSyncRef(principal.uid, String(item.recipe.id)).set({ status: "synced", profileId, syncedAt: FieldValue.serverTimestamp() }, { merge: true });
              aidenResults.push({ recipeId: item.documentId, status: "synced", profileId });
            } catch (reason) {
              const message = safeMessage(reason);
              await recipeSyncRef(principal.uid, String(item.recipe.id)).set({ status: "error", message, syncedAt: FieldValue.serverTimestamp() }, { merge: true });
              aidenResults.push({ recipeId: item.documentId, status: "error", message });
            }
          }
        } catch (reason) {
          const message = safeMessage(reason);
          accepted.forEach(({ documentId }) => aidenResults.push({ recipeId: documentId, status: "error", message }));
        }
      }
    }
    response.status(200).json({ synced: validated.length, removed: existing.docs.filter((document) => !incomingIds.has(document.id)).length, aiden: aidenResults, requestId: randomBytes(6).toString("hex") });
  },
);
