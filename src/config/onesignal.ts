// OneSignal 글로벌 타입 선언
declare global {
  interface Window {
    OneSignalDeferred?: any[];
    OneSignal?: any;
  }
}

export const initializeOneSignal = async () => {
  try {
    const appId = process.env.REACT_APP_ONESIGNAL_APP_ID;

    // App ID가 없으면 초기화 건너뛰기
    if (!appId || appId === 'your-onesignal-app-id-here') {
      console.warn('OneSignal App ID가 설정되지 않았습니다. OneSignal 기능이 비활성화됩니다.');
      console.info('OneSignal을 사용하려면:');
      console.info('1. https://onesignal.com 에서 무료 계정 생성');
      console.info('2. 새 앱 생성 후 Web Push 플랫폼 추가');
      console.info('3. .env 파일에 REACT_APP_ONESIGNAL_APP_ID 설정');
      return;
    }

    console.log('🔔 OneSignal 초기화 시작...');
    console.log('App ID:', appId);

    // OneSignalDeferred를 통한 초기화
    window.OneSignalDeferred = window.OneSignalDeferred || [];

    window.OneSignalDeferred.push(async function(OneSignal: any) {
      await OneSignal.init({
        appId: appId,
        allowLocalhostAsSecureOrigin: true, // 로컬 테스트용
        serviceWorkerPath: 'OneSignalSDKWorker.js',
        notifyButton: {
          enable: false // 기본 버튼 비활성화
        }
      });

      // 자동 프롬프트 비활성화
      if (OneSignal.Slidedown) {
        OneSignal.Slidedown.promptPush = async () => {
          console.log('OneSignal 자동 프롬프트 비활성화됨');
          return Promise.resolve();
        };
      }

      console.log('✅ OneSignal 초기화 성공');

      // 개발 환경에서 디버그 정보 출력
      if (process.env.NODE_ENV === 'development') {
        // 구독 상태 확인
        try {
          const permission = Notification.permission;
          console.log('브라우저 알림 권한:', permission);

          // OneSignal 구독 상태 확인
          if (OneSignal.User && OneSignal.User.PushSubscription) {
            const optedIn = OneSignal.User.PushSubscription.optedIn;
            console.log('OneSignal 구독 상태:', optedIn);

            // OneSignal User ID 확인
            const onesignalId = OneSignal.User.onesignalId;
            console.log('OneSignal User ID:', onesignalId);
          }
        } catch (e) {
          console.log('디버그 정보 수집 중 오류:', e);
        }
      }
    });

  } catch (error) {
    console.error('OneSignal 초기화 실패:', error);
  }
};

// OneSignal이 초기화되었는지 확인
const isOneSignalInitialized = () => {
  const appId = process.env.REACT_APP_ONESIGNAL_APP_ID;
  return appId && appId !== 'your-onesignal-app-id-here' && typeof window !== 'undefined' && window.OneSignal;
};

// OneSignal 태그 설정 (새 API 사용)
export const setOneSignalTag = async (key: string, value: string) => {
  try {
    // OneSignal이 초기화되지 않았으면 건너뛰기
    if (!isOneSignalInitialized()) {
      console.log(`OneSignal 미초기화 상태 - 태그 설정 건너뛰기: ${key} = ${value}`);
      return;
    }

    // OneSignal Web SDK v16 API 사용
    if (window.OneSignal && window.OneSignal.User) {
      const tags: Record<string, string> = {};
      tags[key] = value;
      window.OneSignal.User.addTags(tags);
      console.log(`OneSignal 태그 설정: ${key} = ${value}`);
    }
  } catch (error) {
    console.error('OneSignal 태그 설정 실패:', error);
  }
};

// 알림 권한 요청
export const requestNotificationPermission = async () => {
  try {
    // OneSignal이 초기화되지 않았으면 건너뛰기
    if (!isOneSignalInitialized()) {
      console.log('OneSignal 미초기화 상태 - 알림 권한 요청 건너뛰기');
      return false;
    }

    // 브라우저 네이티브 권한 요청
    const permission = await Notification.requestPermission();

    if (permission === 'granted' && window.OneSignal) {
      // OneSignal 구독
      await window.OneSignal.User.PushSubscription.optIn();
      return true;
    }
    return false;
  } catch (error) {
    console.error('알림 권한 요청 실패:', error);
    return false;
  }
};

// 알림 구독 상태 확인
export const checkNotificationPermission = async () => {
  try {
    // 브라우저 권한 확인
    const permission = Notification.permission;
    return permission === 'granted';
  } catch (error) {
    console.error('알림 상태 확인 실패:', error);
    return false;
  }
};

// 알림 구독 토글
export const toggleNotificationSubscription = async (enable: boolean) => {
  try {
    // OneSignal이 초기화되지 않았으면 건너뛰기
    if (!isOneSignalInitialized()) {
      console.log('OneSignal 미초기화 상태 - 구독 상태 변경 건너뛰기');
      return false;
    }

    if (window.OneSignal && window.OneSignal.User) {
      if (enable) {
        await window.OneSignal.User.PushSubscription.optIn();
      } else {
        await window.OneSignal.User.PushSubscription.optOut();
      }
    }
    console.log(`알림 구독 상태: ${enable ? '활성화' : '비활성화'}`);
    return enable;
  } catch (error) {
    console.error('알림 구독 상태 변경 실패:', error);
    return false;
  }
};

// OneSignal Player ID 가져오기 (디버깅용)
export const getOneSignalUserId = async () => {
  try {
    // 새 API에서는 External ID를 사용
    if (window.OneSignal && window.OneSignal.User) {
      const externalId = window.OneSignal.User.externalId;
      return externalId;
    }
    return null;
  } catch (error) {
    console.error('User ID 가져오기 실패:', error);
    return null;
  }
};

// OneSignal 태그 가져오기 (디버깅용)
export const getOneSignalTags = async () => {
  try {
    if (window.OneSignal && window.OneSignal.User) {
      const tags = window.OneSignal.User.getTags();
      return tags;
    }
    return {};
  } catch (error) {
    console.error('태그 가져오기 실패:', error);
    return {};
  }
};