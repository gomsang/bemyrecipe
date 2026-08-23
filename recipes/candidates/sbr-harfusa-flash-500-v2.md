---
type: recipe
status: candidate
storage: candidate
bean: ../../beans/sbr-ethiopia-harfusa.md
research_dossier: ../../research/2026-08-24-flash-serving-ice.md
research_status: sufficient-with-gaps
brew_ready: true
lineage: sbr-harfusa-flash-500
version: 2
revision:
  kind: execution_adjustment
  parent: sbr-harfusa-flash-500-v1
  primary_variable: ice_role_split
  summary: "텀블러의 Serving ice를 150g으로 늘리고 총 얼음 230g은 유지"
  rationale: "v1은 500ml 텀블러에 처음 넣는 Serving ice가 80g뿐이어서 사용자가 손드립에서 만족했던 150g 이상의 서비스 경험과 맞지 않았다. 추출과 최종 희석을 바꾸지 않고 Brew ice 70g을 Serving ice로 옮긴다."
  changes:
    - "Brew ice 150g → 80g"
    - "Serving ice 80g → 150g"
    - "총 얼음 230g, dose, selected water, 분쇄와 profile은 유지"
    - "minimum_serving_ice_g 150g 추가"
    - "카라페와 텀블러를 분리한 2단계 열수지로 잔존 얼음 검증"
  success_criteria:
    - "500ml 텀블러에 처음 Serving ice 150g이 들어감"
    - "70°C stress model에서 텀블러의 Serving ice가 20g 이상 남음"
    - "5분 뒤에도 베르가못과 백도가 구분되고 얼음 채움이 충분함"
accepted_at: null
acceptance_note: null
similar_recipes:
  - sbr-harfusa-flash-500-v1.md
  - sbr-harfusa-flash-315-v4.md
created: 2026-08-24
ruleset_version: 5
control_conditions:
  aiden_quantity_mode: metric_precise
  basket: single_serve
  shower_selector: single_serve
  filter_paper: "standard #2 cone · exact product unrecorded"
  grinder_burr: ode-gen2-stock
  water: samdasoo
  vessel: tumbler-500
  ice_goal: remain_while_drinking
rule_exceptions: []
rule_extension_requests: []
drink_guide:
  status: ready
  title: "긴 한 잔에 어울리는 얼음의 자리"
  deck: >-
    500ml 텀블러에 150g의 얼음을 먼저 담고, Harfusa의 베르가못과 백도를 그 위로 빠르게 식혀 완성한다. 첫 모금만 차가운 커피가 아니라, 이동하며 천천히 마셔도 얼음이 남는 한 잔을 위한 구성이다.
  estimated_read_minutes: 8
  brew_story: >-
    25g의 커피와 Aiden 물 280ml로 약 230g의 농축 커피를 만든다. 카라페의 Brew ice는 80g, 텀블러의 Serving ice는 150g이다. 이전 버전과 총 얼음 230g은 같아서 최종 희석은 그대로다. 65°C 낙하 기준으로 카라페의 커피는 약 27.7°C가 되어 텀블러로 옮겨지고, 150g의 fresh ice와 만나 약 42.4g이 남는다. 70°C 조건에서도 약 27.9g이 텀블러에 남는 계산이다.
  serving_ritual: >-
    뚜껑을 닫기 전, 얼음 사이에서 올라오는 베르가못과 오렌지 껍질 향을 먼저 맡는다. 첫 모금의 밝은 감귤 뒤로 백도의 부드러운 단맛이 따라오는지 보고, 이동하며 마실 때에는 희석이 진행되어도 그 두 인상이 따로 남는지 느껴본다.
  brew_choices:
    - label: "CONCENTRATE"
      value: "25g · 280ml"
      reason: "실제 hot ratio 1:11.20으로 긴 음용 시간에도 향의 밀도가 너무 빨리 비지 않게 한다."
    - label: "TWO ICE ROLES"
      value: "80g + 150g"
      reason: "총 얼음은 유지하면서 500ml 텀블러에 어울리는 150g을 마시는 잔에 직접 담는다."
    - label: "IN-TUMBLER ICE"
      value: "약 42g / 28g"
      reason: "65°C 기준과 70°C stress 조건에서 텀블러에 남는 Serving ice의 계산값이다."
    - label: "PULSE"
      value: "3회 · 28초"
      reason: "이번 버전은 얼음 역할만 바꾸므로 25g bed를 위한 기존 추출 profile은 유지한다."
  taste_journey:
    - moment: "뚜껑을 닫기 전"
      cue: "베르가못과 오렌지 껍질의 향이 차가운 잔 위에서도 분명하게 올라오는지 맡아 본다."
    - moment: "첫 모금"
      cue: "감귤의 밝음 뒤로 백도 같은 부드러운 단향과 가벼운 질감이 이어지는지 느껴본다."
    - moment: "5분 뒤"
      cue: "얼음이 녹기 시작한 뒤에도 베르가못과 백도가 따로 읽히고 질감이 물처럼 비지 않는지 본다."
    - moment: "마지막"
      cue: "남은 얼음과 함께 오렌지필의 향긋한 여운이 이어지는지, 거친 쓴맛으로 바뀌지는 않는지 살핀다."
beverage_style: flash
serve_mode: iced
brew_method: flash
cup_id: tumbler-500
cup_capacity_ml: 500
dose_g: 25
brew_water_g: 280
filter_rinse:
  enabled: true
  water: hot
  discard_rinse_water: true
ice_plan:
  strategy: split
  brew_ice:
    grams: 80
    vessel: carafe
    timing: before_brew
    purpose: flash_chill
  serving_ice:
    grams: 150
    vessel: tumbler-500
    timing: before_transfer
    purpose: keep_cold
prep_steps:
  - id: set_quantity_mode
    phase: before_brew
    label: "Precise Units 설정"
    instruction: "Aiden에서 Settings → Units → Precise Units를 켜고 물양이 10ml씩 움직이는지 확인한 뒤 280ml를 고른다."
    critical: true
  - id: rinse_filter
    phase: before_brew
    label: "필터 린싱"
    instruction: "Cone paper filter를 뜨거운 물로 적신다. Aiden 위에서 린싱했다면 카라페의 린스 물을 완전히 버리고 빈 상태를 확인한다."
    critical: true
  - id: set_shower_selector
    phase: before_brew
    label: "Single basket / one green dot"
    instruction: "Single Serve cone basket을 장착하고 물리 shower selector를 한 개의 초록 점(Single)에 맞춘다."
    critical: true
  - id: add_brew_ice
    phase: before_brew
    label: "Brew ice 80g"
    instruction: "빈 카라페에 Brew ice 80g을 넣어 고르게 펼친 뒤 Aiden에 장착한다."
    critical: true
  - id: dose_and_brew
    phase: before_brew
    label: "25.0g 계량"
    instruction: "Ode Gen 2 5⅓로 분쇄한 25.0g을 평평하게 담는다. Aiden의 약 20g 안내 대신 실제 25.0g과 selected water 280ml를 사용한다."
    critical: true
  - id: wait_for_finish
    phase: after_brew
    label: "Drip finish 대기"
    instruction: "완료 차임과 drip finish가 끝날 때까지 기다린 뒤 카라페를 10–15초 부드럽게 돌려 농도와 온도를 맞춘다."
    critical: true
  - id: add_serving_ice
    phase: after_brew
    label: "Serving ice 150g"
    instruction: "500ml 텀블러에 fresh Serving ice 150g을 이송 직전에 넣는다."
    critical: true
  - id: transfer
    phase: serve
    label: "즉시 이송"
    instruction: "커피를 Serving ice 위로 전부 붓고 두세 번 가볍게 섞는다. 카라페에 고체 얼음이 남았다면 억지로 텀블러에 옮기지 말고 따로 기록한다."
    critical: true
profile_name: "SBR Harfusa Ice 500 v2"
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
pulse_interval_seconds: 28
pulse_temps_c: [94, 93, 92]
batch_pulses_enabled: true
batch_pulse_count: 1
batch_pulse_interval_seconds: 30
batch_pulse_temps_c: [94]
retention_factor: 2.0
drop_temp_c: 65
target_temp_c: 5
minimum_headspace_ml: 30
minimum_serving_ice_g: 150
---

# SBR · Harfusa · 500ml Tumbler Flash brew · v2

상태: **Candidate — 사용자 채택 전 / brew ready**

## 목표

- 500ml 텀블러에 처음부터 Serving ice 150g을 담아, 오래 마셔도 얼음이 남는 서비스 경험을 만든다.
- v1의 추출과 총 얼음 230g은 유지해 맛과 장시간 희석 상한을 바꾸지 않는다.

## 최종 실행값

| 항목 | 값 |
|---|---:|
| 실제 원두 | **25.0g** |
| Aiden selected water | **280ml** |
| Brew ice / Serving ice | **80g / 150g** |
| 분쇄 | Ode Gen 2 Stock Burr · **5⅓** |
| Bloom | **1:3 · 45초 · 95°C** |
| Pulses | **3회 · 28초 · 94 → 93 → 92°C** |
| Basket / selector | Single Serve cone / **one green dot** |
| 물 | 제주삼다수 |

## Harness 계산

| 계산 | 값 |
|---|---:|
| Machine-assumed dose | 20.0g |
| Actual hot ratio | 1:11.20 |
| Total recipe-water ratio | 1:20.40 |
| 예상 hot beverage | 230g |
| 65°C 이송 온도 / 텀블러 얼음 / headspace | 약 27.7°C / 42.4g / 36.2ml |
| 70°C stress 이송 온도 / 텀블러 얼음 / headspace | 약 31.4°C / 27.9g / 37.5ml |
| 모든 얼음이 녹은 장시간 음료량 | 약 460g · 1:18.40 |

500ml 버전은 카라페에서 완전히 차갑게 만드는 레시피가 아니다. Brew ice 80g으로 먼저 열을 낮춘 뒤, 텀블러의 fresh Serving ice 150g 위에 **즉시** 부어 두 번째 냉각을 끝내야 한다.

## Harness check

- ✅ Ruleset v5 · `metric_precise`에서 280ml 선택 가능
- ✅ Serving ice 150g으로 사용자의 500ml 기준 통과
- ✅ 65°C/70°C에서 텀블러의 Serving ice 42.4g/27.9g 잔존
- ✅ 두 조건에서 30ml minimum headspace 이상
- ✅ 추출 profile, 총 얼음 230g과 장시간 희석은 v1과 동일
- ⚠️ 이송 전 27–31°C는 모델값이므로 지체 없이 Serving ice 위로 옮겨야 함
- ⚠️ 실제 텀블러 열용량, 냉동고 얼음 온도와 얼음 크기는 첫 추출에서 측정 필요

## Changed from previous version

v1은 총 열수지에서는 얼음이 남았지만, 텀블러에 처음 넣는 Serving ice가 80g뿐이었다. v2는 사용자가 손드립에서 만족했던 **150g을 서비스 하한**으로 삼고, `ice_role_split` 하나만 바꿨다. Brew ice 70g을 텀블러로 옮겼으며 총 얼음, dose, water, 분쇄와 Aiden profile은 그대로다.

## 첫 brew에서 기록할 것

- 카라페 swirl 뒤 이송 직전 온도와 이송까지 걸린 시간
- Serving ice 150g의 실제 개수와 텀블러 채움 정도
- 이송 직후, 5분 뒤, 마지막의 남은 얼음 무게
- 베르가못·백도 분리, 오렌지필의 향긋함과 혀 마름

## Brew logs

- 없음
