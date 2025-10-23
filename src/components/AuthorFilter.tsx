import React, { useState } from 'react';
import { AUTHORS } from '../constants/authors';

interface AuthorFilterProps {
  selectedAuthor: string | null;
  onAuthorChange: (author: string | null) => void;
}

const AuthorFilter: React.FC<AuthorFilterProps> = ({ selectedAuthor, onAuthorChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filterOptions = ['전체', ...AUTHORS];

  const handleAuthorSelect = (author: string) => {
    const isAll = author === '전체';
    onAuthorChange(isAll ? null : author);
    setIsDropdownOpen(false);
  };

  const displayValue = selectedAuthor || '전체';

  return (
    <div className="mb-4">
      {/* Mobile dropdown */}
      <div className="md:hidden relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between bg-white rounded-xl shadow-soft px-4 py-3 text-sm font-medium text-gray-700"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{displayValue}</span>
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Dropdown menu */}
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-20 overflow-hidden border border-gray-100">
              {filterOptions.map((author) => {
                const isAll = author === '전체';
                const isSelected = isAll ? selectedAuthor === null : selectedAuthor === author;

                return (
                  <button
                    key={author}
                    onClick={() => handleAuthorSelect(author)}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm transition-colors border-b border-gray-50 last:border-b-0
                      ${isSelected
                        ? 'bg-primary-light text-primary font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {author}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Desktop pills */}
      <div className="hidden md:flex flex-wrap gap-2">
        {filterOptions.map((author) => {
          const isAll = author === '전체';
          const isSelected = isAll ? selectedAuthor === null : selectedAuthor === author;

          return (
            <button
              key={author}
              onClick={() => onAuthorChange(isAll ? null : author)}
              className={`
                px-4 py-2 rounded-full text-sm transition-all duration-200
                ${isSelected
                  ? 'bg-primary-light text-primary font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {author}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AuthorFilter;