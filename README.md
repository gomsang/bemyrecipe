# bemyrecipe

대화로 만든 Fellow Aiden 레시피를 Markdown에 남기고, 웹에서 읽고, 내 Aiden으로 보내는 작은 개인 도구입니다.

사이트는 로그인 없이 Accepted와 Candidates 레시피를 열람할 수 있습니다. 각 상세 화면은 실행용 **추출 레시피**와 산지에서 잔까지 이어지는 **드링크 가이드**를 나눠 보여 줍니다. 선택한 version과 화면은 `/recipes/<id>/brew`, `/recipes/<id>/guide` 주소에 남아 링크를 받은 사람도 같은 내용을 바로 열 수 있습니다. 로그인하면 자신의 Fellow 계정을 연결하고 Aiden 프로필을 조회·수정하며, 로컬 Codex 동기화용 토큰을 발급할 수 있습니다. 레시피 상세 화면에서는 검증된 Candidate와 Accepted를 바로 Aiden에 저장할 수 있고, 각각 `C.`, `A.` 접두사로 구분합니다. 로컬에서 레시피를 `Accepted`로 바꾼 뒤 동기화하면 해당 프로필을 Aiden에 자동 등록합니다.

> Fellow는 공개 Aiden API를 제공하지 않습니다. 이 프로젝트의 기기 연결은 앱이 사용하는 비공식 엔드포인트를 직접 호출하며, Fellow의 변경으로 동작이 중단될 수 있습니다. 다른 Fellow 라이브러리를 런타임 의존성으로 설치하지 않습니다.

## 처음 사용하는 순서

### 공개 사이트만 실행

Node.js 22가 필요합니다.

```bash
git clone https://github.com/gomsang/bemyrecipe.git
cd bemyrecipe
npm install
npm --prefix functions install
cp .env.example .env.local
npm run dev
```

Firebase 값이 없어도 `public/catalog.json`으로 만든 로컬 카탈로그는 표시됩니다. 원본은 `recipes/`, `beans/`, `research/`, `logs/`의 Markdown입니다.

### Codex로 레시피 만들기

저장소를 Codex 작업 폴더로 열고 평소 말로 요청합니다.

> 이 원두로 500ml 텀블러에 아이스 레시피를 만들어줘. 마시는 동안 얼음이 남았으면 좋겠어.

Codex는 `AGENTS.md`의 intake와 research gate를 거친 뒤 Candidate를 만듭니다. 추출 뒤 맛과 시간을 알려주면 log를 남기고, 한 번에 하나의 primary variable만 바꿉니다.

독자에게 보이는 한국어를 다듬을 때는 선택적으로 [`humanize-korean`](https://github.com/epoko77-ai/im-not-ai) Codex skill을 쓸 수 있습니다. Codex CLI 0.121.0 이상에서 설치한 뒤 `$humanize-korean`으로 실행합니다. 이 저장소의 `AGENTS.md`는 skill이 있을 때 레시피와 드링크 가이드의 문체 점검에 사용하되, 수치·인용·출처 범위는 건드리지 않도록 정해 둡니다.

새 Candidate에는 드링크 가이드가 함께 붙습니다. 단순한 레시피 해설이 아니라, 커피를 마시는 사람이 산지와 품종의 역사, 가공 과정, 로스팅, 향미 표현을 읽을 수 있는 짧은 매거진에 가깝습니다. 카페에서 커피와 함께 건네도 자연스럽도록 조사 과정이나 내부 검증 문구는 본문에서 빼고, 공개되지 않은 정보는 끝의 편집 노트에 정직하게 남깁니다. 추출자를 위한 내용은 `WHY THIS BREW`에만 둡니다. `beans/*.md`가 공통 사실과 출처를, `recipes/*.md`가 이 버전의 추출 의도와 마시는 흐름을 맡습니다. 같은 이름의 다른 crop은 참고 맥락으로만 쓰며, 확인되지 않은 농장이나 발효 이야기를 채워 넣지 않습니다.

채택은 명시적으로 말해야 합니다.

> 이 레시피를 채택할게.

이때 파일은 `recipes/accepted/`로 이동하고 `status: accepted`가 됩니다. 사이트 토큰이 설정되어 있으면 다음 명령으로 공개 카탈로그와 Aiden을 동기화합니다.

```bash
npm run catalog:validate
npm run catalog:sync
```

### 레시피 version 관리

사이트는 Markdown 파일 수만큼 카드를 늘리지 않습니다. 같은 `lineage`를 한 레시피로 묶고 최신 version만 목록에 보여 줍니다. 이전 설정은 상세 화면 맨 아래의 접힌 **VERSION HISTORY**에서 골라 비교할 수 있습니다.

같은 원두, HOT/ICED mode, brew method, cup, basket, vessel, ice goal에서 설정만 바뀌면 새 이름을 만들지 않고 `<lineage>-v<number>.md`로 올립니다. 단, 같은 농장·품종이라도 로스터가 다르면 별도 bean과 lineage입니다. 짧은 `roaster_code`를 파일·웹 제목·Aiden profile name에 넣어 구분하고, 확인되지 않았을 때만 `UNK`를 씁니다. 각 파일의 `revision` frontmatter가 parent와 변경 내용을 기계가 읽을 수 있게 보존합니다. 전체 convention은 [docs/RECIPE-SCHEMA.md](docs/RECIPE-SCHEMA.md#lineage와-version)에 있습니다.

```bash
npm run versions:test
npm run catalog:validate
```

Validator는 빠진 version, 중복 version, 잘못된 parent, 같은 lineage의 cup/mode 변경, 동일 조건을 새 lineage로 복제한 경우를 차단합니다.

로그인 상태에서는 상세 화면의 **에이든 프로필로 저장**으로 Candidate와 Accepted를 모두 수동 저장할 수 있습니다. 서버가 Markdown이 아니라 동기화된 레시피 projection을 다시 검증한 뒤 Candidate에는 `C. `, Accepted에는 `A. `를 붙입니다. 기존 `[C]`/`[A]` 이름은 같은 profile을 새 이름으로 갱신합니다. Research Hold나 hard rule을 통과하지 못한 레시피는 버튼이 비활성화되며, 로그아웃 화면에는 이 개인 기능이 나타나지 않습니다.

로컬 설정법은 [local/README.md](local/README.md)에 정리되어 있습니다.

## HOT, ICED와 얼음

`serve_mode`는 최종 음용 방식을 나타냅니다.

- `hot`: 뜨겁게 마시는 레시피. Brew ice와 Serving ice는 모두 0g이어야 합니다.
- `iced`: 얼음을 사용하는 레시피. `brew_method: flash`라면 뜨거운 물로 추출합니다. Aiden의 Cold Brew 설정과는 다릅니다.
- `cold_brew`: Aiden의 Cold Brew 모드. 비공식 API 매핑이 충분히 검증되지 않아 현재 자동 전송하지 않습니다.

아이스 레시피의 얼음은 두 역할로 나눕니다.

- **Brew ice**: 추출 전에 빈 카라페에 넣습니다. 뜨거운 추출액을 즉시 식히고 농도를 완성하며, 대부분 녹는 것이 정상입니다.
- **Serving ice**: 추출이 끝난 뒤 음용 컵에 새로 넣습니다. 마시는 동안 차가움을 유지하고 얼음이 남도록 하는 몫입니다.

필터 종류와 조건부 린싱, 린스 물 폐기, 물리 shower selector, 얼음 투입, 분쇄·도징, 추출 후 swirl, 이송 순서는 `prep_steps`와 `control_conditions`에 저장됩니다. UI의 **PREPARATION**은 이 값을 그대로 표시합니다. 상세 필드와 HOT/ICED 예시는 [docs/RECIPE-SCHEMA.md](docs/RECIPE-SCHEMA.md)를 참고하십시오.

Aiden 물양은 단위 모드에 따라 간격이 달라집니다. 기본 cup/half-cup 모드는 75ml씩 움직이고, `Settings → Units → Precise Units`를 켜면 Single Serve에서 10ml 단위 선택이 가능합니다. 레시피는 `aiden_quantity_mode`를 기록하고, 사이트의 **AIDEN WATER SELECTOR**에서 필요한 모드와 정확한 물양을 함께 보여 줍니다. Validator와 서버가 이 조합을 둘 다 검사합니다.

Flash recipe는 낙하 온도를 5°C 높인 조건도 함께 검사합니다. 카라페의 Brew ice와 음용 컵의 Serving ice를 실행 순서대로 계산하고, 카라페에 고체로 남은 얼음을 손님 잔의 얼음으로 세지 않습니다. `remain_while_drinking` 목표라면 두 조건 모두 음용 컵의 Serving ice 10g 이상, 컵별 최소 Serving ice 투입량과 headspace를 통과해야 합니다.

## Ruleset

`shared/recipe-rules.ts`가 사이트 표시와 Markdown 검증에서 함께 쓰는 중앙 ruleset입니다. HOT/ICED label, brew method 조합, ice role, 린싱 설명, 통제조건과 validation 등급을 한곳에서 관리합니다.

규칙은 두 종류로 나눕니다.

- **Hard constraint**: Aiden 입력 범위, 모순된 얼음 수지, 실행할 수 없는 순서. 빌드를 중단합니다.
- **Adaptive constraint**: 새 accessory, 환경값, 향미 가설처럼 아직 schema에 없는 조건. 레시피는 보존하고 UI에 Review와 system-change proposal을 표시합니다.

더 나은 레시피가 기존 규칙에 없다는 이유로 버려지지 않습니다. `control_conditions`에 실제 조건을 기록하고 `rule_extension_requests`에 schema·UI·validator·migration·test 변경안을 남깁니다. 운영 방식은 [docs/RULE-GOVERNANCE.md](docs/RULE-GOVERNANCE.md)에 있습니다.

## 저장소 구조

```text
.
├── src/                    공개 카탈로그와 로그인 후 관리 UI
├── functions/              Firebase Functions와 자체 Fellow HTTP client
├── shared/                 UI·검증기가 함께 쓰는 Aiden profile/recipe ruleset
├── scripts/                Markdown 검증, catalog 생성, 원격 동기화
├── local/                  Codex 로컬 사용 안내
├── recipes/                Candidate / Accepted Markdown 원본
├── beans/ research/ logs/  원두, 조사 dossier, 실제 추출 기록
├── docs/                   구조와 schema 문서
├── firestore.rules         공개 읽기·서버 전용 쓰기 규칙
└── firebase.json           Hosting, Functions, Firestore 구성
```

Markdown이 레시피의 source of truth입니다. 브라우저 편집과 Aiden 응답이 Markdown 원본을 조용히 덮어쓰지 않습니다. 사이트 DB는 배포·조회·동기화 상태를 위한 projection입니다. 전체 흐름은 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)에 있습니다.

## Firebase 배포

Firebase CLI로 로그인하고 자신의 프로젝트를 지정합니다.

```bash
npx firebase login
npx firebase use YOUR_PROJECT_ID
```

Firebase Console에서 다음을 준비합니다.

1. Authentication에서 Email/Password 로그인을 활성화합니다.
2. Firestore를 생성합니다.
3. Functions와 Secret Manager를 쓸 수 있는 결제 플랜을 연결합니다.
4. Web App 설정을 `.env.local`에 넣습니다. Firebase Web App 설정값은 식별자이며 서버 비밀키가 아닙니다.

서버 비밀값은 최소 32바이트 난수로 만듭니다. 파일이나 GitHub Secret에 평문으로 커밋하지 않습니다.

```bash
openssl rand -base64 48 | npx firebase functions:secrets:set CREDENTIAL_ENCRYPTION_KEY
openssl rand -base64 48 | npx firebase functions:secrets:set TOKEN_PEPPER
```

전체 배포:

```bash
npm run deploy
```

Functions 결제 설정 전 공개 사이트와 Firestore 규칙만 배포할 수도 있습니다.

```bash
npm run deploy:public
```

자신의 프로젝트로 fork할 때 `.firebaserc`의 프로젝트 별칭과 `.env.local`을 바꾸십시오. 보안 구성과 운영상 한계는 [SECURITY.md](SECURITY.md), 서버 상세는 [functions/README.md](functions/README.md)에 있습니다.

## 검사

```bash
npm run catalog:validate
npm run rules:test
npm run thermal:test
npm run routes:test
npm run profiles:test
npm run build
npm audit --omit=dev
npm --prefix functions audit --omit=dev
```

카탈로그 빌드는 다음을 함께 검사합니다.

- Aiden 앱에서 선택 가능한 profile 값과 step
- pulse 개수와 온도 배열 길이
- HOT 레시피의 얼음 0g 규칙
- ICED 레시피의 ice plan과 preparation step
- Flash 레시피의 2단계 0°C 상변화 열수지, 컵별 Serving ice 투입·잔존량, +5°C stress와 고체 얼음 부피 headspace
- Recipe/Drink Guide 공유 URL의 생성·해석
- `brew_ready: true` 레시피의 실행 순서 존재 여부
- bean story의 장소·지역·사람·품종·고도·가공·로스팅, 가공 단계, 감각어, 작은 사전과 출처 범위
- recipe Drink Guide의 추출 의도·핵심 선택·serving ritual·taste journey
- 등록되지 않은 새 통제조건의 review와 system-change proposal

## 라이선스

코드는 MIT License로 배포합니다. Fellow, Aiden과 관련 상표는 각 소유자에게 있습니다.
