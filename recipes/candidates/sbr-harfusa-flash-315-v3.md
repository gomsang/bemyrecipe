---
type: recipe
status: candidate
storage: candidate
bean: ../../beans/sbr-ethiopia-harfusa.md
research_dossier: ../../research/2026-08-23-harfusa.md
research_status: sufficient-with-gaps
brew_ready: true
lineage: sbr-harfusa-flash-315
version: 3
revision:
  kind: correction
  parent: sbr-harfusa-flash-315-v2
  primary_variable: serving_geometry
  summary: "상변화 열수지를 교정하고 70°C에서도 얼음이 남는 315ml 기준 확정"
  rationale: "v2가 5°C에서 고체 얼음이 남는 물리적으로 모순된 상태를 계산해 잔존량을 과대평가했다. 0°C 상변화 모델과 고체 얼음 부피를 적용해 전체 geometry를 다시 맞췄다."
  changes:
    - "dose/water 17g/190ml → 16g/180ml"
    - "brew/serving ice 110g/20g → 120g/22g"
    - "65°C 예상 잔존 얼음 2.7g → 21.3g"
    - "70°C stress 예상 잔존 얼음 0g → 12.1g"
    - "minimum_headspace_ml 20을 기계 검증 필드로 추가"
  success_criteria:
    - "70°C stress model에서 얼음이 10g 이상 남음"
    - "고체 얼음 부피를 포함해 headspace 20ml 이상"
    - "5분 후에도 베르가못과 백도가 구분되고 혀가 마르지 않음"
accepted_at: null
acceptance_note: null
similar_recipes:
  - sbr-harfusa-flash-315-v2.md
  - sbr-harfusa-flash-500-v1.md
created: 2026-08-24
ruleset_version: 3
control_conditions:
  basket: single_serve
  shower_selector: single_serve
  filter_paper: "standard #2 cone · exact product unrecorded"
  grinder_burr: ode-gen2-stock
  water: samdasoo
  vessel: glass-315
  ice_goal: remain_while_drinking
rule_exceptions: []
rule_extension_requests: []
drink_guide:
  status: ready
  title: "작은 잔에 남겨 둔, 마지막 얼음 한 조각"
  deck: >-
    Harfusa의 높은 향을 315ml에 또렷하게 담으면서 마지막 모금까지 차갑게 이어 가는 레시피다. 급랭용 얼음과 마실 때 남을 얼음을 나누되, 눈대중이 아니라 상변화와 실제 얼음 부피까지 계산했다.
  estimated_read_minutes: 8
  brew_story: >-
    16g coffee와 Aiden water 180ml로 148g 안팎의 hot concentrate를 만든다. carafe의 brew ice 120g이 먼저 열을 받고, 잔의 fresh serving ice 22g이 이송 뒤의 냉각을 이어 간다. 얼음이 남아 있는 동안 물과 얼음의 평형 온도는 약 0°C라는 조건으로 다시 계산하면 65°C 낙하에서 약 21g, 70°C에서도 약 12g이 남는다. 95°C bloom과 94→92°C의 완만한 하강은 그대로 두어 이번 교정에서는 맛 변수가 아니라 serving geometry만 바로잡았다.
  serving_ritual: >-
    잔을 받으면 바로 마시기보다 차가운 표면 위로 올라오는 향을 먼저 맡는다. 첫 모금에서는 베르가못과 백도를 찾고, 5분 뒤에는 조금 희석된 잔에서 같은 향이 어떻게 달라지는지 비교한다. 마지막에는 오렌지필이 향긋한 여운으로 남는지, 얼음이 실제로 남아 있는지 본다.
  brew_choices:
    - label: "CONCENTRATE"
      value: "16g · 180ml"
      reason: "실제 hot ratio 1:11.25를 유지하면서 315ml 안에 얼음과 20ml 이상의 여유를 둔다."
    - label: "TWO ICE ROLES"
      value: "120g + 22g"
      reason: "급랭과 음용 중 보냉을 분리하고 70°C stress에서도 10g 넘는 얼음을 남긴다."
    - label: "HEADSPACE"
      value: "약 23ml"
      reason: "고체 얼음 밀도 0.917g/ml를 반영한 값으로, 질량을 곧 부피로 보지 않았다."
    - label: "GRIND"
      value: "ODE 5⅓"
      reason: "개인 drawdown log가 없으므로 Fellow의 현재 Single Brew 출발점을 유지한다."
  taste_journey:
    - moment: "잔을 들기 전"
      cue: "얼그레이를 닮은 베르가못의 높은 향이 차가운 표면 위에서도 올라오는지 맡아 본다."
    - moment: "첫 모금"
      cue: "감귤의 밝음 뒤로 백도 같은 둥근 단향과 가벼운 질감이 이어지는지 본다."
    - moment: "5분 뒤"
      cue: "희석이 진행돼도 백도와 오렌지필이 하나의 신맛으로 뭉개지지 않는지 비교한다."
    - moment: "마지막"
      cue: "얼음이 실제로 남았는지, 오렌지필의 향긋한 쌉쌀함이 혀 마름으로 바뀌지 않았는지 기록한다."
beverage_style: flash
serve_mode: iced
brew_method: flash
cup_id: glass-315
cup_capacity_ml: 315
dose_g: 16
brew_water_g: 180
filter_rinse:
  enabled: true
  water: hot
  discard_rinse_water: true
ice_plan:
  strategy: split
  brew_ice:
    grams: 120
    vessel: carafe
    timing: before_brew
    purpose: flash_chill
  serving_ice:
    grams: 22
    vessel: glass-315
    timing: before_transfer
    purpose: keep_cold
prep_steps:
  - id: rinse_filter
    phase: before_brew
    label: "필터 린싱"
    instruction: "Single Serve cone paper filter를 뜨거운 물로 적신다. Aiden 위에서 린싱했다면 carafe의 물을 완전히 버리고 빈 상태를 확인한다."
    critical: true
  - id: set_shower_selector
    phase: before_brew
    label: "Single basket / one green dot"
    instruction: "Single Serve cone basket을 장착하고 물리 shower selector를 한 개의 초록 점(Single)에 맞춘다."
    critical: true
  - id: add_brew_ice
    phase: before_brew
    label: "Brew ice 120g"
    instruction: "빈 carafe에 brew ice 120g을 넣어 고르게 펼친 뒤 Aiden에 장착한다."
    critical: true
  - id: dose_and_brew
    phase: before_brew
    label: "16.0g 계량"
    instruction: "Ode Gen 2 5⅓로 분쇄한 16.0g을 cone basket에 평평하게 담는다. 기기의 약 12.9g 안내 대신 실제 16.0g과 selected water 180ml를 사용한다."
    critical: true
  - id: wait_for_finish
    phase: after_brew
    label: "Drip finish 대기"
    instruction: "완료 차임과 drip finish가 끝날 때까지 기다린 뒤 carafe를 10–15초 부드럽게 돌린다."
    critical: true
  - id: add_serving_ice
    phase: after_brew
    label: "Serving ice 22g"
    instruction: "315ml 유리잔에 fresh serving ice 22g을 이송 직전에 넣는다."
    critical: true
  - id: transfer
    phase: serve
    label: "즉시 이송"
    instruction: "커피를 serving ice 위로 전부 붓고 두세 번만 가볍게 섞는다."
    critical: false
profile_name: "SBR Harfusa Ice 315 v3"
profile_temperature_c: 94
nominal_ratio: 14
cold_brew_enabled: false
grinder: "Fellow Ode Gen 2 · Stock Burr"
grind_setting: "5⅓"
bloom_enabled: true
bloom_ratio: 3
bloom_seconds: 45
bloom_temp_c: 95
single_serve_pulses_enabled: true
pulse_count: 3
pulse_interval_seconds: 23
pulse_temps_c: [94, 93, 92]
batch_pulses_enabled: true
batch_pulse_count: 1
batch_pulse_interval_seconds: 30
batch_pulse_temps_c: [94]
retention_factor: 2.0
drop_temp_c: 65
target_temp_c: 5
minimum_headspace_ml: 20
---

# SBR · Harfusa · 315ml Split-ice Flash brew · v3

상태: **Candidate — 사용자 채택 전 / brew ready**

## 목표

- 315ml 잔에서 베르가못과 백도의 구분을 지키면서, 70°C 보수 조건에서도 마지막까지 얼음이 남는 한 잔

## 최종 실행값

| 항목 | 값 |
|---|---:|
| 실제 원두 | **16.0g** |
| Aiden selected water | **180ml** |
| Brew ice / Serving ice | **120g / 22g** |
| 분쇄 | Ode Gen 2 Stock Burr · **5⅓** |
| Bloom | **1:3 · 45초 · 95°C** |
| Pulses | **3회 · 23초 · 94 → 93 → 92°C** |
| Basket / selector | Single Serve cone / **one green dot** |
| 물 | 제주삼다수 |

Aiden은 실제 원두 무게를 재지 않는다. 명목 1:14가 약 12.9g을 안내해도 실제 투입량은 **16.0g**이다.

## Harness 계산

| 계산 | 값 |
|---|---:|
| Machine-assumed dose | 12.86g |
| Actual hot ratio | 1:11.25 |
| Total recipe-water ratio | 1:20.13 |
| Nominal bloom water / actual bloom | 38.57g / 1:2.41 |
| 예상 hot beverage | 148g |
| 65°C 잔존 얼음 / headspace | 약 21.3g / 23.1ml |
| 70°C stress 잔존 얼음 / headspace | 약 12.1g / 23.9ml |
| 모든 얼음이 녹은 장시간 음료량 | 약 290g · 1:18.13 |

열수지는 얼음 0°C, 물의 비열 4.186J/g°C, 융해열 333.55J/g, 고체 얼음 밀도 0.917g/ml, 용기·공기 열손실 0을 가정한 보수 근사다. 얼음이 남는 동안 평형은 약 0°C이며, 실제 freezer 온도와 얼음 모양·carafe 열용량은 첫 brew에서 교정한다.

## Harness check

- ✅ Intake와 Research gate 통과
- ✅ Ruleset v3의 65°C base와 70°C stress에서 잔존 얼음 10g 이상
- ✅ 두 조건에서 20ml minimum headspace 이상
- ✅ Single basket + one green dot 공식 기본 조합
- ✅ Actual bloom 1:2.41, pulse 3개와 온도 3개 일치
- ⚠️ 실제 dose는 machine-assumed dose보다 24.4% 많으므로 기기 안내 대신 16.0g 사용
- ⚠️ exact filter와 Ode calibration, 실제 drop temperature는 첫 log에 기록

## Changed from previous version

v2의 5°C 열수지 식은 고체 얼음이 남는 상태와 5°C 액체가 동시에 존재한다고 보아 잔존량을 과대평가했다. v3는 0°C 상변화 모델을 적용하고, 고체 얼음의 부피까지 headspace에 포함했다. 추출 profile과 분쇄는 유지하고 **serving geometry**만 교정했다.

## 첫 brew에서 기록할 것

- 실제 dose, selected water, 두 얼음 무게와 filter 종류
- Carafe swirl 뒤 이송 직전 온도와 최종 질량
- Drawdown과 basket standing water
- 첫 모금/5분 뒤의 베르가못, 백도, 오렌지필
- 다 마신 뒤 남은 얼음의 유무와 가능하면 무게

## Brew logs

- 없음
