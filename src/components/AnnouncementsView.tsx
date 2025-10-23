import React from 'react';
import { Announcement } from '../types';

interface AnnouncementsViewProps {
  announcements: Announcement[];
}

const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ announcements }) => {
  return (
    <div className="flex-1 flex flex-col h-screen max-w-4xl mx-auto px-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            행복 아카이브
          </h1>
          <p className="text-gray-500 text-lg">
            행복이란 무엇일까?
          </p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="flex-1 overflow-y-auto pb-6">
        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-xl border border-gray-200 shadow-soft hover:shadow-hover p-6 transition-all animate-slide-up"
              >
                {/* Announcement Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-sm">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {announcement.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500 text-sm">
                          {announcement.author}
                        </span>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-gray-500 text-sm">
                          {new Date(announcement.date).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badge for new announcements */}
                  {isNewAnnouncement(announcement.date) && (
                    <span className="px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">
                      NEW
                    </span>
                  )}
                </div>

                {/* Announcement Content */}
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {announcement.content}
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="text-sm">좋아요</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-2.796 0-5.29 1.28-6.716 3.342m9.032 4.026a9.003 9.003 0 01-9.032 0"
                      />
                    </svg>
                    <span className="text-sm">공유</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-2">아직 행복의 기록이 없어요</p>
            <p className="text-gray-400 text-sm">행복한 순간들이 여기에 차곡차곡 쌓일 거예요</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to check if announcement is new (within 7 days)
const isNewAnnouncement = (date: string): boolean => {
  const announcementDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - announcementDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

export default AnnouncementsView;