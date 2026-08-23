import * as Switch from "@radix-ui/react-switch";
import { Plus, Trash2 } from "lucide-react";
import type { AidenProfile } from "../../shared/aiden-profile";
import { AIDEN_PROFILE_OPTIONS, validateAidenProfile } from "../../shared/aiden-profile";

type ProfileEditorProps = {
  value: AidenProfile;
  onChange: (profile: AidenProfile) => void;
  onSave: () => void;
  saving?: boolean;
};

function Select({ value, options, onChange, suffix = "" }: { value: number; options: readonly number[]; onChange: (value: number) => void; suffix?: string }) {
  return (
    <select value={value} onChange={(event) => onChange(Number(event.target.value))}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}{suffix}
        </option>
      ))}
    </select>
  );
}

function Toggle({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <Switch.Root className="switch-root" checked={checked} onCheckedChange={onCheckedChange}>
      <Switch.Thumb className="switch-thumb" />
    </Switch.Root>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="setting-row">
      <span>{label}</span>
      <div className="setting-control">{children}</div>
    </div>
  );
}

export function ProfileEditor({ value, onChange, onSave, saving }: ProfileEditorProps) {
  const errors = validateAidenProfile(value);
  const syncBlocked = value.cold_brew_enabled;
  const update = <K extends keyof AidenProfile>(key: K, next: AidenProfile[K]) => onChange({ ...value, [key]: next });

  function updatePulseCount(kind: "single" | "batch", count: number) {
    const key = kind === "single" ? "pulse_temps_c" : "batch_pulse_temps_c";
    const countKey = kind === "single" ? "pulse_count" : "batch_pulse_count";
    const current = value[key];
    const fallback = current.at(-1) ?? value.profile_temperature_c;
    update(countKey, count);
    update(key, Array.from({ length: count }, (_, index) => current[index] ?? fallback));
  }

  function updatePulseTemperature(kind: "single" | "batch", index: number, temperature: number) {
    const key = kind === "single" ? "pulse_temps_c" : "batch_pulse_temps_c";
    const temperatures = [...value[key]];
    temperatures[index] = temperature;
    update(key, temperatures);
  }

  return (
    <div className="profile-editor">
      <section className="settings-section">
        <div className="section-heading">
          <div><span className="section-number">01</span><h3>기본 설정</h3></div>
          <p>Fellow 앱에서 선택 가능한 값만 표시합니다.</p>
        </div>
        <SettingRow label="Profile name">
          <input value={value.profile_name} maxLength={50} onChange={(event) => update("profile_name", event.target.value)} />
        </SettingRow>
        <SettingRow label="Temperature">
          <Select value={value.profile_temperature_c} options={AIDEN_PROFILE_OPTIONS.temperaturesC} onChange={(next) => update("profile_temperature_c", next)} suffix=" °C" />
        </SettingRow>
        <SettingRow label="Coffee-to-Water Ratio">
          <Select value={value.nominal_ratio} options={AIDEN_PROFILE_OPTIONS.ratios} onChange={(next) => update("nominal_ratio", next)} suffix="" />
          <span className="ratio-prefix">1 :</span>
        </SettingRow>
        <SettingRow label="Cold Brew">
          <Toggle checked={value.cold_brew_enabled} onCheckedChange={(next) => update("cold_brew_enabled", next)} />
        </SettingRow>
      </section>

      <section className="settings-section">
        <div className="section-heading">
          <div><span className="section-number">02</span><h3>Bloom</h3></div>
          <Toggle checked={value.bloom_enabled} onCheckedChange={(next) => update("bloom_enabled", next)} />
        </div>
        <SettingRow label="Bloom Ratio">
          <Select value={value.bloom_ratio} options={AIDEN_PROFILE_OPTIONS.bloomRatios} onChange={(next) => update("bloom_ratio", next)} />
          <span className="ratio-prefix">1 :</span>
        </SettingRow>
        <SettingRow label="Bloom Time">
          <Select value={value.bloom_seconds} options={AIDEN_PROFILE_OPTIONS.bloomSeconds} onChange={(next) => update("bloom_seconds", next)} suffix="s" />
        </SettingRow>
        <SettingRow label="Bloom Temperature">
          <Select value={value.bloom_temp_c} options={AIDEN_PROFILE_OPTIONS.temperaturesC} onChange={(next) => update("bloom_temp_c", next)} suffix=" °C" />
        </SettingRow>
      </section>

      <PulseSection
        number="03"
        title="Single Serve Pulses"
        enabled={value.single_serve_pulses_enabled}
        onEnabled={(next) => update("single_serve_pulses_enabled", next)}
        count={value.pulse_count}
        interval={value.pulse_interval_seconds}
        temperatures={value.pulse_temps_c}
        onCount={(next) => updatePulseCount("single", next)}
        onInterval={(next) => update("pulse_interval_seconds", next)}
        onTemperature={(index, next) => updatePulseTemperature("single", index, next)}
      />

      <PulseSection
        number="04"
        title="Batch Pulses"
        enabled={value.batch_pulses_enabled}
        onEnabled={(next) => update("batch_pulses_enabled", next)}
        count={value.batch_pulse_count}
        interval={value.batch_pulse_interval_seconds}
        temperatures={value.batch_pulse_temps_c}
        onCount={(next) => updatePulseCount("batch", next)}
        onInterval={(next) => update("batch_pulse_interval_seconds", next)}
        onTemperature={(index, next) => updatePulseTemperature("batch", index, next)}
      />

      {errors.length ? (
        <div className="validation-box">
          {errors.map((error) => <p key={error}>{error}</p>)}
        </div>
      ) : null}
      {syncBlocked ? <div className="validation-box"><p>Cold Brew는 앱에서 선택할 수 있지만 비공식 API의 duration/profileType 매핑을 검증하기 전까지 자동 저장하지 않습니다.</p></div> : null}
      <button className="primary-button save-profile" onClick={onSave} disabled={Boolean(saving || errors.length || syncBlocked)}>
        {saving ? "저장 중…" : "Aiden 프로필 저장"}
      </button>
    </div>
  );
}

type PulseSectionProps = {
  number: string;
  title: string;
  enabled: boolean;
  onEnabled: (value: boolean) => void;
  count: number;
  interval: number;
  temperatures: number[];
  onCount: (value: number) => void;
  onInterval: (value: number) => void;
  onTemperature: (index: number, value: number) => void;
};

function PulseSection(props: PulseSectionProps) {
  return (
    <section className="settings-section">
      <div className="section-heading">
        <div><span className="section-number">{props.number}</span><h3>{props.title}</h3></div>
        <Toggle checked={props.enabled} onCheckedChange={props.onEnabled} />
      </div>
      <SettingRow label="Number of Pulses">
        <Select value={props.count} options={AIDEN_PROFILE_OPTIONS.pulseCounts} onChange={props.onCount} />
      </SettingRow>
      <SettingRow label="Time between pulses">
        <Select value={props.interval} options={AIDEN_PROFILE_OPTIONS.pulseIntervalSeconds} onChange={props.onInterval} suffix="s" />
      </SettingRow>
      {props.temperatures.map((temperature, index) => (
        <SettingRow label={`Pulse ${index + 1} temperature`} key={index}>
          <Select value={temperature} options={AIDEN_PROFILE_OPTIONS.temperaturesC} onChange={(next) => props.onTemperature(index, next)} suffix=" °C" />
          <span className="pulse-marker">{index === props.temperatures.length - 1 ? <Trash2 size={14} /> : <Plus size={14} />}</span>
        </SettingRow>
      ))}
    </section>
  );
}
