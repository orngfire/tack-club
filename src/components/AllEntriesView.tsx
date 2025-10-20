import React, { useState } from 'react';
import { DiaryEntry } from '../types';
import DiaryCard from './DiaryCard';
import NewEntryForm from './NewEntryForm';
import AuthorFilter from './AuthorFilter';
import { formatDate } from '../utils/dateHelpers';

interface AllEntriesViewProps {
  entries: DiaryEntry[];
  currentUserId: string;
  onAddEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  onReaction: (entryId: string) => void;
}

const AllEntriesView: React.FC<AllEntriesViewProps> = ({
  entries,
  currentUserId,
  onAddEntry,
  onReaction
}) => {
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  // Filter entries by selected author
  const filteredEntries = selectedAuthor
    ? entries.filter(entry => entry.author === selectedAuthor)
    : entries;

  // Sort entries by timestamp (newest first)
  const sortedEntries = [...filteredEntries].sort((a, b) => b.timestamp - a.timestamp);

  const handleAddEntry = (author: string, content: string) => {
    onAddEntry({
      author,
      content,
      date: formatDate(new Date()),
      timestamp: Date.now(),
      reactions: { 악: [] }
    });
    setShowNewEntryForm(false);
  };

  return (
    <div className="flex-1 flex flex-col h-screen max-w-3xl mx-auto px-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 mb-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          모든 압정들
        </h1>
        <p className="text-white/70">
          지금까지 기록된 모든 순간들을 한눈에 볼 수 있어요
        </p>
      </div>

      {/* Author Filter */}
      <AuthorFilter
        selectedAuthor={selectedAuthor}
        onAuthorChange={setSelectedAuthor}
      />

      {/* Add New Entry Button */}
      {!showNewEntryForm && (
        <button
          onClick={() => setShowNewEntryForm(true)}
          className="w-full mb-6 p-4 glass-card rounded-2xl hover:bg-white/15 transition-all group"
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
            <span className="font-medium">새 일기 작성하기</span>
          </div>
        </button>
      )}

      {/* New Entry Form */}
      {showNewEntryForm && (
        <div className="mb-6">
          <NewEntryForm
            date={formatDate(new Date())}
            onSubmit={handleAddEntry}
            onCancel={() => setShowNewEntryForm(false)}
          />
        </div>
      )}

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto pb-6">
        {sortedEntries.length > 0 ? (
          <div className="space-y-4">
            {sortedEntries.map((entry) => (
              <DiaryCard
                key={entry.id}
                entry={entry}
                currentUserId={currentUserId}
                onReaction={onReaction}
                showDate={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 mx-auto text-white/30 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-white/50 text-lg mb-2">아직 작성된 일기가 없어요</p>
            <p className="text-white/40 text-sm">첫 번째 일기를 작성해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEntriesView;