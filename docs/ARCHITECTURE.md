# 구조와 데이터 흐름

## 원칙

레시피 원본은 Git으로 버전 관리하는 Markdown입니다. Firestore는 공개 사이트와 개인 동기화 상태를 위한 저장소입니다. Aiden은 Accepted 레시피의 배포 대상이지 원본 저장소가 아닙니다.

```text
Codex chat
  → beans / research / recipes / logs
  → local validator + catalog builder
  → Firebase sync endpoint
      ├─ Firestore public recipe projection
      └─ Accepted + brew-ready → Fellow private endpoint → Aiden profile

Browser
  ├─ no login → public recipes read
  └─ verified login → private callable Functions
       ├─ token issue/revoke
       ├─ encrypted Fellow credentials
       └─ Aiden profile read/create/update/delete
```

## 공개 영역

빌드 시 `scripts/build-catalog.ts`가 Markdown을 검증해 `public/catalog.json`을 만듭니다. 정적 파일만으로도 공개 사이트가 열립니다. Firestore에 동기화된 레시피가 있으면 사이트가 최신 원격 카탈로그를 사용합니다.

비로그인 화면은 Recipes만 보여 줍니다. Aiden과 Console navigation은 인증 후에만 렌더링합니다. 계정 아이콘은 일반적인 계정 진입점으로만 둡니다.

## 개인 영역

Firebase Auth의 이메일/비밀번호 로그인을 사용하며 서버 작업은 인증된 이메일만 허용합니다. callable Functions가 사용자 UID로 데이터 범위를 고정합니다. 클라이언트는 Firestore의 credential이나 token 문서를 직접 읽을 수 없습니다.

## Fellow 연결

`functions/src/fellow-client.ts`는 필요한 HTTP 호출만 직접 구현합니다. 로그인 응답의 access token은 함수 실행 중 메모리에만 두고 저장하지 않습니다. 사용자의 Fellow 이메일과 비밀번호는 AES-256-GCM으로 암호화해 저장합니다.

저장 뒤 Fellow profile 목록을 다시 조회하여 보낸 값과 echo된 값을 비교합니다. 값이 다르면 성공으로 기록하지 않습니다. Cold Brew mapping은 확인이 부족하므로 자동 전송을 거부합니다.

## Accepted 자동 등록

동기화 endpoint는 다음 조건을 모두 만족한 레시피만 Aiden에 upsert합니다.

- `status: accepted`
- `brew_ready: true`
- local validator 결과 `valid: true`
- 사용자의 Aiden 연결 완료

동일한 profile name이 있으면 해당 사용자 profile을 수정하고, 없으면 새로 만듭니다. Candidate는 사이트에 보이지만 Aiden에는 자동 등록하지 않습니다.
