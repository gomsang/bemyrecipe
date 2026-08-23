# Security

## 취약점 제보

공개 issue에 credential, token, Firebase secret, 실제 사용자 데이터나 재현용 계정을 올리지 마십시오. GitHub의 private vulnerability reporting을 사용해 주십시오. 기능 요청과 일반 버그는 issue로 받을 수 있습니다.

## credential 처리

- Fellow 이메일과 비밀번호는 Firebase Functions에서만 복호화합니다.
- AES-256-GCM master key는 Firebase Secret Manager에 둡니다.
- 브라우저와 public recipe 문서에는 credential이 들어가지 않습니다.
- API token 원문은 발급 직후 한 번만 보여 주고 SHA-256 digest만 저장합니다.
- 이메일 인증이 끝난 Firebase 사용자만 private Functions를 호출할 수 있습니다.

서버에 Fellow credential을 맡기고 싶지 않다면 저장소를 fork하여 자신의 Firebase 프로젝트에 배포하십시오. 어떤 배포를 선택하든 공식 Fellow API가 아닌 private endpoint를 사용한다는 점은 같습니다.

## 운영 점검

- `.env.local`과 Firebase debug log가 Git에서 제외되었는지 확인합니다.
- Functions와 production dependency audit를 CI와 배포 전에 실행합니다.
- Firebase App Check, budget alert, Functions quota와 로그 보존기간은 운영 규모에 맞게 설정합니다.
- 의심되는 token은 Console에서 즉시 폐기합니다.
- master secret을 교체할 때는 기존 credential 재연결 절차를 먼저 준비합니다.

## 지원 범위

보안 수정은 현재 default branch에 적용합니다. Fellow private API의 안정성이나 계정 정책 변경은 이 프로젝트가 보장할 수 없습니다.
