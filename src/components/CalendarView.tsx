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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const weekDates = getWeekDates(currentWeekStart);

  const getEntriesForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return entries.filter(entry => entry.date === dateStr);
  };

  const selectedDateStr = formatDate(selectedDate);
  const selectedDateEntries = getEntriesForDate(selectedDate);

  // Get all authors list
  const AUTHORS = ['응곤', '민성', '성현', '한준', '이바', '예림'];

  // Get today's authors who have written
  const getTodayWritingStatus = () => {
    const today = new Date();
    const todayStr = formatDate(today);
    const todayEntries = entries.filter(entry => entry.date === todayStr);

    // Use Array.from() instead of spread operator for TypeScript compatibility
    const writtenAuthorsSet = new Set(todayEntries.map(entry => entry.author));
    const writtenAuthors = Array.from(writtenAuthorsSet);

    const completed = AUTHORS.filter(author => writtenAuthors.includes(author));
    const pending = AUTHORS.filter(author => !writtenAuthors.includes(author));

    return { completed, pending };
  };

  const handleAddEntry = (author: string, content: string) => {
    onAddEntry({
      author,
      content,
      date: selectedDateStr,
      timestamp: Date.now(),
      reactions: { 악: [] }
    });
    setShowNewEntryForm(false);
  };

  // Get month and year for header
  const monthYear = currentWeekStart.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long'
  });

  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
    setShowNewEntryForm(false); // Close the form when navigating weeks
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
    setShowNewEntryForm(false); // Close the form when navigating weeks
  };

  return (
    <div className="flex-1 flex flex-col h-screen max-w-full md:max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
      {/* Month Header */}
      <div className="bg-white rounded-xl shadow-soft p-2.5 sm:p-4 md:p-6 mb-2 sm:mb-4 md:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
              오늘의 압정은 무엇인가요?
            </h1>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg font-medium">
              {monthYear}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={goToPreviousWeek} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={goToNextWeek} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-xl shadow-soft p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6">
        <div className="flex justify-between items-center gap-1 sm:gap-2">
          {weekDates.map((date) => {
            const dateStr = formatDate(date);
            const isSelected = formatDate(selectedDate) === dateStr;
            const today = isToday(date);
            const dayName = date.toLocaleDateString('ko-KR', { weekday: 'short' });
            const dayNumber = date.getDate();
            const hasEntries = getEntriesForDate(date).length > 0;

            return (
              <button
                key={dateStr}
                onClick={() => {
                  setSelectedDate(date);
                  setShowNewEntryForm(false); // Close the form when switching dates
                }}
                className={`
                  flex-1 flex flex-col items-center justify-center p-2 sm:p-2.5 md:p-3 rounded-xl transition-all
                  ${isSelected
                    ? 'bg-primary text-white shadow-md'
                    : today
                      ? 'bg-primary-light text-primary hover:bg-primary hover:text-white'
                      : 'hover:bg-gray-50 text-gray-700'
                  }
                `}
              >
                <span className={`text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 ${isSelected ? 'text-white/90' : today ? 'text-primary' : 'text-gray-500'}`}>
                  {dayName}
                </span>
                <span className={`text-sm sm:text-base md:text-lg font-bold ${isSelected || today ? '' : 'text-gray-900'}`}>
                  {dayNumber}
                </span>
                {hasEntries && !isSelected && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${today ? 'bg-primary' : 'bg-gray-400'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Content */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
        <div className="bg-white rounded-xl shadow-soft p-3 sm:p-4 md:p-6 mb-4">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-base sm:text-base md:text-lg font-semibold text-gray-900">
              {formatDateKorean(selectedDate)}
            </h2>
            <span className="text-sm text-gray-500">
              {selectedDateEntries.length}개의 압정
            </span>
          </div>

          {/* Today's Writing Status - only show if viewing today */}
          {isToday(selectedDate) && (
            <div className="mb-4 p-4 bg-gradient-to-r from-primary-light to-pink-50 rounded-xl border border-primary/10">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">오늘의 작성 현황</h3>
              {(() => {
                const { completed, pending } = getTodayWritingStatus();
                return (
                  <div className="space-y-2">
                    {completed.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span className="text-sm text-gray-700">
                          {completed.map((name, index) => (
                            <span key={name}>
                              <span className="font-medium">{name}</span>
                              {index < completed.length - 1 && ', '}
                            </span>
                          ))}
                          <span className="ml-1 text-gray-500">작성 완료</span>
                        </span>
                      </div>
                    )}
                    {pending.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500">⏳</span>
                        <span className="text-sm text-gray-700">
                          {pending.map((name, index) => (
                            <span key={name}>
                              <span className="font-medium">{name}</span>
                              {index < pending.length - 1 && ', '}
                            </span>
                          ))}
                          <span className="ml-1 text-gray-500">작성 대기 중</span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Add Entry Button/Form */}
          {showNewEntryForm ? (
            <NewEntryForm
              date={selectedDateStr}
              onSubmit={handleAddEntry}
              onCancel={() => setShowNewEntryForm(false)}
            />
          ) : (
            <button
              onClick={() => setShowNewEntryForm(true)}
              className="w-full mb-4 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl hover:border-primary hover:bg-primary-light transition-all group"
            >
              <div className="flex items-center justify-center gap-2 text-gray-500 group-hover:text-primary">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="font-medium">새 압정 작성하기</span>
              </div>
            </button>
          )}

          {/* Diary Entries for Selected Date */}
          {selectedDateEntries.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEntries.map((entry) => (
                <DiaryCard
                  key={entry.id}
                  entry={entry}
                  currentUserId={currentUserId}
                  onReaction={onReaction}
                  showComments={false}
                />
              ))}
            </div>
          ) : (
            !showNewEntryForm && (
              <div className="text-center py-12">
                <p className="text-gray-400">이 날짜에 작성된 압정이 없어요</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;