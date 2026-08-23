export const AIDEN_PROFILE_OPTIONS = {
  ratios: Array.from({ length: 13 }, (_, index) => 14 + index * 0.5),
  bloomRatios: Array.from({ length: 5 }, (_, index) => 1 + index * 0.5),
  temperaturesC: Array.from({ length: 99 }, (_, index) => 50 + index * 0.5),
  bloomSeconds: Array.from({ length: 120 }, (_, index) => index + 1),
  pulseCounts: Array.from({ length: 10 }, (_, index) => index + 1),
  pulseIntervalSeconds: Array.from({ length: 60 }, (_, index) => index + 1),
} as const;

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

const PROFILE_NAME_PATTERN = /^[A-Za-z0-9 !@#$%&*+?\/.,:)(-]+$/;

function includesNumber(options: readonly number[], value: number) {
  return options.includes(value);
}

export function validateAidenProfile(profile: AidenProfile): string[] {
  const errors: string[] = [];
  if (!profile.profile_name || profile.profile_name.length > 50 || !PROFILE_NAME_PATTERN.test(profile.profile_name)) {
    errors.push("profile_name은 1–50자의 영문·숫자·허용 문장부호만 사용할 수 있습니다.");
  }
  if (!includesNumber(AIDEN_PROFILE_OPTIONS.temperaturesC, profile.profile_temperature_c)) {
    errors.push("profile_temperature_c는 50–99°C 범위의 0.5°C 단위여야 합니다.");
  }
  if (!includesNumber(AIDEN_PROFILE_OPTIONS.ratios, profile.nominal_ratio)) {
    errors.push("nominal_ratio는 14–20 범위의 0.5 단위여야 합니다.");
  }
  if (!includesNumber(AIDEN_PROFILE_OPTIONS.bloomRatios, profile.bloom_ratio)) {
    errors.push("bloom_ratio는 1–3 범위의 0.5 단위여야 합니다.");
  }
  if (!includesNumber(AIDEN_PROFILE_OPTIONS.bloomSeconds, profile.bloom_seconds)) {
    errors.push("bloom_seconds는 1–120초 정수여야 합니다.");
  }
  if (!includesNumber(AIDEN_PROFILE_OPTIONS.temperaturesC, profile.bloom_temp_c)) {
    errors.push("bloom_temp_c는 50–99°C 범위의 0.5°C 단위여야 합니다.");
  }
  validatePulseGroup("single serve", profile.pulse_count, profile.pulse_interval_seconds, profile.pulse_temps_c, errors);
  validatePulseGroup("batch", profile.batch_pulse_count, profile.batch_pulse_interval_seconds, profile.batch_pulse_temps_c, errors);
  return errors;
}

function validatePulseGroup(
  label: string,
  count: number,
  interval: number,
  temperatures: number[],
  errors: string[],
) {
  if (!includesNumber(AIDEN_PROFILE_OPTIONS.pulseCounts, count)) {
    errors.push(`${label} pulse count는 1–10이어야 합니다.`);
  }
  if (!includesNumber(AIDEN_PROFILE_OPTIONS.pulseIntervalSeconds, interval)) {
    errors.push(`${label} pulse interval은 1–60초 정수여야 합니다.`);
  }
  if (temperatures.length !== count) {
    errors.push(`${label} pulse 온도 개수는 pulse count와 같아야 합니다.`);
  }
  if (temperatures.some((temperature) => !includesNumber(AIDEN_PROFILE_OPTIONS.temperaturesC, temperature))) {
    errors.push(`${label} pulse 온도는 모두 50–99°C 범위의 0.5°C 단위여야 합니다.`);
  }
}

export function toFellowPayload(profile: AidenProfile): FellowProfilePayload {
  if (profile.cold_brew_enabled) {
    throw new Error("Cold Brew의 비공식 API profileType/duration 매핑은 현재 검증되지 않아 자동 전송하지 않습니다.");
  }
  const errors = validateAidenProfile(profile);
  if (errors.length) throw new Error(errors.join(" "));
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
