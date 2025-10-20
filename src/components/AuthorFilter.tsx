import React from 'react';
import { AUTHORS, getAuthorColor } from '../constants/authors';

interface AuthorFilterProps {
  selectedAuthor: string | null;
  onAuthorChange: (author: string | null) => void;
}

const AuthorFilter: React.FC<AuthorFilterProps> = ({ selectedAuthor, onAuthorChange }) => {
  const filterOptions = ['전체', ...AUTHORS];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filterOptions.map((author) => {
        const isAll = author === '전체';
        const isSelected = isAll ? selectedAuthor === null : selectedAuthor === author;

        return (
          <button
            key={author}
            onClick={() => onAuthorChange(isAll ? null : author)}
            className={`
              px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200
              transform hover:scale-105 active:scale-95
              ${isSelected
                ? isAll
                  ? 'bg-white/25 text-white shadow-lg border border-white/30'
                  : `bg-gradient-to-r ${getAuthorColor(author)} text-white shadow-lg`
                : 'glass-card text-white/80 hover:bg-white/15 border border-white/10'
              }
            `}
          >
            <div className="flex items-center gap-2">
              {!isAll && (
                <div className={`w-2 h-2 rounded-full ${
                  isSelected
                    ? 'bg-white'
                    : `bg-gradient-to-r ${getAuthorColor(author)}`
                }`} />
              )}
              <span>{author}</span>
              {isSelected && (
                <svg
                  className="w-3.5 h-3.5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AuthorFilter;