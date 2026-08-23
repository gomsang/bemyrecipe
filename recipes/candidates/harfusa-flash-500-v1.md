---
type: recipe
status: candidate
storage: candidate
bean: ../../beans/ethiopia-harfusa.md
research_dossier: ../../research/2026-08-23-harfusa-tumbler-500.md
research_status: sufficient-with-gaps
brew_ready: true
lineage: harfusa-flash-500
version: 1
revision:
  kind: baseline
  parent: null
  primary_variable: null
  summary: "500ml 텀블러용 split-ice baseline"
  rationale: "Harfusa의 향미 선명도와 백도 단맛을 유지하면서 음용 중 얼음이 남는 첫 실행 기준을 만든다."
  changes: []
  success_criteria:
    - "5분 후에도 베르가못과 백도가 구분됨"
    - "다 마실 때 serving ice가 남음"
    - "500ml 텀블러에 충분한 headspace가 확보됨"
accepted_at: null
acceptance_note: null
similar_recipes:
  - harfusa-flash-315-v1.md
created: 2026-08-23
ruleset_version: 1
control_conditions:
  basket: single_serve
  grinder_burr: ode-gen2-stock
  water: samdasoo
  vessel: tumbler-500
  ice_goal: remain_while_drinking
rule_exceptions: []
rule_extension_requests: []
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
    grams: 150
    vessel: carafe
    timing: before_brew
    purpose: flash_chill
  serving_ice:
    grams: 80
    vessel: tumbler-500
    timing: before_transfer
    purpose: keep_cold
prep_steps:
  - id: rinse_filter
    phase: before_brew
    label: "필터 린싱"
    instruction: "Cone paper filter를 뜨거운 물로 충분히 적신다. Aiden 위에서 린싱했다면 carafe의 린스 물을 완전히 버리고 carafe를 비운다."
    critical: true
  - id: add_brew_ice
    phase: before_brew
    label: "Brew ice 150g"
    instruction: "빈 carafe에 brew ice 150g을 넣어 고르게 펼친 뒤 Aiden에 장착한다. 이 얼음은 추출액을 즉시 식히는 recipe water다."
    critical: true
  - id: dose_and_brew
    phase: before_brew
    label: "25.0g 계량"
    instruction: "Ode Gen 2 5⅓로 분쇄한 25.0g을 평평하게 담는다. Aiden의 약 20g 안내 대신 실제 25.0g을 사용하고 selected water 280ml로 시작한다."
    critical: true
  - id: wait_for_finish
    phase: after_brew
    label: "Drip finish 대기"
    instruction: "완료 차임과 drip finish가 끝날 때까지 carafe를 빼지 않는다. 끝난 뒤 10–15초 부드럽게 swirl해 농도와 온도를 맞춘다."
    critical: true
  - id: add_serving_ice
    phase: after_brew
    label: "Serving ice 80g"
    instruction: "500ml tumbler에 fresh serving ice 80g을 새로 넣는다. 이 얼음은 급랭용이 아니라 마시는 동안 차가움과 잔존 얼음을 유지한다."
    critical: true
  - id: transfer
    phase: serve
    label: "즉시 이송"
    instruction: "Swirl한 커피를 serving ice 위로 전부 붓고 2–3회만 가볍게 섞는다. 처음과 5분 뒤, 다 마신 뒤를 기록한다."
    critical: false
profile_name: "Harfusa Ice 500 v1"
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
---

# Harfusa · 500ml Tumbler Flash brew · v1

상태: **Candidate — 사용자 채택 전 / brew ready**

Research/Brew gate: **sufficient-with-gaps / brew_ready: true**

## 요청 충분성

- Decision-critical 정보: **complete**
- 원두: Ethiopia Yirgacheffe Harfusa Washed G1 · Medium–Light · roast 2026-08-14
- 서빙: 500ml tumbler · carafe ice와 fresh serving ice 모두 사용 · 30ml 이상 headspace · 마시는 동안 얼음 잔존
- 맛: 사용자가 clarity/sweetness 우선순위를 아직 정하지 않았으므로 베르가못의 선명도와 백도의 단맛을 균형 있게 보는 baseline
- 물: 제주삼다수

## 규칙 평가

- Ruleset: **v1**
- Hard constraints: **pass** — ICED/FLASH, split ice, rinse-water 폐기, ordered prep가 일치함
- Advisory review: **없음**
- Rule exception: **없음**
- System change proposal: **없음**. 향후 얼음 형태·냉동고 온도처럼 결과를 설명하는 새 통제조건이 생기면 recipe에 보존하고 ruleset/UI 확장을 제안함

## Research Dossier

- Dossier: [Harfusa · 500ml Tumbler Flash brew](../../research/2026-08-23-harfusa-tumbler-500.md)
- Research status: `sufficient-with-gaps`
- 조사 시점: 2026-08-23
- 핵심 충돌: 공식 Light 99°C와 더 낮은 declining profile, Ode 3–7대의 상충 보고, hot-water extraction과 ice remaining의 충돌
- Gate 판정: intake complete이며 모든 조사 축을 다뤘고, exact roaster·water alkalinity·개인 열 보정값의 gap을 첫 brew 측정으로 넘길 수 있어 numeric Candidate 허용

## 참고한 유사 recipe

| 참고 recipe | 유사한 점 | 참고한 원칙 | 그대로 복사하지 않은 이유 |
|---|---|---|---|
| [Harfusa · 315ml Flash v1 Research Hold](harfusa-flash-315-v1.md) | 같은 원두·장비·iced 목표 | Brew ice와 serving ice를 분리하고 열수지·headspace를 먼저 검증 | 315ml용 20g/225ml/110g ice는 자체 계산에서 얼음 잔존에 실패했고 4⅓도 개인 근거가 없음 |
| 직접적으로 유사한 Accepted Recipe 없음 | — | 공식·유사 원두·개인 측정을 순서대로 적용 | 아직 Accepted Recipe와 brew log가 없음 |

## 목표

- 향미: 차가워진 뒤에도 베르가못과 백도가 구분되고, 오렌지필은 향긋하되 거칠지 않을 것
- 농도/질감: 첫 모금은 선명하지만 물처럼 얇지 않고, 얼음이 더 녹은 후에도 과도하게 밋밋하지 않을 것
- 온도/얼음: 약 5°C로 시작하고, 텀블러에 fresh ice가 눈에 보이게 남을 것

## 서빙 모드와 얼음 역할

**Serve mode: ICED · Brew method: Flash**

| 얼음 | 위치와 시점 | 역할 | 이 레시피에서의 해석 |
|---|---|---|---|
| Brew ice · 150g | 추출 **전**, 빈 Aiden carafe | 뜨거운 추출액을 즉시 급랭하고 최종 농도를 만드는 recipe water | 상당 부분 녹는 것이 정상이며, 끝까지 남기기 위한 얼음이 아님 |
| Serving ice · 80g | 추출 **후**, 이송 직전 500ml tumbler | 이미 차가워진 커피의 온도를 유지하고 음용 중 얼음을 남김 | carafe에 처음부터 합쳐 넣지 않고 fresh ice로 별도 계량 |

Paper filter는 뜨거운 물로 린싱합니다. Fellow의 Aiden 레시피 안내처럼 기기 위에서 린싱했다면 carafe에 받은 물을 완전히 버린 뒤 brew ice를 넣습니다. 린스 물은 Aiden selected water 280ml나 얼음 230g에 포함하지 않습니다.

## 준비

| 항목 | 값 |
|---|---:|
| 실제 원두 | **25.0g** |
| Aiden brew water | **280ml** |
| Brew ice · carafe | **150g** |
| Serving ice · tumbler | **80g** |
| 컵 | 500ml tumbler |
| 예상 적재 / headspace | 460g / 40ml |
| 분쇄도 | Ode Gen 2 Stock Burr · **5⅓** |
| 물 | 제주삼다수 |
| Basket | Single Serve cone |

중요: Aiden에는 scale이 없습니다. 명목 1:14 때문에 기기가 약 20g을 안내하더라도 **실제 투입량은 반드시 25.0g**으로 계량합니다.

## Aiden 입력

| 단계 | 설정 |
|---|---|
| Profile name | `Harfusa Ice 500 v1` |
| Nominal ratio | **1:14** |
| Bloom | **1:3 · 45초 · 95°C** |
| Single Serve pulses | **3회 · 28초 간격** |
| Pulse temperatures | **94 → 93 → 92°C** |
| Guided/selected water | **280ml** |

## Harness 계산

| 계산 | 값 | 의미 |
|---|---:|---|
| Machine-assumed dose | 20.0g | 280 ÷ 14; 기기 계산값이지 실제 dose가 아님 |
| 실제 dose 차이 | +25.0% | 실제 25g이 기기 가정보다 큼; 의도한 iced concentrate |
| Actual hot ratio | 1:11.20 | 280 ÷ 25 |
| Total recipe-water ratio | 1:20.40 | (280 + 150 + 80) ÷ 25; 남은 얼음과 grounds retention 포함 |
| Nominal bloom water | 60.0g | 20 × 3 |
| Actual bloom ratio | 1:2.40 | 실제 25g 기준; wetting 경고선 1:2 이상 |
| 예상 retained water | 50g | RF 2.0g/g 가정 |
| 예상 hot beverage | 230g | 280 − 50 |
| 예상 cup load | 460g | 230 + 150 + 80 |
| 예상 headspace | 40ml | 500 − 460; 개인 권장 30ml 충족 |
| 5°C 도달 필요 얼음 | 약 163g | hot beverage 230g, drop 65°C, ice 0°C 가정 |
| 예상 잔존 얼음 | 약 67g | 총 ice 230 − 필요 ice 163 |
| 시작 시 예상 cold liquid | 약 393g · 1:15.72 | 230g coffee + 약 163g 녹은 얼음; 잔존 얼음 제외 |
| 모든 얼음이 결국 녹을 때 | 약 460g · 1:18.40 | 실제 장시간 희석의 상한 근사 |

## Harness check

- ✅ Intake gate complete
- ✅ Research status `sufficient-with-gaps`; 각 주요 setting이 Dossier 근거/가설과 연결됨
- ✅ 280ml: Single Serve cone 영역이며 공식 450ml cap 아래
- ✅ 92–95°C: 현재 알려진 Aiden hot-brew 범위 안
- ✅ Pulse count 3과 pulse temperature 3개 일치
- ⚠️ 실제 dose는 machine-assumed dose보다 25% 많음 — 화면 안내 대신 25.0g 사용
- ✅ Actual bloom 1:2.40 — 최소 wetting 경고선보다 큼
- ✅ 예상 headspace 40ml — `tumbler-500` 최소 권장 30ml 충족
- ✅ 0°C 보수 모델에서도 약 67g ice remaining
- ⚠️ RF, drop temperature, 텀블러 열용량, freezer ice 온도는 미교정
- ⚠️ 삼다수 Ca/Mg는 낮은 범위지만 alkalinity/KH가 없어 산미 효과를 단정하지 않음
- ⚠️ 시작 전 실제 Aiden UI에서 ratio·28초·각 온도 저장 가능 여부 확인; UI가 최종 기준

## 실행 순서

1. Single Serve cone filter를 장착하고 paper를 뜨거운 물로 충분히 헹굽니다. Aiden 위에서 린싱했다면 carafe의 물을 **완전히 버리고 carafe를 비웁니다.**
2. 빈 Aiden carafe에 **brew ice 150g**을 넣고, carafe를 가볍게 흔들어 얼음을 고르게 펼칩니다. 이 얼음은 급랭과 희석을 담당합니다.
3. 원두 **25.0g**을 Ode Gen 2 **5⅓**에 분쇄해 cone basket에 평평하게 담습니다.
4. 위 profile과 **280ml**를 선택해 brew합니다. 기기 dose 안내가 20g 부근이어도 25g을 유지합니다.
5. Drip finish 후 carafe를 **10–15초 부드럽게 swirl**해 층과 온도를 균일하게 합니다. Brew ice가 거의 녹는 것이 예상되며, 작은 조각이 남아도 정상입니다.
6. 500ml tumbler에 **fresh serving ice 80g**을 새로 넣고 carafe의 커피를 전부 붓습니다. 이 얼음은 음용 중 차가움과 잔존 얼음을 담당합니다. 세게 젓지 말고 2–3회만 가볍게 섞습니다.
7. 처음과 5분 후를 나누어 맛을 보고, 다 마실 때 얼음 잔존 여부를 기록합니다.

## 이번 버전의 가설

- 가설: 공식 anchor와 유사 bean 범위가 겹치는 Ode 5⅓, 실제 1:2.4 bloom, 완만한 95→92°C decline이면 1:11.2 hot concentrate에서도 washed Ethiopia의 향을 확보하면서 거친 오렌지 껍질 떫음을 억제할 수 있다.
- 성공 기준: 베르가못과 백도가 5분 후에도 구분되고, drawdown이 normal이며 basket에 standing water가 없고, 혀가 마르지 않으며, 다 마실 때 얼음이 남는다.
- 실패 시 먼저 볼 것: `drawdown/standing water → bitterness+astringency → sharp acidity+thinness → cup load/ice remaining` 순서. Revision은 이 중 첫 조건에 해당하는 primary variable 하나만 바꾼다.

## Setting 근거

| Setting | 선택 이유 | Dossier 근거 | 신뢰도 |
|---|---|---|---|
| 25g / 280ml / ice 150g+80g | 460g cup load, 40ml headspace, 보수 모델 67g ice remaining | 열수지 + 사용자 승인 geometry | Medium |
| Nominal 1:14 | Machine-assumed 20g으로 bloom 60g을 만들고 실제 25g concentrate와 분리 | Aiden no-scale 공식 자료 + Harness 계산 | Medium |
| Ode 5⅓ | 공식 Single Brew 시작점이며 유사 Medium–Light washed Ethiopia 4–5⅓의 굵은 끝 | Fellow 공식 + 유사 bean | Medium |
| Bloom 1:3 · 45s · 95°C | 9일차 25g bed에 actual 1:2.4 wetting, 공식 Light 45초를 보수적으로 채택 | Fellow profiles + roast age | Medium |
| 3 pulses · 28s | 공식 3×23초에서 high-dose/fines overflow 지침의 +5초 적용 | Fellow overflow guide | Medium |
| 94→93→92°C | 99°C flat보다 낮되 concentrate 추출을 위해 지나치게 낮추지 않은 decline | Aiden 측정 리뷰 + UC Davis 제약 | Medium-Low |
| Paper filter hot rinse | 종이 향을 줄이고 basket을 준비하되, 린스 물은 recipe water와 분리 | [Fellow Aiden recipe guidance](https://fellowproducts.com/blogs/brew-talks/fellows-take-on-brandywine-felloween-iv-brew-recipe) | High |

## 첫 brew에서 기록할 것

- Recipe와 실제 dose/water/ice가 같았는지
- Brew 종료 후 `carafe 총 내용물 무게 − 처음 brew ice 150g`; 예상 hot beverage 약 230g
- Carafe swirl 후 transfer 직전 온도와 텀블러 최종 적재 무게; 예상 약 460g
- Drawdown: fast / normal / slow, basket standing water 여부
- 추출 직후와 5분 후: aroma clarity, acidity, sweetness, bitterness, astringency, body, finish
- 다 마실 때 ice remaining: yes/no, 가능하면 남은 무게

## Changed from previous version

- v1은 500ml tumbler의 새 baseline이므로 parent revision은 없습니다.
- 315ml v1은 다른 serving lineage의 Research Hold이며 이 버전의 parent가 아닙니다.

## Brew logs

- 없음
