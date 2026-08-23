# 보안 안내

## 취약점 제보

공개 issue에 credential, token, Firebase secret, 실제 사용자 데이터나 재현용 계정을 올리지 마십시오. GitHub의 private vulnerability reporting을 사용해 주십시오. 기능 요청과 일반 버그는 issue로 받을 수 있습니다.

## 계정 정보 처리

- Fellow 이메일과 비밀번호는 Firebase Functions에서만 복호화합니다.
- AES-256-GCM master key는 Firebase Secret Manager에 둡니다.
- 브라우저와 공개 recipe 문서에는 계정 정보가 들어가지 않습니다.
- API token 원문은 발급 직후 한 번만 보여 주고 SHA-256 digest만 저장합니다.
- 이메일 인증이 끝난 Firebase 사용자만 private Functions를 호출할 수 있습니다.

서버에 Fellow credential을 맡기고 싶지 않다면 저장소를 fork하여 자신의 Firebase 프로젝트에 배포하십시오. 어떤 배포를 선택하든 공식 Fellow API가 아닌 private endpoint를 사용한다는 점은 같습니다.

## 운영 점검

- `.env.local`과 Firebase debug log가 Git에서 제외되었는지 확인합니다.
- Functions와 운영 dependency audit를 CI와 배포 전에 실행합니다.
- Firebase App Check, budget alert, Functions quota와 로그 보존기간은 운영 규모에 맞게 설정합니다.
- 의심되는 token은 Console에서 즉시 폐기합니다.
- master secret을 교체할 때는 기존 계정 재연결 절차를 먼저 준비합니다.

## 알려진 의존성 권고

2026-08-24 기준 `functions/`의 `npm audit --omit=dev`는 `uuid <11.1.1`의 [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq)를 중간 등급 7건으로 보고합니다. 최신 `firebase-admin 14.3.0`과 `firebase-functions 7.3.2`의 Google Cloud Storage 하위 의존성에서 들어오는 항목입니다. 실제 호출부인 `gaxios`와 `teeny-request`는 이 권고의 대상인 v3/v5/v6 buffer API가 아니라 `uuid.v4()`만 사용합니다.

`npm audit fix --force`는 해결책으로 `firebase-admin 10.3.0` 하향을 제안하므로 적용하지 않습니다. Firebase Admin이 호환되는 새 Storage 계열을 채택하면 다시 확인합니다. 이 기록은 audit 경고를 숨기는 예외가 아니라, 현재 도달 경로와 강제 수정의 위험을 함께 남긴 것입니다.

## 지원 범위

보안 수정은 현재 default branch에 적용합니다. Fellow private API의 안정성이나 계정 정책 변경은 이 프로젝트가 보장할 수 없습니다.
