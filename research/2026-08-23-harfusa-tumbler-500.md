---
type: research-dossier
bean: ../beans/ethiopia-harfusa.md
recipe_lineage: harfusa-flash-500
status: sufficient-with-gaps
searched_at: 2026-08-23
latest_official_check: 2026-08-23
prepared_for: "Flash brew · 500ml tumbler · carafe ice + serving ice · ice remaining"
coverage:
  aiden_official: true
  ode_gen2: true
  extraction_science: true
  expert_barista: true
  aiden_community: true
  bean_specific: partial
  internal_recipes: true
---

# Harfusa · 500ml Tumbler Flash brew · Research Dossier

## 조사 질문

- 500ml 텀블러에 최소 30ml headspace를 남기면서, 급랭 뒤 마시는 동안 얼음이 남게 하려면 hot water와 두 종류 얼음을 어떻게 나눌 것인가?
- 9일차 Medium–Light washed Ethiopia를 제한된 hot water로 충분히 추출하면서 베르가못의 선명도와 백도의 단맛을 균형 있게 얻으려면 어떤 Aiden/Ode 기준점이 가장 방어 가능한가?
- 삼다수의 낮은 Ca/Mg 함량과 미확인 alkalinity를 첫 baseline에서 어떻게 취급할 것인가?

## 요청 조건

| 항목 | 값 | 출처/확실성 |
|---|---|---|
| Bean / roast / process | Ethiopia Yirgacheffe Harfusa Washed G1 · Medium–Light · 2026-08-14 roast | 사용자 제공 · High |
| Tasting goal | 베르가못의 선명도와 백도의 단맛을 균형 있게; 향긋한 오렌지필은 살리고 마르는 껍질 쓴맛은 회피 | 사용자 제공 + 우선순위 미정에 대한 baseline 가정 |
| Basket / volume | Aiden Single Serve cone · 선택 brew water 450ml 이하 | 공식 volume 경계 + recipe 설계 |
| Cup / ice geometry | 500ml tumbler · carafe 급랭 얼음 + fresh serving ice · 470ml 이하 · 얼음 잔존 | 사용자 승인 · High |
| Grinder / burr | Fellow Ode Gen 2 · Stock Gen 2 Brew Burr | `PROFILE.md` · High |
| Water | 제주삼다수 | 사용자 제공 · High; alkalinity는 미기록 |

## Evidence matrix

| Claim | 분류 | Source | Source 조건 | 현재 요청 적용성 | 신뢰도 |
|---|---|---|---|---|---|
| 2026-08-23 확인 시 Fellow가 공개한 최신 Aiden firmware는 1.5.9다. | Evidence | [Fellow firmware notes](https://help.fellowproducts.com/hc/en-us/articles/29196666277019-What-is-the-current-firmware-version-for-Aiden-and-what-did-it-update) | 2026-06-03 게시; 사용자 기기 설치 여부는 별도 | 현재 기능 기준 확인에 직접 | High |
| Aiden Single Brew는 150–450ml이고 Ode Gen 2 공식 출발점은 5⅓이다. Fellow는 굵게 시작해 astringency 직전까지 곱게 이동하라고 안내한다. | Evidence | [Fellow Aiden grinder guide](https://help.fellowproducts.com/hc/en-us/articles/29101533994267-How-should-I-dial-in-my-grinder-when-brewing-with-Aiden-Getting-Started-With-Aiden-Pt-3) | 범용 roast/물; Stock Burr | basket/volume과 grind anchor에 직접, 최적값은 아님 | High |
| Cone basket Instant Brew는 넘침 방지를 위해 450ml에서 제한된다. | Evidence | [Fellow cone-basket volume limit](https://help.fellowproducts.com/hc/en-us/articles/25293565052699-Why-didn-t-Aiden-s-water-tank-drain-completely-during-Instant-Brew-with-the-cone-filter-basket) | 공식 기계 안전 동작 | 280ml 선택 water가 cone 영역임을 확인 | High |
| 공식 Light profile은 1:17, bloom 1:3·45초·99°C, 3 pulses·23초·99°C이고 Medium은 1:16, bloom 1:2·30초·96°C, 3 pulses·23초·96°C다. | Evidence | [Fellow pre-installed profiles](https://help.fellowproducts.com/hc/en-us/articles/29539043135515-What-are-the-pre-installed-brew-profiles-Aiden-offers) | 범용 roast profile; flash 아님 | 상·하한 baseline으로 부분 적용 | High |
| Custom profile의 필수값은 온도와 명목 coffee-to-water ratio이며 bloom과 Single Serve pulses는 고급 변수다. | Evidence | [Fellow custom profile guide](https://help.fellowproducts.com/hc/en-us/articles/31203208491419-How-do-I-create-share-and-receive-a-custom-Brew-Profile-in-the-Fellow-Brew-with-Aiden-app) | 현재 app/profile 구조 | 입력 구조 확인에 직접 | High |
| Aiden에는 scale이 없으므로 화면 dose guidance는 실제 투입량 측정값이 아니다. | Evidence | [Fellow built-in grinder/scale FAQ](https://help.fellowproducts.com/hc/en-us/articles/24940406053915-Does-Aiden-feature-a-built-in-coffee-grinder-or-scale) | 공식 기기 설명 | 실제 25g과 machine-assumed 20g을 분리하는 데 직접 | High |
| 높은 dose·미분·빠듯한 pulse는 overflow 위험을 높일 수 있고, Fellow는 굵게 하거나 pulse 간격을 약 5초 늘리는 방향을 제시한다. | Evidence | [Fellow overflow guidance](https://help.fellowproducts.com/hc/en-us/articles/31743634624667-How-to-Prevent-Overflowing-When-Brewing-with-Aiden) | 범용 troubleshooting | 25g washed Ethiopia에서 28초 interval 선택에 직접 | High |
| Fellow의 유사한 washed Ethiopia Sidamo Bensa는 Heirloom, 1,950–3,000m, Medium–Light이며 7–20일차 사용을 전제로 Aiden Single Serve Ode Gen 2 4–5⅓ 범위를 제시한다. | Evidence with transfer limit | [Fellow · Ethiopia Sidamo Bensa by ONA](https://fellowproducts.com/blogs/brew-talks/fellows-take-on-ethiopia-bensa-sidamo-by-ona-brew-recipe) | 다른 산지·lot; 같은 process/roast family; 사용자는 roast 9일차 | grind 범위와 rest 적용성은 높음, 온도 숫자 직접 이식 불가 | Medium-High |
| Ode Gen 2 Stock Burr는 64mm flat burr이며 Fellow는 Gen 2 burr가 Standard burr보다 더 곱게 갈 수 있다고 명시한다. | Evidence | [Ode Gen 2 gear guide](https://fellowproducts.com/pages/gear-guide-ode/search), [Gen 2 burr grind guide](https://help.fellowproducts.com/hc/en-us/articles/9962302561819-What-are-the-recommended-grind-settings-for-Ode-Gen-2-Brew-Burrs) | 제조사 설명 | burr 종류 확인에 직접; dial 간 절대 입도 보장은 아님 | High |
| Aiden 직접 측정 리뷰에서 50–99°C 단계 전환과 20–21% extraction이 관찰됐고, Medium roast에는 93→88°C declining profile이 고정 고온보다 덜 거칠었다. | Evidence / expert measurement | [Coffee Chronicler Aiden review](https://coffeechronicler.com/fellow-aiden-review/) | 다른 원두·물; affiliate 공개; 수개월 사용·온도 probe·refractometer | Aiden의 높은 추출 능력과 declining 방향은 관련, 숫자는 부분 적용 | Medium |
| Aiden의 닫힌 brew chamber와 높은 slurry 열 유지 때문에 수동 pour-over 숫자를 그대로 옮기지 말아야 한다는 관찰이 있다. | Expert observation | [James Hoffmann Aiden review](https://www.youtube.com/watch?v=lUFTOeT9fcE) | 비교 리뷰; exact bean 아님 | 고정 99°C를 피하는 보조 근거 | Medium |
| 87/90/93°C에서 strength와 extraction을 맞추면 drip coffee의 sensory 차이가 작았다. 온도는 flavor label이 아니라 extraction dynamics 변수로 취급해야 한다. | Evidence / research | [Batali et al., Scientific Reports 2020](https://escholarship.org/uc/item/7200z8cg) | 통제된 hot drip, iced/Aiden 아님 | 온도로 특정 향미를 보장하지 않게 하는 직접 제약 | High |
| Ca²⁺, Mg²⁺ 등 용존 이온은 coffee compound 추출에 영향을 주며, bicarbonate/alkalinity는 산미 인지를 바꿀 수 있다. | Evidence / research | [Hendon et al., J. Agric. Food Chem. 2014](https://pubs.acs.org/doi/10.1021/jf501687c) | 계산화학과 추출 맥락; 특정 생수 sensory test 아님 | 삼다수 변수를 기록해야 하는 이유에 직접 | High |
| 삼다수 공개 무기물 범위는 Ca 2.5–4.0mg/L, Mg 1.7–3.5mg/L다. 이를 CaCO₃ equivalent로만 환산하면 경도 약 13–24mg/L 범위이나 alkalinity는 이 표로 알 수 없다. | Evidence + calculation | [광동제약 제주삼다수 제품정보](https://www.ekdp.com/product/items_view.do?s=371) | 제품 공개 범위; bottle별 실제값·HCO₃⁻ 미기록 | 낮은 경도 추정은 가능, 산미 buffer 단정은 불가 | Medium-High |
| Hot concentrate를 carafe ice로 급랭한 뒤 fresh serving ice에 붓는 방식은 급랭 희석과 음용 중 냉각을 분리한다. | Expert method | [James Hoffmann iced filter guide](https://www.youtube.com/watch?v=PApBycDrPo0), [Joe Coffee flash brew guide](https://joecoffeecompany.com/blogs/all-articles/how-to-make-flash-brewed-iced-coffee) | 수동 filter; Aiden 아님 | 역할 분리 원칙은 직접 적용, 비율은 열수지로 재계산 | Medium |
| Aiden iced community recipe의 ‘표시 물 절반을 ice로 하고 dose를 두 배’ 접근은 어떤 사용자에게는 지나치게 강했고, 450ml cone brew도 비공식적으로 시도됐다. | Community disagreement | [Aiden iced coffee profile discussion](https://www.reddit.com/r/FellowProducts/comments/1j5d40m/aiden_iced_coffee_profile/) | dose/burr/water·최종 희석 불완전 | 단순 배수 규칙을 채택하지 않는 반대 근거 | Low |
| 최근 Aiden+Ode 사용자는 5 아래에서 과다 추출을 겪었다고 보고했지만, 같은 thread의 94→91°C·Ode 6.2 성공 사례는 다른 washed coffee·RO/TWW·4주 rest 조건이었다. | Community disagreement | [Aiden and Ode 2 troubleshooting](https://www.reddit.com/r/pourover/comments/1vlitet/struggle_with_aidan_and_ode_2_combo/) | 다른 원두·물·rest | 5보다 곱게 시작하지 않는 안전 방향만 제공 | Low |
| Ethiopia Drops profile의 Ode 3.2·7 pulses는 해당 사용자에게 astringent했고, 다른 사용자는 Medium profile을 선호했다. | Community negative report | [Ethiopia Danche Aiden discussion](https://www.reddit.com/r/FellowProducts/comments/1gubnfo/strange_aiden_recipe_from_drops/) | 다른 Ethiopia/lot, water 불명 | 매우 고운 grind·많은 pulse를 피하는 반대 근거 | Low |
| Washed Ethiopia 사용자 사이에도 Ode 7에서 bitter, 낮은 온도·fine grind 성공, 공식 Light 성공 등 상반된 보고가 공존한다. | Community conflict | [Washed Ethiopia Aiden discussion](https://www.reddit.com/r/FellowProducts/comments/1hnlr10/new_aiden_user_looking_for_guidance/) | Sidama 등 다른 lot; 조건 불완전 | community 수치를 평균내지 않아야 함을 보여줌 | Low |
| Harfusa/Hafursa 자료는 Yirgacheffe G1, heirloom, smallholder 맥락을 지지하지만 2024 crop이며 사용자의 exact roaster/lot는 아니다. | Evidence with limitation | [Project Origin · Yirgacheffe G1 Hafursa](https://projectorigin.coffee/wp-content/uploads/2024/08/ETH_Yirgacheffe_2024.pdf) | 다른 crop/seller | station 맥락만 부분 적용; bag facts 대체 금지 | Medium-Low |
| 내부 315ml v1은 4⅓과 얼음 110g의 근거가 약하고 자체 열수지에서도 얼음 잔존에 실패해 Research Hold다. | Internal evidence | [315ml v1 Research Hold](../recipes/candidates/harfusa-flash-315-v1.md) | 같은 bean, 다른 cup; 미추출 | 실패한 serving geometry를 반복하지 않는 데 직접 | Medium |

## 분야별 합성

### Aiden 공식·기계

선택한 280ml는 최종 500ml 음료량이 아니라 coffee bed에 전달되는 hot brew water이며 Single Serve cone 영역입니다. Aiden에는 scale이 없으므로 명목 1:14에서 표시되는 20g은 실제 dose가 아닙니다. 실제 25g을 따로 계량해야 합니다. 공식 Light 99°C는 범용 hot brew이고, 현재 요청은 Medium–Light concentrate이므로 그대로 쓰지 않습니다. 25g bed와 Ethiopia fines 위험에는 공식 23초보다 5초 늘린 28초 pulse interval을 overflow 방지 가설로 씁니다.

### Ode Gen 2 Stock Burr

공식 Single Brew anchor 5⅓과, 조건이 가까운 Fellow washed Ethiopia의 4–5⅓ 범위가 겹칩니다. 제한된 hot water 때문에 더 곱게 갈 유인이 있지만 개인 drawdown 데이터가 없고 커뮤니티의 very-fine 실패도 있습니다. 첫 잔은 겹치는 범위의 가장 굵은 쪽인 5⅓에서 시작합니다. 영점·seasoning이 미기록이므로 이는 calibrated starting point이지 보편 입도가 아닙니다.

### 추출 과학

온도만으로 베르가못이나 백도를 만든다고 해석하지 않습니다. 25g/280ml의 actual hot ratio 1:11.2는 concentrate이므로 충분한 wetting과 contact가 필요하지만, 최종 strength는 녹은 얼음까지 포함해 판단해야 합니다. 삼다수는 공개 Ca/Mg 기준으로 낮은 경도 범위이나 alkalinity가 없어 ‘산미가 무조건 선명해진다’고 단정하지 않습니다.

열수지는 `HARNESS.md`의 0°C 얼음, 65°C drop, 5°C target 가정을 사용합니다. Hot beverage 230g에 필요한 얼음은 약 163g입니다. 총 230g ice를 넣으면 약 67g이 남습니다. 실제 freezer ice가 0°C보다 낮으면 더 많이 남을 수 있지만, 텀블러 열용량·실내 열유입은 반대 방향이므로 첫 brew 측정이 우선입니다.

### 독립 전문가·바리스타

Hoffmann과 Coffee Chronicler의 공통 적용점은 Aiden의 열 유지와 추출 능력을 수동 pour-over처럼 취급하지 않는 것입니다. Coffee Chronicler의 93→88°C medium 실험은 방향성은 유용하지만 이 bean보다 더 어두운 roast일 수 있습니다. 따라서 95°C bloom 뒤 94→93→92°C의 완만한 하강을 사용해 extraction 부족과 거친 finish 사이를 시험합니다. Flash brew에서는 carafe ice와 fresh serving ice의 역할만 가져오고 비율은 새 열수지로 정합니다.

### Aiden 커뮤니티

동일 grinder 이름만으로도 3대 fine grind, 공식 5⅓, 6–7대 coarse grind가 모두 성공·실패 사례에 등장합니다. 물, calibration, dose, rest가 달라 평균값은 의미가 없습니다. 공통적으로 높은 dose/fines에서는 standing water와 bitterness를 함께 확인해야 하므로 첫 잔에 drawdown과 basket 잔수를 필수 기록합니다.

### 원두·로스터·생산지

원두 사실은 사용자 bag 정보가 최우선입니다. 정확한 roaster가 미기록이고 외부의 exact lot 일치를 확인하지 못했으므로 Project Origin의 Hafursa 자료는 지역 맥락만 제공합니다. Fellow의 Sidamo Bensa는 exact bean이 아니라 process·roast·고도·rest가 가까운 비교 사례입니다. 8월 14일 roast는 오늘 9일차여서 그 자료의 7–20일 window에는 들어갑니다.

### 개인 유사 recipe와 log

Accepted Recipe와 brew log는 아직 없습니다. 315ml v1은 미추출 Research Hold이므로 맛 숫자는 가져오지 않고, ‘headspace와 잔존 얼음을 열수지로 먼저 해결한다’는 교훈만 가져옵니다. 500ml v1은 별도 lineage의 baseline입니다.

## 충돌과 결정

| 충돌 | 선택 | 이유 | 틀렸을 때 관찰될 것 |
|---|---|---|---|
| 공식 Light 99°C flat vs Medium 96°C flat vs 전문가의 더 낮은 declining profile | Bloom 95°C, pulses 94→93→92°C | Medium–Light, 9일차, concentrate의 추출 필요와 orange-peel harshness 위험을 절충 | 정상 drawdown인데 날카롭고 비며 단맛이 없으면 grind 우선; 밸런스는 좋고 후미만 거칠면 last pulse temperature 검토 |
| 공식 Ode 5⅓ vs 유사 Fellow 4–5⅓ vs community 3–7대 | 5⅓ | 최신 공식 anchor와 유사 bean 범위가 겹치고, 미분/고 dose의 실패 비용이 더 큼 | 빠르고 얇고 시며 단맛 부족이면 1 click finer; 느리고 떫으면 1 click coarser |
| 더 많은 hot water로 extraction 확보 vs 더 많은 ice로 잔존·headspace 확보 | 25g · 280ml hot · 150g brew ice · 80g serving ice | 40ml headspace와 보수적 67g ice remaining을 유지하면서 initial cold liquid 약 1:15.7 확보 | 약하면 ice가 아니라 drawdown/추출 증상을 먼저 구분; 얼음이 안 남으면 actual output과 cup load 재측정 |
| 315ml v1의 단순 ice split vs 500ml의 긴 음용 시간 | Brew ice와 serving ice를 별도 역할로 설계 | 카라페 약 8°C 급랭 후 fresh ice가 최종 5°C와 장시간 냉각을 담당 | 카라페에서 얼음이 많이 남거나 텀블러 얼음이 빨리 사라지면 drop temp/ice start temp 가정이 틀린 것 |
| 삼다수 low-hardness 추정 vs alkalinity 미확인 | 물은 고정하되 profile을 추가 변경하지 않음 | Ca/Mg만으로 acidity buffering을 예측할 수 없음 | 같은 recipe에서 산미가 지나치게 날카롭거나 둔하면 물 성분/다른 물 비교를 별도 실험 |

## Setting rationale

| Recipe setting | Evidence / inference | Confidence | 첫 brew 검증 |
|---|---|---|---|
| 25g / 280ml / 150g + 80g ice | 500ml cup load 460g, headspace 40ml, 0°C model ice remaining 67g | Medium; RF/drop temp 미교정 | carafe final mass, transfer temp, tumbler load, ending ice |
| Nominal 1:14 | UI의 machine-assumed 20g과 actual 25g을 의도적으로 분리; bloom 60g 확보 | Medium | 실제 dose 확인, profile 화면 값 |
| Ode 5⅓ | 공식 Single Brew anchor와 유사 washed Ethiopia 범위의 공통점 | Medium | drawdown, standing water, astringency, clarity |
| Bloom 1:3 · 45s · 95°C | 실제 bloom 1:2.4; 9일차 gas와 25g bed wetting | Medium | dry pockets, aroma release, bed behavior |
| 3 pulses · 28s · 94→93→92°C | 공식 3×23s에서 high-dose/fines overflow 지침의 +5s 적용; 완만한 declining | Medium-Low | drawdown, finish, sweetness, bitterness |
| 삼다수 | 사용자가 고정한 물; 낮은 Ca/Mg, alkalinity gap | Medium | bottle/lot, 맛의 날카로움 또는 둔함 |

## Coverage gaps와 가정

- 정확한 roaster와 외부 exact lot/crop 일치는 확인하지 못했습니다. Bag facts를 우선합니다.
- 삼다수 alkalinity/KH와 실제 bottle TDS는 미기록입니다.
- Ode Gen 2 zero point, seasoning, 최근 청소 상태는 미기록입니다.
- RF 2.0g/g, drop temperature 65°C, target 5°C, ice start 0°C는 개인 미교정 가정입니다.
- 텀블러 자체의 열용량과 마시는 시간·주변 온도는 열수지에 포함하지 않았습니다.
- 사용자의 실제 Aiden UI에서 1:14, 28초, 각 온도가 저장되는지 시작 전 확인해야 하며 UI가 최종 기준입니다.

## Gate 판정

- Research status: **sufficient-with-gaps** — 일곱 축과 핵심 충돌을 다뤘고, 남은 gap은 첫 baseline 구조를 바꾸지 않으며 측정 항목으로 넘길 수 있음
- Intake status: **complete**
- Numeric recipe allowed: **yes**
- 다음 행동: 500ml v1 Candidate를 한 번 추출하고 실제 output·온도·drawdown·ice remaining을 기록
