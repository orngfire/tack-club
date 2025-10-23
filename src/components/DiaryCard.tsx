import React from 'react';
import { DiaryEntry } from '../types';
import { formatTime } from '../utils/dateHelpers';
import { getAuthorColor } from '../constants/authors';
import { getInitials, getAvatarColor, getAvatarImage } from '../utils/avatarHelpers';

interface DiaryCardProps {
  entry: DiaryEntry;
  currentUserId: string;
  onReaction: (entryId: string) => void;
  showDate?: boolean;
  showComments?: boolean;
}

const DiaryCard: React.FC<DiaryCardProps> = ({
  entry,
  currentUserId,
  onReaction,
  showDate = false,
  showComments = true
}) => {
  // 리액션 데이터 안전하게 처리
  const reactions = entry.reactions?.악 || [];
  const hasReacted = reactions.includes(currentUserId);
  const reactionCount = reactions.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-2 sm:mb-3 shadow-soft hover:shadow-hover transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full ${getAvatarColor(entry.author)} flex items-center justify-center shadow-sm`}>
            {getAvatarImage(entry.author) ? (
              <img
                src={getAvatarImage(entry.author)!}
                alt={entry.author}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {getInitials(entry.author)}
              </span>
            )}
          </div>
          <div>
            <p className="text-gray-900 font-medium text-sm">{entry.author}</p>
            <p className="text-gray-500 text-xs">
              {formatTime(entry.timestamp)}
              {showDate && ` • ${new Date(entry.date).toLocaleDateString('ko-KR')}`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
        {entry.content}
      </div>

      {/* Reaction Button - Clean Style */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onReaction(entry.id)}
          className={`
            inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
            transition-all duration-200 transform active:scale-95
            ${hasReacted
              ? 'bg-primary-light text-primary border border-primary/20'
              : reactionCount > 0
                ? 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }
          `}
        >
          <span className={`text-base ${hasReacted ? 'animate-scale-in' : ''}`}>
            📍
          </span>
          <span>악</span>
          {reactionCount > 0 && (
            <span className="font-semibold text-xs">
              {reactionCount}
            </span>
          )}
        </button>

        {/* Comment button - Only show when showComments is true */}
        {showComments && (
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>댓글</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DiaryCard;