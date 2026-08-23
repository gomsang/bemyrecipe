---
type: recipe
status: candidate
storage: candidate
bean: ../beans/bean-file.md
research_dossier: ../../research/YYYY-MM-DD-bean-slug.md
research_status: blocked
brew_ready: false
lineage: bean-style-cup
version: 1
parent: null
accepted_at: null
acceptance_note: null
similar_recipes: []
created: YYYY-MM-DD
ruleset_version: 1
control_conditions:
  basket: single_serve
  grinder_burr: "grinder-and-burr-id"
  water: "water-id"
  vessel: "serving-vessel-id"
  ice_goal: remain_while_drinking
rule_exceptions: []
rule_extension_requests: []
beverage_style: flash
serve_mode: iced # hot | iced | cold_brew — docs/RECIPE-SCHEMA.md 참고
brew_method: flash # standard | flash | cold_drip
cup_id: glass-315
cup_capacity_ml: 315
dose_g: 0
brew_water_g: 0
filter_rinse:
  enabled: true
  water: hot
  discard_rinse_water: true
ice_plan:
  strategy: split
  brew_ice:
    grams: 0
    vessel: carafe
    timing: before_brew
    purpose: flash_chill
  serving_ice:
    grams: 0
    vessel: serving_vessel
    timing: before_transfer
    purpose: keep_cold
prep_steps:
  - id: rinse_filter
    phase: before_brew
    label: "필터 린싱"
    instruction: "Paper filter를 뜨거운 물로 충분히 적시고 린스 물을 완전히 버린다."
    critical: true
  - id: add_brew_ice
    phase: before_brew
    label: "Brew ice"
    instruction: "마른 carafe에 계량한 brew ice를 넣고 Aiden에 장착한다."
    critical: true
  - id: finish_and_transfer
    phase: after_brew
    label: "급랭과 이송"
    instruction: "Drip finish 뒤 carafe를 부드럽게 swirl하고 fresh serving ice를 담은 컵으로 즉시 옮긴다."
    critical: true
profile_name: "ASCII profile name v1"
profile_temperature_c: 0
nominal_ratio: 0
cold_brew_enabled: false
grinder: "Fellow Ode Gen 2 · Stock Burr"
grind_setting: ""
bloom_enabled: true
bloom_ratio: 0
bloom_seconds: 0
bloom_temp_c: 0
single_serve_pulses_enabled: true
pulse_count: 0
pulse_interval_seconds: 0
pulse_temps_c: []
batch_pulses_enabled: true
batch_pulse_count: 1
batch_pulse_interval_seconds: 30
batch_pulse_temps_c: [0]
retention_factor: 2.0
drop_temp_c: 65
target_temp_c: 5
---

# Recipe name · v1

상태: **Candidate — 사용자 채택 전**

Research/Brew gate: **blocked / brew_ready: false**

## 요청 충분성

- Decision-critical 정보: complete / incomplete
- 아직 필요한 답:

## 규칙 평가

- Ruleset: v1
- Hard constraints: pass / blocked
- Advisory review:
- 새 통제조건 또는 허용값:
- System change proposal: 없음 / `rule_extension_requests` 참고

## Research Dossier

- Dossier:
- Research status:
- 조사 시점:
- 핵심 충돌:
- 이 recipe를 허용한 gate 판정:

## 참고한 유사 recipe

| 참고 recipe | 유사한 점 | 참고한 원칙 | 그대로 복사하지 않은 이유 |
|---|---|---|---|
|  |  |  |  |

## 목표

- 향미:
- 농도/질감:
- 온도/얼음:

## 준비

| 항목 | 값 |
|---|---:|
| 실제 원두 |  |
| Aiden brew water |  |
| Brew ice |  |
| Serving ice |  |
| 컵 |  |
| 분쇄도 |  |
| 물 |  |

## Aiden 입력

| 단계 | 설정 |
|---|---|
| Nominal ratio |  |
| Bloom |  |
| Pulses |  |

## Harness 계산

| 계산 | 값 | 의미 |
|---|---:|---|
| Machine-assumed dose |  |  |
| Actual hot ratio |  |  |
| Total recipe-water ratio |  |  |
| Nominal bloom water |  |  |
| Actual bloom ratio |  |  |
| Estimated hot beverage |  |  |
| Estimated cup load |  |  |
| Estimated headspace |  |  |
| Ice needed / remaining |  |  |

## Harness check

- [ ] Intake gate complete
- [ ] Research gate complete 또는 sufficient-with-gaps
- [ ] 각 주요 setting이 Dossier 근거/가설과 연결됨
- [ ] 기기 UI 값 확인
- [ ] Basket 확인
- [ ] 온도 범위
- [ ] Dose mismatch
- [ ] Bloom wetting
- [ ] Cup headspace
- [ ] Ice remaining estimate

## 실행 순서

1.
2.
3.

## 이번 버전의 가설

- 가설:
- 성공 기준:
- 실패 시 먼저 볼 것:

## Setting 근거

| Setting | 선택 이유 | Dossier 근거 | 신뢰도 |
|---|---|---|---|
| Dose / water / ice |  |  |  |
| Ode setting |  |  |  |
| Bloom |  |  |  |
| Pulse / temperature |  |  |  |

## Changed from previous version

- v1은 baseline이므로 해당 없음.

## Brew logs

- 없음
