# New Recipe Intake

새 recipe 숫자를 만들기 전에 확인하는 질문 gate입니다. 사용자가 이미 제공한 내용은 다시 묻지 않습니다.

이 gate를 통과해도 바로 숫자를 만들지 않습니다. 이어서 `research/PROTOCOL.md`의 Research gate를 통과해야 합니다.

## 1. Decision-critical — 없으면 반드시 질문

### A. 원두와 로스팅

- 정확한 원두명
- process
- roast level 또는 로스터가 표현한 배전 정보
- tasting notes 또는 사용자가 살리고 싶은 향미

품종·고도·지역은 중요한 참고정보지만 포장에 없을 수 있습니다. 먼저 물어보고 사용자가 모른다고 하면 `unknown`으로 진행합니다.

### B. 음용 형태

- Hot / Flash brew / Iced / Cold brew 중 무엇인지
- 음용 컵의 실제 용량
- 아이스라면 얼음 위치:
  - Aiden 아래 carafe/brew vessel
  - 음용 컵
  - 둘 다
- 마시는 동안 얼음이 남아야 하는지
- 한 잔을 가득 채울지, headspace를 얼마나 둘지

`아이스`만으로는 충분하지 않습니다. 뜨거운 커피를 얼음컵에 바로 받을지, carafe ice로 먼저 급랭한 뒤 serving ice에 부을지 반드시 구분합니다.

### C. 장비와 목표

- grinder와 burr; 기본 프로필과 같다면 재질문 생략
- 원하는 맛: clarity / sweetness / acidity / body / balance 중 우선순위
- 피하고 싶은 맛이나 이전 실패 경험

## 2. Important but assumable — 가정을 밝히고 진행 가능

- roast date
- 물의 GH/KH/TDS
- Ode calibration
- 목표 음용 온도의 정확한 숫자
- 실제 retention factor
- Flash brew drop temperature

가정한 값은 recipe의 `Assumptions`와 `Harness check`에 표시하고 첫 brew 측정 항목으로 넘깁니다.

## 3. 질문 형식

질문은 최대 세 묶음으로 짧게 합니다.

예시:

1. **원두** — 품종·가공·로스팅 날짜 중 포장에 적힌 정보가 있나요? 모르면 모른다고 해도 됩니다.
2. **서빙** — 315/420/500ml 중 어느 잔인가요? 얼음은 carafe, 음용 컵, 둘 다 중 어디에 넣고 끝까지 남아야 하나요?
3. **맛** — clarity와 sweetness 중 무엇을 더 우선하고, 이전 추출에서 피하고 싶은 맛이 있나요?

## 4. 충분성 판정

다음 문장을 모두 완성할 수 있으면 생성 가능합니다.

> 이 recipe는 `[원두/roast/process]`를 `[drink style]`로 추출해 `[용량]ml 컵`에 담으며, 얼음은 `[위치/목표]`이고, `[향미 목표]`를 우선한다.

완성할 수 없으면 질문합니다. 완성할 수 있으면 Research Dossier를 만든 뒤 numeric Candidate 여부를 판정합니다.

## 5. 유사 recipe 검색 보고

새 Candidate에는 아래 표를 넣습니다.

| 참고 recipe | 유사한 점 | 참고한 원칙 | 그대로 복사하지 않은 이유 |
|---|---|---|---|

유사 recipe가 없으면 `직접적으로 유사한 기존 recipe 없음`이라고 적습니다. 억지로 하나를 선택하지 않습니다.
