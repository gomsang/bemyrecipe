# Personal Brew Profile

마지막 갱신: 2026-08-24

## 음용 취향

- 주 음용 방식: 아이스 / Flash brew
- 핵심 목표: 차갑게 마시되 마시는 동안 얼음이 남아 있을 것
- 선호 방향: 향의 선명도, 과일의 단맛, 깨끗한 finish
- 회피 방향: 마르는 떫음, 거친 껍질 쓴맛, 향이 뭉개지는 과다 추출
- 개선 방식: 한 번에 한 변수만 변경

## 장비

- Brewer: Fellow Aiden Precision Coffee Maker
- Grinder: Fellow Ode Gen 2
- Burr: Stock Gen 2 Brew Burrs
- Grinder calibration: 미기록 — 다른 사용자의 숫자는 참고값으로만 사용
- Aiden firmware: 1.5.9로 마지막 확인(2026-08-23); 현재 기기 UI가 최종 기준
- Aiden water units: `metric_precise` 사용 — 사용자가 2026-08-24에 Precise Units 활성화 결정
- 기본 cup 표시에서는 150ml 다음이 225ml이며, 정밀 물양 레시피는 `Settings → Units → Precise Units`를 전제로 함

## 음용 컵

| ID | 이름 | 용량 | 용도 | 최소 권장 headspace |
|---|---|---:|---|---:|
| `glass-315` | 315ml 유리잔 | 315ml | 주력 아이스 | 20ml |
| `glass-420` | 420ml 유리잔 | 420ml | 여유 있는 아이스 | 25ml |
| `tumbler-500` | 500ml 텀블러 | 500ml | 이동용 | 30ml |

컵 용량 계산에서 물과 음료는 우선 `1g ≈ 1ml`로 근사합니다. 얼음 모양, 거품, 붓는 속도 때문에 실제 넘침은 달라질 수 있습니다.

## 물

- 현재 물: 제주삼다수
- 공개 무기물 범위: Ca 2.5–4.0mg/L, Mg 1.7–3.5mg/L
- Ca/Mg만 CaCO₃ equivalent로 환산한 추정 경도: 약 13–24mg/L — 실제 bottle 측정값이 아님
- 아직 기록할 항목: KH/alkalinity, TDS, 실제 bottle/lot
- 물이 바뀐 추출은 같은 레시피의 단순 재현으로 간주하지 말고 로그에 반드시 기록

## 개인 보정값

| 항목 | 현재값 | 신뢰도 | 보정 방법 |
|---|---:|---|---|
| 원두 수분 보유량 | 원두 1g당 물 2.0g | 낮음 | `brewWaterG - finalHotBeverageG`로 역산 |
| Flash brew 낙하 온도 | 65°C | 매우 낮음 | 얼음에 닿기 직전 온도 3회 측정 후 평균 |
| 목표 음용 온도 | 5°C | 가정 | 실제 선호에 따라 수정 |
| 목표 잔존 얼음 | 최소 10g | 가정 | 마실 때 만족도를 함께 기록 |

## 아직 필요한 교정

- Ode Gen 2 영점과 burr seasoning 상태
- 현재 사용하는 물
- 225ml 추출 시 실제 hot beverage output
- Flash brew 낙하 온도
- 315ml 잔에서 편안하게 마실 수 있는 실사용 최대 적재량
