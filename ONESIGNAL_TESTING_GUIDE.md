# OneSignal 테스팅 가이드

## 현재 상태

OneSignal 통합이 완료되었으며, App ID가 설정되어 있습니다. 하지만 아직 몇 가지 설정이 필요할 수 있습니다.

## 테스트 방법

### 1. 로컬 테스트 (OneSignal 없이)

현재 설정으로 OneSignal이 없어도 앱이 정상 작동합니다:

1. 브라우저 개발자 도구(F12) 열기
2. Console 탭 확인
3. 이름 선택 시 다음과 같은 메시지가 표시되면 정상:
   - "OneSignal 미초기화 상태 - 태그 설정 건너뛰기"
   - "OneSignal 미초기화 상태 - 알림 권한 요청 건너뛰기"

이름 선택 후 3초 안에 모달이 자동으로 닫힙니다.

### 2. OneSignal과 함께 테스트

#### OneSignal 계정 설정

1. https://onesignal.com 접속
2. 무료 계정 생성
3. "New App/Website" 클릭
4. 앱 이름 입력 (예: "Tack Club")
5. "Web Push" 플랫폼 선택

#### Web Push 설정

1. **Site Setup**
   - Site Name: Tack Club
   - Site URL:
     - 로컬 테스트: `http://localhost:3000`
     - 프로덕션: `https://tack-club.web.app`
   - 둘 다 추가 가능

2. **Permission Prompt Setup**
   - "Skip" 선택 (우리는 커스텀 UI 사용)

3. **App ID 복사**
   - 설정 완료 후 Dashboard에서 App ID 확인
   - Settings > Keys & IDs에서도 확인 가능

#### .env 파일 업데이트

```bash
# .env 파일의 마지막 줄을 실제 App ID로 변경
REACT_APP_ONESIGNAL_APP_ID=실제-app-id-여기에-입력
```

#### 앱 재시작

```bash
# Ctrl+C로 현재 서버 중지
npm start
```

## 기능 확인 사항

### 이름 선택 모달
- ✅ 첫 방문 시 자동으로 표시
- ✅ 이름 선택 후 3초 내 자동 닫힘
- ✅ OneSignal 없어도 작동

### 알림 설정
- OneSignal 설정 시: 알림 권한 요청
- OneSignal 미설정 시: 자동으로 건너뜀

### 설정 페이지
- 사이드바 설정 아이콘 클릭
- 알림 설정 토글 확인
- 이름 변경 기능 확인

## 문제 해결

### "설정 중..." 무한 로딩
이제 해결됨! 타임아웃 추가로 3초 후 자동 진행

### OneSignal 오류 메시지
Console에 OneSignal 관련 경고가 표시되는 것은 정상입니다.
App ID가 설정되지 않았을 때 표시되는 안내 메시지입니다.

### 알림이 작동하지 않음
1. 브라우저가 알림을 지원하는지 확인
2. HTTPS 또는 localhost에서만 작동
3. 브라우저 설정에서 알림이 차단되지 않았는지 확인

## 프로덕션 배포 전 체크리스트

1. [ ] OneSignal 계정 생성 및 App ID 획득
2. [ ] .env 파일에 실제 App ID 설정
3. [ ] Firebase 환경 변수에 OneSignal App ID 추가
4. [ ] HTTPS 도메인 설정 확인
5. [ ] OneSignal Dashboard에서 도메인 추가