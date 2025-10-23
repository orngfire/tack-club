# 🔔 OneSignal 로컬 테스트 완전 가이드

## 📋 체크리스트 - OneSignal 구독자 등록 안 되는 문제 해결

### 1. OneSignal Dashboard 설정 확인

**OneSignal 대시보드에서 확인할 사항:**

1. **Site Setup 확인**
   - Settings → Configuration → Web → Site Setup
   - Local Testing: `ON` 확인
   - Site URL에 추가되어 있어야 함:
     - `http://localhost:3000`
     - `http://127.0.0.1:3000`

2. **Service Worker 설정 확인**
   - Advanced Settings → Service Worker
   - Path: `/OneSignalSDKWorker.js`
   - Scope: `/` (기본값)

### 2. 로컬 파일 확인

```bash
# Service Worker 파일 확인
ls public/OneSignalSDKWorker.js
# 파일이 있어야 함!
```

### 3. 환경 변수 확인

**.env 파일:**
```bash
# OneSignal App ID 확인
REACT_APP_ONESIGNAL_APP_ID=ecbca850-0f20-4c95-84a7-de7a0d97079a
```

### 4. 브라우저 Console 디버깅

**개발자 도구 (F12) → Console에서 실행:**

```javascript
// 1. 현재 상태 확인
console.log('브라우저 권한:', Notification.permission);
console.log('OneSignal 로드:', typeof OneSignal !== 'undefined');

// 2. OneSignal 상태 확인 (앱 실행 후)
OneSignal.User.onesignalId  // User ID
OneSignal.User.PushSubscription.optedIn  // 구독 상태
OneSignal.User.PushSubscription.token  // Push Token

// 3. 수동으로 구독 시도
await OneSignal.User.PushSubscription.optIn()

// 4. 태그 확인
OneSignal.User.getTags()
```

### 5. Network 탭에서 확인

**개발자 도구 → Network 탭:**
1. `onesignal.com` 도메인 요청 확인
2. `OneSignalSDKWorker.js` 로드 확인
3. 에러 응답 확인

### 6. Application 탭에서 Service Worker 확인

**개발자 도구 → Application → Service Workers:**
- OneSignal Service Worker가 등록되어 있는지 확인
- Status: `activated` 확인

## 🚀 전체 테스트 시나리오

### Step 1: 완전 초기화
```javascript
// Console에서 실행
localStorage.clear();
// Service Worker 제거
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
// 페이지 새로고침
location.reload();
```

### Step 2: OneSignal 초기화 확인
페이지 로드 후 Console에 다음 메시지 확인:
- 🔔 OneSignal 초기화 시작...
- App ID: ecbca850-0f20-4c95-84a7-de7a0d97079a
- ✅ OneSignal 초기화 성공
- 브라우저 알림 권한: default/granted
- OneSignal 구독 상태: true/false
- OneSignal User ID: (ID 또는 null)

### Step 3: 구독 프로세스
1. 이름 선택 모달에서 이름 선택
2. 브라우저 알림 권한 팝업 → "허용" 클릭
3. Console 확인:
   - "브라우저 알림 권한 요청 결과: granted"

### Step 4: OneSignal Dashboard 확인
1. https://onesignal.com 로그인
2. Your App → Audience → All Users
3. 새 구독자 확인 (1-2분 후 나타남)

## 🔧 문제별 해결 방법

### "구독자가 Dashboard에 안 나타남"

**원인 1: Service Worker 미등록**
```javascript
// Console에서 확인
navigator.serviceWorker.getRegistrations()
// OneSignal worker가 있어야 함
```

**해결:**
1. `public/OneSignalSDKWorker.js` 파일 확인
2. 브라우저 캐시 강력 새로고침 (Cmd+Shift+R)

**원인 2: localhost가 OneSignal에서 허용 안 됨**
- OneSignal Dashboard → Settings → Configuration
- "Treat HTTP localhost as HTTPS" 활성화

**원인 3: 브라우저가 localhost 알림 차단**
- Chrome: chrome://settings/content/notifications
- localhost:3000이 차단되어 있으면 허용으로 변경

### "OneSignal.User.PushSubscription.optIn() 실패"

**Console에서 수동 테스트:**
```javascript
// 1. 권한 먼저 요청
await Notification.requestPermission()

// 2. OneSignal 구독
await OneSignal.User.PushSubscription.optIn()

// 3. 상태 확인
console.log('구독됨:', OneSignal.User.PushSubscription.optedIn)
console.log('Token:', OneSignal.User.PushSubscription.token)
```

### "알림 토글이 작동 안 함"

설정 페이지에서 토글 후 Console 확인:
```javascript
// 토글 후 상태 확인
OneSignal.User.PushSubscription.optedIn
localStorage.getItem('notificationEnabled')
```

## 📱 테스트 푸시 알림 보내기

### OneSignal Dashboard에서:
1. Messages → New Push
2. Audience: All Users (또는 Subscribed Users)
3. Message 작성
4. "Send to Test Device" 선택
5. User ID 입력 (Console에서 확인한 ID)
6. Send Test

### API로 테스트:
```bash
curl --location --request POST 'https://onesignal.com/api/v1/notifications' \
--header 'Authorization: Basic YOUR_REST_API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
  "app_id": "ecbca850-0f20-4c95-84a7-de7a0d97079a",
  "contents": {"en": "테스트 알림입니다"},
  "headings": {"en": "압정 클럽"},
  "included_segments": ["Subscribed Users"]
}'
```

## ✅ 성공 지표

1. Console에 OneSignal User ID 표시
2. OneSignal Dashboard에 구독자 수 증가
3. Test Push 수신 성공
4. 설정 페이지 토글 정상 작동

## 🔍 추가 디버깅 명령어

```javascript
// OneSignal 전체 상태 덤프
console.log({
  initialized: typeof OneSignal !== 'undefined',
  userId: OneSignal?.User?.onesignalId,
  externalId: OneSignal?.User?.externalId,
  optedIn: OneSignal?.User?.PushSubscription?.optedIn,
  token: OneSignal?.User?.PushSubscription?.token,
  permission: Notification.permission,
  tags: await OneSignal?.User?.getTags()
});
```

## 주의사항

1. **시크릿 모드**: Service Worker가 작동 안 할 수 있음
2. **광고 차단기**: OneSignal 스크립트 차단 가능
3. **HTTPS**: Production에서는 반드시 HTTPS 필요
4. **Safari**: 별도 설정 필요 (APNs 인증서)