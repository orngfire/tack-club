import React, { useState, useMemo } from 'react';
import { DiaryEntry } from '../types';
import { AUTHORS } from '../constants/authors';
import { getLocalDateString, parseLocalDateString } from '../utils/dateHelpers';

interface StatsViewProps {
  entries: DiaryEntry[];
}

const StatsView: React.FC<StatsViewProps> = ({ entries }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));

  // Get the start of the week (Monday)
  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0); // 시간을 자정으로 설정
    return d;
  }

  // Get week number based on first Thursday rule
  function getWeekNumber(date: Date): { week: number; month: string; year: number } {
    const d = new Date(date);
    const month = d.getMonth();
    const year = d.getFullYear();

    // Find first Thursday of the month
    const firstDay = new Date(year, month, 1);
    let firstThursday = new Date(firstDay);

    while (firstThursday.getDay() !== 4) { // 4 is Thursday
      firstThursday.setDate(firstThursday.getDate() + 1);
    }

    // Get the Monday of the week containing the first Thursday
    const firstWeekMonday = getWeekStart(firstThursday);

    // Calculate week number
    const weekDiff = Math.floor((d.getTime() - firstWeekMonday.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const weekNumber = weekDiff + 1;

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    return {
      week: weekNumber,
      month: monthNames[month],
      year
    };
  }

  // Navigate to previous/next week
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
    setCurrentWeekStart(getWeekStart(newDate));
  };

  // Format date range for display
  const getDateRange = (weekStart: Date): string => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const formatDate = (date: Date) => {
      const year = String(date.getFullYear()).slice(2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
      return `${year}.${month}.${day}(${weekDay})`;
    };

    return `${formatDate(weekStart)} ~ ${formatDate(weekEnd)}`;
  };

  // Calculate posting counts for the current week
  const weekStats = useMemo(() => {
    const stats: Record<string, Record<string, number>> = {};
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Initialize stats for all authors
    AUTHORS.forEach(author => {
      stats[author] = {};
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(date.getDate() + i);
        const dateKey = getLocalDateString(date);
        stats[author][dateKey] = 0;
      }
    });

    // Count entries
    entries.forEach(entry => {
      if (entry.author && stats[entry.author]) {
        // entry.date를 Date 객체로 파싱
        const entryDate = parseLocalDateString(entry.date);
        entryDate.setHours(0, 0, 0, 0); // 시간을 자정으로 설정

        // 날짜가 현재 주차 범위에 포함되는지 확인
        if (entryDate >= currentWeekStart && entryDate <= weekEnd) {
          // entry.date를 로컬 날짜 문자열로 정규화
          const dateKey = getLocalDateString(entryDate);
          if (stats[entry.author][dateKey] !== undefined) {
            stats[entry.author][dateKey]++;
          }
        }
      }
    });

    return stats;
  }, [entries, currentWeekStart]);

  // Get color intensity based on count
  const getColorClass = (count: number): string => {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-pink-200';
    if (count === 2) return 'bg-pink-300';
    if (count === 3) return 'bg-pink-400';
    return 'bg-pink-500'; // 4 or more
  };

  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
  const weekInfo = getWeekNumber(currentWeekStart);

  // Calculate weekly totals for each author
  const weeklyTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    AUTHORS.forEach(author => {
      totals[author] = Object.values(weekStats[author] || {}).reduce((sum, count) => sum + count, 0);
    });
    return totals;
  }, [weekStats]);

  return (
    <div className="flex-1 flex flex-col h-screen max-w-full md:max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-soft p-2.5 sm:p-4 md:p-6 mb-2 sm:mb-4 md:mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
            압정을 몇 개 모았을까?
          </h1>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg font-medium">
            이번 주에 모은 행복들
          </p>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-xl shadow-soft p-3 sm:p-5 md:p-6 mb-2 sm:mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-5 sm:mb-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="이전 주"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center mt-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {weekInfo.month} {weekInfo.week}주차
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              {getDateRange(currentWeekStart)}
            </p>
          </div>

          <button
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="다음 주"
            disabled={currentWeekStart >= getWeekStart(new Date())}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Index and Grid Container - Center Aligned */}
        <div className="flex flex-col items-center mt-1 sm:-mt-2">
          {/* Color Index - Gradient Bar Style */}
          <div className="mb-4 sm:mb-2 self-center sm:self-end sm:mr-4">
            <div>
              <div className="flex h-2.5 rounded-full overflow-hidden shadow-sm">
                <div className="w-6 bg-gray-100"></div>
                <div className="w-6 bg-pink-200"></div>
                <div className="w-6 bg-pink-300"></div>
                <div className="w-6 bg-pink-400"></div>
                <div className="w-6 bg-pink-500"></div>
              </div>
              <div className="flex mt-1">
                <span className="text-[9px] text-gray-500 w-6 text-center">0</span>
                <span className="text-[9px] text-gray-500 w-6 text-center">1</span>
                <span className="text-[9px] text-gray-500 w-6 text-center">2</span>
                <span className="text-[9px] text-gray-500 w-6 text-center">3</span>
                <span className="text-[9px] text-gray-500 w-6 text-center">4+</span>
              </div>
            </div>
          </div>

          {/* Stats Grid - Centered based on Thursday */}
          <div className="flex justify-center w-full">
            <div className="overflow-x-auto relative -ml-6">
              <div>
            {/* Week days header */}
            <div className="flex items-start gap-[3px] mb-2">
              <div className="w-14 mr-1 text-xs sm:text-sm font-medium text-gray-500"></div>
              {weekDays.map((day, index) => {
                const date = new Date(currentWeekStart);
                date.setDate(date.getDate() + index);
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div key={day} className="w-5 sm:w-6 text-center">
                    <div className={`text-[10px] sm:text-xs font-medium ${isToday ? 'text-primary' : 'text-gray-500'}`}>
                      {day}
                    </div>
                    <div className={`text-[10px] ${isToday ? 'text-primary' : 'text-gray-400'}`}>
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
              <div className="ml-2 text-xs sm:text-sm font-medium text-gray-500 text-center"></div>
            </div>

            {/* Author rows */}
            {AUTHORS.map(author => {
              const dates = [];
              for (let i = 0; i < 7; i++) {
                const date = new Date(currentWeekStart);
                date.setDate(date.getDate() + i);
                dates.push(getLocalDateString(date));
              }

              return (
                <div key={author} className="flex items-center gap-[3px] mb-[2px]">
                  {/* Author name */}
                  <div className="w-14 mr-1 text-[11px] sm:text-xs font-bold text-gray-600 flex items-center justify-end pr-2">
                    {author}
                  </div>

                  {/* Day cells */}
                  {dates.map(dateKey => {
                    const count = weekStats[author]?.[dateKey] || 0;
                    const today = new Date();
                    const todayKey = getLocalDateString(today);
                    const isFuture = dateKey > todayKey;

                    return (
                      <div
                        key={dateKey}
                        className={`
                          w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center
                          ${isFuture ? 'bg-gray-100' : getColorClass(count)}
                          transition-all hover:scale-110
                        `}
                        title={`${author} - ${dateKey}: ${count}개`}
                      />
                    );
                  })}

                  {/* Weekly total */}
                  <div className="ml-2 flex items-center justify-center">
                    <span className={`text-[9px] sm:text-[10px] font-medium ${weeklyTotals[author] > 0 ? 'text-primary' : 'text-gray-400'}`}>
                      {weeklyTotals[author]}개
                    </span>
                  </div>
                </div>
              );
            })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;