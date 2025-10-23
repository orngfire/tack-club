import React, { useState } from 'react';
import { ViewType } from '../types';
import NotificationSettings from './NotificationSettings';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <aside className="w-16 h-screen bg-white border-r border-gray-200 flex flex-col items-center py-6">
      {/* Logo/Title Area */}
      <div className="mb-8">
        <button
          onClick={() => onViewChange('calendar')}
          className="w-10 h-10 rounded-xl overflow-hidden shadow-soft hover:shadow-hover transition-all transform active:scale-95"
          title="오늘의 압정은 무엇인가요?"
        >
          <img
            src="/tack-icon.svg"
            alt="압정 클럽 로고"
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col gap-2">
        {/* All Entries View */}
        <button
          onClick={() => onViewChange('all')}
          className={`group relative p-3 rounded-xl transition-all duration-200 ${
            currentView === 'all'
              ? 'bg-primary-light text-primary'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
          title="모든 압정"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          {currentView === 'all' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full" />
          )}
        </button>

        {/* Calendar View */}
        <button
          onClick={() => onViewChange('calendar')}
          className={`group relative p-3 rounded-xl transition-all duration-200 ${
            currentView === 'calendar'
              ? 'bg-primary-light text-primary'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
          title="달력 보기"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {currentView === 'calendar' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full" />
          )}
        </button>

        {/* Announcements View */}
        <button
          onClick={() => onViewChange('announcements')}
          className={`group relative p-3 rounded-xl transition-all duration-200 ${
            currentView === 'announcements'
              ? 'bg-primary-light text-primary'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
          title="행복 아카이브"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          {currentView === 'announcements' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full" />
          )}
        </button>

        {/* Stats View */}
        <button
          onClick={() => onViewChange('stats')}
          className={`group relative p-3 rounded-xl transition-all duration-200 ${
            currentView === 'stats'
              ? 'bg-primary-light text-primary'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
          title="통계"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          {currentView === 'stats' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full" />
          )}
        </button>
      </nav>

      {/* Bottom section - Settings */}
      <div className="mt-auto">
        <button
          onClick={() => setShowSettings(true)}
          className="p-3 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all duration-200"
          title="설정"
        >
          <svg
            className="w-[22px] h-[22px]"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.9}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">설정</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <NotificationSettings />
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;