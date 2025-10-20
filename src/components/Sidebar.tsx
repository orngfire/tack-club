import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <aside className="w-20 h-screen glass-card border-r border-white/10 flex flex-col items-center py-8 gap-6">
      {/* Logo/Title Area */}
      <div className="mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          T
        </div>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col gap-4">
        {/* All Entries View */}
        <button
          onClick={() => onViewChange('all')}
          className={`group relative p-3 rounded-xl transition-all duration-300 ${
            currentView === 'all'
              ? 'bg-white/20 shadow-lg'
              : 'hover:bg-white/10'
          }`}
          title="모든 일기"
        >
          <svg
            className={`w-6 h-6 transition-colors ${
              currentView === 'all' ? 'text-white' : 'text-white/70 group-hover:text-white'
            }`}
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
          {currentView === 'all' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full animate-fade-in" />
          )}
        </button>

        {/* Calendar View */}
        <button
          onClick={() => onViewChange('calendar')}
          className={`group relative p-3 rounded-xl transition-all duration-300 ${
            currentView === 'calendar'
              ? 'bg-white/20 shadow-lg'
              : 'hover:bg-white/10'
          }`}
          title="달력 보기"
        >
          <svg
            className={`w-6 h-6 transition-colors ${
              currentView === 'calendar' ? 'text-white' : 'text-white/70 group-hover:text-white'
            }`}
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
          {currentView === 'calendar' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full animate-fade-in" />
          )}
        </button>

        {/* Announcements View */}
        <button
          onClick={() => onViewChange('announcements')}
          className={`group relative p-3 rounded-xl transition-all duration-300 ${
            currentView === 'announcements'
              ? 'bg-white/20 shadow-lg'
              : 'hover:bg-white/10'
          }`}
          title="공지사항"
        >
          <svg
            className={`w-6 h-6 transition-colors ${
              currentView === 'announcements' ? 'text-white' : 'text-white/70 group-hover:text-white'
            }`}
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
          {currentView === 'announcements' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full animate-fade-in" />
          )}
        </button>
      </nav>

      {/* Bottom section - can add user profile or settings later */}
      <div className="mt-auto">
        <button className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group">
          <svg
            className="w-6 h-6 text-white/70 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;