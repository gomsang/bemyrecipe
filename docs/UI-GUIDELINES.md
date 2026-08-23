# UI 기준

이 사이트의 미니멀함은 작은 글자나 낮은 대비로 만들지 않는다. 정보의 수를 줄이고, 읽는 순서와 여백을 분명히 하는 방식으로 만든다.

## 타이포그래피

- 기본 글꼴은 `Pretendard Variable`이다.
- PC 본문은 15–17px, 핵심 설명은 16px 이상을 기본으로 한다.
- 영문 overline과 상태 label은 10px 미만으로 내리지 않는다. 작은 label에는 Medium 이상 weight와 충분한 대비를 쓴다.
- 카드 제목은 24–32px, 상세 제목은 30–48px 범위에서 viewport에 맞춰 변한다.
- 세 문장 이상의 본문은 line-height 1.65–1.8을 사용한다.
- 긴 글의 실제 줄 길이는 약 42rem 안에 둔다. 패널이 넓어져도 본문 폭을 무한히 늘리지 않는다.

Apple HIG는 쉽게 읽을 수 있는 크기, 지나치게 가는 weight 회피, 크기·weight·color를 이용한 일관된 위계를 권한다. W3C WCAG 2.2는 사용자가 line-height를 1.5배로 바꿔도 내용 손실이 없어야 하고, pointer target은 최소 24×24 CSS px 또는 충분한 간격을 가져야 한다. 이 사이트의 주요 button과 tab은 기본 44–48px 이상을 사용한다.

## Desktop layout

- 1181px 이상에서는 recipe index와 detail을 나란히 둔다.
- 1180px 이하에서는 한 열로 바꿔 본문 폭을 확보한다.
- 1280px 전후에서는 목록의 핵심 수치를 제목 아래로 내려 제목이 한두 단어씩 끊기지 않게 한다.
- Detail panel은 sticky로 두되, 한 화면에 모든 정보를 압축하지 않는다.

## 정보 공개 순서

상세 화면의 첫 단계는 두 가지다.

1. `추출 레시피`: 실행값, ice plan, preparation, rules
2. `드링크 가이드`: 원두 배경, 이 version의 추출 의도, 마시는 순서, 출처 범위

두 mode는 같은 중요도의 tab으로 표시한다. 로그인하지 않은 사용자에게는 Aiden이나 token 기능의 빈 자리, 잠금 표시, 가입 유도문을 보여 주지 않는다.

Recipe 선택은 `/recipes/<recipe-id>/brew`, 드링크 가이드는 `/recipes/<recipe-id>/guide`로 주소가 바뀝니다. 새로고침하거나 URL을 공유해도 같은 version과 같은 tab이 열려야 하며, 브라우저 뒤로 가기·앞으로 가기도 선택 이력을 복원해야 합니다. Firebase Hosting과 로컬 dev server는 이 deep link를 `index.html`로 되돌리는 SPA fallback을 유지합니다.

`VERSION HISTORY`와 `SELECTED CHANGE`는 현재 추출을 실행하는 데 필요한 정보가 아니다. 상세 화면 맨 아래의 하나의 접이식 archive에 묶고 기본값은 닫힘으로 둔다. 어느 tab을 보고 있든 같은 위치에서 열 수 있어야 한다.

## Drink Guide reader

- 첫 화면은 제목, 한 문단 소개, 예상 독서 시간으로 시작한다.
- 원두 fact는 label/value와 손님이 이해할 짧은 맥락이 있는 grid로 보여 준다. `사용자 확인`, `봉투 표기`, `exact lot` 같은 조사 작업어는 표시하지 않는다.
- 긴 본문은 `THE COFFEE → FROM CHERRY TO GREEN → TASTING LANGUAGE → WHY THIS BREW → HOW TO DRINK → SOURCES` 순서로 나눈다.
- 각 coffee chapter의 내부 evidence 값은 보존하되 화면에는 `이 커피의 정보`, `하르푸사 이야기`, `지역 이야기`, `품종 이야기`, `로스팅과 추출`처럼 독자용 문구로 번역한다.
- `FROM CHERRY TO GREEN`은 가공명을 최소 네 단계의 과정으로 풀고, 일반 공정인지 exact-lot 사실인지 범위를 붙인다.
- `TASTING LANGUAGE`는 봉투의 컵노트를 첨가물이나 정답처럼 말하지 않고, 찾아볼 감각과 구분할 감각을 함께 제시한다.
- 낯선 산지·가공 용어는 본문을 반복하지 않는 작은 사전으로 모은다.
- 전체 guide는 마시는 사람을 위한 글이다. 추출 설정을 설명하는 장은 `WHY THIS BREW` 하나뿐이다.
- `unknowns`는 숨기지 않되 `편집 노트`로 정리해 본문 흐름을 끊지 않는다.
- Source는 `더 읽어보기`에 직접 링크와 독자용 적용 범위를 함께 표시한다. 출처 수만 많은 장식용 목록은 만들지 않는다.
- 본문은 카페에서 커피와 함께 건네도 자연스러워야 한다. “사용자가 확인했다”, “봉투에서 직접 확인된다”, “이번 로트의 사실로 사용하지 않는다”처럼 제작 과정이나 검증 보고서를 독자에게 말하지 않는다. 필요한 불확실성은 자연스러운 사실 문장과 편집 노트로 남긴다.
- Research Hold version은 guide를 지우지 않되, 실행용이 아니라는 경고를 제목 앞에 표시한다.

## 반응형 확인

변경 후에는 최소한 다음을 확인한다.

- 1280×720: hero, catalog 2-column, tab, recipe text 크기
- 390×844: 가로 overflow 없음, one-column card/detail, ice card stack, guide choice stack
- 브라우저 200% zoom 또는 640px 상당 폭: 두 방향 scroll 없이 핵심 내용을 읽을 수 있음
- keyboard focus, tab 선택 상태, 44px 이상 주요 target

참고:

- [Apple Human Interface Guidelines · Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Apple Human Interface Guidelines · Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [W3C WCAG 2.2 · Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [W3C WCAG 2.2 · Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
