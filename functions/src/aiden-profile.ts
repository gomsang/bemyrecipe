export type AidenProfile = {
  profile_name: string;
  profile_temperature_c: number;
  nominal_ratio: number;
  cold_brew_enabled: boolean;
  bloom_enabled: boolean;
  bloom_ratio: number;
  bloom_seconds: number;
  bloom_temp_c: number;
  single_serve_pulses_enabled: boolean;
  pulse_count: number;
  pulse_interval_seconds: number;
  pulse_temps_c: number[];
  batch_pulses_enabled: boolean;
  batch_pulse_count: number;
  batch_pulse_interval_seconds: number;
  batch_pulse_temps_c: number[];
};

export type FellowProfilePayload = {
  profileType: number;
  title: string;
  ratio: number;
  bloomEnabled: boolean;
  bloomRatio: number;
  bloomDuration: number;
  bloomTemperature: number;
  ssPulsesEnabled: boolean;
  ssPulsesNumber: number;
  ssPulsesInterval: number;
  ssPulseTemperatures: number[];
  batchPulsesEnabled: boolean;
  batchPulsesNumber: number;
  batchPulsesInterval: number;
  batchPulseTemperatures: number[];
};

const isHalfStep = (value: number) => Number.isFinite(value) && Math.abs(value * 2 - Math.round(value * 2)) < 0.001;
const inHalfStepRange = (value: number, min: number, max: number) => value >= min && value <= max && isHalfStep(value);
const inIntegerRange = (value: number, min: number, max: number) => Number.isInteger(value) && value >= min && value <= max;

export function validateProfile(value: unknown): asserts value is AidenProfile {
  if (!value || typeof value !== "object") throw new Error("Aiden profile이 필요합니다.");
  const profile = value as Record<string, unknown>;
  const title = String(profile.profile_name ?? "");
  if (!/^[A-Za-z0-9 !@#$%&*+?\/.,:)(-]{1,50}$/.test(title)) throw new Error("Profile name 형식이 올바르지 않습니다.");
  if (!inHalfStepRange(Number(profile.profile_temperature_c), 50, 99)) throw new Error("Temperature는 50–99°C, 0.5°C 단위여야 합니다.");
  if (!inHalfStepRange(Number(profile.nominal_ratio), 14, 20)) throw new Error("Ratio는 14–20, 0.5 단위여야 합니다.");
  if (!inHalfStepRange(Number(profile.bloom_ratio), 1, 3)) throw new Error("Bloom ratio는 1–3, 0.5 단위여야 합니다.");
  if (!inIntegerRange(Number(profile.bloom_seconds), 1, 120)) throw new Error("Bloom time은 1–120초여야 합니다.");
  if (!inHalfStepRange(Number(profile.bloom_temp_c), 50, 99)) throw new Error("Bloom temperature 범위가 올바르지 않습니다.");
  validatePulse("Single Serve", profile.pulse_count, profile.pulse_interval_seconds, profile.pulse_temps_c);
  validatePulse("Batch", profile.batch_pulse_count, profile.batch_pulse_interval_seconds, profile.batch_pulse_temps_c);
}

function validatePulse(label: string, countValue: unknown, intervalValue: unknown, temperaturesValue: unknown) {
  const count = Number(countValue);
  const interval = Number(intervalValue);
  if (!inIntegerRange(count, 1, 10)) throw new Error(`${label} pulse count는 1–10이어야 합니다.`);
  if (!inIntegerRange(interval, 1, 60)) throw new Error(`${label} interval은 1–60초여야 합니다.`);
  if (!Array.isArray(temperaturesValue) || temperaturesValue.length !== count) throw new Error(`${label} 온도 개수가 pulse count와 다릅니다.`);
  if (temperaturesValue.some((temperature) => !inHalfStepRange(Number(temperature), 50, 99))) throw new Error(`${label} 온도 범위가 올바르지 않습니다.`);
}

export function toFellowPayload(profile: AidenProfile): FellowProfilePayload {
  validateProfile(profile);
  if (profile.cold_brew_enabled) throw new Error("Cold Brew profile은 비공식 API 매핑 확인 전까지 자동 저장하지 않습니다.");
  return {
    profileType: 0,
    title: profile.profile_name,
    ratio: profile.nominal_ratio,
    bloomEnabled: profile.bloom_enabled,
    bloomRatio: profile.bloom_ratio,
    bloomDuration: profile.bloom_seconds,
    bloomTemperature: profile.bloom_temp_c,
    ssPulsesEnabled: profile.single_serve_pulses_enabled,
    ssPulsesNumber: profile.pulse_count,
    ssPulsesInterval: profile.pulse_interval_seconds,
    ssPulseTemperatures: profile.pulse_temps_c,
    batchPulsesEnabled: profile.batch_pulses_enabled,
    batchPulsesNumber: profile.batch_pulse_count,
    batchPulsesInterval: profile.batch_pulse_interval_seconds,
    batchPulseTemperatures: profile.batch_pulse_temps_c,
  };
}

export function fromFellowProfile(profile: Record<string, unknown>): AidenProfile & { id: string } {
  const singleTemps = Array.isArray(profile.ssPulseTemperatures) ? profile.ssPulseTemperatures.map(Number) : [Number(profile.bloomTemperature ?? 93)];
  const batchTemps = Array.isArray(profile.batchPulseTemperatures) ? profile.batchPulseTemperatures.map(Number) : [singleTemps[0] ?? 93];
  return {
    id: String(profile.id ?? ""),
    profile_name: String(profile.title ?? "Untitled"),
    profile_temperature_c: Number(singleTemps[0] ?? profile.bloomTemperature ?? 93),
    nominal_ratio: Number(profile.ratio ?? 16),
    cold_brew_enabled: Number(profile.profileType ?? 0) !== 0,
    bloom_enabled: Boolean(profile.bloomEnabled),
    bloom_ratio: Number(profile.bloomRatio ?? 2),
    bloom_seconds: Number(profile.bloomDuration ?? 30),
    bloom_temp_c: Number(profile.bloomTemperature ?? 93),
    single_serve_pulses_enabled: Boolean(profile.ssPulsesEnabled),
    pulse_count: Number(profile.ssPulsesNumber ?? singleTemps.length),
    pulse_interval_seconds: Number(profile.ssPulsesInterval ?? 23),
    pulse_temps_c: singleTemps,
    batch_pulses_enabled: Boolean(profile.batchPulsesEnabled),
    batch_pulse_count: Number(profile.batchPulsesNumber ?? batchTemps.length),
    batch_pulse_interval_seconds: Number(profile.batchPulsesInterval ?? 30),
    batch_pulse_temps_c: batchTemps,
  };
}
