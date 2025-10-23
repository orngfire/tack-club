import React, { useState } from 'react';
import { AUTHORS } from '../constants/authors';
import { setOneSignalTag } from '../config/onesignal';
import { getAvatarImage } from '../utils/avatarHelpers';

interface NameSelectionModalProps {
  onNameSelected: (name: string) => void;
}

const NameSelectionModal: React.FC<NameSelectionModalProps> = ({ onNameSelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const handleNameSelect = async (name: string) => {
    setIsLoading(true);
    setSelectedName(name);

    try {
      // 1. localStorage에 저장
      localStorage.setItem('myName', name);
      localStorage.setItem('hasSelectedName', 'true');

      // 2. OneSignal 태그 설정 (타임아웃 설정)
      const tagPromise = setOneSignalTag('author', name);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('OneSignal timeout')), 3000)
      );

      try {
        await Promise.race([tagPromise, timeoutPromise]);
        console.log('OneSignal 태그 설정 성공');
      } catch (error) {
        console.warn('OneSignal 태그 설정 실패 (계속 진행):', error);
        // OneSignal이 실패해도 계속 진행
      }

      // 3. 브라우저 알림 권한 요청 (사용자가 거부해도 계속 진행)
      try {
        if ('Notification' in window && Notification.permission === 'default') {
          // 권한이 아직 설정되지 않은 경우에만 요청
          const permission = await Notification.requestPermission();
          console.log('브라우저 알림 권한 요청 결과:', permission);

          // 권한이 허용된 경우 localStorage에 저장
          if (permission === 'granted') {
            localStorage.setItem('notificationEnabled', 'true');
          }
        } else {
          console.log('알림 권한 상태:', Notification.permission);
        }
      } catch (error) {
        console.warn('알림 권한 요청 실패 (계속 진행):', error);
      }

      // 4. 콜백 호출
      onNameSelected(name);
    } catch (error) {
      console.error('이름 선택 처리 중 오류:', error);
      // 오류가 발생해도 기본 기능은 작동하도록
      onNameSelected(name);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 max-w-sm sm:max-w-md w-full transform transition-all">
        {/* 헤더 */}
        <div className="text-center mb-5 sm:mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
            당신은 누구인가요?
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            압정을 남길 이름을 선택해주세요
          </p>
        </div>

        {/* 이름 선택 그리드 */}
        <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-3">
          {AUTHORS.map((author) => {
            const avatarPath = getAvatarImage(author) || `https://ui-avatars.com/api/?name=${author}&background=667eea&color=fff&bold=true`;
            const isSelected = selectedName === author;

            return (
              <button
                key={author}
                onClick={() => handleNameSelect(author)}
                disabled={isLoading}
                className={`
                  relative p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200
                  ${isSelected
                    ? 'border-primary bg-primary/5 shadow-md scale-105'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }
                  ${isLoading && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                  flex flex-col items-center gap-1 sm:gap-2
                `}
              >
                {/* 아바타 이미지 */}
                <div className={`
                  w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden
                  ${isSelected ? 'ring-2 sm:ring-3 md:ring-4 ring-primary/30' : ''}
                `}>
                  <img
                    src={avatarPath}
                    alt={author}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 아바타 표시
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${author}&background=667eea&color=fff&bold=true`;
                    }}
                  />
                </div>

                {/* 이름 */}
                <span className={`
                  font-semibold text-xs sm:text-sm
                  ${isSelected ? 'text-primary' : 'text-gray-700'}
                `}>
                  {author}
                </span>

                {/* 선택 체크마크 */}
                {isSelected && (
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="mt-4 sm:mt-5 md:mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>설정 중...</span>
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="mt-4 sm:mt-5 md:mt-6 p-2.5 sm:p-3 bg-blue-50 rounded-lg">
          <p className="text-[11px] sm:text-xs text-blue-700 text-center">
            💡 이름 선택 후 브라우저 알림 권한을 요청합니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default NameSelectionModal;