import type { FellowProfilePayload } from "./aiden-profile.js";

const API_ROOT = "https://l8qtmnc692.execute-api.us-west-2.amazonaws.com/v1";
// Fellow's private Aiden API currently expects the mobile-client request shape.
// Keep this in our own client rather than depending on a third-party package.
const CLIENT_AGENT = "Fellow/5 CFNetwork/1568.300.101 Darwin/24.2.0";
const TASTABLE_KEYS: (keyof FellowProfilePayload)[] = [
  "title", "ratio", "bloomEnabled", "bloomRatio", "bloomDuration", "bloomTemperature",
  "ssPulsesEnabled", "ssPulsesNumber", "ssPulsesInterval", "ssPulseTemperatures",
  "batchPulsesEnabled", "batchPulsesNumber", "batchPulsesInterval", "batchPulseTemperatures",
];

type Credentials = { email: string; password: string };
type AuthResponse = { accessToken: string; refreshToken?: string };

export class FellowClient {
  private accessToken = "";
  private devicesCache: Record<string, unknown>[] | null = null;

  constructor(private readonly credentials: Credentials) {}

  async connect() {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(this.credentials),
    }, false);
    if (!response.accessToken) throw new Error("Fellow 로그인이 거절되었습니다.");
    this.accessToken = response.accessToken;
    return this.devices();
  }

  async devices() {
    if (!this.accessToken) throw new Error("Fellow 세션이 없습니다.");
    if (!this.devicesCache) {
      const devices = await this.request<unknown>("/devices?dataType=real");
      if (!Array.isArray(devices) || !devices.length) throw new Error("Fellow 계정에서 Aiden 기기를 찾지 못했습니다.");
      this.devicesCache = devices.filter((device): device is Record<string, unknown> => Boolean(device && typeof device === "object"));
    }
    return this.devicesCache;
  }

  async profiles(deviceId?: string) {
    const id = deviceId ?? String((await this.devices())[0]?.id ?? "");
    const profiles = await this.request<unknown>(`/devices/${encodeURIComponent(id)}/profiles`);
    if (!Array.isArray(profiles)) throw new Error("Fellow profile 응답 형식이 달라졌습니다.");
    return profiles.filter((profile): profile is Record<string, unknown> => Boolean(profile && typeof profile === "object"));
  }

  async saveProfile(payload: FellowProfilePayload, profileId?: string | null) {
    const deviceId = String((await this.devices())[0]?.id ?? "");
    if (profileId) {
      await this.request(`/devices/${encodeURIComponent(deviceId)}/profiles/${encodeURIComponent(profileId)}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    } else {
      await this.request(`/devices/${encodeURIComponent(deviceId)}/profiles`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    const saved = (await this.profiles(deviceId)).find((profile) => String(profile.id) === profileId || String(profile.title).trim() === payload.title.trim());
    if (!saved) throw new Error("Fellow가 저장 완료한 profile을 다시 찾지 못했습니다.");
    const differences = compareEcho(payload, saved);
    if (differences.length) throw new Error(`Fellow 저장값 검증 실패: ${differences.join(", ")}`);
    return saved;
  }

  async upsertByTitle(payload: FellowProfilePayload, aliases: string[] = []) {
    const allowedTitles = new Set([payload.title, ...aliases].map((title) => title.trim().toLowerCase()));
    const existing = (await this.profiles()).find((profile) => (
      /^p\d+$/.test(String(profile.id))
      && allowedTitles.has(String(profile.title).trim().toLowerCase())
    ));
    return this.saveProfile(payload, existing ? String(existing.id) : null);
  }

  async deleteProfile(profileId: string) {
    if (!/^p\d+$/.test(profileId)) throw new Error("사용자 profile만 삭제할 수 있습니다.");
    const deviceId = String((await this.devices())[0]?.id ?? "");
    await this.request(`/devices/${encodeURIComponent(deviceId)}/profiles/${encodeURIComponent(profileId)}`, { method: "DELETE" });
  }

  private async request<T = unknown>(pathname: string, init: RequestInit = {}, authenticated = true): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set("accept", "application/json");
    headers.set("content-type", "application/json");
    headers.set("user-agent", CLIENT_AGENT);
    if (authenticated) headers.set("authorization", `Bearer ${this.accessToken}`);
    const response = await fetch(`${API_ROOT}${pathname}`, { ...init, headers, signal: AbortSignal.timeout(12_000) });
    const text = await response.text();
    let body: unknown;
    try { body = text ? JSON.parse(text) : {}; } catch { body = { message: text }; }
    if (!response.ok) {
      const message = body && typeof body === "object" && "message" in body ? String((body as { message: unknown }).message) : `HTTP ${response.status}`;
      throw new Error(`Fellow API 요청 실패: ${message}`);
    }
    return body as T;
  }
}

function compareEcho(sent: FellowProfilePayload, received: Record<string, unknown>) {
  const issues: string[] = [];
  for (const key of TASTABLE_KEYS) {
    const expected = sent[key];
    const actual = received[key];
    if (Array.isArray(expected)) {
      if (!Array.isArray(actual) || actual.length !== expected.length || expected.some((value, index) => Math.abs(value - Number(actual[index])) > 0.3)) issues.push(String(key));
    } else if (typeof expected === "number") {
      if (Math.abs(expected - Number(actual)) > 0.3) issues.push(String(key));
    } else if (typeof expected === "string") {
      if (expected.trim() !== String(actual ?? "").trim()) issues.push(String(key));
    } else if (expected !== actual) {
      issues.push(String(key));
    }
  }
  return issues;
}
