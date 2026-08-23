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

원두의 재사용 가능한 `story`는 bean Markdown이 소유하고, version별 `drink_guide`는 recipe Markdown이 소유합니다. Catalog builder는 둘을 recipe의 `drinkGuide`로 합성합니다. 공개 UI는 **추출 레시피 / 드링크 가이드** 두 독서 모드를 제공하지만 어느 쪽도 브라우저가 만든 별도 원본이 아닙니다.

화면의 타이포그래피·breakpoint·상세 정보 순서·Drink Guide reader 규칙은 [UI-GUIDELINES.md](UI-GUIDELINES.md)에 둡니다.

각 Markdown version은 별도 문서로 보존하지만 UI 목록은 `lineage`로 그룹화합니다. 가장 높은 version이 lineage head가 되어 한 카드만 표시되고, `revision` projection으로 이전 version의 parent·변경 이유·변경값·성공 기준을 펼쳐봅니다. Firestore projection이 현재 version schema보다 오래되면 정적 Markdown catalog가 우선합니다.

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

자동 등록되는 Accepted의 기기 profile name에는 `[A] `를 붙입니다. 동일한 최종 이름이 있으면 해당 사용자 profile을 수정하고, 없으면 새로 만듭니다. Candidate는 사이트에 보이지만 자동 등록하지 않습니다.

## 상세 화면에서 수동 저장

로그인한 사용자에게만 Candidate와 Accepted 상세 화면의 **에이든 프로필로 저장** 작업을 렌더링합니다. 로그아웃 화면에는 버튼이나 잠금 상태를 표시하지 않습니다.

수동 저장은 공개 Firestore 레시피를 서버에서 다시 읽고 `brew_ready`, 입력값 validation, 현재 ruleset의 hard rule을 확인합니다. 레시피 작성자와 저장 사용자가 달라도 공개 상세 화면에서 자신의 Aiden으로 보낼 수 있습니다. 통과한 Candidate는 `[C] `, Accepted는 `[A] `를 `profile_name` 앞에 붙여 Aiden에 upsert합니다. Markdown 원본 이름은 바꾸지 않습니다. Research Hold, invalid, blocked, 검증되지 않은 Cold Brew profile은 상태와 무관하게 기기 전송을 거부합니다.
