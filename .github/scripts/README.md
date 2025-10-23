# OneSignal 자동 알림 시스템 설정 가이드

## 🔔 개요
매일 오전 10시와 오후 5시에 압정을 작성하지 않은 사용자들에게 개인화된 푸시 알림을 자동으로 발송합니다.

## ⏰ 알림 시간
- **오전 알림**: 10:00 KST (01:00 UTC)
  - 메시지: "굿모닝 [이름]" / "오늘도 행복한 하루 보내길!"
- **오후 알림**: 17:00 KST (08:00 UTC)
  - 메시지: "굿이브닝 [이름]" / "오늘의 압정은 무엇인가요?"

## 🔑 GitHub Secrets 설정

### 1. GitHub 리포지토리로 이동
1. GitHub에서 프로젝트 리포지토리 열기
2. Settings 탭 클릭
3. 왼쪽 메뉴에서 Secrets and variables > Actions 선택

### 2. 다음 Secrets 추가
#### FIREBASE_URL
- Firebase Realtime Database URL
- 예시: `https://tack-club-default-rtdb.firebaseio.com`
- Firebase Console > Realtime Database에서 확인 가능

#### ONESIGNAL_APP_ID
- OneSignal App ID
- OneSignal Dashboard > Settings > Keys & IDs에서 확인
- 예시: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

#### ONESIGNAL_REST_API_KEY
- OneSignal REST API Key
- OneSignal Dashboard > Settings > Keys & IDs > REST API Key
- 예시: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Secret 추가 방법
1. "New repository secret" 버튼 클릭
2. Name: Secret 이름 입력 (예: FIREBASE_URL)
3. Secret: 실제 값 입력
4. "Add secret" 버튼 클릭

## 📁 파일 구조
```
.github/
├── workflows/
│   ├── morning-reminder.yml   # 오전 10시 알림
│   └── evening-reminder.yml   # 오후 5시 알림
└── scripts/
    ├── check-and-notify.js    # 메인 스크립트
    └── README.md              # 이 파일
```

## 🧪 테스트 방법

### 수동 실행 (workflow_dispatch)
1. GitHub 리포지토리 > Actions 탭
2. "Morning Reminder" 또는 "Evening Reminder" 선택
3. "Run workflow" 버튼 클릭
4. Branch 선택 후 "Run workflow" 클릭

### 로그 확인
1. Actions 탭에서 실행 중이거나 완료된 워크플로우 클릭
2. Job 이름 클릭하여 상세 로그 확인
3. 다음 정보를 확인:
   - 오늘 날짜 (KST)
   - 작성 완료자 목록
   - 미작성자 목록
   - 각 사용자별 푸시 발송 결과

## 📊 로그 예시

### 모두 작성 완료한 경우
```
========================================
[2024-01-15T01:00:00.000Z]
MORNING 알림 체크 시작
========================================
오늘 날짜(KST): 2024-01-15
전체 사용자: 응곤, 민성, 성현, 한준, 이바, 예림

📡 Firebase에서 데이터 조회 중...
오늘 작성된 압정: 6개

📊 작성 현황
작성 완료: 응곤, 민성, 성현, 한준, 이바, 예림 (6명)
미작성자: 없음 (0명)
========================================

🎉 모두 작성 완료! 알림 발송 안 함
```

### 미작성자가 있는 경우
```
========================================
[2024-01-15T08:00:00.000Z]
EVENING 알림 체크 시작
========================================
오늘 날짜(KST): 2024-01-15
전체 사용자: 응곤, 민성, 성현, 한준, 이바, 예림

📡 Firebase에서 데이터 조회 중...
오늘 작성된 압정: 4개

📊 작성 현황
작성 완료: 성현, 한준, 이바, 예림 (4명)
미작성자: 응곤, 민성 (2명)
========================================

📤 2명에게 개별 푸시 발송 시작...

✅ 응곤에게 evening 푸시 발송 완료 (ID: xxxx-xxxx)
✅ 민성에게 evening 푸시 발송 완료 (ID: yyyy-yyyy)

========================================
📈 발송 결과
성공: 2건
실패: 0건
========================================

✨ 모든 푸시 발송 완료!
```

## ⚠️ 주의사항

1. **Firebase 보안 규칙**
   - entries 노드에 대한 읽기 권한이 허용되어야 함
   - `.read: true` 설정 필요

2. **OneSignal 태그 설정**
   - 각 사용자는 앱에서 이름 선택 시 `author` 태그가 설정되어 있어야 함
   - 태그 형식: `{ "author": "응곤" }`

3. **시간대**
   - 모든 날짜 계산은 KST(한국 표준시) 기준
   - GitHub Actions는 UTC 기준으로 실행

4. **API 제한**
   - OneSignal API 호출 간격: 1초
   - 너무 빠른 연속 호출 방지

## 🚨 문제 해결

### 알림이 발송되지 않는 경우
1. GitHub Secrets가 올바르게 설정되었는지 확인
2. Firebase URL이 올바른지 확인
3. OneSignal Dashboard에서 사용자 태그 확인
4. Actions 로그에서 에러 메시지 확인

### Firebase 연결 실패
1. Firebase URL 확인 (끝에 슬래시 제거)
2. Firebase 보안 규칙 확인
3. 네트워크 문제 확인

### OneSignal 발송 실패
1. REST API Key 확인
2. App ID 확인
3. 사용자 태그 설정 확인
4. OneSignal Dashboard에서 에러 로그 확인

## 📧 문의
문제가 지속되면 이슈를 생성하거나 관리자에게 문의하세요.