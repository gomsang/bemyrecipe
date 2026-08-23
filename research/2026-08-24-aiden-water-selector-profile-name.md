# Aiden 물양 선택 간격과 profile 상태 접두사 · 2026-08-24

## 질문

1. 190ml처럼 기본 cup 화면에 보이지 않는 물양을 현재 Aiden에서 실제로 선택할 수 있는가?
2. 레시피가 실행 가능한 물양인지 Harness가 어떻게 검증해야 하는가?
3. Aiden 화면에서 대괄호가 빠지는 상태 접두사는 무엇으로 바꿀 것인가?

## 결론

- 사용자의 현재 화면은 기본 cup/half-cup 모드다. 이 모드에서는 150ml 다음이 225ml이며 75ml 간격으로 움직인다.
- 190ml는 `Settings → Units → Precise Units`를 켠 Single Serve 화면에서 선택할 수 있다. 사용자가 이 설정을 켜기로 했으므로 기존 레시피의 물·원두·얼음 수치는 바꾸지 않는다.
- 앞으로 레시피는 `aiden_quantity_mode`를 필수 통제조건으로 기록한다. `standard_cup`과 `metric_precise`의 간격, 물양에 맞는 basket, 준비 단계가 함께 맞아야 build와 서버 저장을 통과한다.
- 상태 접두사는 Candidate `C. `, Accepted `A. `를 사용한다. 대괄호가 표시되지 않는 것은 사용자 기기에서 직접 확인된 사실이다. 마침표는 기존 profile name 허용 문자이면서 한 글자 상태 구분이 또렷해 `C- `보다 읽기 좋다고 판단했다.
- 과거 `[C]`, `[A]`, `C-`, `A-` profile은 새 이름의 alias로 찾아 수정한다. 이름 형식 변경 때문에 같은 profile을 하나 더 만들지 않는다.

## Evidence

### 현재 사용자 기기

- **Evidence · current device UI · High:** 2026-08-24, 물양 선택 화면에서 150ml(1 cup) 다음 값이 225ml(1.5 cups)로 표시됨.
- **Evidence · current device display · High:** profile name의 `[`와 `]`가 Aiden 화면에 표시되지 않음.
- 적용: 현재 사용자 기기 관찰은 일반 문서보다 우선한다. 다만 첫 관찰은 “190ml가 영구적으로 불가능”하다는 뜻이 아니라 현재 단위 모드가 standard cup임을 뜻한다.

### Fellow 공식 자료

- [Fellow · How should I dial in my grinder when brewing with Aiden?](https://help.fellowproducts.com/hc/en-us/articles/29101533994267-How-should-I-dial-in-my-grinder-when-brewing-with-Aiden-Getting-Started-With-Aiden-Pt-3)
  - **Evidence · official · High:** Single Brew 범위를 0–3 cups, 150–450ml로 구분한다.
- [Fellow · What does “10 cup” mean?](https://help.fellowproducts.com/hc/en-us/articles/25226758297627-What-does-it-mean-when-you-say-Aiden-is-a-10-cup-coffee-brewer-How-much-coffee-can-it-actually-make)
  - **Evidence · official · High:** Aiden의 1 cup은 5oz이고 최대 1.5L/10 cups다.
- [Fellow Aiden Get to Know You Guide](https://www.talkcoffee.com.au/wp-content/uploads/2024/04/Fellow-Aiden-User-Manual.pdf)
  - **Evidence · manufacturer guide mirror · Medium–High:** 기기 설정에서 imperial 또는 metric unit을 선택하며, 추출 시 water quantity를 고른다.
  - 한계: 공식 공개 문서에서 Precise Units의 10ml/50ml 간격을 직접 열거한 표는 찾지 못했다.

### 독립 실기와 현행 사용자 보고

- [Prima Coffee · Fellow Aiden video overview](https://prima-coffee.com/blog/video-overview-fellow-aiden-precision-coffee-maker/)
  - **Evidence · independent hands-on · Medium–High:** metric 설정에서 310→320ml처럼 10ml씩 조절하고, imperial에서는 half-cup 단위로 움직이는 실제 조작을 설명한다.
- [Ideal Home · Fellow Aiden review](https://www.idealhome.co.uk/all-rooms/coffee/fellow-aiden-precision-electric-coffee-maker-review)
  - **Evidence · independent hands-on · Medium:** cup 표시에서 150ml부터 75ml씩 조절한다고 기록한다.
- [FellowProducts community · Aiden minor notes after 10 days](https://www.reddit.com/r/FellowProducts/comments/1tjejj0/aiden_minor_notes_after_10_days/)
  - **Evidence · community/device report · Low–Medium:** firmware 1.5.9에서 450ml까지 10ml, 500ml부터 50ml 간격과 basket 전환을 보고한다.
- [FellowProducts community · Allow metric for water](https://www.reddit.com/r/FellowProducts/comments/1fkr8mb/aiden_allow_metric_for_water_separate_from/)
  - **Evidence · community/device report · Low–Medium:** `Settings → Units → Precise Units` 경로와 작은 water increment를 보고한다.

## Inference

- 사용자가 본 150→225ml는 기기 제한의 전체 목록이 아니라 standard cup 모드의 간격이다.
- 180·190·280ml는 `metric_precise`와 Single Serve basket을 함께 선언할 때 실행 가능하다.
- Fellow 공식 지원 문서가 세부 step을 완전히 명시하지 않았으므로, 정확한 step registry는 “영구 하드웨어 사양”이 아니라 현재 검증된 firmware/UI 계약으로 관리해야 한다.

## Harness 반영

- Ruleset v4에서 `aiden_quantity_mode`를 필수로 추가.
- `standard_cup`: 150ml부터 75ml 간격.
- `metric_precise`: Single 150–450ml는 10ml 간격, Batch 500–1500ml는 50ml 간격.
- 451–499ml는 현재 registry에서 차단.
- `brew_ready: true`에는 `set_quantity_mode` prep step 필수.
- browser catalog build와 Firebase Functions가 같은 조건을 각각 재검증.
- UI는 water 값만 보여 주지 않고 mode, step, 설정 경로를 함께 표시.
- Harfusa v1 225ml는 `standard_cup`; v2 190ml, v3 180ml, 500ml v1의 280ml는 `metric_precise`로 schema migration. 수치나 recipe version은 변경하지 않음.

## 남은 확인

- 사용자가 Precise Units를 켠 뒤 실제 180·190·280ml가 현재 firmware에서 모두 나타나는지 한 번 확인.
- 500ml 이상 Batch 구간의 50ml 간격은 새 firmware에서 바뀔 수 있으므로 첫 Batch recipe 때 현재 기기 UI 재확인.
- Aiden이 period를 화면에 정상 표시하는지 첫 `C. ` profile 저장 echo와 기기 화면에서 확인. 표시가 다르면 숫자 recipe와 분리해 이름 charset registry를 갱신.
