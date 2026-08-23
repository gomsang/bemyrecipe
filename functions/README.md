# Firebase Functions

로그인 후 개인 기능과 로컬 catalog sync를 담당합니다.

## 필요한 secret

- `CREDENTIAL_ENCRYPTION_KEY`: Fellow credential을 AES-256-GCM으로 암호화하는 master secret
- `TOKEN_PEPPER`: API token digest에 추가하는 server secret

두 값은 Firebase Secret Manager에만 저장합니다. Firestore에는 암호문, nonce, auth tag와 token digest만 남습니다.

## endpoint

Callable Functions:

- `getDashboard`
- `saveAidenCredentials`
- `createApiToken`, `revokeApiToken`
- `saveAidenProfile`, `deleteAidenProfile`

HTTP Function:

- `syncCatalog`: `Authorization: Bearer bmr_live_...`가 필요합니다.

`syncCatalog`는 현재 recipe ruleset version과 hard-rule 결과를 다시 확인합니다. `review` recipe는 hard error가 없으면 동기화할 수 있지만, `blocked` 또는 다른 ruleset version은 서버가 거부합니다.

## 비공식 Fellow 연결

런타임에는 외부 Fellow/Aiden library가 없습니다. `src/fellow-client.ts`가 로그인, device/profile 조회와 profile CRUD에 필요한 호출만 구현합니다. API 변경·rate limit·계정 잠금 위험을 줄이기 위해 짧은 timeout, 제한된 요청 수, 오류문구의 이메일 제거, 저장 뒤 echo 검증을 적용합니다.

Fellow API가 반환한 세션 token은 저장하지 않습니다. 기기에서 직접 추출을 시작하는 기능도 제공하지 않습니다.
