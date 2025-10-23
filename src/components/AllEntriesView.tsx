import React, { useState } from 'react';
import { DiaryEntry } from '../types';
import DiaryCard from './DiaryCard';
import AuthorFilter from './AuthorFilter';

interface AllEntriesViewProps {
  entries: DiaryEntry[];
  currentUserId: string;
  onReaction: (entryId: string) => void;
}

const AllEntriesView: React.FC<AllEntriesViewProps> = ({
  entries,
  currentUserId,
  onReaction
}) => {
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  // Filter entries by selected author
  const filteredEntries = selectedAuthor
    ? entries.filter(entry => entry.author === selectedAuthor)
    : entries;

  // Sort entries by timestamp (newest first)
  const sortedEntries = [...filteredEntries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="flex-1 flex flex-col h-screen max-w-full md:max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-soft p-2.5 sm:p-4 md:p-6 mb-2 sm:mb-4 md:mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
            모든 압정들
          </h1>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg font-medium">
            압정을 뿌려놓자. 행복해질 것이다.
          </p>
        </div>
      </div>

      {/* Author Filter */}
      <AuthorFilter
        selectedAuthor={selectedAuthor}
        onAuthorChange={setSelectedAuthor}
      />

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
        {sortedEntries.length > 0 ? (
          <div className="space-y-4 pb-4">
            {sortedEntries.map((entry) => (
              <DiaryCard
                key={entry.id}
                entry={entry}
                currentUserId={currentUserId}
                onReaction={onReaction}
                showDate={true}
                showComments={false}
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
            <p className="text-gray-400 text-lg">아직 작성된 압정이 없어요</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEntriesView;