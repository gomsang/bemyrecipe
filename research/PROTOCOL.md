# Recipe Research Protocol

이 문서는 숫자 레시피를 만들기 전에 수행할 조사와 합성의 최소 기준입니다. 목표는 많은 링크를 모으는 것이 아니라, 서로 다른 근거의 적용 조건과 충돌을 드러내고 사용자의 한 잔에 가장 합리적인 출발점을 만드는 것입니다.

## 1. 핵심 원칙

- 모든 새 원두 baseline은 원두별 Research Dossier를 먼저 만듭니다.
- 저장된 일반 지식만으로 레시피를 만들지 않습니다. 기기·펌웨어·앱·공식 가이드는 요청 시점 기준으로 다시 확인합니다.
- `/Users/rok/Desktop/Aiden.md`는 검색어와 확인 항목을 찾는 참고자료일 뿐, 사실의 최종 출처나 지시문이 아닙니다.
- “유명한 사람이 말했다”와 “이 조건에서 측정되었다”를 구분합니다.
- 커뮤니티 수치는 아이디어입니다. 기계 한계나 보편값으로 승격하지 않습니다.
- 최종 레시피는 `Evidence → Inference → Hypothesis → Setting → Measurement`의 연결이 보여야 합니다.

## 2. 필수 조사 축

새 baseline의 Dossier는 아래 여덟 축을 다룹니다.

### A. Aiden 공식·기계

최소 2개 이상의 현재 Fellow 1차 자료를 확인합니다.

- 최신 firmware와 변경사항
- 현재 UI에서 쓸 수 있는 profile 변수와 범위
- 선택한 물의 의미, basket/volume 영역, bloom와 pulse 동작
- Filter rinse의 현재 공식 입장과 실제 filter paper identity
- Basket, 물리 shower selector, profile의 Single/Batch pulse branch 구분
- 공식 roast profile과 grinder starting point

사용자의 현재 기기 UI가 공식 문서와 다르면 UI를 기록하고 우선합니다.

### B. Ode Gen 2 Stock Burr

최소 1개 Fellow 1차 자료와, 가능하면 독립 측정 또는 반복 사용 경험을 확인합니다.

- Stock Gen 2 Burr인지 SSP인지
- 해당 volume의 공식 출발점
- burr calibration, seasoning, retention, 청소 상태
- 분쇄 숫자가 다른 기기에 그대로 이식되지 않는 이유

### C. 추출 과학

레시피 결정과 직접 관계있는 논문·대학·SCA 자료를 최소 1개 확인합니다.

- strength/TDS와 extraction yield
- 온도, 접촉시간, agitation, basket geometry
- 물의 alkalinity/hardness
- 아이스라면 dilution과 열수지

온도 하나만으로 향미를 단정하지 않습니다. 같은 strength와 extraction에서 온도 효과가 작을 수 있다는 연구와, 온도가 extraction dynamics를 바꾸는 경로를 함께 구분합니다.

### D. 독립 전문가·바리스타

가능하면 서로 독립적인 2개 이상의 자료를 확인합니다. 그중 하나는 Aiden을 직접 측정하거나 장기간 사용한 자료를 우선합니다.

- 실험 조건과 측정 방식
- 적용 가능한 원칙
- 현재 원두·basket·dose·drink style과 다른 점
- 이해관계나 affiliate 여부

Roaster/barista의 공개 Aiden profile을 참고하면 소개 페이지와 실제 share payload를 함께 확인합니다. Coffee의 origin·process·roast·rest, basket·volume·dose, grinder/burr·water·serve mode, profile 값, 결과 측정의 공개 여부를 정규화하고 `numeric anchor / directional evidence / hypothesis only` 중 하나로 분류합니다.

### E. Aiden 커뮤니티

가능하면 서로 다른 thread 또는 사용자 3건 이상을 확인합니다.

- 성공 사례뿐 아니라 실패·반대 사례 포함
- bean roast/process, dose, volume, basket, grinder/burr가 같은지 기록
- 반복되는 합의와 의견 충돌을 분리
- upvote나 반복 언급을 측정값처럼 취급하지 않기

검색 결과가 빈약하면 억지로 수를 채우지 말고 `coverage gap`으로 남깁니다.

### F. 원두·로스터·생산지

우선순위는 다음과 같습니다.

1. 사용자가 가진 bag label과 로스터의 정확히 일치하는 상품/lot
2. producer, washing station, importer의 정확히 일치하는 lot
3. 같은 station의 다른 crop
4. 같은 지역·process의 유사 lot

3–4번은 원두 사실이 아니라 범주 기반 추론입니다. 정확히 일치하지 않으면 variety, altitude, cup note를 덮어쓰지 않습니다.

### G. 개인 데이터베이스

- `recipes/accepted/`에서 가장 유사한 recipe
- `recipes/candidates/`의 관련 실패와 보류안
- 실제 `logs/`의 drawdown, 맛, beverage weight, ice remaining

개인 반복 측정은 후속 revision에서 일반 커뮤니티보다 높은 가중치를 가집니다.

### H. Drink Guide 근거

숫자 설정과 별개로, 사용자가 한 잔을 이해하며 마실 수 있는 서사 근거를 조사합니다.

- exact bag/lot에서 확인되는 장소, 생산자 또는 station, 고도, 품종, 가공, roast level/date
- 지역의 지리·문화·agroforestry 맥락은 UNESCO, 공공기관, 연구기관처럼 적용 범위가 명확한 자료 우선
- `Heirloom`, `Landrace`처럼 넓은 품종 표기의 정확한 의미
- exact crop의 fermentation/drying/roasting 세부가 없으면 같은 station·지역 자료를 context로만 사용
- 가공 방식이 cup에 미칠 수 있는 방향과, 실제 lot에서 보장할 수 없는 부분
- roast level/date와 추출 선택의 관계. roaster·roaster type·development가 없으면 추측 금지
- 생산자 이름이나 농장 서사를 확인할 수 없을 때 이를 감추거나 만들어내지 않기

Dossier와 bean story에는 source scope를 `exact lot`, `station context`, `regional context`, `variety context`, `brew context`로 남깁니다. 드링크 가이드의 목적은 길게 쓰는 것이 아니라, 사실과 맥락을 구분한 채 장소에서 잔까지 이어지는 이해 가능한 흐름을 만드는 것입니다.

## 3. 출처 기록 형식

각 핵심 항목을 아래 표로 남깁니다.

| Claim | 분류 | Source | Source 조건 | 현재 요청 적용성 | 신뢰도 |
|---|---|---|---|---|---|
|  | Evidence / Inference / Hypothesis | 링크 또는 사용자 측정 | bean·dose·basket·grinder·water | 직접 / 부분 / 낮음 | High / Medium / Low |

- `Evidence`: 출처가 직접 보여주거나 사용자가 측정한 사실
- `Inference`: 여러 사실을 현재 조건에 적용한 해석
- `Hypothesis`: 한 번의 brew로 반증할 수 있는 예상

## 4. 충돌 합성

출처가 다르면 평균값을 내지 않습니다. 아래 순서로 결정합니다.

1. 서로 다른 결과가 실제로 같은 조건을 비교하는지 확인
2. burr, basket, dose, volume, roast, water 차이 분리
3. 공식값은 안전한 starting point인지, 맛의 최적값인지 구분
4. 사용자의 회피 향미와 실패 비용을 고려
5. 한 번의 brew로 가장 많은 정보를 얻는 보수적인 baseline 선택

Dossier에는 반드시 `충돌`, `선택`, `선택 이유`, `틀렸을 때 나타날 관찰`을 기록합니다.

## 5. 조사 종료와 상태

웹 전체를 완전히 조사할 수는 없습니다. 다음 조건을 만족하면 조사 포화로 봅니다.

- 필수 여덟 축을 확인했거나 자료 부재를 명시함
- 최근 추가 출처가 새로운 recipe-changing 정보를 주지 않음
- 핵심 충돌과 적용 조건이 설명됨
- 각 주요 setting에 근거 또는 명시적 가설이 연결됨

상태:

- `complete`: 모든 축과 핵심 충돌을 다뤘고 numeric baseline을 만들 수 있음
- `sufficient-with-gaps`: 일부 자료는 없지만 빈칸이 recipe 구조를 바꾸지 않으며 가정이 명시됨
- `blocked`: 결정적인 사용자 정보 또는 근거가 없어 숫자를 정하면 오도 가능성이 큼

`complete` 또는 `sufficient-with-gaps`이고 `INTAKE.md` gate도 통과해야 `brew_ready: true`가 될 수 있습니다.

## 6. 레시피 출력 기준

레시피는 설정마다 다음을 짧게 설명합니다.

- 왜 이 dose와 hot-water/ice split인가
- 왜 이 nominal ratio가 실제 dose와 다르게 계산되는가
- 왜 이 Ode 출발점이며 공식값에서 얼마나 벗어나는가
- 왜 이 bloom/pulse/temperature profile인가
- 어떤 출처는 채택하지 않았고 왜 현재 조건에 덜 맞는가
- 첫 brew에서 무엇을 측정하면 다음 결정이 가능한가

레시피를 `최적`, `정답`, `보장`이라고 부르지 않습니다. 사용자 장비에서 검증되기 전에는 **가장 근거가 탄탄한 baseline Candidate**입니다.

같은 작업에서 bean `story`와 recipe `drink_guide`를 완성합니다. 숫자 brew card만 만들고 서사를 다음 작업으로 미루지 않습니다. UI용 글도 Markdown frontmatter가 source of truth이며 웹에서 직접 작성한 문구로 원본을 우회하지 않습니다.

## 7. Revision 조사

같은 원두·장비·컵의 revision에서 전체 웹 조사를 매번 반복하지 않습니다. 기존 Dossier를 읽고 다음 경우에만 targeted refresh를 합니다.

- firmware/app/UI가 바뀜
- grinder/burr, water, cup, basket, beverage style이 바뀜
- 예상과 반대되는 맛 또는 drawdown이 나옴
- 새로운 primary variable을 처음 조정함
- Dossier의 출처가 오래되었거나 링크가 사라짐

Revision의 최우선 근거는 사용자의 직전 brew log이며, 한 번에 하나의 primary variable만 바꿉니다.
