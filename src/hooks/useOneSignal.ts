import { useState, useEffect } from 'react';
import {
  toggleNotificationSubscription,
  setOneSignalTag,
  getOneSignalUserId,
  getOneSignalTags,
} from '../config/onesignal';

export const useOneSignal = () => {
  // localStorage에서 초기 상태 가져오기
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationEnabled');
    return saved === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [tags, setTags] = useState<Record<string, string>>({});

  // 초기 상태 확인
  useEffect(() => {
    const checkInitialState = async () => {
      try {
        // 브라우저 권한 상태와 localStorage 상태 동기화
        const permission = 'Notification' in window ? Notification.permission : 'denied';
        const savedState = localStorage.getItem('notificationEnabled') === 'true';

        // 권한이 granted이고 localStorage도 true인 경우만 활성화
        const enabled = permission === 'granted' && savedState;
        setIsNotificationEnabled(enabled);

        // 개발 환경에서 디버그 정보 로드
        if (process.env.NODE_ENV === 'development') {
          const id = await getOneSignalUserId();
          const currentTags = await getOneSignalTags();
          setUserId(id || null);
          setTags(currentTags);
        }
      } catch (error) {
        console.error('OneSignal 상태 확인 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialState();
  }, []);

  // 알림 토글
  const toggleNotifications = async (enable: boolean) => {
    setIsLoading(true);
    try {
      // 브라우저 알림 권한 상태에 따라 단순 상태 업데이트
      // OneSignal이 없어도 알림 권한 상태는 관리
      if (enable && 'Notification' in window) {
        // 알림 켜기 - 권한 확인
        const permission = Notification.permission;
        if (permission === 'granted') {
          setIsNotificationEnabled(true);
          localStorage.setItem('notificationEnabled', 'true');
          // OneSignal이 있으면 구독도 활성화
          await toggleNotificationSubscription(true);

          // OneSignal 수동 구독 시도
          try {
            if (typeof window !== 'undefined' && window.OneSignal) {
              await window.OneSignal.User.PushSubscription.optIn();
              console.log('OneSignal 구독 활성화 완료');
            }
          } catch (e) {
            console.log('OneSignal 구독 시도 중 오류:', e);
          }
          return true;
        } else {
          setIsNotificationEnabled(false);
          localStorage.setItem('notificationEnabled', 'false');
          return false;
        }
      } else {
        // 알림 끄기
        setIsNotificationEnabled(false);
        localStorage.setItem('notificationEnabled', 'false');
        await toggleNotificationSubscription(false);

        // OneSignal 구독 해제
        try {
          if (typeof window !== 'undefined' && window.OneSignal) {
            await window.OneSignal.User.PushSubscription.optOut();
            console.log('OneSignal 구독 해제 완료');
          }
        } catch (e) {
          console.log('OneSignal 구독 해제 중 오류:', e);
        }
        return false;
      }
    } catch (error) {
      console.error('알림 토글 실패:', error);
      // 에러가 발생해도 상태는 업데이트
      setIsNotificationEnabled(enable);
      localStorage.setItem('notificationEnabled', String(enable));
      return enable;
    } finally {
      setIsLoading(false);
    }
  };

  // 태그 업데이트
  const updateTag = async (key: string, value: string) => {
    try {
      await setOneSignalTag(key, value);
      setTags(prev => ({ ...prev, [key]: value }));
      return true;
    } catch (error) {
      console.error('태그 업데이트 실패:', error);
      return false;
    }
  };

  // 디버그 정보 새로고침
  const refreshDebugInfo = async () => {
    if (process.env.NODE_ENV === 'development') {
      const id = await getOneSignalUserId();
      const currentTags = await getOneSignalTags();
      setUserId(id || null);
      setTags(currentTags);
    }
  };

  return {
    isNotificationEnabled,
    isLoading,
    toggleNotifications,
    updateTag,
    userId,
    tags,
    refreshDebugInfo,
  };
};