---
type: recipe
status: candidate
storage: candidate
bean: ../../beans/ethiopia-harfusa.md
research_dossier: ../../research/2026-08-23-harfusa.md
research_status: sufficient-with-gaps
brew_ready: false
lineage: harfusa-flash-315
version: 1
parent: null
accepted_at: null
acceptance_note: null
similar_recipes: []
created: 2026-08-23
beverage_style: flash
serve_mode: iced
brew_method: flash
cup_id: glass-315
cup_capacity_ml: 315
dose_g: 20
brew_water_g: 225
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
    grams: 20
    vessel: glass-315
    timing: before_transfer
    purpose: keep_cold
prep_steps:
  - id: do_not_brew
    phase: hold
    label: "추출 보류"
    instruction: "이 버전은 Research Hold다. 얼음이 남지 않을 가능성이 있으므로 추출 카드로 사용하지 않는다."
    critical: true
profile_name: "Harfusa Ice 315 v1"
profile_temperature_c: 96
nominal_ratio: 14
cold_brew_enabled: false
grinder: "Fellow Ode Gen 2 · Stock Burr"
grind_setting: "4⅓"
bloom_enabled: true
bloom_ratio: 3
bloom_seconds: 50
bloom_temp_c: 96
single_serve_pulses_enabled: true
pulse_count: 3
pulse_interval_seconds: 20
pulse_temps_c: [96, 95, 94]
batch_pulses_enabled: true
batch_pulse_count: 1
batch_pulse_interval_seconds: 30
batch_pulse_temps_c: [96]
retention_factor: 2.0
drop_temp_c: 65
target_temp_c: 5
---

# Harfusa · 315ml Flash brew · v1

상태: **Candidate · Research Hold — 사용자 채택 전 / 추출 금지**

이 버전은 새 Research gate 이전에 만든 provisional 숫자를 보존한 기록입니다. 현재 기준에서는 `brew_ready: false`이며, 아래 숫자를 권장 레시피로 사용하지 않습니다.

## 요청 충분성

- Decision-critical 정보: **부분 완료**
- 확인됨: 원두명, process, roast level, tasting notes, 315ml 잔, 아이스, 얼음 잔존 목표
- 아직 확인할 것:
  - 얼음을 carafe와 음용 컵 양쪽에 나눠 넣는 방식이 맞는지
  - clarity와 sweetness 중 우선순위
  - 사용 물과 roast date는 선택정보지만 첫 log에 기록 권장

이 파일은 기존 예시를 보존한 Candidate입니다. 위 두 decision-critical 질문에 답하기 전에는 추출하거나 Accepted로 승격하지 않습니다. 답변 후 이 파일을 덮어쓰지 않고 v2를 만듭니다.

## Research Dossier

- Dossier: [Harfusa · 315ml Flash brew](../../research/2026-08-23-harfusa.md)
- Research status: `sufficient-with-gaps`
- Intake status: `incomplete`
- Gate 판정: **numeric recipe not allowed / brew_ready false**
- 핵심 이유: 기존 `4⅓`은 Fellow의 현재 Single Brew anchor `5⅓`보다 곱지만 개인 drawdown 근거가 없고, 총 얼음 110g은 자체 열수지에서도 얼음 잔존 목표를 충족하지 못할 가능성이 큼

## 참고한 유사 recipe

| 참고 recipe | 유사한 점 | 참고한 원칙 | 그대로 복사하지 않은 이유 |
|---|---|---|---|
| 직접적으로 유사한 Accepted Recipe 없음 | — | Aiden 공식 범위와 washed Ethiopia 출발 가설 사용 | 개인 Accepted 이력이 아직 없음 |

## 목표

- 베르가못의 향과 백도의 단맛을 선명하게 표현
- 기분 좋은 오렌지필은 남기되 마르는 껍질 쓴맛은 피하기
- 315ml 유리잔에서 차갑게 마시며 끝까지 얼음이 남기

## 서빙 모드와 얼음 역할

**Serve mode: ICED · Brew method: Flash · Research Hold**

- `brew ice 90g`: 추출 전에 carafe에 넣어 뜨거운 추출액을 급랭할 계획이었던 얼음
- `serving ice 20g`: 이송 직전 음용 컵에 새로 넣어 차가움을 유지할 계획이었던 얼음
- 현재 열수지에서는 두 얼음을 합쳐도 끝까지 남지 않을 가능성이 높아 실행 절차로 승인하지 않음

## 준비

| 항목 | 값 |
|---|---:|
| 실제 원두 | 20g |
| Aiden brew water | 225ml |
| Brew ice | 90g |
| Serving ice | 20g |
| 컵 | 315ml 유리잔 |
| 분쇄도 | Ode Gen 2, 4⅓ 시작점 |
| 물 | 미기록 — 반드시 log에 기록 |

## Aiden 입력

| 단계 | 설정 |
|---|---|
| Nominal ratio | 1:14 |
| Bloom | 1:3 · 50초 · 96°C |
| Single Serve pulses | 3회 · 20초 간격 |
| Pulse temperatures | 96 → 95 → 94°C |

## Harness 계산

| 계산 | 값 | 의미 |
|---|---:|---|
| Machine-assumed dose | 16.1g | Aiden이 내부 계산에 사용하는 dose |
| 실제 dose 차이 | +24.4% | 실제 20g이 기기 가정보다 많음 |
| Actual hot ratio | 1:11.25 | 225 ÷ 20 |
| Total recipe-water ratio | 1:16.75 | (225 + 90 + 20) ÷ 20 |
| Nominal bloom water | 48.2g | 16.1 × 3 |
| Actual bloom ratio | 1:2.41 | 실제 20g 기준 |
| 예상 retained water | 40g | RF 2.0 가정 |
| 예상 hot beverage | 185g | 225 − 40 |
| 예상 cup load | 295g | 185 + 90 + 20 |
| 예상 headspace | 20ml | 315 − 295; 타이트 |
| 5°C 도달 필요 얼음 | 약 131g | 낙하 65°C 가정 |
| 투입 얼음 | 110g | 열수지상 모두 녹을 가능성 |

## Harness check

- ❌ Intake gate incomplete
- ✅ Research coverage sufficient-with-gaps
- ❌ Brew gate blocked
- ✅ 225ml: Single Serve cone basket 영역
- ✅ 온도 94–96°C: 공식 hot-brew 범위 안
- ✅ Pulse count와 온도 개수 일치
- ⚠️ 실제 dose가 machine-assumed dose보다 24.4% 많음
- ⚠️ 명목 bloom 1:3이 실제로는 약 1:2.41
- ⚠️ 예상 headspace 20ml로, 315ml 잔에서 타이트
- ⚠️ 열수지 근사상 얼음이 끝까지 남지 않을 가능성
- ⚠️ 로스팅 날짜, 물, grinder calibration 미기록

## 실행 보류

이 v1은 추출 카드가 아닙니다. 얼음 위치/split과 clarity-vs-sweetness 우선순위를 확인한 뒤, Research Dossier를 근거로 v2 Candidate를 새로 생성합니다.

## 이번 버전의 가설

- Declining temperature는 Aiden의 열 유지에 대응하는 가설이지만, strength와 extraction을 함께 보지 않고 향미 효과를 단정할 수 없다.
- `4⅓`은 현재 공식 anchor와 개인 데이터로 방어되지 않으므로 baseline으로 채택하지 않는다.
- 얼음 잔존 목표는 현재 계산과 충돌하므로 serving geometry부터 다시 설계해야 한다.

성공 기준:

- 베르가못과 백도가 식은 뒤에도 구분됨
- 오렌지필이 향긋하고 혀를 마르게 하지 않음
- Drawdown이 normal이고 basket에 물이 남지 않음
- 컵이 넘치지 않고, 다 마실 때 얼음이 남음

## Changed from previous version

- v1 Candidate baseline이므로 해당 없음.

## Brew logs

- 아직 없음
