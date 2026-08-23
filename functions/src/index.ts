import { createHash, randomBytes } from "node:crypto";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import type { AidenProfile } from "./aiden-profile.js";
import { fromFellowProfile, toFellowPayload, validateProfile } from "./aiden-profile.js";
import { createOpaqueToken, decryptJson, digestMatches, encryptJson, tokenDigest, type EncryptedValue } from "./crypto.js";
import { FellowClient } from "./fellow-client.js";

initializeApp();
const db = getFirestore();
const REGION = "asia-northeast3";
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
      return { connected: true, devices: devices.length };
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

export const syncCatalog = onRequest(
  { region: REGION, secrets: [credentialKey, tokenPepper], timeoutSeconds: 120, memory: "512MiB", cors: false },
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
        const documentId = `${publicOwnerKey(principal.uid)}__${localId}`;
        incomingIds.add(documentId);
        validated.push({ documentId, recipe, profile: recipe.profile });
      }
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
              const saved = await client.upsertByTitle(toFellowPayload(item.profile));
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
