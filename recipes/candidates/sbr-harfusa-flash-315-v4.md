---
type: recipe
status: candidate
storage: candidate
bean: ../../beans/sbr-ethiopia-harfusa.md
research_dossier: ../../research/2026-08-24-flash-serving-ice.md
research_status: sufficient-with-gaps
brew_ready: true
lineage: sbr-harfusa-flash-315
version: 4
revision:
  kind: execution_adjustment
  parent: sbr-harfusa-flash-315-v3
  primary_variable: ice_role_split
  summary: "음용 잔의 얼음을 52g으로 늘리고 총 얼음 142g은 유지"
  rationale: "v3는 총 열수지를 통과했지만 315ml 잔에 처음 넣는 Serving ice가 22g뿐이라, 사용자가 원하는 눈에 보이는 얼음 채움과 지속적인 보냉을 충분히 검증하지 못했다. 추출과 최종 희석을 바꾸지 않고 Brew ice 30g을 Serving ice로 옮긴다."
  changes:
    - "Brew ice 120g → 90g"
    - "Serving ice 22g → 52g"
    - "총 얼음 142g, dose, selected water, 분쇄와 profile은 유지"
    - "minimum_serving_ice_g 50g 추가"
    - "카라페와 음용 컵을 분리한 2단계 열수지로 잔존 얼음 검증"
  success_criteria:
    - "315ml 잔에 처음 50g 이상의 Serving ice가 들어감"
    - "70°C stress model에서 음용 잔의 Serving ice가 10g 이상 남음"
    - "5분 뒤에도 얼음이 눈에 보이고 베르가못과 백도가 구분됨"
accepted_at: null
acceptance_note: null
similar_recipes:
  - sbr-harfusa-flash-315-v3.md
  - sbr-harfusa-flash-500-v2.md
created: 2026-08-24
ruleset_version: 5
control_conditions:
  aiden_quantity_mode: metric_precise
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
  title: "작은 잔에 충분한 얼음을 남기는 법"
  deck: >-
    베르가못과 백도의 가벼운 향을 차갑고 또렷하게 즐기기 위한 315ml 레시피다. 잔에는 처음부터 52g의 얼음을 담아, 첫 모금의 온도뿐 아니라 마시는 동안 보이는 얼음까지 놓치지 않았다.
  estimated_read_minutes: 8
  brew_story: >-
    16g의 커피와 Aiden 물 180ml로 약 148g의 농축 커피를 만든다. 카라페의 Brew ice는 90g, 마시는 잔의 Serving ice는 52g이다. 이전 버전과 총 얼음 142g은 같아서 장시간 희석과 최종 농도는 그대로지만, 냉각의 더 큰 몫을 잔으로 옮겼다. 65°C 낙하 기준으로 커피는 카라페에서 약 10.3°C까지 식은 뒤 잔으로 옮겨지고, Serving ice는 약 21.3g 남는다. 70°C 조건에서도 약 12.0g이 남는 계산이다.
  serving_ritual: >-
    잔을 받으면 얼음 사이로 올라오는 향을 먼저 맡는다. 첫 모금에서는 베르가못의 높은 향과 백도의 둥근 단맛을 찾아보고, 몇 분 뒤에는 오렌지필의 향긋한 쌉쌀함이 어떻게 길어지는지 느껴본다. 마지막 얼음이 남아 있는 동안에도 향이 텅 비지 않는지가 이 한 잔의 관전 포인트다.
  brew_choices:
    - label: "CONCENTRATE"
      value: "16g · 180ml"
      reason: "실제 hot ratio 1:11.25로 향의 밀도를 유지하면서 315ml 안에 얼음과 20ml 이상의 여유를 둔다."
    - label: "TWO ICE ROLES"
      value: "90g + 52g"
      reason: "총 얼음은 바꾸지 않고 음용 잔의 얼음을 50g 이상으로 늘려 서비스 경험을 보강했다."
    - label: "IN-GLASS ICE"
      value: "약 21g / 12g"
      reason: "65°C 기준과 70°C stress 조건에서 음용 잔에 남는 Serving ice의 계산값이다."
    - label: "GRIND"
      value: "ODE 5⅓"
      reason: "이번 버전은 얼음 역할만 바꾸므로 분쇄와 추출 profile은 그대로 두었다."
  taste_journey:
    - moment: "잔을 들기 전"
      cue: "차가운 표면 위에서 얼그레이를 닮은 베르가못 향이 먼저 올라오는지 맡아 본다."
    - moment: "첫 모금"
      cue: "밝은 감귤 뒤로 백도 같은 부드러운 단향과 가벼운 질감이 이어지는지 느껴본다."
    - moment: "5분 뒤"
      cue: "얼음이 남은 상태에서도 백도와 오렌지필이 한 덩어리의 신맛으로 뭉개지지 않는지 살핀다."
    - moment: "마지막"
      cue: "오렌지필의 향긋한 쌉쌀함과 거칠게 혀를 말리는 쓴맛을 구분해 본다."
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
    grams: 90
    vessel: carafe
    timing: before_brew
    purpose: flash_chill
  serving_ice:
    grams: 52
    vessel: glass-315
    timing: before_transfer
    purpose: keep_cold
prep_steps:
  - id: set_quantity_mode
    phase: before_brew
    label: "Precise Units 설정"
    instruction: "Aiden에서 Settings → Units → Precise Units를 켜고 물양이 10ml씩 움직이는지 확인한 뒤 180ml를 고른다."
    critical: true
  - id: rinse_filter
    phase: before_brew
    label: "필터 린싱"
    instruction: "Single Serve cone paper filter를 뜨거운 물로 적신다. Aiden 위에서 린싱했다면 카라페의 물을 완전히 버리고 빈 상태를 확인한다."
    critical: true
  - id: set_shower_selector
    phase: before_brew
    label: "Single basket / one green dot"
    instruction: "Single Serve cone basket을 장착하고 물리 shower selector를 한 개의 초록 점(Single)에 맞춘다."
    critical: true
  - id: add_brew_ice
    phase: before_brew
    label: "Brew ice 90g"
    instruction: "빈 카라페에 Brew ice 90g을 넣어 고르게 펼친 뒤 Aiden에 장착한다."
    critical: true
  - id: dose_and_brew
    phase: before_brew
    label: "16.0g 계량"
    instruction: "Ode Gen 2 5⅓로 분쇄한 16.0g을 평평하게 담는다. 기기의 약 12.9g 안내 대신 실제 16.0g과 selected water 180ml를 사용한다."
    critical: true
  - id: wait_for_finish
    phase: after_brew
    label: "Drip finish 대기"
    instruction: "완료 차임과 drip finish가 끝날 때까지 기다린 뒤 카라페를 10–15초 부드럽게 돌려 농도와 온도를 맞춘다."
    critical: true
  - id: add_serving_ice
    phase: after_brew
    label: "Serving ice 52g"
    instruction: "315ml 유리잔에 fresh Serving ice 52g을 이송 직전에 넣는다."
    critical: true
  - id: transfer
    phase: serve
    label: "즉시 이송"
    instruction: "커피를 Serving ice 위로 전부 붓고 두세 번만 가볍게 섞는다. 카라페에 고체 얼음이 남았다면 억지로 잔에 옮기지 말고 따로 기록한다."
    critical: false
profile_name: "SBR Harfusa Ice 315 v4"
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
minimum_serving_ice_g: 50
---

# SBR · Harfusa · 315ml Split-ice Flash brew · v4

상태: **Candidate — 사용자 채택 전 / brew ready**

## 목표

- 추출과 최종 희석은 v3와 같게 유지하면서, 315ml 잔에 처음부터 충분한 Serving ice를 둔다.
- 70°C stress 조건에서도 음용 잔 안에 얼음이 10g 이상 남는다.

## 최종 실행값

| 항목 | 값 |
|---|---:|
| 실제 원두 | **16.0g** |
| Aiden selected water | **180ml** |
| Brew ice / Serving ice | **90g / 52g** |
| 분쇄 | Ode Gen 2 Stock Burr · **5⅓** |
| Bloom | **1:3 · 45초 · 95°C** |
| Pulses | **3회 · 23초 · 94 → 93 → 92°C** |
| Basket / selector | Single Serve cone / **one green dot** |
| 물 | 제주삼다수 |

## Harness 계산

| 계산 | 값 |
|---|---:|
| Machine-assumed dose | 12.86g |
| Actual hot ratio | 1:11.25 |
| Total recipe-water ratio | 1:20.13 |
| 예상 hot beverage | 148g |
| 65°C 이송 온도 / 잔의 얼음 / headspace | 약 10.3°C / 21.3g / 23.1ml |
| 70°C stress 이송 온도 / 잔의 얼음 / headspace | 약 13.4°C / 12.0g / 23.9ml |
| 모든 얼음이 녹은 장시간 음료량 | 약 290g · 1:18.13 |

열수지는 카라페 냉각과 음용 잔 냉각을 순서대로 계산한다. 고체 Brew ice가 카라페에 남으면 음용 잔의 얼음으로 세지 않는다. 얼음 0°C, 용기·공기 열손실 0을 가정했으므로 첫 추출의 이송 온도와 잔존 얼음 무게로 교정한다.

## Harness check

- ✅ Ruleset v5 · `metric_precise`에서 180ml 선택 가능
- ✅ Serving ice 52g으로 개인 잠정 하한 50g 통과
- ✅ 65°C/70°C에서 음용 잔의 Serving ice 21.3g/12.0g 잔존
- ✅ 두 조건에서 20ml minimum headspace 이상
- ✅ 추출 profile, 총 얼음 142g과 장시간 희석은 v3와 동일
- ⚠️ 이송 온도, 냉동고 얼음 온도와 얼음 크기는 첫 추출에서 측정 필요

## Changed from previous version

v3의 총 잔존 얼음 계산은 맞았지만, 잔에 처음 넣는 Serving ice 22g이 사용자의 실제 서비스 기대를 충족하는지는 검증하지 않았다. v4는 **ice role split** 하나만 바꿔 Brew ice 30g을 음용 잔으로 옮겼다. 총 얼음, dose, water, 분쇄와 Aiden profile은 그대로다.

## 첫 brew에서 기록할 것

- 카라페 swirl 뒤 이송 직전 온도
- Serving ice 52g의 실제 개수와 잔에서 보이는 채움 정도
- 이송 직후, 5분 뒤, 마지막의 남은 얼음 무게
- 베르가못·백도 분리, 오렌지필의 향긋함과 혀 마름

## Brew logs

- 없음
