# 로컬 Codex 연결

이 폴더는 별도 프로그램이 아니라 Codex에서 저장소를 사용할 때 필요한 연결 안내입니다. 실제 원본은 저장소 루트의 Markdown입니다.

## 1. 저장소 준비

```bash
npm install
npm --prefix functions install
cp .env.example .env.local
```

웹사이트에 로그인한 뒤 Console에서 API token을 발급합니다. 원문은 한 번만 표시됩니다. `.env.local`에 다음 두 값을 넣습니다.

```dotenv
CATALOG_SYNC_URL=https://REGION-PROJECT_ID.cloudfunctions.net/syncCatalog
CATALOG_SYNC_TOKEN=bmr_live_...
```

`.env.local`은 Git에서 제외되어 있습니다. 토큰을 Markdown, `AGENTS.md`, shell history 예시, issue에 넣지 마십시오.

## 2. 레시피 작업

Codex는 `AGENTS.md`에 따라 `PROFILE.md`, `HARNESS.md`, `INTAKE.md`, 조사 dossier와 기존 recipe/log를 읽습니다. 새 숫자를 만들기 전에 intake와 research gate를 통과해야 합니다.

Candidate 생성·수정 후:

```bash
npm run catalog:validate
npm run catalog:build
npm run catalog:sync
```

명시적인 채택 뒤에도 같은 명령을 실행합니다. 이때 서버가 Accepted profile을 연결된 Aiden에 등록합니다.

## 3. 다른 사람의 개인 배포

fork한 뒤 `.firebaserc`, Firebase Web App 값, sync URL만 자신의 프로젝트에 맞게 바꿉니다. 자신의 Fellow 계정은 배포한 사이트에서만 입력합니다. 이 저장소 소유자의 Firebase나 Fellow 계정을 공유할 필요가 없습니다.
