---
type: recipe
status: candidate
storage: candidate
bean: ../../beans/sbr-ethiopia-harfusa.md
research_dossier: ../../research/2026-08-23-harfusa.md
research_status: sufficient-with-gaps
brew_ready: true
lineage: sbr-harfusa-flash-315
version: 2
revision:
  kind: gate_completion
  parent: sbr-harfusa-flash-315-v1
  primary_variable: serving_geometry
  summary: "Research Hold를 해제하고 315ml split-ice 실행 기준 확정"
  rationale: "확정된 삼다수·split ice 조건에서 headspace와 잔존 얼음을 동시에 확보하도록 serving geometry를 다시 계산했다."
  changes:
    - "dose/water를 20g/225ml에서 17g/190ml로 조정"
    - "brew/serving ice를 90g/20g에서 110g/20g으로 조정"
    - "Ode 기준을 4⅓에서 공식 Single Brew anchor 5⅓으로 교정"
    - "Research Hold를 해제하고 brew_ready를 true로 전환"
  success_criteria:
    - "베르가못과 백도가 5분 후에도 구분됨"
    - "drawdown이 normal이고 standing water가 없음"
    - "315ml 잔에서 넘치지 않고 다 마실 때 얼음이 남음"
accepted_at: null
acceptance_note: null
similar_recipes:
  - sbr-harfusa-flash-315-v1.md
  - sbr-harfusa-flash-500-v1.md
created: 2026-08-23
ruleset_version: 2
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
  title: "차가운 잔에서, 베르가못이 먼저 열리는 순간"
  deck: >-
    Gedeo 고원의 washed coffee를 315ml 한 잔에 또렷하게 담는다. 급랭은 carafe에서 끝내고, 새 얼음은 잔에 남겨 첫 향과 마지막 온도를 함께 지키는 레시피다.
  estimated_read_minutes: 5
  brew_story: >-
    17g의 coffee에 Aiden water 190ml를 써 진한 hot concentrate를 만들고, carafe의 brew ice 110g으로 바로 식힌다. 315ml 잔에는 fresh serving ice 20g만 따로 둔다. 두 얼음을 나누는 이유는 단순하다. 하나는 추출 직후의 열을 받고, 다른 하나는 마시는 동안의 시간을 맡는다. 95°C bloom에서 시작해 94→92°C로 완만하게 낮춘 것은 Harfusa의 향을 충분히 열되, 오렌지 껍질 같은 마르는 끝맛은 첫 baseline에서 경계하기 위해서다.
  serving_ritual: >-
    Drip finish 뒤 carafe를 10–15초 부드럽게 돌려 농도와 온도를 맞춘다. fresh serving ice를 담은 315ml 잔으로 곧바로 옮기고 두세 번만 가볍게 섞는다. 첫 모금을 서두르지 말고 향을 먼저 맡은 뒤, 5분 후 같은 노트를 다시 찾아본다.
  brew_choices:
    - label: "CONCENTRATE"
      value: "17g · 190ml"
      reason: "실제 hot ratio 1:11.18로 향의 밀도를 만들면서 315ml 잔에 필요한 얼음 공간을 남긴다."
    - label: "TWO ICE ROLES"
      value: "110g + 20g"
      reason: "brew ice는 급랭, serving ice는 음용 중 냉각을 맡아 역할과 투입 시점을 분리한다."
    - label: "TEMPERATURE"
      value: "95 → 92°C"
      reason: "Aiden의 열 유지 속에서 추출력을 남기되 거칠고 마르는 finish를 경계하는 baseline이다."
    - label: "GRIND"
      value: "ODE 5⅓"
      reason: "개인 drawdown 기록이 없으므로 현재 Fellow Single Brew 공식 출발점을 calibration anchor로 쓴다."
  taste_journey:
    - moment: "잔을 들기 전"
      cue: "차가운 표면 위로 올라오는 베르가못과 가벼운 꽃 향을 먼저 확인한다."
    - moment: "첫 모금"
      cue: "감귤의 선명함 뒤에 백도 같은 둥근 단맛과 차처럼 가벼운 질감이 이어지는지 본다."
    - moment: "5분 뒤"
      cue: "얼음이 조금 더 녹은 뒤에도 백도와 오렌지필이 흐려지지 않고 서로 구분되는지 비교한다."
    - moment: "마지막"
      cue: "얼음이 남아 있는지, 오렌지필이 향긋한 여운인지 혀를 마르게 하는 쓴맛인지 기록한다."
beverage_style: flash
serve_mode: iced
brew_method: flash
cup_id: glass-315
cup_capacity_ml: 315
dose_g: 17
brew_water_g: 190
filter_rinse:
  enabled: true
  water: hot
  discard_rinse_water: true
ice_plan:
  strategy: split
  brew_ice:
    grams: 110
    vessel: carafe
    timing: before_brew
    purpose: flash_chill
  serving_ice:
    grams: 20
    vessel: glass-315
    timing: before_transfer
    purpose: keep_cold
prep_steps:
  - id: rinse_filter
    phase: before_brew
    label: "필터 린싱"
    instruction: "Single Serve cone paper filter를 뜨거운 물로 충분히 적신다. Aiden 위에서 린싱했다면 carafe의 린스 물을 완전히 버리고 carafe를 비운다."
    critical: true
  - id: set_shower_selector
    phase: before_brew
    label: "Single basket / one green dot"
    instruction: "Single Serve cone basket을 장착하고 뚜껑 안쪽 물리 shower selector를 한 개의 초록 점(Single)에 맞춘다. Profile의 pulse 설정과 별개의 수동 확인이다."
    critical: true
  - id: add_brew_ice
    phase: before_brew
    label: "Brew ice 110g"
    instruction: "빈 carafe에 brew ice 110g을 넣어 고르게 펼친 뒤 Aiden에 장착한다. 이 얼음은 추출액을 즉시 식히는 recipe water다."
    critical: true
  - id: dose_and_brew
    phase: before_brew
    label: "17.0g 계량"
    instruction: "Ode Gen 2 5⅓로 분쇄한 17.0g을 cone basket에 평평하게 담는다. Aiden의 약 13.6g 안내 대신 실제 17.0g을 사용하고 selected water 190ml로 시작한다."
    critical: true
  - id: wait_for_finish
    phase: after_brew
    label: "Drip finish 대기"
    instruction: "완료 차임과 drip finish가 끝날 때까지 carafe를 빼지 않는다. 끝난 뒤 10–15초 부드럽게 swirl해 농도와 온도를 맞춘다."
    critical: true
  - id: add_serving_ice
    phase: after_brew
    label: "Serving ice 20g"
    instruction: "315ml 유리잔에 fresh serving ice 20g을 새로 넣는다. 이 얼음은 급랭의 마무리와 마시는 동안의 차가움·잔존 얼음을 담당한다."
    critical: true
  - id: transfer
    phase: serve
    label: "즉시 이송"
    instruction: "Swirl한 커피를 serving ice 위로 전부 붓고 2–3회만 가볍게 섞는다. 처음과 5분 뒤, 다 마신 뒤를 기록한다."
    critical: false
profile_name: "SBR Harfusa Ice 315 v2"
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
---

# SBR · Harfusa · 315ml Split-ice Flash brew · v2

상태: **Candidate — 사용자 채택 전 / brew ready**

Research/Brew gate: **sufficient-with-gaps / brew_ready: true**

## 요청 충분성

- Decision-critical 정보: **complete**
- 원두: Ethiopia Yirgacheffe Harfusa Washed G1 · Medium–Light · roast 2026-08-14
- 서빙: 315ml 유리잔 · carafe brew ice와 fresh serving ice를 나눠 쓰는 Flash brew · 마시는 동안 얼음 잔존
- 컵 적재: PROFILE의 최소 권장 headspace 20ml를 적용하고, 계산상 29ml를 확보
- 맛: 별도 단일 우선순위가 없으므로 베르가못 clarity와 백도 sweetness의 균형을 보는 baseline
- 물: 제주삼다수

## 규칙 평가

- Ruleset: **v2**
- Hard constraints: **pass** — ICED/FLASH, split ice, rinse-water 폐기, ordered prep가 일치함
- Advisory review: **없음**
- Rule exception: **없음**
- System change proposal: **없음**. 얼음 온도·형태가 실제 결과를 크게 바꾸면 통제조건을 보존하고 ruleset 확장을 별도 제안함

## Research Dossier

- Dossier: [Harfusa · 315ml Flash brew](../../research/2026-08-23-harfusa.md)
- 공통 기계 조사: [Aiden rinse · 외부 profile · shower selector](../../research/2026-08-23-aiden-rinse-profiles-shower-selector.md)
- Research status: `sufficient-with-gaps`
- 조사/공식 자료 재확인: 2026-08-23
- 핵심 충돌: 공식 Light 99°C와 완만한 declining profile, Ode 5⅓ 공식 anchor와 더 고운 커뮤니티 값, 뜨거운 추출량과 315ml cup/ice geometry의 충돌
- Gate 판정: split ice, 균형형 향미 목표, 제주삼다수, 20ml 이상 headspace 조건이 확정됐고 모든 hard constraint를 통과해 numeric Candidate 허용

## 참고한 유사 recipe

| 참고 recipe | 유사한 점 | 참고한 원칙 | 그대로 복사하지 않은 이유 |
|---|---|---|---|
| [SBR · Harfusa · 315ml Flash v1 Research Hold](sbr-harfusa-flash-315-v1.md) | 같은 원두·컵·lineage | 실제 1:11대 hot concentrate와 split-ice 구조 | 20g/225ml는 컵 안에서 필요한 얼음량을 확보할 수 없고, 4⅓은 공식 anchor나 개인 log로 방어되지 않음 |
| [SBR · Harfusa · 500ml Tumbler Flash v1](sbr-harfusa-flash-500-v1.md) | 같은 원두·장비·물·iced 목표 | Ode 5⅓, actual bloom 약 1:2.4, 95→92°C의 보수적 baseline | 컵 크기와 dose가 달라 25g/280ml/230g ice를 축소 복사하지 않고 315ml 열수지와 headspace를 다시 계산 |
| 직접적으로 유사한 Accepted Recipe 없음 | — | 공식·내부 Candidate·개인 측정을 순서대로 적용 | 아직 Accepted Recipe와 brew log가 없음 |

## 목표

- 향미: 차가워진 뒤에도 베르가못과 백도가 따로 느껴지고, 오렌지필은 향긋하되 거칠거나 마르지 않을 것
- 농도/질감: 첫 모금은 선명하지만 물처럼 얇지 않고, 얼음이 더 녹은 뒤에는 균형 잡힌 농도가 될 것
- 온도/얼음: 약 5°C로 시작하고, 다 마실 때도 얼음이 눈에 보이게 남을 것

## 서빙 모드와 얼음 역할

**Serve mode: ICED · Brew method: Flash · Ice strategy: Split**

| 얼음 | 위치와 시점 | 역할 | 이 레시피에서의 해석 |
|---|---|---|---|
| Brew ice · 110g | 추출 **전**, 빈 Aiden carafe | 약 156g의 뜨거운 추출액을 즉시 급랭 | 65°C 가정에서는 거의 전부 녹는 것이 정상 |
| Serving ice · 20g | 추출 **후**, 이송 직전 315ml 유리잔 | 급랭을 마무리하고 음용 중 얼음을 유지 | 열수지상 약 19g 잔존 예상; 실제 얼음 형태와 온도에 따라 달라짐 |

Paper filter는 이 version의 재현성 통제조건으로 뜨거운 물에 린싱합니다. Aiden 동봉 필터는 제조사 지침상 rinse가 필수는 아니지만 exact filter가 아직 미기록이므로, 이번 version에서는 방식을 바꾸지 않습니다. Aiden 위에서 린싱했다면 carafe에 받은 물을 완전히 버린 뒤 brew ice를 넣습니다. 린스 물은 selected water 190ml나 얼음 130g에 포함하지 않습니다.

## 준비

| 항목 | 값 |
|---|---:|
| 실제 원두 | **17.0g** |
| Aiden brew water | **190ml** |
| Brew ice · carafe | **110g** |
| Serving ice · 315ml glass | **20g** |
| 예상 적재 / headspace | **286g / 29ml** |
| 분쇄도 | Ode Gen 2 Stock Burr · **5⅓** |
| 물 | 제주삼다수 |
| Basket | Single Serve cone |
| Shower selector | **One green dot / Single** |
| Filter | Standard #2 cone · exact product 미기록 |

중요: Aiden에는 scale이 없습니다. 명목 1:14 때문에 기기가 약 13.6g을 안내하더라도 **실제 투입량은 반드시 17.0g**으로 계량합니다.

## Aiden 입력

| 단계 | 설정 |
|---|---|
| Profile name | `SBR Harfusa Ice 315 v2` |
| Nominal ratio | **1:14** |
| Bloom | **1:3 · 45초 · 95°C** |
| Single Serve pulses | **3회 · 23초 간격** |
| Pulse temperatures | **94 → 93 → 92°C** |
| Guided/selected water | **190ml** |

## Harness 계산

| 계산 | 값 | 의미 |
|---|---:|---|
| Machine-assumed dose | 13.6g | 190 ÷ 14; 기기 계산값이지 실제 dose가 아님 |
| 실제 dose 차이 | +25.3% | 실제 17g이 기기 가정보다 큼; 의도한 iced concentrate |
| Actual hot ratio | 1:11.18 | 190 ÷ 17 |
| Total recipe-water ratio | 1:18.82 | (190 + 110 + 20) ÷ 17; 남은 얼음과 grounds retention 포함 |
| Nominal bloom water | 40.7g | 13.57 × 3 |
| Actual bloom ratio | 1:2.39 | 실제 17g 기준; wetting 경고선 1:2 이상 |
| 예상 retained water | 34g | RF 2.0g/g 가정 |
| 예상 hot beverage | 156g | 190 − 34 |
| 예상 cup load | 286g | 156 + 110 + 20 |
| 예상 headspace | 29ml | 315 − 286; 개인 최소 권장 20ml 충족, 실제 잔에서는 검증 필요 |
| 5°C 도달 필요 얼음 | 약 111g | hot beverage 156g, drop 65°C, ice 0°C 가정 |
| 예상 잔존 얼음 | 약 19g | 총 ice 130 − 필요 ice 110.5 |
| 낙하 70°C 민감도 | 약 10g 잔존 | 미교정 drop temperature가 높을 때의 보수 확인 |
| 시작 시 예상 cold liquid | 약 267g · 1:15.68 | 156g coffee + 약 111g 녹은 얼음; 잔존 얼음 제외 |
| 모든 얼음이 결국 녹을 때 | 약 286g · 1:16.82 | 실제 장시간 희석의 상한 근사 |

## Harness check

- ✅ Intake gate complete
- ✅ Research status `sufficient-with-gaps`; 각 주요 setting이 Dossier 근거/가설과 연결됨
- ✅ 190ml: Single Serve cone basket 영역이며 공식 150–450ml 범위 안
- ✅ 물리 shower selector: one green dot / Single — basket과 공식 기본 조합 일치
- ✅ 92–95°C: 현재 ruleset의 Aiden hot-brew 범위 안
- ✅ Pulse count 3과 pulse temperature 3개 일치
- ⚠️ 실제 dose는 machine-assumed dose보다 25.3% 많음 — 화면 안내 대신 17.0g 사용
- ✅ Actual bloom 1:2.39 — 최소 wetting 경고선보다 큼
- ✅ 예상 headspace 29ml — `glass-315` 최소 권장 20ml 충족
- ✅ 65°C 모델에서 약 19g, 70°C 민감도에서도 약 10g ice remaining
- ⚠️ 29ml는 Harness상 `타이트, 실제 검증 필요` 범주의 상단이며 얼음 모양·거품에 따라 체적이 달라짐
- ⚠️ RF, drop temperature, glass 열용량, freezer ice 온도와 형태는 미교정
- ⚠️ 삼다수 alkalinity/KH와 Ode calibration/seasoning 상태가 미기록
- ⚠️ 시작 전 실제 Aiden UI에서 1:14·23초·각 온도·190ml 저장 가능 여부 확인; 현재 기기 UI가 최종 기준

## 실행 순서

1. Single Serve cone filter를 장착하고 paper를 뜨거운 물로 충분히 헹굽니다. Aiden 위에서 린싱했다면 carafe의 물을 **완전히 버리고 carafe를 비웁니다.**
2. Single Serve cone basket을 확인하고 물리 shower selector를 **한 개의 초록 점 / Single**에 맞춥니다.
3. 빈 Aiden carafe에 **brew ice 110g**을 넣고 고르게 펼칩니다.
4. 원두 **17.0g**을 Ode Gen 2 **5⅓**에 분쇄해 cone basket에 평평하게 담습니다.
5. 위 profile과 **190ml**를 선택해 brew합니다. 기기 dose 안내가 13.6g 부근이어도 17.0g을 유지합니다.
6. Drip finish 후 carafe를 **10–15초 부드럽게 swirl**합니다. Brew ice가 거의 또는 전부 녹는 것이 정상입니다.
7. 315ml 유리잔에 **fresh serving ice 20g**을 넣고 carafe의 커피를 전부 붓습니다. 2–3회만 가볍게 섞습니다.
8. 처음과 5분 후를 나누어 맛을 보고, 다 마실 때 얼음 잔존 여부를 기록합니다.

## 이번 버전의 가설

- 가설: Ode 5⅓, actual 1:2.39 bloom, 94→92°C의 완만한 decline이면 1:11.18 hot concentrate에서도 washed Harfusa의 베르가못 clarity와 백도 sweetness를 균형 있게 확보하면서 마르는 오렌지 껍질 떫음을 피할 수 있다.
- 성공 기준: 베르가못과 백도가 5분 후에도 구분되고, drawdown이 normal이며 basket에 standing water가 없고, 혀가 마르지 않으며, 다 마실 때 얼음이 남는다.
- 실패 시 먼저 볼 것: `drawdown/standing water → bitterness+astringency → sharp acidity+thinness → cup load/ice remaining` 순서. 다음 revision은 이 중 첫 조건에 해당하는 primary variable 하나만 바꾼다.

## Setting 근거

| Setting | 선택 이유 | Dossier 근거 | 신뢰도 |
|---|---|---|---|
| 17g / 190ml / ice 110g+20g | 기존 actual 1:11대 농축 비율을 유지하면서 286g cup load, 29ml headspace, 10g 이상의 보수적 ice remaining을 동시에 확보 | Harness 열수지 + 확정된 split geometry | Medium |
| Nominal 1:14 | Machine-assumed 13.6g으로 bloom 40.7g을 만들고 실제 17g concentrate와 분리 | Aiden no-scale 공식 자료 + Harness 계산 | Medium |
| Ode 5⅓ | Fellow의 현재 Single Brew 출발점이며 개인 drawdown 자료가 없는 상태에서 가장 재현 가능한 anchor | Fellow 공식 + Dossier의 상충 자료 | Medium |
| Bloom 1:3 · 45초 · 95°C | roast 9일차 17g bed에 actual 1:2.39 wetting을 만들고 공식 Light 45초를 유지 | Fellow Light profile + roast age | Medium |
| 3 pulses · 23초 | Fellow Single Brew 공식 3×23초를 낮은 dose baseline에 그대로 사용 | Fellow 공식 profile | Medium |
| 94→93→92°C | 공식 99°C flat보다 낮되 concentrate 추출을 위해 지나치게 낮추지 않은 완만한 decline | Aiden 열 유지 관찰 + UC Davis 제약 | Medium-Low |
| Paper filter hot rinse | Exact paper가 미기록이라 이 version의 통제조건으로 유지. Aiden 동봉 filter에는 필수가 아니며 carafe rinse water는 완전 폐기 | Fellow filter FAQ + Aiden recipe guidance | Medium |

## 첫 brew에서 기록할 것

- Recipe와 실제 dose/water/ice가 같았는지
- Exact filter brand/white·brown 여부, 실제 rinse와 one-green-dot selector가 recipe와 같았는지
- Brew 종료 후 `carafe 총 내용물 무게 − 처음 brew ice 110g`; 예상 hot beverage 약 156g
- Carafe swirl 후 transfer 직전 온도와 glass 최종 적재 무게; 예상 약 286g
- Drawdown: fast / normal / slow, basket standing water 여부
- 추출 직후와 5분 후: aroma clarity, acidity, sweetness, bitterness, astringency, body, finish
- 다 마실 때 ice remaining: yes/no, 가능하면 남은 무게

## Changed from previous version

- v1은 `brew_ready: false`인 Research Hold 기록이라 실제 시음값을 바꾸는 sensory revision이 아닙니다. v2는 intake gate를 완료하고 실행 불가능한 serving geometry를 바로잡은 **gate-completion baseline / serving-geometry correction**입니다.
- Split-ice Flash brew, 균형형 향미 목표, 제주삼다수, 최소 20ml headspace 조건을 확정했습니다.
- 20g/225ml/110g total ice를 17g/190ml/130g total ice로 재설계해 예상 headspace를 20→29ml, ice remaining을 0g 미만 가능성→약 19g으로 바꿨습니다.
- 근거가 약했던 Ode 4⅓을 현재 공식 Single Brew anchor 5⅓으로, bloom/pulse를 현재 공식 baseline과 500ml Candidate의 적용 조건에 맞춰 재설정했습니다.
- 다음 실제 brew부터는 한 번에 primary variable 하나만 변경합니다.

## Brew logs

- 없음
