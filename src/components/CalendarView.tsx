import React, { useState } from 'react';
import { DiaryEntry } from '../types';
import { getWeekDates, formatDate, formatDateKorean, isToday } from '../utils/dateHelpers';
import DiaryCard from './DiaryCard';
import NewEntryForm from './NewEntryForm';

interface CalendarViewProps {
  entries: DiaryEntry[];
  currentUserId: string;
  onAddEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  onReaction: (entryId: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  entries,
  currentUserId,
  onAddEntry,
  onReaction
}) => {
  const [showNewEntryForm, setShowNewEntryForm] = useState<string | null>(null);
  const weekDates = getWeekDates();

  const getEntriesForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return entries.filter(entry => entry.date === dateStr);
  };

  const handleAddEntry = (date: string, author: string, content: string) => {
    onAddEntry({
      author,
      content,
      date,
      timestamp: Date.now(),
      reactions: { 악: [] }
    });
    setShowNewEntryForm(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 md:p-6 mb-4 md:mb-6 text-center">
        <h1 className="text-xl md:text-3xl font-bold text-white mb-2">
          오늘의 압정은 무엇인가요?
        </h1>
        <p className="text-sm md:text-base text-white/70">
          매일의 순간을 함께 기록해요
        </p>
      </div>

      {/* Calendar Grid - Horizontal scroll on mobile */}
      <div className="flex-1 flex gap-2 md:gap-3 overflow-x-auto md:overflow-hidden">
        {weekDates.map((date) => {
          const dateStr = formatDate(date);
          const dayEntries = getEntriesForDate(date);
          const today = isToday(date);

          return (
            <div
              key={dateStr}
              className={`flex-1 flex flex-col min-w-[140px] md:min-w-0 ${
                today ? 'ring-2 ring-white/30 rounded-2xl' : ''
              }`}
            >
              {/* Date Header */}
              <div className={`glass-card rounded-t-2xl p-3 text-center mb-3 ${
                today ? 'bg-white/20' : ''
              }`}>
                <p className="text-white font-medium text-xs md:text-sm">
                  {formatDateKorean(date)}
                </p>
                {today && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                    오늘
                  </span>
                )}
              </div>

              {/* Entries Container */}
              <div className="flex-1 overflow-y-auto px-2 pb-2 custom-scrollbar">
                {/* Add Entry Button */}
                {showNewEntryForm === dateStr ? (
                  <NewEntryForm
                    date={dateStr}
                    onSubmit={(author, content) => handleAddEntry(dateStr, author, content)}
                    onCancel={() => setShowNewEntryForm(null)}
                  />
                ) : (
                  <button
                    onClick={() => setShowNewEntryForm(dateStr)}
                    className="w-full mb-3 p-3 glass-card rounded-2xl hover:bg-white/15 transition-all group"
                  >
                    <div className="flex items-center justify-center gap-2 text-white/70 group-hover:text-white">
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span className="text-sm font-medium">새 일기 작성</span>
                    </div>
                  </button>
                )}

                {/* Diary Entries */}
                {dayEntries.map((entry) => (
                  <DiaryCard
                    key={entry.id}
                    entry={entry}
                    currentUserId={currentUserId}
                    onReaction={onReaction}
                  />
                ))}

                {dayEntries.length === 0 && showNewEntryForm !== dateStr && (
                  <div className="text-center py-8">
                    <p className="text-white/40 text-sm">아직 작성된 일기가 없어요</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;