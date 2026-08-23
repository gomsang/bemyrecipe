# Recipe frontmatter

UI와 Aiden 동기화는 레시피 본문을 추측하지 않고 YAML frontmatter만 읽습니다. 사람이 따라 할 설명도 같은 frontmatter의 `prep_steps`로 관리합니다.

## Lineage와 version

같은 원두·음용 모드·추출 방식·컵·basket·vessel·ice goal에서 추출 설정만 개선되면 새 레시피가 아니라 기존 `lineage`의 다음 version입니다.

```yaml
lineage: harfusa-flash-315
version: 2
revision:
  kind: sensory_adjustment
  parent: harfusa-flash-315-v1
  primary_variable: grind_setting
  summary: "마르는 끝맛을 줄이기 위해 한 단계 굵게 조정"
  rationale: "v1 brew log에서 느린 drawdown과 astringency가 함께 관찰됨"
  changes:
    - "Ode Gen 2 5⅓ → 6"
  success_criteria:
    - "drawdown이 normal 범위로 돌아옴"
    - "백도 단맛을 유지하면서 혀 마름이 감소함"
```

### Convention

- 파일 id는 반드시 `<lineage>-v<version>`입니다.
- v1은 `kind: baseline`, `parent: null`, `primary_variable: null`입니다.
- v2 이상은 직전 version을 `parent`로 가리키고 번호를 건너뛰지 않습니다. `.md` 확장자는 쓰지 않습니다.
- `summary`는 목록과 version history에 보일 한 줄 변경 설명입니다.
- `rationale`은 왜 바꿨는지, `changes`는 실제 차이, `success_criteria`는 다음 brew에서 판정할 조건입니다.
- 실제 brew를 개선하는 revision은 `primary_variable` 하나만 바꿉니다. 파생 계산값은 `changes`에 함께 기록할 수 있습니다.
- Research Hold를 처음 실행 가능한 baseline으로 교정하는 경우는 `gate_completion`, 잘못 옮긴 값의 정정은 `correction`을 사용합니다.
- bean, `serve_mode`, `brew_method`, `beverage_style`, `cup_id`, `cup_capacity_ml`, basket, vessel, ice goal이 바뀌면 새 lineage입니다.
- grinder나 water처럼 보정 과정에서 확인·교체될 수 있는 조건은 같은 lineage에 둘 수 있지만 반드시 revision change로 기록합니다.

허용되는 `revision.kind`는 `baseline`, `gate_completion`, `sensory_adjustment`, `execution_adjustment`, `correction`, `equipment_adaptation`입니다. 빌드는 version 중복·누락, 잘못된 parent, identity 변경, 동일 조건의 중복 lineage를 차단합니다.

## Ruleset과 통제조건

```yaml
ruleset_version: 1
control_conditions:
  basket: single_serve
  grinder_burr: ode-gen2-stock
  water: samdasoo
  vessel: tumbler-500
  ice_goal: remain_while_drinking
rule_exceptions: []
rule_extension_requests: []
```

`control_conditions`는 계산과 재현성에 영향을 주는 recipe별 조건입니다. 현재 ruleset에 없는 key나 허용값도 삭제하지 않습니다. Validator는 이를 hard error 대신 review로 분류하고 system-change proposal을 만듭니다.

새 조건이 더 나은 레시피에 필요하면 다음처럼 기록합니다.

```yaml
rule_extension_requests:
  - condition: ice_shape
    reason: "표면적 차이가 희석 속도와 잔존 얼음을 설명함"
    proposed_changes:
      - "schema에 ice_shape 추가"
      - "ICE PLAN UI에 형태 표시"
      - "rule test와 기존 recipe migration 검토"
```

Hard constraint는 exception으로 우회할 수 없습니다. Advisory를 의도적으로 벗어나는 경우에만 `rule_exceptions`에 `rule_id`, `reason`, `evidence`, `expires_when`을 모두 기록합니다. 자세한 정책은 [RULE-GOVERNANCE.md](RULE-GOVERNANCE.md)를 따릅니다.

## 음용 방식

```yaml
serve_mode: iced       # hot | iced | cold_brew
brew_method: flash     # standard | flash | cold_drip
```

| `serve_mode` | 의미 | 허용되는 대표 조합 |
|---|---|---|
| `hot` | 추출 후 얼음 없이 뜨겁게 음용 | `brew_method: standard` |
| `iced` | 최종 음료에 얼음을 사용 | 뜨거운 물로 급랭하는 `flash` |
| `cold_brew` | Aiden Cold Brew 프로그램 | `cold_drip`; 현재 자동 기기 전송 제외 |

`iced`는 Aiden의 Cold Brew 스위치를 뜻하지 않습니다. Flash brew는 `serve_mode: iced`, `brew_method: flash`, `cold_brew_enabled: false`입니다.

## 필터 린싱

```yaml
filter_rinse:
  enabled: true
  water: hot           # hot | none
  discard_rinse_water: true
```

린스 물이 카라페에 남으면 계산하지 않은 물이 음료에 추가됩니다. Aiden에서 필터를 린싱했다면 카라페의 물을 완전히 버린 뒤 Brew ice를 넣습니다. 린싱하지 않는 레시피는 세 값을 `false`, `none`, `false`로 명시합니다.

## 얼음 계획

```yaml
ice_plan:
  strategy: split      # none | brew_only | serving_only | split
  brew_ice:
    grams: 150
    vessel: carafe
    timing: before_brew
    purpose: flash_chill
  serving_ice:
    grams: 80
    vessel: tumbler-500
    timing: before_transfer
    purpose: keep_cold
```

### Brew ice

추출 전에 빈 카라페에 넣는 얼음입니다. 뜨거운 추출액을 바로 식히고 용해되는 물로 최종 농도를 맞춥니다. 다 녹거나 대부분 녹는 것이 실패가 아닙니다.

### Serving ice

추출이 끝난 뒤 음용 컵에 새로 넣는 얼음입니다. 카라페의 음료를 옮기기 직전에 넣습니다. 마시는 동안 낮은 온도를 유지하고 얼음이 남게 하는 역할입니다.

`split`은 두 얼음을 모두 쓰는 방식입니다. 500ml 텀블러처럼 오래 차갑게 마실 때 기본 후보가 됩니다. HOT 레시피는 `strategy: none`이고 두 `grams`가 모두 0이어야 합니다.

## 준비 순서

```yaml
prep_steps:
  - id: rinse_filter
    phase: before_brew  # before_brew | after_brew | serve | hold
    label: "필터 린싱"
    instruction: "Paper filter를 뜨거운 물로 적시고 carafe의 린스 물을 완전히 버린다."
    critical: true
```

배열 순서가 실제 실행 순서입니다. 다음 내용은 본문에만 두지 말고 step으로 기록합니다.

1. 필터를 린싱하는지와 린스 물 폐기
2. Brew ice의 중량·용기·투입 시점
3. 실제 dose, 분쇄도, Aiden selected water
4. Drip finish 확인과 추출 후 swirl
5. Serving ice의 중량·용기·투입 시점
6. 이송과 기록할 측정값

`brew_ready: true`이면 step이 하나 이상 있어야 합니다. 추출하면 안 되는 연구 보류 레시피는 `phase: hold` step으로 이유를 표시합니다.

## Aiden profile 값

현재 profile schema는 앱의 선택형 입력과 같은 단위만 허용합니다.

| 필드 | 허용값 |
|---|---|
| `profile_name` | 1–50자 영문·숫자·허용 문장부호 |
| `profile_temperature_c` | 50–99°C, 0.5°C 단위 |
| `nominal_ratio` | 14–20, 0.5 단위 |
| `bloom_ratio` | 1–3, 0.5 단위 |
| `bloom_seconds` | 1–120초 정수 |
| `bloom_temp_c` | 50–99°C, 0.5°C 단위 |
| pulse count | 1–10 정수 |
| pulse interval | 1–60초 정수 |
| pulse temperature | 50–99°C, 0.5°C 단위; 개수는 count와 동일 |

Fellow 앱이나 firmware에서 값이 바뀌면 공식 문서와 실제 UI를 다시 확인한 뒤 `shared/aiden-profile.ts`와 Functions validator를 함께 수정합니다.
