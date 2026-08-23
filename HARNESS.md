# Aiden Recipe Harness

이 문서는 모든 레시피 생성·검증·시음·개선의 기준입니다. 목표는 “그럴듯한 숫자”가 아니라, 개인 장비와 취향에서 재현 가능하게 더 맛있는 다음 잔을 만드는 것입니다.

## 1. 데이터 계층

1. `PROFILE.md`: 사용자·장비·컵·개인 보정값
2. `beans/*.md`: 원두의 사실, 출처, 가정
3. `recipes/candidates/*.md`: 아직 채택되지 않은 제안·실험 버전
4. `recipes/accepted/*.md`: 사용자가 명시적으로 채택한 버전
5. `logs/*.md`: 실제 추출 결과
6. `research/*.md`: 원두별 Research Dossier와 근거 합성
7. `INDEX.md`: 최신 상태와 링크

과거 recipe와 log는 수정해 역사를 지우지 않습니다. 잘못 기록한 사실을 바로잡을 때만 수정하고 변경 이유를 남깁니다.

## 1.1 Recipe 상태 흐름

```text
정보 확인 → Research Dossier → 유사 recipe 참고 → Candidate → Brew/log/revision → User acceptance → Accepted
```

- 모든 새 recipe와 revision은 Candidate로 시작합니다.
- 계산 통과, 좋은 시음 점수, Codex 판단은 acceptance가 아닙니다.
- 사용자만 명시적으로 accept할 수 있습니다.
- Accepted recipe의 개선안도 새 Candidate입니다.
- Accepted가 교체되어도 이전 파일은 `superseded` 상태로 보존합니다.

### Lineage 판정

- bean, serve mode, brew method, beverage style, cup, basket, vessel, ice goal이 같고 추출 설정만 바뀌면 기존 lineage의 다음 version입니다.
- 새 version은 직전 version을 `revision.parent`로 가리키고 `revision.primary_variable` 하나를 명시합니다.
- `revision.summary`, `rationale`, `changes`, `success_criteria`는 frontmatter에 저장합니다. 본문의 변경 설명만으로 대체하지 않습니다.
- 위 identity가 달라지면 새 lineage입니다. 같은 identity와 control conditions를 이름만 바꿔 새 lineage로 복제하지 않습니다.
- `brew_ready: true`는 intake와 research gate가 모두 통과했다는 뜻이며, acceptance와는 무관합니다.

## 1.2 유사 recipe 참고 규칙

비슷함은 다음 순서로 판단합니다.

1. 음용 방식과 basket 영역
2. 컵 용량과 얼음 배치
3. roast level과 실제 용해도 기록
4. process
5. origin/variety/altitude
6. dose와 grinder/burr
7. 사용자가 원하는 향미

Accepted recipe를 먼저 참고합니다. 다만 같은 나라나 같은 roast라는 이유만으로 숫자를 복사하지 않습니다. 새 recipe에는 반드시 다음을 기록합니다.

- 참고한 recipe 링크
- 가져온 원칙 또는 범위
- 가져오지 않은 숫자와 이유
- 새 원두에 맞춘 핵심 가설

## 2. 필수 입력과 질문 gate

세부 질문과 판정은 `INTAKE.md`를 따릅니다. Decision-critical 항목이 비어 있으면 숫자 recipe를 만들지 말고 먼저 질문합니다.

### 원두

- 이름, 산지/지역, 생산자 또는 washing station
- 고도, 품종, 가공
- 로스팅 포인트, 로스팅 날짜
- 로스터 컵노트

### 추출 환경

- 음용 방식과 컵
- 실제 coffee dose
- grinder/burr/calibration
- 물
- 원하는 향미, 농도, 음용 온도, 얼음 잔존

사용자가 확인할 수 없는 품종·고도 같은 원두 정보는 `unknown`으로 진행할 수 있습니다. 하지만 컵 크기, hot/iced 방식, 얼음 배치처럼 recipe 구조를 바꾸는 값은 되묻습니다. 모르는 값은 `미기록`으로 남기며 정밀한 숫자를 추측해 채우지 않습니다.

## 2.1 조사 gate

모든 새 원두 baseline은 `research/PROTOCOL.md`에 따라 원두별 Research Dossier를 먼저 만듭니다.

- Aiden 공식·기계, Ode Gen 2 Stock Burr, 추출 과학, 독립 전문가, Aiden 커뮤니티, 원두별 자료, 내부 유사 recipe를 다룹니다.
- 출처 수만 채우지 말고 적용 조건과 반대 증거를 기록합니다.
- `Evidence`, `Inference`, `Hypothesis`를 분리합니다.
- Research 상태가 `blocked`면 숫자 recipe를 만들지 않습니다.
- Intake와 Research가 모두 통과한 Candidate만 `brew_ready: true`입니다.
- 빠른 임시안을 사용자가 명시적으로 원한 경우에만 `brew_ready: false` 숫자를 허용합니다.

최고 수준의 판단은 확신을 과장하는 것이 아니라, 어떤 정보가 사실이고 어떤 부분이 한 잔으로 검증할 가설인지 분명히 하는 것입니다.

## 3. Aiden 필수 계산

기호:

- `C`: 실제 coffee dose (g)
- `H`: Aiden 선택 brew water (g 또는 ml)
- `BI`: carafe/brew ice (g)
- `SI`: serving ice (g)
- `NR`: Aiden profile nominal ratio의 물 쪽 숫자
- `BR`: Aiden bloom ratio의 물 쪽 숫자
- `RF`: retention factor, 원두 1g당 보유되는 물(g)
- `Cup`: 컵 용량(ml)

### 기기가 가정하는 원두량

```text
machineAssumedDoseG = H / NR
```

Aiden에는 저울이 없으므로 이 값은 실제 투입량이 아닙니다.

### 실제 hot extraction ratio

```text
actualHotRatio = H / C
```

### 전체 recipe-water ratio

```text
totalRecipeWaterRatio = (H + BI + SI) / C
```

이는 최종 beverage ratio와 같지 않습니다. 원두 보유수와 남은 얼음을 포함하기 때문입니다.

### Bloom 보정

```text
nominalBloomWaterG = machineAssumedDoseG × BR
actualBloomRatio = nominalBloomWaterG / C
```

명목 dose보다 실제 dose가 많으면 실제 bloom ratio가 작아집니다.

### 예상 음료량과 컵 여유

```text
retainedWaterG = C × RF
estimatedHotBeverageG = H - retainedWaterG
estimatedCupLoadG = estimatedHotBeverageG + BI + SI
estimatedHeadspaceMl = Cup - estimatedCupLoadG
```

Headspace 판정:

- `< 0ml`: 불가능/넘침
- `0–14ml`: 높은 위험
- `15–29ml`: 타이트, 실제 검증 필요
- `30ml 이상`: 비교적 편안함

개인 컵의 권장 headspace가 더 크면 `PROFILE.md` 값을 우선합니다.

## 4. Flash brew 열수지 근사

아래 계산은 얼음이 0°C이고, 용기·공기·추출 중 열손실을 무시한 1차 근사입니다.

기호:

- `B`: estimated hot beverage (g)
- `Td`: 커피가 얼음에 닿을 때의 실제 온도(°C)
- `Tt`: 목표 온도(°C)
- 물의 비열 `c = 4.186 J/g°C`
- 얼음 융해열 `Lf = 333.55 J/g`

```text
iceNeededG = B × c × (Td - Tt) / (Lf + c × Tt)
estimatedIceRemainingG = max(0, BI + SI - iceNeededG)
```

판정:

- `estimatedIceRemainingG < 5g`: 얼음이 모두 녹을 가능성
- `5–9g`: 경계
- `10g 이상`: 목표 후보

이 계산을 레시피의 진실로 취급하지 않습니다. 실제 낙하 온도, 최종 무게, 얼음 잔존을 기록해 `PROFILE.md`를 교정합니다.

## 5. 기계 검증

각 recipe에서 확인:

- 선택 brew water가 현재 기기 UI에서 가능한가
- `≤450ml`면 Single Serve cone 영역, 그보다 크면 Batch 영역인지
- 실제 basket과 물리 shower selector를 각각 기록했고, 공식 기본 조합이면 서로 일치하는가
- 물리 shower selector와 profile의 Single Serve/Batch pulse 설정을 같은 값으로 오해하지 않았는가
- filter paper의 brand·size·bleached 여부와 rinse 선택을 기록했는가
- 모든 hot-brew 온도가 Aiden 공식 50–99°C 범위에 있는가
- `pulseCount`와 pulse temperature 개수가 같은가
- actual bloom이 베드를 충분히 적시는가; `1:2` 미만이면 강한 경고
- 실제 dose와 machine-assumed dose가 10% 이상 다르면 눈에 띄게 표시했는가
- 컵 headspace가 목표 이상인가
- 아이스 목표인데 열수지상 얼음이 남을 가능성이 있는가
- nominal ratio나 interval의 현재 UI 한계를 오래된 게시물만으로 단정하지 않았는가

## 5.1 Filter rinse 판정

Filter rinse는 Aiden 작동에 필요한 필수 cycle이 아닙니다. Fellow는 Aiden에 자동 pre-rinse가 없으며 **동봉 필터는 린스할 필요가 없다**고 안내합니다. 반면 일부 Fellow Drops 레시피는 paper filter 린스를 권장합니다. 이 둘은 모순된 기계 명령이 아니라, 동봉 필터의 필요성과 개별 레시피의 준비 선택을 각각 말한 것으로 해석합니다.

Rinse의 주된 목적은 필터 고유의 냄새·먼지 제거와 종이 안착입니다. Aiden의 닫힌 brew chamber에서 manual dripper의 예열 논리를 그대로 필수화하지 않습니다. 특히 Flash brew에서는 린스 물이 남으면 계산하지 않은 희석이 생기므로 예열 이득보다 물수지 통제가 우선입니다.

| Filter 조건 | 기본 판정 | 실행 |
|---|---|---|
| Fellow 동봉/공식 Aiden white filter, 냄새 없음 | Optional | 재현성을 위해 rinse 또는 no-rinse 중 하나를 recipe에 고정 |
| 산소표백 white filter, water-only test에서 중립 | Optional | 생략 가능; brand가 바뀌면 재확인 |
| Unbleached, bamboo, 장기 개봉, 보관 냄새, 물만 통과시켜도 종이 향 | Recommended | 뜨거운 물로 린스하고 물을 완전히 폐기 |
| Brand·재질 미기록 | Unknown | baseline에서는 한 방식을 보수적으로 고정하되 `필수`라고 부르지 않고 filter 정보를 다음 intake/log에 보강 |

Rinse를 하는 recipe는 다음을 지킵니다.

- `filter_paper`와 `filter_rinse`를 함께 기록합니다.
- 가능한 경우 rinse water source, 온도 범위, 대략적인 양을 prep 또는 log에 남깁니다.
- Aiden 위에서 린스했다면 carafe를 완전히 비운 뒤 Brew ice를 계량합니다.
- Rinse on/off 비교에서는 같은 filter lot와 같은 recipe를 쓰고, rinse만 primary variable로 바꿉니다.
- 종이 향 차이가 불명확하면 water-only triangle test 또는 최소 2회의 blind paired brew로 확인합니다.

## 5.2 Basket, 물리 shower selector, profile branch

다음 세 값은 서로 다른 변수입니다.

1. `basket`: 실제로 장착한 Single Serve cone 또는 Batch basket
2. `shower_selector`: 뚜껑 안쪽의 물리 위치, 한 개의 초록 점 또는 세 개의 파란 점
3. Profile branch: 선택 용량에서 실행되는 Single Serve pulses 또는 Batch pulses

공식 기본값은 basket과 selector를 맞추는 것입니다.

| Aiden selected water | Basket | 물리 shower selector | 기본 판정 |
|---:|---|---|---|
| `≤450ml` | `single_serve` | `single_serve` · one green dot | Default |
| `>450ml` | `batch` | `batch` · three blue dots | Default |

기기가 경고를 건너뛸 수 있거나 brew가 시작된다는 사실은 더 나은 추출의 증거가 아닙니다. Batch selector를 Single Serve cone과 쓰면 물 분포와 국소 agitation이 바뀌므로, 일부 coffee에서 중앙 crater나 과도한 교반을 줄일 가능성은 있지만 edge wetting·bypass·낮은 extraction을 만들 가능성도 있습니다. 현재 공개 자료에는 `Single basket + Batch selector`가 항상 우월하다는 통제 측정이 없습니다.

Mismatch를 금지하지는 않습니다. 다만 다음 조건의 실험으로만 허용합니다.

- `basket`과 `shower_selector`를 서로 다르게 기록하고 Ruleset은 `review`로 표시합니다.
- Grind, dose, water, bloom, pulses, temperature, filter와 rinse를 고정하고 `shower_selector`만 바꿉니다.
- 같은 recipe를 각 조건 최소 2회 반복하고 bed 사진, dry edge/중앙 crater, drawdown, final beverage, 가능하면 TDS/EY, taste를 기록합니다.
- Bed 모양만으로 승패를 정하지 않고 cup quality와 반복성을 우선합니다.
- 개인 log가 반복해 우위를 보이기 전에는 공식 match를 baseline으로 유지합니다.

현재 Harfusa Candidate의 190ml와 280ml는 모두 Single Serve 영역이므로 기본 물리 설정은 **one green dot / Single**입니다.

## 6. 첫 레시피 설계 순서

1. Intake gate 통과
2. 원두별 Research Dossier 완성 및 충돌 합성
3. 컵과 최종 적재 목표 결정
4. 실제 dose, brew water, brew/serving ice 결정
5. 명목 ratio를 정하고 실제 ratio/bloom 재계산
6. 원두 밀도·가공·로스팅과 Aiden/Ode 근거에 맞는 분쇄도 출발점 결정
7. bloom 결정
8. pulse 개수·간격·온도 결정
9. 각 setting을 Dossier 근거 또는 가설에 연결
10. 모든 Harness check 실행
11. 첫 추출에서 측정할 것 명시

첫 버전은 `optimal`이 아니라 `baseline`입니다.

## 6.1 Ode Gen 2 출발점 검증

Recipe마다 다음을 함께 기록합니다.

- Stock Gen 2 Brew Burr / SSP 구분
- 현재 Fellow가 해당 volume에 제시하는 출발점
- 실제 제안 setting과 공식 출발점의 차이
- 차이를 만든 이유: roast, dose, basket, Aiden의 높은 열 유지, drawdown 위험, 개인 log 중 해당 항목
- calibration/seasoning/청소 상태

Fellow가 현재 제시하는 숫자도 범용 출발점입니다. 반대로 유명 바리스타나 Reddit 사용자의 숫자도 보편적인 particle size가 아닙니다.

## 6.2 외부 Aiden profile 비교와 전이

유명 roaster, Fellow Drops, 바리스타 profile은 강한 참고자료이지만 source의 명성만으로 숫자를 이식하지 않습니다. 공개 profile을 참고할 때는 사람용 소개 페이지와 실제 share payload를 함께 확인하고 다음 조건을 표로 정규화합니다.

- Coffee: origin, producer/station, variety, process, altitude, roast level, tasting notes, roast age
- Machine: firmware 확인일, basket, selected water, hot/iced, 실제 dose와 nominal ratio
- Profile: bloom ratio/time/temp, Single/Batch pulse count·interval·temperature
- Environment: grinder와 burr, grind range, water, filter, rinse, vessel
- Outcome: roaster 목표와 실제 사용자 측정/log; 결과가 없으면 `설정 공개`일 뿐 `우수성 검증`은 아님

전이 수준은 다음처럼 구분합니다.

| 수준 | 조건 | 사용할 수 있는 것 |
|---|---|---|
| Numeric anchor | Aiden 공개 payload가 있고 coffee·roast·process·basket·volume·burr가 매우 가까움 | 겹치는 범위의 출발점; actual dose/bloom은 다시 계산 |
| Directional evidence | 일부 조건만 가깝거나 결과 측정이 없음 | high/low temperature, flat/declining, bloom/pulse의 방향성 |
| Hypothesis only | Manual pour-over, 다른 brewer/burr, 조건 누락, community 재작성 | 다음 한 변수 실험 아이디어만 사용 |

2026-08-23에 확인한 세 washed Ethiopia Aiden profile만 해도 nominal ratio `1:15–1:17`, bloom `1:3 · 35–60초`, Single Serve temperature `90–97°C`, flat/declining이 모두 존재합니다. 따라서 “washed Ethiopia 공식값” 하나를 만들지 않습니다. 대신 다음 패턴만 Harness에 남깁니다.

- `1:3` nominal bloom은 유사 profile에서 반복되지만 실제 dose가 다르면 actual bloom ratio를 반드시 재계산합니다.
- Single Serve 3 pulses가 흔하지만 coffee와 volume을 무시한 필수값은 아닙니다.
- 더 큰 Single Serve volume일수록 같은 grinder 범위 안에서 굵은 쪽으로 이동하라는 Fellow 지침을 우선합니다.
- Medium–Light washed Ethiopia의 declining profile은 harsh finish를 줄일 가설이 될 수 있지만, flat profile도 Light washed Ethiopia에서 사용되므로 roast와 실제 log가 결정합니다.
- Manual pour-over의 swirl·pour 횟수는 Aiden pulse 숫자로 직접 번역하지 않습니다.

## 7. 시음 기록 원칙

최소 기록:

- 실제 투입량과 기기 설정이 recipe와 같았는가
- 실제 filter paper와 rinse 여부가 recipe와 같았는가
- 실제 basket과 물리 shower selector 위치가 recipe와 같았는가
- 최종 beverage 무게
- 가능하면 낙하 온도와 마시기 시작한 온도
- drawdown: fast / normal / slow
- basket에 물이 남았는가
- 다 마실 때 얼음이 남았는가, 가능하면 남은 무게
- aroma clarity, acidity, sweetness, bitterness, astringency, body, finish
- 전체 만족도와 자유 서술

차가운 커피는 향과 단맛 인지가 달라지므로, 가능하면 추출 직후와 5분 후를 나누어 적습니다.

## 8. 맛 → 다음 변수

우선순위가 높은 첫 조건 하나만 적용합니다.

| 관찰 | 다음 primary variable | 방향 |
|---|---|---|
| Drawdown이 느리거나 물이 남고 떫음 | Grind | 한 단계 굵게 |
| 쓴맛과 떫음이 함께 강함 | Grind | 한 단계 굵게 |
| 밸런스는 좋은데 후미만 거침 | Last pulse temperature | 1°C 낮게 |
| 날카롭게 시고 얇으며 단맛 부족, drawdown 정상 | Grind | 한 클릭 곱게 |
| 깨끗하지만 묽음 | Brew/serving ice 또는 dose | 희석부터 점검 |
| 맛은 좋지만 너무 진함 | Total dilution | 얼음/물 소폭 증가 |
| 얼음이 남지 않음 | Serving ice | 컵 여유가 있을 때만 증가 |
| 얼음이 남지 않고 컵도 타이트함 | Brew water | 새 ratio/bloom과 함께 재계산 |
| 향이 좋으나 반복 재현 안 됨 | 변경 없음 | 같은 recipe 한 번 더 |
| Bed crater만 보이고 맛·drawdown은 정상 | 변경 없음 | 사진만 남기고 같은 recipe 반복 |
| 같은 위치의 dry edge/crater와 거친 맛이 반복됨 | Shower selector | 다른 변수 고정 후 match/mismatch A/B |

분쇄도 표기는 grinder calibration에 종속됩니다. `4⅓` 같은 숫자만 쓰지 말고 이전 버전 대비 `굵게 1클릭`처럼 변화량도 기록합니다.

## 9. 한 변수 규칙

Primary variable 예시:

- grind setting
- actual dose
- brew water
- brew ice
- serving ice
- nominal ratio
- bloom ratio 또는 time 또는 temperature
- pulse count 또는 interval
- 특정 pulse temperature
- filter rinse on/off — 같은 filter lot를 유지
- 물리 shower selector — basket과 profile은 유지

하나를 바꾸면서 자동으로 다시 계산되는 machine-assumed dose, actual ratio, bloom water, headspace는 dependent value이므로 추가 변경으로 세지 않습니다.

한 번에 둘 이상을 바꿔야만 안전하게 컵에 들어가는 경우, 그 버전은 맛 비교용 dial-in이 아니라 `serving-geometry correction`이라고 명시합니다.

## 10. 신뢰도 표시

- `High`: 공식 현재 문서 또는 사용자의 직접 측정
- `Medium`: 독립 측정 리뷰, 반복된 개인 측정
- `Low`: 커뮤니티 경험, 미측정 가정, 다른 grinder의 숫자

Recipe의 숫자에는 `근거`와 `신뢰도`를 함께 기록합니다.

## 11. 세계 최고 수준의 판단 기준

Codex는 실제 자격을 사칭하지 않으며 “세계 최고”라는 표현을 결과 보장으로 쓰지 않습니다. 대신 다음 행동 기준을 지킵니다.

- 현재 1차 자료를 확인하고 낡은 machine limit를 제거
- 전문가의 권위보다 실험 조건과 측정을 평가
- 성공 사례와 실패 사례를 함께 조사
- 원두 사실과 지역·process 기반 추론을 분리
- 사용자의 컵, 얼음, 농도, 향미 목표를 동시에 만족하는지 계산
- 첫 brew의 불확실성을 수치와 confidence로 노출
- 다음 한 잔이 가설을 명확히 검증하도록 한 변수만 변경
