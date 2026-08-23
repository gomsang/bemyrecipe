# ohmycoffee Index

마지막 갱신: 2026-08-23

## 현재 상태

- 운영 방식: Codex 채팅 + Markdown source of truth + 공개 웹 catalog
- 웹 UI: 공개 Accepted/Candidates 열람, 추출 레시피/드링크 가이드 reader, 로그인 후 개인 Aiden·token 관리
- 활성 원두: 1
- 활성 recipe lineage: 2
- 총 recipe version: 3
- Accepted recipe: 0
- Candidate recipe: 3
- 총 brew log: 0
- Research Dossier: 3 (`complete` 1, `sufficient-with-gaps` 2)

## 원두

| 원두 | 상태 | 최신 recipe | Brew 수 | 다음 행동 |
|---|---|---|---:|---|
| [SBR · Ethiopia Yirgacheffe Harfusa Washed G1](beans/sbr-ethiopia-harfusa.md) | 활성 | [SBR · 315ml Split-ice Flash v2](recipes/candidates/sbr-harfusa-flash-315-v2.md) | 0 | v2 추출 후 맛·drawdown·ice remaining 기록 |

## Recipe lineage

### SBR · Harfusa · Flash brew · 315ml

| Version | 상태 | 핵심 설정 | 검증 상태 | 로그 |
|---|---|---|---|---|
| [v1](recipes/candidates/sbr-harfusa-flash-315-v1.md) | Candidate · Research Hold | Legacy provisional: 20g · 225ml · 96→95→94°C | `brew_ready: false`; intake blocked | 없음 |
| [v2](recipes/candidates/sbr-harfusa-flash-315-v2.md) | Candidate | 17g · 190ml · brew ice 110g · serving ice 20g · Ode 5⅓ · 94→92°C | `brew_ready: true`; 미추출 | 없음 |

### SBR · Harfusa · Flash brew · 500ml Tumbler

| Version | 상태 | 핵심 설정 | 검증 상태 | 로그 |
|---|---|---|---|---|
| [v1](recipes/candidates/sbr-harfusa-flash-500-v1.md) | Candidate | 25g · 280ml · brew ice 150g · serving ice 80g · Ode 5⅓ · 95→92°C | `brew_ready: true`; 미추출 | 없음 |

## Accepted Recipes

- 아직 없음

## Candidate Recipes

- [SBR · Harfusa · 315ml Flash brew · v1](recipes/candidates/sbr-harfusa-flash-315-v1.md) — 사용자 채택 전 / Research Hold / 추출 금지
- [SBR · Harfusa · 315ml Split-ice Flash brew · v2](recipes/candidates/sbr-harfusa-flash-315-v2.md) — 사용자 채택 전 / brew ready
- [SBR · Harfusa · 500ml Tumbler Flash brew · v1](recipes/candidates/sbr-harfusa-flash-500-v1.md) — 사용자 채택 전 / brew ready

## Research Dossiers

- [SBR · Harfusa · 315ml Flash brew · 2026-08-23](research/2026-08-23-harfusa.md) — Aiden/Ode/과학/전문가/커뮤니티/원두 조사 완료, intake complete, roast development·개인 열 보정값 gap
- [SBR · Harfusa · 500ml Tumbler Flash brew · 2026-08-23](research/2026-08-23-harfusa-tumbler-500.md) — Aiden/Ode/과학/전문가/커뮤니티/원두/삼다수 조사, `sufficient-with-gaps`
- [Aiden rinse · 외부 profile · shower selector · 2026-08-23](research/2026-08-23-aiden-rinse-profiles-shower-selector.md) — 동봉 필터 rinse 불필요, filter별 조건부 판정, 공개 washed Ethiopia profile 비교, selector match/mismatch 근거, `complete`

## 다음 교정 우선순위

1. 315ml v2 첫 brew에서 exact filter, one-green-dot selector, carafe output, transfer 온도, drawdown, ice remaining 측정
2. 315ml v2 추출 직후와 5분 후의 베르가못 clarity·백도 sweetness를 비교해 실제 우선순위 확인
3. Filter가 Fellow 동봉 white paper라면 필요할 때 rinse/no-rinse 한 변수 paired test
4. 공식 Single selector에서 dry edge/crater와 거친 맛이 반복될 때만 Batch selector A/B 검토
5. Ode Gen 2 calibration/seasoning 상태 기록
6. 삼다수 alkalinity/KH 또는 TDS를 알게 되면 Profile 보강
7. 첫 log를 근거로 primary variable 하나만 바꿀지 결정
