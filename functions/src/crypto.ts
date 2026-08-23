import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";

export type EncryptedValue = { cipherText: string; iv: string; tag: string; version: 1 };

function encryptionKey(encoded: string) {
  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32) throw new Error("CREDENTIAL_ENCRYPTION_KEY는 base64 형식의 32-byte key여야 합니다.");
  return key;
}

export function encryptJson(value: unknown, encodedKey: string, ownerId: string): EncryptedValue {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(encodedKey), iv);
  cipher.setAAD(Buffer.from(ownerId));
  const cipherText = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return { cipherText: cipherText.toString("base64"), iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), version: 1 };
}

export function decryptJson<T>(value: EncryptedValue, encodedKey: string, ownerId: string): T {
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(encodedKey), Buffer.from(value.iv, "base64"));
  decipher.setAAD(Buffer.from(ownerId));
  decipher.setAuthTag(Buffer.from(value.tag, "base64"));
  const plain = Buffer.concat([decipher.update(Buffer.from(value.cipherText, "base64")), decipher.final()]);
  return JSON.parse(plain.toString("utf8")) as T;
}

export function tokenDigest(token: string, pepper: string) {
  return createHash("sha256").update(token).update(pepper).digest("hex");
}

export function digestMatches(left: string, right: string) {
  const leftBytes = Buffer.from(left, "hex");
  const rightBytes = Buffer.from(right, "hex");
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

export function createOpaqueToken() {
  const id = randomBytes(9).toString("base64url");
  const secret = randomBytes(32).toString("base64url");
  return { id, token: `bmr_live_${id}_${secret}`, prefix: `bmr_live_${id.slice(0, 6)}` };
}
