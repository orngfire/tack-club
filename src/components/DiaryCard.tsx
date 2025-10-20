import React from 'react';
import { DiaryEntry } from '../types';
import { formatTime } from '../utils/dateHelpers';
import { getAuthorColor } from '../constants/authors';

interface DiaryCardProps {
  entry: DiaryEntry;
  currentUserId: string;
  onReaction: (entryId: string) => void;
  showDate?: boolean;
}

const DiaryCard: React.FC<DiaryCardProps> = ({
  entry,
  currentUserId,
  onReaction,
  showDate = false
}) => {
  const hasReacted = entry.reactions.악.includes(currentUserId);
  const reactionCount = entry.reactions.악.length;

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-4 mb-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAuthorColor(entry.author)} flex items-center justify-center text-white text-sm font-medium shadow-md`}>
            {entry.author[0].toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium text-sm">{entry.author}</p>
            <p className="text-white/50 text-xs">
              {formatTime(entry.timestamp)}
              {showDate && ` • ${new Date(entry.date).toLocaleDateString('ko-KR')}`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-white/90 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
        {entry.content}
      </div>

      {/* Reaction Button - Slack Style */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onReaction(entry.id)}
          className={`
            inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
            transition-all duration-200 transform active:scale-95
            ${hasReacted
              ? 'bg-purple-500/30 text-white border border-purple-400/50 hover:bg-purple-500/40'
              : reactionCount > 0
                ? 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/20'
                : 'bg-transparent text-white/60 border border-white/20 hover:bg-white/10 hover:text-white/80'
            }
          `}
        >
          <span className={`transition-transform duration-200 ${hasReacted ? 'scale-110' : ''}`}>
            😱
          </span>
          <span>악</span>
          {reactionCount > 0 && (
            <span className="ml-0.5 font-semibold">
              {reactionCount}
            </span>
          )}
        </button>

        {/* Add more reaction button */}
        <button className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200 group">
          <svg
            className="w-4 h-4 text-white/40 group-hover:text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DiaryCard;