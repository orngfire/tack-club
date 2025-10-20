import React, { useState, useEffect } from 'react';
import { DiaryEntry, Announcement, ViewType } from './types';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import CalendarView from './components/CalendarView';
import AllEntriesView from './components/AllEntriesView';
import AnnouncementsView from './components/AnnouncementsView';
import { formatDate } from './utils/dateHelpers';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('calendar');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // For demo purposes, using a fixed user ID
  const currentUserId = 'user-1';

  // Load initial data
  useEffect(() => {
    // Load from localStorage if available
    const savedEntries = localStorage.getItem('tackclub-entries');
    const savedAnnouncements = localStorage.getItem('tackclub-announcements');

    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    } else {
      // Initial sample data
      const sampleEntries: DiaryEntry[] = [
        {
          id: '1',
          author: '응곤',
          content: '오늘은 정말 멋진 날이었어요! 새로운 프로젝트를 시작했는데 팀원들과 함께 브레인스토밍을 하면서 정말 창의적인 아이디어들이 많이 나왔습니다. 😊',
          date: formatDate(new Date()),
          timestamp: Date.now() - 3600000,
          reactions: { 악: ['user-2', 'user-3'] }
        },
        {
          id: '2',
          author: '예림',
          content: '커피를 너무 많이 마셔서 심장이 두근두근... 하지만 코딩할 때 집중력은 최고였어요!',
          date: formatDate(new Date()),
          timestamp: Date.now() - 7200000,
          reactions: { 악: ['user-1'] }
        },
        {
          id: '3',
          author: '한준',
          content: '오늘 점심에 먹은 김치찌개가 너무 맵고 짜서 악악악!!! 그래도 맛있었어요 ㅋㅋㅋ',
          date: formatDate(new Date(Date.now() - 86400000)), // Yesterday
          timestamp: Date.now() - 86400000,
          reactions: { 악: ['user-1', 'user-2', 'user-3', 'user-4'] }
        },
        {
          id: '4',
          author: '민성',
          content: '오늘 새로운 기능을 배포했는데 버그 없이 잘 작동해서 기분이 너무 좋아요! 팀원들 모두 수고했어요~ 🎉',
          date: formatDate(new Date()),
          timestamp: Date.now() - 10800000,
          reactions: { 악: ['user-1', 'user-3'] }
        },
        {
          id: '5',
          author: '성현',
          content: '회의가 3시간이나 했어요... 악!! 그래도 중요한 결정들을 내려서 의미있는 시간이었어요.',
          date: formatDate(new Date(Date.now() - 86400000)),
          timestamp: Date.now() - 100000000,
          reactions: { 악: ['user-2', 'user-4', 'user-5'] }
        },
        {
          id: '6',
          author: '이바',
          content: '오늘은 집중이 너무 잘 돼서 코딩이 술술 풀렸어요! 이런 날이 더 많았으면 좋겠네요 ㅎㅎ',
          date: formatDate(new Date(Date.now() - 172800000)),
          timestamp: Date.now() - 180000000,
          reactions: { 악: [] }
        }
      ];
      setEntries(sampleEntries);
    }

    if (savedAnnouncements) {
      setAnnouncements(JSON.parse(savedAnnouncements));
    } else {
      // Initial sample announcements
      const sampleAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'Tack Club 오픈!',
          content: '안녕하세요 여러분! 드디어 우리만의 공유 일기장 Tack Club이 오픈했습니다. 🎉\n\n매일매일 우리의 소중한 순간들을 기록하고 공유해보세요. "악" 리액션으로 서로의 일상에 공감하고 응원해주세요!\n\n앞으로 더 많은 기능들이 추가될 예정이니 기대해주세요!',
          date: formatDate(new Date()),
          author: '관리자'
        },
        {
          id: '2',
          title: '새로운 기능 업데이트 예정',
          content: '다음 주에 새로운 기능들이 추가될 예정입니다:\n\n• 사진 업로드 기능\n• 다양한 리액션 추가\n• 다크모드 지원\n• 검색 기능\n\n많은 관심 부탁드립니다!',
          date: formatDate(new Date(Date.now() - 172800000)), // 2 days ago
          author: '개발팀'
        }
      ];
      setAnnouncements(sampleAnnouncements);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('tackclub-entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('tackclub-announcements', JSON.stringify(announcements));
  }, [announcements]);

  const handleAddEntry = (newEntry: Omit<DiaryEntry, 'id'>) => {
    const entry: DiaryEntry = {
      ...newEntry,
      id: Date.now().toString()
    };
    setEntries([...entries, entry]);
  };

  const handleReaction = (entryId: string) => {
    setEntries(entries.map(entry => {
      if (entry.id === entryId) {
        const hasReacted = entry.reactions.악.includes(currentUserId);
        return {
          ...entry,
          reactions: {
            ...entry.reactions,
            악: hasReacted
              ? entry.reactions.악.filter(id => id !== currentUserId)
              : [...entry.reactions.악, currentUserId]
          }
        };
      }
      return entry;
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden pb-20 md:pb-0">
        <div className="h-full animate-fade-in view-transition">
          {currentView === 'calendar' && (
            <CalendarView
              entries={entries}
              currentUserId={currentUserId}
              onAddEntry={handleAddEntry}
              onReaction={handleReaction}
            />
          )}
          {currentView === 'all' && (
            <AllEntriesView
              entries={entries}
              currentUserId={currentUserId}
              onAddEntry={handleAddEntry}
              onReaction={handleReaction}
            />
          )}
          {currentView === 'announcements' && (
            <AnnouncementsView announcements={announcements} />
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
}

export default App;