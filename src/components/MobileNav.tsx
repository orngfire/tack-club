import React from 'react';
import { ViewType } from '../types';

interface MobileNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, onViewChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 md:hidden z-50 shadow-top safe-bottom">
      <div className="flex justify-around items-center">
        {/* All Entries */}
        <button
          onClick={() => onViewChange('all')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            currentView === 'all' ? 'text-primary' : 'text-gray-400'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span className="text-xs">모든 압정</span>
          {currentView === 'all' && (
            <div className="w-1 h-1 bg-primary rounded-full" />
          )}
        </button>

        {/* Calendar */}
        <button
          onClick={() => onViewChange('calendar')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            currentView === 'calendar' ? 'text-primary' : 'text-gray-400'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs">달력</span>
          {currentView === 'calendar' && (
            <div className="w-1 h-1 bg-primary rounded-full" />
          )}
        </button>

        {/* Announcements */}
        <button
          onClick={() => onViewChange('announcements')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            currentView === 'announcements' ? 'text-primary' : 'text-gray-400'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span className="text-xs">행복</span>
          {currentView === 'announcements' && (
            <div className="w-1 h-1 bg-primary rounded-full" />
          )}
        </button>

        {/* Stats */}
        <button
          onClick={() => onViewChange('stats')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            currentView === 'stats' ? 'text-primary' : 'text-gray-400'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="text-xs">통계</span>
          {currentView === 'stats' && (
            <div className="w-1 h-1 bg-primary rounded-full" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;