---
type: research-dossier
bean: ../beans/sbr-ethiopia-harfusa.md
recipe_lineage: "sbr-harfusa-flash-315 / sbr-harfusa-flash-500"
status: sufficient-with-gaps
searched_at: 2026-08-24
latest_official_check: 2026-08-24
prepared_for: "Flash brew · serving ice allocation correction · 315ml / 500ml"
coverage:
  aiden_official: true
  ode_gen2: inherited
  extraction_science: true
  expert_barista: true
  aiden_community: inherited
  bean_specific: inherited
  internal_recipes: true
  drink_guide_story: true
---

# Flash brew · Serving ice 역할 재배분 조사

## 조사 질문

- 총 얼음량이 충분하더라도 음용 컵의 Serving ice가 20–80g뿐이라면 “마시는 동안 얼음이 남는 한 잔”으로 볼 수 있는가?
- Brew ice와 Serving ice를 따로 쓰는 레시피에서 카라페와 음용 컵을 하나의 열평형으로 계산해도 되는가?
- 기존 농도와 추출값을 건드리지 않고 315ml와 500ml의 서비스 경험을 바로잡을 수 있는가?

## 요청 조건과 새 관찰

| 항목 | 값 | 출처/확실성 |
|---|---|---|
| 315ml 현재안 | Brew 120g + Serving 22g | v3 Markdown · High |
| 500ml 현재안 | Brew 150g + Serving 80g | v1 Markdown · High |
| 사용자의 500ml 경험 | 손드립 때 음용 텀블러에 150g 이상 사용 | 사용자 경험 · High |
| 개인 목표 | 마시는 동안 잔 안에 얼음이 눈에 보이게 남고 계속 차가울 것 | `PROFILE.md` + 이번 피드백 · High |

## Evidence matrix

| Claim | 분류 | Source | Source 조건 | 현재 요청 적용성 | 신뢰도 |
|---|---|---|---|---|---|
| Fellow의 아이스 푸어오버는 20g coffee, 160g hot water, 180g ice를 사용한다. | Evidence | [Fellow · How To Brew Iced Coffee At Home With Your Pour-Over](https://fellowproducts.com/blogs/brew-guides/how-to-brew-iced-coffee-at-home) | 수동 Stagg dripper, carafe ice | 얼음 150g대가 비정상적으로 많지 않다는 방향 근거. Aiden 숫자로 직접 이식하지 않음 | High |
| 같은 Fellow 가이드는 concentrate를 먼저 몇 개의 얼음으로 식힌 뒤, 한 잔 이상의 fresh ice 위에 나누어 붓는 방식도 제안한다. | Evidence | [Fellow · Iced Coffee Recipe](https://fellowproducts.com/blogs/brew-guides/how-to-brew-iced-coffee-at-home) | 수동 filter, carafe와 serving cup 분리 | Brew ice와 Serving ice의 역할 분리에 직접 적용 | High |
| Flash-chill에서는 카라페의 얼음 무게만큼 hot brew water를 줄여 최종 물수지를 맞출 수 있다. | Evidence | [Fellow · Pour-Over Coffee FAQ](https://fellowproducts.com/blogs/brew-guides/how-to-make-pour-over-coffee-a-beginners-guide) | 수동 pour-over | 총 recipe water를 고정한 재배분 논리에 부분 적용 | High |
| 얼음과 물의 열수지는 액체 물의 비열과 얼음의 융해열을 분리해 계산해야 한다. | Evidence | [NIST · Properties of Ice and Supercooled Water](https://www.nist.gov/publications/properties-ice-and-supercooled-water) | 물/얼음 물성 | 0°C 상변화 모델의 물성 근거 | High |
| 카라페에 고체로 남은 Brew ice는 자동으로 음용 컵의 잔존 얼음이 되지 않는다. | Inference | 준비 순서 + 두 용기 분리 | carafe swirl 뒤 액체를 serving ice 위로 이송 | 현재 실행 순서에 직접 적용 | High |
| 총 얼음량이 같고 Brew ice가 모두 녹는 이상 모델에서는 최종 희석과 잔존 얼음 총량이 같아도, 처음 음용 컵에 놓이는 얼음량과 이송 온도는 달라진다. | Inference | NIST 물성 + 두 단계 계산 | 용기/공기 열손실 없음, ice 0°C | 이번 재배분의 핵심. 실제값은 측정 필요 | Medium |
| 22g 또는 80g이 수학상 남을 수 있어도 사용자가 기대하는 얼음 채움과 장시간 보냉 경험에는 부족하다. | Evidence / personal preference | 이번 사용자 피드백 | 개인 컵과 음용 습관 | 개인화 기준으로 직접 적용 | High |

## 충돌과 결정

| 충돌 | 선택 | 이유 | 틀렸을 때 관찰될 것 |
|---|---|---|---|
| Brew ice가 많을수록 카라페에서 더 차갑게 이송되지만 Serving ice가 너무 적어 보인다. | 총 얼음량은 유지하고 Serving ice 쪽으로 이동 | 농도·장시간 희석 상한·추출 profile을 그대로 두면서 서비스 경험만 바꿀 수 있다. | 이송 직후 얼음이 지나치게 빨리 줄거나 향이 급격히 닫힘 |
| 단일 평형은 총 잔존량을 간단히 보여 주지만 얼음 위치를 잃는다. | 카라페 냉각과 serving cup 냉각을 순서대로 계산 | 실제 준비 순서와 맞고, 카라페 잔존 얼음을 손님 잔의 얼음으로 오인하지 않는다. | 측정한 이송 온도와 모델의 차이가 반복됨 |
| 보편적인 “적정 채움” 수치는 없다. | 컵별 최소 Serving ice를 개인 기준으로 저장 | 315ml 50g은 잠정값, 500ml 150g은 사용자의 경험값으로 출처가 다름을 보존한다. | 실제 음용에서 과도한 희석 또는 여전히 부족한 얼음 체감 |

## Setting rationale

| Recipe | Governing change | 새 배분 | 65°C / 70°C 이송 온도 | 음용 컵 예상 잔존 얼음 | 판단 |
|---|---|---:|---:|---:|---|
| 315ml v4 | `ice_role_split` | Brew 90g + Serving 52g | 10.3°C / 13.4°C | 21.3g / 12.0g | 총 142g 유지, Serving ice 50g 잠정 하한 통과 |
| 500ml v2 | `ice_role_split` | Brew 80g + Serving 150g | 27.7°C / 31.4°C | 42.4g / 27.9g | 총 230g 유지, 사용자 경험 150g 하한 통과 |

## 모델 경계와 측정

- 얼음은 0°C, 용기와 공기로 빠지는 열은 0으로 둔 보수 근사다.
- Brew ice가 고체로 남으면 카라페에 남는 것으로 계산한다. 실제로 조각이 잔에 함께 들어갔다면 별도 기록한다.
- 500ml v2의 이송 액체는 모델상 27–31°C다. Serving ice 150g 위에 **즉시** 전부 붓고 가볍게 섞는 순서가 필수다.
- 실제로는 냉동고 얼음이 0°C보다 낮고 카라페가 열을 흡수하므로 잔존량이 달라질 수 있다.
- 첫 brew에서 이송 직전 온도, Serving ice 투입량, 5분 뒤와 마지막 잔존 얼음 무게를 기록한다.

## Drink Guide 적용

- 손님용 가이드에는 “사용자가 확인”, “봉투에서 직접 확인”처럼 조사 과정을 드러내는 문장을 쓰지 않는다.
- 커피의 이름, 산지, 고도, 가공, 로스터와 로스팅 날짜는 자연스러운 사실 문장으로 소개한다.
- 정보가 공개되지 않은 부분은 편집 노트와 더 읽어보기에서 정직하게 경계를 남기되, 본문의 흐름을 끊는 검증 보고서 어투는 피한다.

## Gate 판정

- Research status: **sufficient-with-gaps** — 이번 revision에 필요한 ice-role 근거와 물리 모델을 확인함
- Intake status: **complete**
- Numeric revision allowed: **yes**
- Primary variable: **ice_role_split**
- 다음 행동: v4/v2를 각각 추출해 서비스 아이스 체감과 이송 온도를 측정
