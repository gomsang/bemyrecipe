# Recipe rule governance

## 목적

규칙은 레시피를 획일화하기 위한 목록이 아니다. 현재 Aiden과 데이터 구조에서 실행할 수 없는 설정은 막고, 아직 모델링하지 못한 좋은 아이디어는 잃지 않기 위한 장치다.

중앙 source는 `shared/recipe-rules.ts`다. 사이트 UI와 Markdown catalog builder가 이 파일을 함께 사용한다.

## 등급

### Hard constraint

실행하거나 저장할 수 없는 상태다.

- Aiden이 받을 수 없는 profile 값
- HOT인데 ice가 들어간 것처럼 서로 모순되는 구조
- ice strategy와 실제 중량의 불일치
- 린스 물을 버리지 않아 계산하지 않은 물이 남는 구조
- pulse count와 온도 배열 길이 불일치
- `brew_ready: true`인데 필수 실행 단계가 없는 상태

Hard constraint는 `rule_exceptions`로 우회할 수 없다.

### Adaptive constraint

레시피가 틀렸다는 뜻이 아니라 시스템의 표현력이 부족할 가능성이다.

- 기존 목록에 없는 basket 또는 accessory
- 얼음 형태, 냉동고 온도, 실내 온도처럼 새로 측정하기 시작한 조건
- 새로운 serving method
- 기존 enum에 없지만 실제 기기에서 확인된 값
- 향미 결과를 반복적으로 설명하는 새로운 변수

이 경우 build는 계속되며 recipe는 `review`가 된다. 사이트에는 system-change proposal이 표시된다.

## Markdown 계약

```yaml
ruleset_version: 2
control_conditions:
  basket: single_serve
  shower_selector: single_serve
  filter_paper: "Fellow Aiden #2 white"
  grinder_burr: ode-gen2-stock
  water: samdasoo
  vessel: tumbler-500
  ice_goal: remain_while_drinking
rule_exceptions: []
rule_extension_requests: []
```

새 통제조건을 발견하면 삭제하지 않고 그대로 기록한다.

```yaml
control_conditions:
  basket: single_serve
  shower_selector: single_serve
  filter_paper: "Fellow Aiden #2 white"
  ice_shape: large-clear-cube
rule_extension_requests:
  - condition: ice_shape
    reason: "같은 질량에서도 표면적 차이가 잔존 얼음과 희석 속도를 반복적으로 설명함"
    proposed_changes:
      - "ice_shape enum과 설명 추가"
      - "ICE PLAN UI에 형태 표시"
      - "열수지 calibration log와 연결"
      - "기존 iced recipe migration은 optional로 유지"
      - "unknown/known ice_shape rule test 추가"
```

이 recipe는 다른 hard constraint가 없다면 추출할 수 있다. Codex는 레시피와 함께 시스템 확장안을 사용자에게 권한다.

## Exception

Advisory rule을 의도적으로 벗어날 때만 사용한다.

```yaml
rule_exceptions:
  - rule_id: control.ambient_temperature_c.range
    reason: "야외 겨울 추출 calibration"
    evidence: "실측 ambient -2°C와 동일 조건 brew log 3회"
    expires_when: "outdoor thermal model이 ruleset에 추가될 때"
```

Exception은 영구 면제가 아니다. 근거와 종료조건을 함께 기록한다.

## Ruleset 확장 절차

1. 실제 recipe/log에서 반복되는 gap을 확인한다.
2. 새 조건이 machine fact, calculation input, sensory hypothesis 중 무엇인지 분류한다.
3. hard 또는 advisory 등급을 결정한다.
4. `shared/recipe-rules.ts`에 schema와 UI metadata를 추가한다.
5. `docs/RECIPE-SCHEMA.md`와 template를 갱신한다.
6. 기존 recipe의 migration 필요 여부를 결정한다. 불필요한 과거 데이터 재작성은 하지 않는다.
7. positive, blocked, review test를 추가한다.
8. 동작 의미가 바뀌면 ruleset version을 올리고 UI에 재검토 상태를 표시한다.

규칙 확장은 별도 recipe version 증가로 계산하지 않는다. 다만 새 규칙 때문에 숫자 설정이 달라지면 일반 revision 규칙에 따라 새 recipe version을 만든다.
