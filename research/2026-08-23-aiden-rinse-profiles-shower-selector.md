---
type: research-dossier
scope: aiden-method
bean: null
recipe_lineage: all-aiden-recipes
status: complete
searched_at: 2026-08-23
latest_official_check: 2026-08-23
prepared_for: "Aiden filter rinse · 외부 profile 전이 · 물리 shower selector"
coverage:
  aiden_official: true
  ode_gen2: true
  extraction_science: true
  expert_barista: true
  aiden_community: true
  bean_specific: true
  internal_recipes: true
---

# Aiden filter rinse · 외부 profile · shower selector Research Dossier

## 조사 질문

- Aiden에서 paper filter rinse는 기기 작동 또는 향미를 위해 항상 필요한가?
- 유명 roaster와 바리스타가 공개한 Aiden profile에서 어떤 원칙을 차용할 수 있는가?
- Single Serve cone basket에서도 물리 shower selector를 Batch에 두는 것이 항상 더 나은가?
- 이 결론을 recipe source, ruleset, UI와 brew log에 어떻게 기록해야 하는가?

## 요청 조건

| 항목 | 값 | 출처/확실성 |
|---|---|---|
| Machine | Fellow Aiden · firmware 1.5.9 last verified | `PROFILE.md` + Fellow release notes · High |
| Grinder / burr | Fellow Ode Gen 2 · Stock Gen 2 Brew Burr | `PROFILE.md` · High |
| Water | 제주삼다수 | 사용자 제공 · High |
| Current bean | Ethiopia Yirgacheffe Harfusa Washed G1 · Heirloom · 1,800–2,100m · Medium–Light | 사용자 bag 정보 · High |
| Current serving | 190ml/280ml selected water의 Single Serve cone Flash brew | 현재 Candidate · High |
| Current filter | Standard #2 cone 범주; exact brand·bleaching 미기록 | 현재 recipe · Low |

## 핵심 판정

1. **Evidence:** Aiden은 자동 pre-rinse cycle이 없고, Fellow는 동봉 필터는 린스할 필요가 없다고 명시합니다. 따라서 rinse는 Aiden의 필수 작동 조건이 아닙니다.
2. **Evidence:** 일부 Fellow Aiden recipe는 rinse와 rinse-water 폐기를 권장합니다. 이는 모든 필터에 대한 보편 의무가 아니라 해당 recipe의 preparation 선택입니다.
3. **Inference:** Filter의 material·표백·보관 상태에 따라 냄새와 off-flavor 위험이 달라지므로 rinse는 `필터별 조건부 통제변수`로 다루는 것이 가장 방어 가능합니다.
4. **Evidence:** Fellow manual과 R&D 안내의 기본값은 basket과 물리 selector를 맞추는 것입니다.
5. **Hypothesis:** Single basket + Batch selector가 특정 dose/coffee에서 중앙 agitation을 줄일 수는 있지만 항상 낫다는 통제 자료는 없습니다. 공식 match를 baseline으로 두고 selector만 바꾸는 A/B가 필요합니다.
6. **Evidence:** 비교 가능한 washed Ethiopia 공식 share profile도 ratio, bloom, 온도 형태가 넓게 갈립니다. 유명 profile은 범위와 가설을 주지만 원두 범주 하나의 정답을 주지 않습니다.

## Evidence matrix

| Claim | 분류 | Source | Source 조건 | 적용성 | 신뢰도 |
|---|---|---|---|---|---|
| Aiden에는 pre-rinse cycle이 없고 동봉 필터는 rinse가 필요 없다. Manual rinse는 가능하다. | Evidence | [Fellow · Does Aiden pre-rinse the coffee filter automatically?](https://help.fellowproducts.com/hc/en-us/articles/24977666937115-Does-Aiden-pre-rinse-the-coffee-filter-automatically) | 현재 공식 support; 동봉 필터 | Aiden 기본 workflow에 직접 | High |
| Aiden single basket은 standard #2 cone, batch basket은 8–12 cup batch filter용이다. | Evidence | [Fellow · compatible filters](https://help.fellowproducts.com/hc/en-us/articles/24855205708443-What-filters-is-Aiden-compatible-with) | 공식 basket/filter 규격 | Filter identity 기록에 직접 | High |
| Fellow의 일부 Aiden recipe는 paper filter rinse를 권장하고 기기 위에서 했다면 carafe의 물을 버리라고 한다. | Evidence | [Red Rooster Holiday Drop recipe](https://fellowproducts.com/blogs/brew-talks/fellows-take-on-holiday-drop-by-red-rooster-brew-recipe), [The Well Decaf recipe](https://fellowproducts.com/blogs/brew-talks/fellows-take-on-the-well-decaf-brew-recipe) | 개별 recipe preparation | Rinse 허용과 물수지에 직접; 필요성 일반화는 불가 | High |
| Cone filter paper 7종 sensory test에서 unbleached와 bamboo가 bleached보다 냄새가 더 두드러지는 경향이 있었고 절대적 승자는 없었다. | Evidence | [Molnar · Coffee filter paper](https://www.theseus.fi/handle/10024/121013) | 7인 coffee test·9인 odor/off-flavor 평가; Aiden 아님 | Filter별 조건부 판정에 부분 적용 | Medium |
| Commercial papers는 rinse 후에도 sensory 차이가 남았고 filter 종류마다 결과가 달랐다. | Roaster experiment | [Stumptown · The Facts About Filters](https://www.stumptowncoffee.com/blogs/news/the-facts-about-filters) | Roaster bench comparison; 오래된 자료, 정량 blind protocol 제한 | Paper identity가 rinse보다 먼저라는 방향 | Medium-Low |
| 한 분석 poster에서 특정 filter compound가 water rinse 후 감소했다. | Evidence with limitation | [Agilent · compounds released from coffee filter paper](https://www.agilent.com/cs/library/posters/public/po-7250-asms-2021-tp347-en-agilent.pdf) | 세 commercial papers, chemical analysis; sensory/Aiden 직접 검증 아님 | Rinse가 일부 물질을 줄일 수 있다는 보조 근거만 | Medium-Low |
| Fellow는 Single/Batch용 두 basket과 showerhead를 각각 최적 extraction을 위해 설계했다고 설명한다. | Evidence | [Fellow · Batch Brew vs Single Serve](https://help.fellowproducts.com/hc/en-us/articles/24855355575195-What-s-the-difference-between-batch-brew-and-single-serve-Getting-Started-With-Aiden-Pt-8) | 공식 R&D 설명 | 기본 match에 직접 | High |
| Manual은 one green dot을 Single basket, three blue dots를 Batch basket에 맞추라고 한다. | Evidence | [Fellow Aiden get-to-know-you guide](https://www.talkcoffee.com.au/wp-content/uploads/2024/04/Fellow-Aiden-User-Manual.pdf) | 공식 guide 사본 | 물리 실행에 직접 | High |
| Selector mismatch는 extraction에 큰 영향을 줄 수 있으므로 brew volume과 basket에 맞추라는 독립 retailer guide가 있다. | Expert product guidance | [Seattle Coffee Gear Aiden guide](https://www.seattlecoffeegear.com/pages/product-resources/fellow-aiden-coffee-maker-product-guide) | 제품 교육; 제조사 외 자료 | Mismatch 위험의 보조 근거 | Medium |
| Aiden의 basket별 물 분포는 edge-to-edge wetting을 맞추려는 설계라고 설명된다. | Expert product overview | [Prima Coffee Aiden overview](https://prima-coffee.com/blog/video-overview-fellow-aiden-precision-coffee-maker/) | 장비 overview·Fellow 설명 인용 | Basket/selector match 원리의 보조 근거 | Medium |
| 일부 사용자는 Single basket + Batch selector가 crater를 줄이거나 더 맛있다고 보고한다. | Community hypothesis | [Single-serve bed discussion](https://www.reddit.com/r/FellowProducts/comments/1rnq274/aiden_coffee_bed_single_serve/), [two mugs discussion](https://www.reddit.com/r/FellowProducts/comments/1j6l4g7/) | 조건·반복·TDS 불완전 | A/B 후보만 제공 | Low |
| 다른 사용자는 mismatch에서 watery cup, bypass 또는 충분하지 않은 extraction을 보고한다. | Community negative report | [500ml green basket discussion](https://www.reddit.com/r/FellowProducts/comments/1h4fu1w/), [showerhead configuration discussion](https://www.reddit.com/r/FellowProducts/comments/1pfyyzq/aiden_shower_head_configuration/) | 조건·측정 불완전 | 항상 Batch라는 주장에 대한 반대 사례 | Low |
| 공식 Light profile은 1:17, bloom 1:3·45초·99°C, Single 3×23초·99°C다. | Evidence | [Fellow pre-installed profiles](https://help.fellowproducts.com/hc/en-us/articles/29539043135515-What-are-the-pre-installed-brew-profiles-Aiden-offers) | 범용 Light roast | Machine baseline, bean 최적값 아님 | High |
| Aiden custom profile에서 temperature와 ratio만 필수이며 bloom과 Single pulses는 advanced 선택이다. | Evidence | [Fellow custom profile guide](https://help.fellowproducts.com/hc/en-us/articles/31203208491419-How-do-I-create-share-and-receive-a-custom-Brew-Profile-in-the-Fellow-Brew-with-Aiden-app) | 현재 앱 구조 | Pulse가 물리 selector와 별개임을 확인 | High |
| 유사한 ONA Sidamo Bensa public profile은 1:15, bloom 1:3·35초·94°C, Single 3×23초·92→91→90°C다. | Evidence | [Fellow ONA Bensa page](https://fellowproducts.com/blogs/brew-talks/fellows-take-on-ethiopia-bensa-sidamo-by-ona-brew-recipe), [public profile cQKs](https://brew.link/p/cQKs) | Washed Heirloom, 1,950–3,000m, Medium–Light, 7–20일 | Harfusa에 가장 가까운 roast/process 비교; flash 아님 | Medium-High |
| ilse Chelbesa public profile은 1:17, bloom 1:3·60초·97°C, Single 3×25초·97°C다. | Evidence | [Fellow ilse Chelbesa page](https://fellowproducts.com/blogs/brew-talks/fellows-take-on-ilse-coffee-chelbesa-brew-recipe), [public profile AHq2](https://brew.link/p/AHq2) | Yirgacheffe, Washed landrace, 2,200m, Light | Origin·notes가 매우 가까우나 더 light, hot profile | Medium-High |
| Tandem Gure Kesso public profile은 1:16.5, bloom 1:3·45초·95°C, Single 3×23초·95°C다. | Evidence | [Fellow Tandem Gure Kesso page](https://fellowproducts.com/blogs/brew-talks/fellows-take-on-tandem-coffee-roasters-ethiopia-gure-kesso-brew-recipe), [public profile Zisb](https://brew.link/p/Zisb) | Jimma, Washed landrace, 2,100–2,150m, Light | Washed Ethiopia 범위 확인; exact origin/roast 다름 | Medium-High |
| Proud Mary washed Red Bourbon profile은 1:15, bloom 1:2.5·60초·92°C, Single 3×25초다. | Evidence | [Fellow · Proud Mary Warm & Fuzzy](https://fellowproducts.com/blogs/brew-talks/fellows-take-on-warm-fuzzy-by-proud-mary-coffee-brew-recipe) | El Salvador, washed Red Bourbon, Medium, chocolate/brown sugar/orange | Roast/process effect 비교; Harfusa 숫자 이식 불가 | Medium |
| Red Rooster의 밝은 blend와 진한 blend는 1:17/1:16, 95°C flat-near/92→90.5°C 등 서로 다른 profile을 쓴다. | Evidence | [Fellow · Red Rooster Holiday Drop](https://fellowproducts.com/blogs/brew-talks/fellows-take-on-holiday-drop-by-red-rooster-brew-recipe) | Multi-origin blends, 목표 향미 다름 | Flavor goal에 따라 profile이 달라짐을 보여줌 | Medium |
| Current Harfusa Candidate는 1:14 nominal이나 actual dose가 더 많아 actual hot ratio와 actual bloom이 public profile과 다르다. | Internal calculation | [315ml v2](../recipes/candidates/sbr-harfusa-flash-315-v2.md), [500ml v1](../recipes/candidates/sbr-harfusa-flash-500-v1.md) | Flash concentrate, split ice, 삼다수, Ode Stock | 외부 nominal ratio 직접 이식 금지에 직접 | High |

## 분야별 합성

### Aiden 공식·기계

Fellow의 현재 FAQ는 가장 직접적입니다. 동봉 paper는 rinse가 필요 없고, 기기에는 자동 rinse cycle이 없습니다. 따라서 `Aiden이기 때문에 반드시 rinse`라는 규칙은 제거해야 합니다. Manual rinse는 허용되므로 recipe가 이를 선택했다면 물수지와 순서를 명시해야 합니다.

물리 selector는 profile editor에 저장되는 temperature/ratio/bloom/pulse와 다른 하드웨어 상태입니다. 공식 workflow는 Single Serve cone에 one green dot, Batch basket에 three blue dots를 맞춥니다. 기기가 mismatch 경고를 넘길 수 있어도 공식 최적 조합이 바뀌지는 않습니다.

### Filter material과 rinse

Filter paper 연구와 roaster 비교는 종이마다 냄새와 flow 특성이 다르다는 데는 일치하지만, 모든 bleached paper에서 rinse가 sensory 차이를 만든다고 증명하지는 않습니다. Unbleached/bamboo/오염 냄새는 rinse 권장 쪽의 근거가 강하고, Fellow supplied white paper는 제조사 지침상 생략 가능합니다.

**Inference:** Rinse를 binary 취향으로만 저장하면 원인을 놓칩니다. `filter_paper`를 같이 기록해야 합니다. Rinse 유무보다 filter brand/lot가 바뀌는 편이 flow와 odor를 동시에 바꿀 수 있습니다.

### 외부 roaster·barista profile 비교

ONA는 World Barista Champion Saša Šestić가 세운 roaster이고, ilse·Tandem·Proud Mary·Red Rooster도 Fellow가 coffee별 Aiden profile을 공개했습니다. 이 자료의 장점은 Aiden이 받을 실제 payload와 coffee 설명을 함께 볼 수 있다는 점입니다. 단점은 대부분 dose, selected volume, water, sensory result가 완전히 공개되지 않아 `좋았다는 검증`과 `설정 공개`가 같지 않다는 점입니다.

#### Washed Ethiopia 정규화 비교

| Coffee | Harfusa와의 관계 | Nominal ratio | Bloom | Single Serve pulses | Ode Gen 2 range | 전이 판정 |
|---|---|---:|---|---|---|---|
| ONA Ethiopia Sidamo Bensa | Washed Heirloom, Medium–Light, high altitude, florals/stone fruit | 1:15 | 1:3 · 35s · 94°C | 3 · 23s · 92→91→90°C | 4–5.1 | 가장 가까운 temperature-shape anchor; hot/flash 차이로 숫자 직접 이식 금지 |
| ilse Ethiopia Chelbesa | 같은 Yirgacheffe, Washed landrace, peach/citrus/tea; 더 Light | 1:17 | 1:3 · 60s · 97°C | 3 · 25s · 97°C flat | 3.2–4.2 | Origin/note anchor; 더 높은 extraction demand를 Harfusa에 그대로 적용하지 않음 |
| Tandem Ethiopia Gure Kesso | Washed landrace, Light, 2,100m대, orange/tea | 1:16.5 | 1:3 · 45s · 95°C | 3 · 23s · 95°C flat | 3.2–5 | 중간 범위 anchor; exact region과 roast 차이 유지 |
| Current Harfusa Candidates | Medium–Light, Flash concentrate, split ice, actual dose > machine assumption | 1:14 nominal | 1:3 nominal · 45s · 95°C; actual 약 1:2.4 | 3 · 23/28s · 94→93→92°C | 5⅓ | 외부 범위 안의 완만한 decline이지만 actual ratio/bloom과 iced 목적이 고유함 |

공통적으로 nominal bloom 1:3과 Single 3 pulses가 보이지만 온도와 시간은 크게 갈립니다. ONA profile은 현재 Harfusa의 declining 방향을 지지하는 가장 가까운 비교이고, ilse와 Tandem의 flat profile은 declining이 보편 법칙이 아니라는 반대 증거입니다.

### Aiden 커뮤니티

Batch selector를 Single basket에 쓰는 사용자 경험은 두 방향으로 갈립니다. 중앙 jet/crater가 줄고 cup이 좋아졌다는 보고와, watery/bypass/낮은 extraction 보고가 모두 있습니다. Dose, filter, grind, water, pulse, TDS가 통제되지 않아 우열을 일반화할 수 없습니다.

커뮤니티의 가치는 `selector를 agitation 변수로 시험할 수 있다`는 가설에 있습니다. Machine limit나 항상 더 좋은 기본값의 근거로 사용하지 않습니다.

### 내부 recipe와 현재 Harfusa

현재 315ml v2와 500ml v1은 Aiden selected water가 각각 190ml와 280ml라 공식 Single Serve 영역입니다. Basket은 Single Serve cone이고 물리 selector도 one green dot이 기본입니다. 두 recipe의 rinse는 유지하되, 필터 종류가 미기록이므로 `필수`가 아니라 version의 재현성 통제조건으로 재분류합니다.

## 충돌과 결정

| 충돌 | 선택 | 이유 | 틀렸을 때 관찰될 것 |
|---|---|---|---|
| Fellow supplied filter는 no-rinse 가능 vs Fellow recipe의 rinse 권장 | Rinse를 조건부 통제변수로 정의 | 기기 필요성과 개별 recipe 선택을 분리하며 filter research의 material 차이를 반영 | 같은 filter의 blind A/B에서 반복 차이가 있으면 해당 filter 기본값을 갱신 |
| Manual dripper의 preheat 논리 vs Aiden closed chamber/Flash brew | Preheat를 Aiden rinse의 필수 이유로 쓰지 않음 | Aiden thermal path가 다르고 Flash는 rinse water 잔존이 희석 오류를 만듦 | No-rinse에서 repeatable temperature/extraction 차이가 나면 개인 log에 보정 |
| 공식 basket-selector match vs 일부 사용자의 Batch-for-Single 선호 | 공식 match를 baseline, mismatch를 advisory A/B로 허용 | 공식 설계와 독립 guide가 match를 지지하고 community 결과가 충돌 | 최소 2×2회 개인 A/B에서 mismatch가 sensory/TDS 모두 우월하면 recipe별 채택 |
| 유사 washed Ethiopia의 90–97°C, 1:15–1:17 범위 | 단일 숫자가 아니라 compatibility matrix 사용 | Roast, ratio, rest, volume, water와 serving 차이가 큼 | 개인 brew log가 특정 범위를 반복 지지하면 Harfusa lineage 우선순위가 외부 자료를 대체 |
| ONA declining vs ilse/Tandem flat | Harfusa에서 완만한 decline을 hypothesis로 유지 | ONA가 roast/process/variety가 가장 가깝고 Harfusa의 harsh finish 회피 목표와 맞음 | 시고 비고 단맛이 없으며 drawdown 정상이라면 grind를 먼저, 이후 temperature 검토 |

## Harness와 ruleset 반영

- `HARNESS.md`에 filter-specific rinse decision table을 추가합니다.
- `control_conditions.filter_paper`를 추가해 rinse와 paper identity를 함께 기록합니다.
- `control_conditions.shower_selector`를 추가하고 basket과 다른 경우 hard block이 아닌 `review`로 표시합니다.
- Brew-ready recipe는 `set_shower_selector` prep step을 가져야 합니다.
- UI에서 physical selector를 Filter Rinse보다 앞에 별도 표시합니다.
- `shower_selector`와 `filter rinse on/off`를 primary variable 목록에 추가합니다.
- 외부 profile은 coffee/machine/environment/outcome matrix를 채운 뒤 numeric anchor, directional evidence, hypothesis only로 분류합니다.

## 현재 recipe 적용

| 항목 | 315ml v2 | 500ml v1 | 판정 |
|---|---|---|---|
| Basket | Single Serve cone | Single Serve cone | 유지 |
| Selected water | 190ml | 280ml | 모두 Single Serve 영역 |
| Physical selector | one green dot / Single | one green dot / Single | 명시적으로 추가 |
| Filter | Standard #2 cone, exact product 미기록 | Standard #2 cone, exact product 미기록 | 다음 brew에서 brand/bleached 확인 |
| Rinse | Hot rinse / discard | Hot rinse / discard | 이 version의 통제조건으로 유지; 보편 필수 표현 제거 |
| Profile | 95 bloom, 94→92°C | 95 bloom, 94→92°C | ONA와 방향이 가깝지만 Flash actual ratio 때문에 외부 숫자 직접 이식 안 함 |

## 개인 검증 계획

### Rinse A/B

1. Exact filter brand, size, white/brown, 개봉일을 기록합니다.
2. 같은 water로 filter만 통과시킨 물과 control water를 blind 비교합니다.
3. 차이가 없으면 같은 Harfusa recipe를 rinse/no-rinse 각 2회, 순서를 교차해 비교합니다.
4. Drawdown, final weight, aroma clarity, papery/woody finish를 기록합니다.
5. 차이가 반복되지 않으면 Fellow supplied/neutral filter의 기본은 no-rinse로 단순화할 수 있습니다.

### Shower selector A/B

1. 먼저 공식 `Single basket + Single selector`로 현재 Candidate를 최소 1회 정상 추출합니다.
2. 다른 모든 값을 고정하고 다음 brew에서 selector만 Batch로 바꿉니다.
3. 각 조건을 최소 2회 반복합니다.
4. Bed 사진, central crater/dry edge, drawdown, final beverage, 가능하면 TDS/EY, 처음/5분 후 taste를 기록합니다.
5. Batch selector가 반복 우월할 때만 새 Candidate version의 `primary_variable: shower_selector`로 기록합니다.

## Coverage gaps와 한계

- Fellow는 공개 문서에서 Single basket + Batch selector의 비교 TDS/EY나 blind sensory 결과를 제공하지 않았습니다.
- Community mismatch 보고는 filter, dose, water, grind, pulse가 통제되지 않았습니다.
- Public Drops payload에는 사용자가 실제 선택한 water volume, actual dose, water chemistry와 결과 측정이 대개 없습니다.
- Current Harfusa의 exact filter brand/bleached 여부가 미기록입니다.
- Current Harfusa Candidate는 아직 brew log가 없어 외부 profile보다 높은 개인 근거가 없습니다.
- 450ml 경계의 문구가 자료마다 `up to 450ml`와 `less than 450ml`로 다르게 표현될 수 있으므로 정확히 450ml 사용 시 현재 기기 UI를 최종 기준으로 합니다.

## Gate 판정

- Research status: **complete** — 세 질문에 필요한 공식, 연구/전문가, profile payload, 상반 community 자료와 내부 적용을 확보
- Intake status: **not applicable** — 새 숫자 recipe 생성이 아니라 공통 Harness/ruleset 조사
- Numeric recipe allowed: **기존 Candidate 유지**; 이번 조사만으로 temperature/grind를 변경하지 않음
- 다음 행동: 현재 Harfusa 첫 brew에서 exact filter와 selector를 기록한 뒤, 필요할 때 rinse 또는 selector 한 변수 A/B 실행
