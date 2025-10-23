# Firebase 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속합니다.
2. "프로젝트 추가"를 클릭합니다.
3. 프로젝트 이름을 입력합니다 (예: tack-club).
4. Google Analytics 설정은 선택사항입니다.
5. 프로젝트 생성을 완료합니다.

## 2. Firebase Realtime Database 설정

1. Firebase Console에서 좌측 메뉴의 "Realtime Database"를 클릭합니다.
2. "데이터베이스 만들기"를 클릭합니다.
3. 위치 선택 (아시아는 singapore를 추천).
4. 보안 규칙 설정:
   - 개발 중에는 "테스트 모드에서 시작"을 선택합니다.
   - 나중에 프로덕션에서는 적절한 보안 규칙을 설정해야 합니다.

### 보안 규칙 예시 (테스트용):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### 프로덕션 보안 규칙 예시:
```json
{
  "rules": {
    "entries": {
      ".read": true,
      ".write": true,
      "$entryId": {
        ".validate": "newData.hasChildren(['author', 'content', 'date', 'timestamp', 'reactions'])"
      }
    },
    "happiness-posts": {
      ".read": true,
      ".write": true,
      "$postId": {
        ".validate": "newData.hasChildren(['author', 'content', 'timestamp', 'likes'])"
      }
    }
  }
}
```

## 3. Firebase 웹 앱 추가

1. Firebase Console 프로젝트 설정에서 "웹" 아이콘을 클릭합니다.
2. 앱 닉네임을 입력합니다 (예: Tack Club Web).
3. Firebase Hosting은 선택사항입니다.
4. "앱 등록"을 클릭합니다.
5. Firebase 설정 값이 표시됩니다 - 이 값들을 복사합니다.

## 4. 환경 변수 설정

1. 프로젝트 루트에 `.env` 파일을 생성합니다.
2. Firebase Console에서 복사한 설정 값을 입력합니다:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## 5. 애플리케이션 실행

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm start
```

## 6. 데이터 구조

Firebase Realtime Database에서 데이터는 다음과 같은 구조로 저장됩니다:

```
{
  "entries": {
    "entryId": {
      "id": "entryId",
      "author": "작성자명",
      "content": "내용",
      "date": "YYYY-MM-DD",
      "timestamp": 1234567890,
      "reactions": {
        "악": ["userId1", "userId2"]
      }
    }
  },
  "happiness-posts": {
    "postId": {
      "id": "postId",
      "author": "익명",
      "content": "내용",
      "imageUrl": "base64-image-data",
      "timestamp": 1234567890,
      "likes": ["userId1", "userId2"]
    }
  }
}
```

## 7. 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요. (`.gitignore`에 포함되어 있음)
- Firebase 설정 값은 안전하게 보관하세요.
- 프로덕션 배포 시에는 적절한 보안 규칙을 설정해야 합니다.
- 실시간 데이터 동기화는 여러 사용자가 동시에 앱을 사용할 때 자동으로 작동합니다.

## 8. 문제 해결

### Firebase 연결 오류
- `.env` 파일의 설정 값이 올바른지 확인하세요.
- Firebase Console에서 Realtime Database가 활성화되어 있는지 확인하세요.
- 네트워크 연결을 확인하세요.

### 데이터가 표시되지 않을 때
- Firebase Console에서 데이터베이스에 데이터가 있는지 확인하세요.
- 브라우저 콘솔에서 오류 메시지를 확인하세요.
- 보안 규칙이 읽기를 허용하는지 확인하세요.