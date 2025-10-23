import React, { useState, useEffect } from 'react';
import { AUTHORS } from '../constants/authors';
import { useOneSignal } from '../hooks/useOneSignal';
import { getAvatarImage } from '../utils/avatarHelpers';

const NotificationSettings: React.FC = () => {
  const [currentName, setCurrentName] = useState(localStorage.getItem('myName') || '');
  const [isChangingName, setIsChangingName] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    isNotificationEnabled,
    isLoading,
    toggleNotifications,
    updateTag,
    userId,
    tags,
    refreshDebugInfo,
  } = useOneSignal();

  useEffect(() => {
    // 컴포넌트 마운트 시 디버그 정보 새로고침
    refreshDebugInfo();
  }, [refreshDebugInfo]);

  const handleNameChange = async (newName: string) => {
    setIsUpdating(true);
    try {
      // localStorage 업데이트
      localStorage.setItem('myName', newName);
      setCurrentName(newName);

      // OneSignal 태그 업데이트
      await updateTag('author', newName);

      // 모달 닫기
      setIsChangingName(false);

      // 디버그 정보 새로고침
      await refreshDebugInfo();
    } catch (error) {
      console.error('이름 변경 실패:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleNotifications = async () => {
    console.log('토글 클릭 - 현재 상태:', isNotificationEnabled);

    if (!isNotificationEnabled) {
      // 알림 켜기 - 권한 요청
      console.log('알림 활성화 시도');

      // 브라우저 네이티브 권한 요청
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('브라우저 권한 요청 결과:', permission);

        if (permission === 'granted') {
          // 권한이 부여되면 상태 업데이트
          await toggleNotifications(true);
          if (currentName) {
            await updateTag('author', currentName);
          }
        }
      } else {
        console.error('이 브라우저는 알림을 지원하지 않습니다');
      }
    } else {
      // 알림 끄기
      console.log('알림 비활성화 시도');
      await toggleNotifications(false);
    }

    // 디버그 정보 새로고침
    await refreshDebugInfo();
  };

  const avatarPath = getAvatarImage(currentName) || `https://ui-avatars.com/api/?name=${currentName}&background=667eea&color=fff&bold=true`;

  return (
    <div className="space-y-4">
      {/* 내 정보 카드 */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">내 정보</h3>

        <div className="flex items-center gap-4 mb-4">
          {/* 아바타 */}
          <img
            src={avatarPath}
            alt={currentName}
            className="w-12 h-12 rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${currentName}&background=667eea&color=fff&bold=true`;
            }}
          />

          {/* 이름 및 변경 버튼 */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{currentName || '미선택'}</span>
              <button
                onClick={() => setIsChangingName(true)}
                className="text-xs text-primary hover:text-primary-dark"
              >
                변경
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              압정 작성자 이름
            </p>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-sm font-medium text-gray-700">알림</span>
            </div>

            <button
              onClick={handleToggleNotifications}
              disabled={isLoading}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${isNotificationEnabled ? 'bg-primary' : 'bg-gray-200'}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${isNotificationEnabled ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {isNotificationEnabled
              ? '압정 리마인드를 받고 있어요'
              : '알림이 비활성화되어 있어요'}
          </p>
        </div>

        {/* 개발 환경 디버그 정보 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="border-t pt-3 mt-3">
            <details className="text-xs text-gray-400">
              <summary className="cursor-pointer hover:text-gray-600">디버그 정보</summary>
              <div className="mt-2 space-y-1 font-mono">
                <div>User ID: {userId || 'N/A'}</div>
                <div>Tags: {JSON.stringify(tags)}</div>
              </div>
            </details>
          </div>
        )}
      </div>

      {/* 이름 변경 모달 */}
      {isChangingName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">이름 변경</h3>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {AUTHORS.map((author) => {
                const isSelected = author === currentName;
                return (
                  <button
                    key={author}
                    onClick={() => handleNameChange(author)}
                    disabled={isUpdating}
                    className={`
                      p-3 rounded-lg border transition-all
                      ${isSelected
                        ? 'border-primary bg-primary/5 font-semibold text-primary'
                        : 'border-gray-200 hover:border-primary/50 text-gray-700'}
                      ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {author}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsChangingName(false)}
              disabled={isUpdating}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 알림 안내 */}
      {!isNotificationEnabled && (
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            💡 알림을 켜면 새로운 압정이 등록될 때 알려드려요
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;